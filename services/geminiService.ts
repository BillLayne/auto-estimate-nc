import { VehicleInfo, EstimateResult, SimplifiedEstimateResult, ComparisonResult } from "../types";

/**
 * Cloudflare Worker proxy URL — holds the Gemini API key server-side.
 */
const API_BASE = import.meta.env.PROD
  ? 'https://claims-assistant-api.bill-7e3.workers.dev'
  : 'http://localhost:8787';

const MODEL = 'gemini-2.5-flash';

const SYSTEM_INSTRUCTION = `
You are an Insurance Agency Assistant for Bill Layne Insurance Agency.
LOCATION: 1283 N BRIDGE ST, ELKIN NC 28621.
PHONE: 336-835-1993.
EMAIL: SAVE@BILLLAYNEINSURANCE.COM.
WEBSITE: WWW.BILLLAYNEINSURANCE.COM.

PERSONA: Helpful, informative, and cautious. You provide a PRELIMINARY GUIDE, not a professional appraisal.

STRICT LOGIC RULES:
1. DISCLAIMER FOCUS: Explicitly state that this is a market-based guide to help the user decide if they should file a claim.
2. NC LABOR RATES: Use $85-$105/hr for body and $90-$110/hr for paint.
3. GROUNDING: Use your knowledge of current North Carolina part pricing.
4. MULTI-ANGLE ANALYSIS: You will be provided with multiple photos. Analyze all of them to identify damaged components, hidden damage, and assess overall severity accurately.
5. TONE: Avoid "Adjuster" or "Appraisal" terms. Use "Preliminary Guide" or "Estimated Repair Cost."

OUTPUT: Return a valid JSON object matching the provided schema. No extra text or markdown.
`;

const TRANSLATOR_INSTRUCTION = `
You are an "Estimate Translator" for Bill Layne Insurance. Your job is to read complex auto body shop estimates (PDFs or Images) and explain them to a customer who has a 10th-grade reading level.
RULES:
1. Identify the Shop Name, Customer Name, Vehicle, and Grand Total.
2. Group the line items into logical sections (e.g., "Front Bumper Area", "Door Repair", "Painting").
3. For each significant line item, provide the "Technical Name" (what the sheet says) and a "Simple Name" (what it actually is).
4. Write a "Simple Summary" that explains the overall scope of work in a friendly, reassuring paragraph.
`;

const COMPARATOR_INSTRUCTION = `
You are a "Collision Repair Auditor" for Bill Layne Insurance.
Your task is to compare two different repair estimates (Estimate A and Estimate B) for the same vehicle.
Identify the key drivers of price difference (e.g., Labor Rates, OEM vs. Aftermarket parts, Repair vs. Replace operations).
Provide a neutral, factual comparison to help the customer understand why the prices differ.
`;

async function callWorker(model: string, contents: any, systemInstruction?: string, generationConfig?: any) {
  const payload: any = { model, contents };
  if (systemInstruction) {
    payload.systemInstruction = { parts: [{ text: systemInstruction }] };
  }
  if (generationConfig) {
    payload.generationConfig = generationConfig;
  }

  const resp = await fetch(`${API_BASE}/api/auto/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!resp.ok) {
    const errText = await resp.text();
    throw new Error(`API error ${resp.status}: ${errText}`);
  }
  return resp.json();
}

function extractText(result: any): string {
  return result.candidates?.[0]?.content?.parts?.[0]?.text || '{}';
}

function extractGroundingSources(result: any): Array<{title: string, uri: string}> {
  return result.candidates?.[0]?.groundingMetadata?.groundingChunks?.map((chunk: any) => ({
    title: chunk.web?.title || 'Market Reference',
    uri: chunk.web?.uri || '#'
  })).filter((source: any) => source.uri !== '#') || [];
}

// ─── VIN LOOKUP ────────────────────────────────────────────────

export async function lookupVehicleByVin(vin: string): Promise<Partial<VehicleInfo>> {
  const result = await callWorker(
    MODEL,
    [{ parts: [{ text: `Decode this VIN for Bill Layne Agency Guide: ${vin}.` }] }],
    SYSTEM_INSTRUCTION,
    {
      responseMimeType: 'application/json',
      responseSchema: {
        type: 'OBJECT',
        properties: {
          year: { type: 'STRING' },
          make: { type: 'STRING' },
          model: { type: 'STRING' }
        },
        required: ['year', 'make', 'model']
      }
    }
  );
  return JSON.parse(extractText(result));
}

// ─── VIN FROM IMAGE (CAMERA OCR) ──────────────────────────────

export async function extractVinFromImage(base64Image: string): Promise<string | null> {
  try {
    const result = await callWorker(
      MODEL,
      [{
        parts: [
          { inlineData: { data: base64Image.split(',')[1], mimeType: 'image/jpeg' } },
          { text: "Examine this image. Find the Vehicle Identification Number (VIN). It is a 17-character alphanumeric string. It might be a barcode or text on a sticker/plate. Return ONLY the raw VIN string. If no VIN is found, return 'null'." }
        ]
      }]
    );

    const text = extractText(result)?.trim();
    if (!text || text.toLowerCase() === 'null') return null;
    const cleanVin = text.replace(/[^A-HJ-NPR-Z0-9]/gi, '').toUpperCase();
    return cleanVin.length >= 11 ? cleanVin : null;
  } catch (error) {
    console.error("VIN Scan Error:", error);
    return null;
  }
}

// ─── GENERATE DAMAGE ESTIMATE (MULTI-PHOTO) ───────────────────

export async function generateEstimate(
  vehicle: VehicleInfo,
  imagesData: string[]
): Promise<EstimateResult> {
  const vinSnippet = vehicle.vin ? `VIN ${vehicle.vin}` : "VIN not provided";

  const imageParts = imagesData.map(img => {
    const [header, data] = img.split(',');
    const mimeType = header.match(/:(.*?);/)?.[1] || 'image/jpeg';
    return { inlineData: { data, mimeType } };
  });

  const promptPart = {
    text: `
    PRELIMINARY GUIDE REQUEST:
    Vehicle: ${vehicle.year} ${vehicle.make} ${vehicle.model} (${vinSnippet})
    Mileage: ${vehicle.mileage}

    1. ANALYZE visual damage across all attached images (multiple angles).
    2. Use your knowledge of current North Carolina part prices.
    3. CALCULATE estimated repair costs using NC market labor rates.
    4. SUMMARIZE as a guide for deciding whether to file an insurance claim.
  `};

  const result = await callWorker(
    MODEL,
    [{ parts: [...imageParts, promptPart] }],
    SYSTEM_INSTRUCTION,
    {
      responseMimeType: 'application/json',
      responseSchema: {
        type: 'OBJECT',
        properties: {
          vehicle: {
            type: 'OBJECT',
            properties: {
              vin: { type: 'STRING' },
              year: { type: 'STRING' },
              make: { type: 'STRING' },
              model: { type: 'STRING' },
              mileage: { type: 'STRING' }
            }
          },
          damagedComponents: { type: 'ARRAY', items: { type: 'STRING' } },
          severity: { type: 'STRING' },
          partsBreakdown: {
            type: 'ARRAY',
            items: {
              type: 'OBJECT',
              properties: {
                name: { type: 'STRING' },
                condition: { type: 'STRING' },
                estimatedPrice: { type: 'NUMBER' },
                sourceUrl: { type: 'STRING' }
              }
            }
          },
          laborBreakdown: {
            type: 'ARRAY',
            items: {
              type: 'OBJECT',
              properties: {
                description: { type: 'STRING' },
                hours: { type: 'NUMBER' },
                rate: { type: 'NUMBER' },
                total: { type: 'NUMBER' }
              }
            }
          },
          totalEstimate: { type: 'NUMBER' },
          summary: { type: 'STRING' }
        },
        required: ['totalEstimate', 'partsBreakdown', 'laborBreakdown', 'summary']
      }
    }
  );

  const data = JSON.parse(extractText(result));
  const groundingSources = extractGroundingSources(result);
  return { ...data, groundingSources };
}

// ─── ANALYZE EXISTING ESTIMATE (TRANSLATOR) ───────────────────

export async function analyzeExistingEstimate(
  filesData: string[]
): Promise<SimplifiedEstimateResult> {
  const inputParts = filesData.map(file => {
    const [header, data] = file.split(',');
    const mimeType = header.match(/:(.*?);/)?.[1] || 'image/jpeg';
    return { inlineData: { data, mimeType } };
  });

  const result = await callWorker(
    MODEL,
    [{ parts: [...inputParts, { text: "Review this attached auto repair estimate document. Parse the technical details and translate them into a simplified, easy-to-understand breakdown." }] }],
    TRANSLATOR_INSTRUCTION,
    {
      responseMimeType: 'application/json',
      responseSchema: {
        type: 'OBJECT',
        properties: {
          shopName: { type: 'STRING' },
          customerName: { type: 'STRING' },
          vehicleStr: { type: 'STRING' },
          grandTotal: { type: 'NUMBER' },
          simpleSummary: { type: 'STRING' },
          sections: {
            type: 'ARRAY',
            items: {
              type: 'OBJECT',
              properties: {
                title: { type: 'STRING' },
                items: {
                  type: 'ARRAY',
                  items: {
                    type: 'OBJECT',
                    properties: {
                      technicalName: { type: 'STRING' },
                      simpleName: { type: 'STRING' },
                      explanation: { type: 'STRING' },
                      cost: { type: 'NUMBER' }
                    }
                  }
                },
                sectionTotal: { type: 'NUMBER' }
              }
            }
          }
        }
      }
    }
  );

  const raw = JSON.parse(extractText(result));
  return {
    shopName: raw.shopName || "Unknown Shop",
    customerName: raw.customerName,
    vehicleStr: raw.vehicleStr,
    grandTotal: typeof raw.grandTotal === 'number' ? raw.grandTotal : 0,
    simpleSummary: raw.simpleSummary || "Analysis complete.",
    sections: Array.isArray(raw.sections) ? raw.sections : []
  };
}

// ─── COMPARE TWO ESTIMATES ────────────────────────────────────

export async function compareEstimates(
  filesA: string[],
  filesB: string[]
): Promise<ComparisonResult> {
  const createParts = (files: string[]) => files.map(file => {
    const [header, data] = file.split(',');
    const mimeType = header.match(/:(.*?);/)?.[1] || 'image/jpeg';
    return { inlineData: { data, mimeType } };
  });

  const partsA = createParts(filesA);
  const partsB = createParts(filesB);

  const promptText = `
    I have provided ${partsA.length + partsB.length} images total.
    The first ${partsA.length} images are ESTIMATE A (Shop A).
    The remaining ${partsB.length} images are ESTIMATE B (Shop B).

    Please compare these two estimates.
    1. Identify the Shop Name and Total Cost for both.
    2. Calculate the price difference.
    3. Analyze the line items to find SPECIFIC reasons for the difference.
    4. Provide a neutral recommendation based on cost vs quality indicators.
  `;

  const result = await callWorker(
    MODEL,
    [{ parts: [...partsA, ...partsB, { text: promptText }] }],
    COMPARATOR_INSTRUCTION,
    {
      responseMimeType: 'application/json',
      responseSchema: {
        type: 'OBJECT',
        properties: {
          shopA: {
            type: 'OBJECT',
            properties: { name: { type: 'STRING' }, total: { type: 'NUMBER' } }
          },
          shopB: {
            type: 'OBJECT',
            properties: { name: { type: 'STRING' }, total: { type: 'NUMBER' } }
          },
          priceDifference: { type: 'NUMBER' },
          summary: { type: 'STRING' },
          differences: {
            type: 'ARRAY',
            items: {
              type: 'OBJECT',
              properties: {
                category: { type: 'STRING' },
                shopA_Value: { type: 'STRING' },
                shopB_Value: { type: 'STRING' },
                explanation: { type: 'STRING' }
              }
            }
          },
          recommendation: { type: 'STRING' }
        }
      }
    }
  );

  return JSON.parse(extractText(result)) as ComparisonResult;
}
