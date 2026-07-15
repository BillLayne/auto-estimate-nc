import { VehicleInfo, EstimateResult, SimplifiedEstimateResult, ComparisonResult, HomeProjectInfo, HomeEstimateResult, HomeLineItem } from "../types";

/**
 * Cloudflare Worker proxy URL — holds the Gemini API key server-side.
 * Dev default is a local `wrangler dev`; set VITE_API_BASE in .env.local to
 * point dev at the deployed Worker instead.
 */
const API_BASE = (import.meta.env.VITE_API_BASE as string | undefined)
  || (import.meta.env.PROD
    ? 'https://claims-assistant-api.bill-7e3.workers.dev'
    : 'http://localhost:8787');

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

const HOME_SYSTEM_INSTRUCTION = `
You are a Home Repair & Project Cost Guide assistant for Bill Layne Insurance Agency.
LOCATION: 1283 N BRIDGE ST, ELKIN NC 28621.
PHONE: 336-835-1993.
EMAIL: SAVE@BILLLAYNEINSURANCE.COM.
WEBSITE: WWW.BILLLAYNEINSURANCE.COM.

PERSONA: Helpful, informative, and cautious. You provide a PRELIMINARY COST GUIDE, not a contractor bid or professional appraisal.

NC RESIDENTIAL MARKET BENCHMARKS (2026, use as anchors — adjust for scope visible in photos):
- Handyman $50–$85/hr · Carpenter $50–$90/hr · Licensed electrician $80–$130/hr · Licensed plumber $80–$140/hr · Painter $40–$70/hr
- Asphalt architectural shingle roof: $400–$650 per square installed. Metal roof: $800–$1,400 per square.
- Vinyl siding: $4.50–$9.00/sq ft installed. Seamless aluminum gutters: $6–$12/linear ft.
- Deck: pressure-treated $35–$60/sq ft; composite $55–$95/sq ft; railing $30–$60/linear ft.
- Fence: wood privacy $25–$50/linear ft; chain link $15–$30/linear ft; vinyl $30–$60/linear ft.
- Vinyl replacement window: $450–$900 each installed. Exterior door: $400–$1,500 installed.
- Drywall hung + finished: $2–$4/sq ft. Interior water-damage dry-out & repair: commonly $1,500–$5,000 per affected room (more if mold or structural).
- Flooring installed: LVP $4–$8/sq ft; carpet $3–$6/sq ft; hardwood $8–$15/sq ft.
- Most contractors have a minimum service call of $150–$350. Permits ($100–$1,500) and debris disposal ($300–$600) apply to bigger jobs.

STRICT LOGIC RULES:
1. RANGES ONLY: Residential work varies far more than auto body. Every line item and the total must be a LOW–HIGH range, never a single number.
2. DISCLAIMER FOCUS: This is a market-based guide to help the homeowner understand likely costs before talking to contractors or their insurance agency.
3. HIDDEN DAMAGE: Photos cannot reveal structural, electrical, plumbing, rot, or mold issues behind surfaces. Say so when relevant and reflect it in the high end of the range.
4. DAMAGE MODE: Assess severity (Minor/Moderate/Severe), list observed issues, and write neutral "claimConsiderations" — explain in plain English what homeowners typically weigh (their deductible, whether damage is from a covered peril, that NC wind/hail deductibles are often a percentage of dwelling coverage). NEVER tell them to file or not file, NEVER promise coverage, and end by suggesting they talk it through with their agent.
5. UPGRADE MODE: Include repairVsReplace when it makes sense, and practical budgetTips (get 3 written bids, verify the NC contractor license for jobs $40,000+, never pay large deposits up front, ask what's excluded).
6. TONE: Friendly, plain English, 10th-grade reading level. Avoid "adjuster," "appraisal," or "bid" — say "Preliminary Cost Guide."
7. LINE ITEM FORMAT: "description" is a SHORT title (3–8 words, e.g. "Replace missing shingles & underlayment") — put all detail in "note" (one or two sentences max). "category" must be EXACTLY one of: "Materials", "Labor", "Other" — use "Other" only for combined job pricing, permits, disposal, or contingency.

OUTPUT: Return a valid JSON object matching the provided schema. No extra text or markdown.
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
          { inlineData: { data: base64Image.split(',')[1], mimeType: (base64Image.match(/^data:(.*?);/)?.[1]) || 'image/jpeg' } },
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

// ─── HOME REPAIR / PROJECT ESTIMATE (MULTI-PHOTO) ─────────────

export async function generateHomeEstimate(
  project: HomeProjectInfo,
  imagesData: string[]
): Promise<HomeEstimateResult> {
  const imageParts = imagesData.map(img => {
    const [header, data] = img.split(',');
    const mimeType = header.match(/:(.*?);/)?.[1] || 'image/jpeg';
    return { inlineData: { data, mimeType } };
  });

  const modeLine = project.mode === 'damage'
    ? 'MODE: DAMAGE — the homeowner has storm/accident/water damage and wants to understand the likely repair cost before deciding what to do.'
    : 'MODE: UPGRADE — the homeowner is planning to replace, update, or add something and wants a realistic budget range before calling contractors.';

  const promptPart = {
    text: `
    PRELIMINARY HOME COST GUIDE REQUEST:
    ${modeLine}
    Project category: ${project.category}
    Homeowner's description: ${project.description || 'Not provided — rely on the photos.'}
    Approximate size: ${project.approxSize || 'Not provided — estimate from the photos.'}
    Location: ${project.zip ? `NC ZIP ${project.zip}` : 'North Carolina'}

    1. ANALYZE all attached photos of the home area (multiple angles).
    2. Use current North Carolina residential material prices and labor rates.
    3. BUILD a line-item cost guide with LOW–HIGH ranges for materials and labor.
    4. ${project.mode === 'damage'
        ? 'Assess severity, list the issues you can see, and write neutral claim considerations per your rules.'
        : 'Include a repair-vs-replace comparison if relevant, plus budget tips for hiring a contractor.'}
  `};

  const result = await callWorker(
    MODEL,
    [{ parts: [...imageParts, promptPart] }],
    HOME_SYSTEM_INSTRUCTION,
    {
      responseMimeType: 'application/json',
      responseSchema: {
        type: 'OBJECT',
        properties: {
          projectTitle: { type: 'STRING' },
          scopeSummary: { type: 'STRING' },
          severity: { type: 'STRING' },
          observedIssues: { type: 'ARRAY', items: { type: 'STRING' } },
          lineItems: {
            type: 'ARRAY',
            items: {
              type: 'OBJECT',
              properties: {
                description: { type: 'STRING' },
                category: { type: 'STRING' },
                lowCost: { type: 'NUMBER' },
                highCost: { type: 'NUMBER' },
                note: { type: 'STRING' }
              }
            }
          },
          totalLow: { type: 'NUMBER' },
          totalHigh: { type: 'NUMBER' },
          repairVsReplace: {
            type: 'OBJECT',
            properties: {
              repairLow: { type: 'NUMBER' },
              repairHigh: { type: 'NUMBER' },
              replaceLow: { type: 'NUMBER' },
              replaceHigh: { type: 'NUMBER' },
              guidance: { type: 'STRING' }
            }
          },
          claimConsiderations: { type: 'STRING' },
          budgetTips: { type: 'ARRAY', items: { type: 'STRING' } }
        },
        required: ['projectTitle', 'scopeSummary', 'lineItems', 'totalLow', 'totalHigh']
      }
    }
  );

  const raw = JSON.parse(extractText(result));

  // Defensive normalization — never let a malformed AI response break the report.
  const money = (v: any) => (typeof v === 'number' && Number.isFinite(v) && v >= 0 ? Math.round(v) : 0);
  const lineItems: HomeLineItem[] = (Array.isArray(raw.lineItems) ? raw.lineItems : [])
    .map((li: any) => {
      const low = money(li.lowCost);
      const high = money(li.highCost);
      return {
        description: String(li.description || 'Work item'),
        category: (['Materials', 'Labor', 'Other'].includes(li.category) ? li.category : 'Other') as HomeLineItem['category'],
        lowCost: Math.min(low, high || low),
        highCost: Math.max(low, high),
        note: li.note ? String(li.note) : undefined
      };
    })
    .filter((li: HomeLineItem) => li.highCost > 0);

  const sumLow = lineItems.reduce((s, li) => s + li.lowCost, 0);
  const sumHigh = lineItems.reduce((s, li) => s + li.highCost, 0);
  const totalLow = money(raw.totalLow) || sumLow;
  const totalHigh = Math.max(money(raw.totalHigh) || sumHigh, totalLow);

  const severity = ['Minor', 'Moderate', 'Severe'].includes(raw.severity) ? raw.severity : undefined;

  const rvr = raw.repairVsReplace;
  const repairVsReplace = rvr && money(rvr.replaceHigh) > 0
    ? {
        repairLow: money(rvr.repairLow),
        repairHigh: Math.max(money(rvr.repairHigh), money(rvr.repairLow)),
        replaceLow: money(rvr.replaceLow),
        replaceHigh: Math.max(money(rvr.replaceHigh), money(rvr.replaceLow)),
        guidance: String(rvr.guidance || '')
      }
    : null;

  return {
    projectTitle: String(raw.projectTitle || 'Home Project Cost Guide'),
    scopeSummary: String(raw.scopeSummary || 'Preliminary cost guide based on your photos.'),
    severity,
    observedIssues: Array.isArray(raw.observedIssues) ? raw.observedIssues.map(String) : [],
    lineItems,
    totalLow,
    totalHigh,
    repairVsReplace,
    claimConsiderations: raw.claimConsiderations ? String(raw.claimConsiderations) : undefined,
    budgetTips: Array.isArray(raw.budgetTips) ? raw.budgetTips.map(String) : [],
    groundingSources: extractGroundingSources(result)
  };
}
