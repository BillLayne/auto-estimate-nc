import { HomeProjectInfo } from './types';

/**
 * Category-specific photo coaching for the /home/ flow.
 * Shown as a pop-up overlay when the customer reaches the photo step,
 * so the AI gets multiple useful angles instead of one blurry close-up.
 */

export interface PhotoShot {
  label: string;
  hint: string;
}

export interface PhotoGuide {
  title: string;
  intro: string;
  shots: PhotoShot[];
}

const DEFAULT_SHOTS: PhotoShot[] = [
  { label: 'A wide shot', hint: 'Stand back so the whole area is in the frame.' },
  { label: 'A close-up', hint: 'Get near the worst or most important spot.' },
  { label: 'A second angle', hint: 'A different viewpoint catches things the first shot missed.' },
  { label: 'The surroundings', hint: 'One step-back photo showing what’s around the area.' },
];

const GUIDES: Record<string, PhotoShot[]> = {
  'Roof': [
    { label: 'Whole roof from the ground', hint: 'Step back into the yard so we can see the full roof line.' },
    { label: 'The problem area', hint: 'A straight-on shot of the damaged or worn section.' },
    { label: 'Up close — but stay safe', hint: 'Zoom in from the ground or a window. Please don’t climb on the roof.' },
    { label: 'Inside, if anything leaked', hint: 'Ceiling stains or attic drips help us catch hidden damage.' },
  ],
  'Siding & Gutters': [
    { label: 'The whole wall', hint: 'One shot of the full side of the house, corner to corner.' },
    { label: 'Close-up of the worst spot', hint: 'Dents, cracks, holes, or a sagging gutter section.' },
    { label: 'Down the wall at an angle', hint: 'An angled shot makes dents and waves show up.' },
    { label: 'Downspouts & the ground below', hint: 'Where the water goes tells us a lot.' },
  ],
  'Deck & Porch': [
    { label: 'The whole deck', hint: 'Stand back so the entire deck and railings are in frame.' },
    { label: 'Straight down at the boards', hint: 'Shows cracks, rot, and how the surface is wearing.' },
    { label: 'Underneath, if you can', hint: 'The framing and posts tell us the most about repair vs. replace.' },
    { label: 'Stairs and railings', hint: 'A close-up where they attach to the deck.' },
  ],
  'Fence': [
    { label: 'The full fence line', hint: 'From a distance, so we can see how far it runs.' },
    { label: 'The damaged or worn section', hint: 'A straight-on shot of the problem area.' },
    { label: 'A post at ground level', hint: 'Post condition usually decides repair vs. replace.' },
    { label: 'Both sides if you can', hint: 'The back side often shows different wear.' },
  ],
  'Windows & Doors': [
    { label: 'The whole window or door', hint: 'From outside, straight-on.' },
    { label: 'Up close on the problem', hint: 'Rot, fogged glass, cracked frames, or gaps.' },
    { label: 'From inside the room', hint: 'Inside views catch leaks, drafts, and water stains.' },
    { label: 'How many are affected', hint: 'A wide shot showing every window or door involved.' },
  ],
  'Water Damage': [
    { label: 'The whole room', hint: 'From the doorway, so we can judge the size of the space.' },
    { label: 'Close-up of the stain or damage', hint: 'Ceiling, wall, or floor — get right up on it.' },
    { label: 'Where the water came from', hint: 'Around the pipe, roof spot, or appliance if you know it.' },
    { label: 'Floors and baseboards', hint: 'Swelling or buckling changes the estimate a lot.' },
  ],
  'Drywall & Paint': [
    { label: 'The whole wall', hint: 'Corner to corner, so we can size the job.' },
    { label: 'Close-up of cracks or holes', hint: 'Right up on the worst spots.' },
    { label: 'An angle in good light', hint: 'Texture problems and waves show best at an angle.' },
    { label: 'Any other affected walls', hint: 'One shot each is plenty.' },
  ],
  'Flooring': [
    { label: 'The whole room from the doorway', hint: 'So we can judge the square footage.' },
    { label: 'Straight down close-up', hint: 'Shows the current material and its condition.' },
    { label: 'Doorways and transitions', hint: 'Where this floor meets the next room.' },
    { label: 'Any damaged spots', hint: 'Scratches, buckling, stains — get close.' },
  ],
  'Kitchen': [
    { label: 'The whole kitchen from the doorway', hint: 'One wide shot of the full space.' },
    { label: 'Counters and cabinets up close', hint: 'The surfaces you want changed or repaired.' },
    { label: 'The appliance wall', hint: 'Stove, fridge, and dishwasher area.' },
    { label: 'The floors', hint: 'One straight-down shot.' },
  ],
  'Bathroom': [
    { label: 'The whole bathroom from the door', hint: 'One wide shot of the full space.' },
    { label: 'Tub or shower up close', hint: 'Grout, tile, caulk, and any soft spots.' },
    { label: 'Vanity and counter', hint: 'Straight-on shot of the sink area.' },
    { label: 'Floors and around the toilet', hint: 'Water likes to hide here.' },
  ],
};

export function getHomePhotoGuide(project: HomeProjectInfo): PhotoGuide {
  const shots = GUIDES[project.category] || DEFAULT_SHOTS;
  const isDamage = project.mode === 'damage';
  const noun = project.category && project.category !== 'Other' ? project.category.toLowerCase() : 'project';
  return {
    title: isDamage ? `How to photograph your ${noun} damage` : `How to photograph your ${noun}`,
    intro: isDamage
      ? 'Clear photos from a few angles help the AI spot hidden damage and price it right. 3–5 photos is perfect.'
      : 'Photos of how it looks today help the AI size the job and price it right. 3–5 photos is perfect.',
    shots,
  };
}
