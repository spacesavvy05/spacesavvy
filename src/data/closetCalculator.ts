// Data for the Closet Space Calculator (/tools/closet-space-calculator).
// Shared by the React page and the prerender script so both show the same numbers.

const TAG = 'spacesavvy07-20';
const amz = (asin: string) => `https://www.amazon.com/dp/${asin}?tag=${TAG}`;

export const CLOSET_TOOL_PATH = '/tools/closet-space-calculator';
export const CLOSET_TOOL_TITLE = 'Closet Rod Calculator: How Many Hangers Per Foot? (Free Tool)';
export const CLOSET_TOOL_H1 = 'Closet Rod Calculator: How Many Hangers Per Foot?';
export const CLOSET_TOOL_DESCRIPTION =
  'Free closet rod calculator: see how many hangers fit per foot, how many clothes fit on your rail, and how many hangers you need. Works in inches or cm.';
export const CLOSET_QUICK_ANSWER =
  'On a closet rod you can fit about 11 shirts per foot on slim velvet hangers, about 9 on standard plastic hangers and about 4 on chunky wooden hangers. Pants, dresses and coats take more room, so fewer fit.';
export const CLOSET_TOOL_IMAGE = '/images/tools/closet-space-calculator-cover.jpg';

// Hanger thickness in inches (The Container Store hanger guide: slim 1/4", basic 1/2", coat 1-3/4").
export interface HangerType {
  id: 'velvet' | 'plastic' | 'wood';
  label: string;
  short: string;
  thickness: number;
  note: string;
}
export const HANGERS: HangerType[] = [
  { id: 'velvet', label: 'Slim velvet', short: 'Slim velvet', thickness: 0.25, note: 'about 1/4" thick' },
  { id: 'plastic', label: 'Standard plastic', short: 'Plastic', thickness: 0.5, note: 'about 1/2" thick' },
  { id: 'wood', label: 'Chunky wood / coat', short: 'Chunky wood', thickness: 1.75, note: 'about 1-3/4" thick' },
];

// Hanging width of the garment itself in inches (Organized Living closet design guide ranges; we use the middle).
export interface WardrobeType {
  id: 'tops' | 'bottoms' | 'dresses' | 'jackets' | 'mixed';
  label: string;
  width: number;
  range: string;
}
export const WARDROBES: WardrobeType[] = [
  { id: 'tops', label: 'Shirts & tops', width: 0.75, range: '1/2" to 1"' },
  { id: 'bottoms', label: 'Pants & skirts', width: 1.5, range: '1" to 2"' },
  { id: 'dresses', label: 'Dresses', width: 2, range: '1" to 3"' },
  { id: 'jackets', label: 'Jackets & coats', width: 4, range: '2" to 6"' },
  { id: 'mixed', label: 'A bit of everything', width: 1.4, range: 'mix of the above' },
];

// Closet designers recommend leaving 10-15% extra room, so we only count 90% of the rail.
export const BREATHING_ROOM = 0.9;

// Average pieces per foot of rod (rounded), used for the quick-answer table.
export function perFoot(hanger: HangerType, wardrobe: WardrobeType): number {
  return Math.round((12 * BREATHING_ROOM) / (wardrobe.width + hanger.thickness));
}

// Inches of rod needed for a number of pieces (includes the breathing room).
export function railNeeded(pieces: number, hanger: HangerType, wardrobe: WardrobeType): number {
  return (pieces * (wardrobe.width + hanger.thickness)) / BREATHING_ROOM;
}

export function itemsThatFit(railInches: number, hanger: HangerType, wardrobe: WardrobeType): number {
  if (!railInches || railInches <= 0) return 0;
  return Math.floor((railInches * BREATHING_ROOM) / (wardrobe.width + hanger.thickness));
}

export const CLOSET_PRODUCT = {
  name: 'Amazon Basics Slim Velvet Non-Slip Hangers (50-Pack)',
  affiliateUrl: amz('B00FXNAAW2'),
};
export const CLOSET_ALSO = [
  { label: 'Double your rail', name: 'Simple Houseware Adjustable Hanging Closet Rod', affiliateUrl: amz('B0BN78VZ96') },
  { label: 'Hang vertically', name: 'Space-Saving Cascading Hangers (10-Pack)', affiliateUrl: amz('B01MR79LE0') },
];

export const CLOSET_SOURCES = [
  { label: 'The Container Store: hanger guide (hanger thickness)', url: 'https://www.containerstore.com/blog/posts/our-ultimate-hanger-guide' },
  { label: 'Organized Living: closet design guide (garment widths, extra room)', url: 'https://organizedliving.com/docs/default-source/design-guide-documents/closetcreationguide_storage-101.pdf' },
  { label: 'Oregon State University Extension: closet planning (4" per coat)', url: 'https://ir.library.oregonstate.edu/xmlui/bitstream/1957/24327/1/ECNO691.pdf' },
];

export const CLOSET_FAQS = [
  {
    question: 'How many hangers fit per foot of closet rod?',
    answer:
      'About 11 shirts per foot on slim velvet hangers, about 9 on standard plastic hangers and about 4 on chunky wooden hangers, leaving a little breathing room. Pants fit about 5 to 6 per foot, dresses about 3 to 5 and coats only 2 to 3.',
  },
  {
    question: 'How many hangers do I need?',
    answer:
      'One for every piece you want to hang, plus a few spares for new clothes. Count what you hang today, then use the "How many do I need?" mode above to see how much rod that takes.',
  },
  {
    question: 'How much closet rod space does one person need?',
    answer:
      'Oregon State University Extension suggests at least four feet of rod per person. With slim hangers and a second rod for short pieces, a smaller closet can hold the same amount.',
  },
  {
    question: 'How many clothes fit on a 36-inch closet rod?',
    answer:
      'About 32 shirts on slim velvet hangers, 25 on standard plastic hangers and 12 on chunky wooden hangers. Mixed wardrobes with pants, dresses and jackets fit fewer, because those pieces are wider.',
  },
  {
    question: 'How thick are velvet hangers, and do they really save space?',
    answer:
      'Slim velvet hangers are about 1/4 inch thick, half a standard plastic hanger and far thinner than a chunky wooden one (about 1-3/4 inches). The biggest gain comes from replacing wooden or thick plastic hangers.',
  },
  {
    question: 'How accurate is this calculator?',
    answer:
      'It gives an estimate. Real clothes vary in thickness, so treat the number as a good guide rather than an exact count. Measure your rod from wall to wall for the best result.',
  },
];

export const CLOSET_RELATED = [
  { title: 'Black Friday Home Organization Finds for Small Apartments', href: '/blog/black-friday-home-organization-small-apartments' },
  { title: '20 Studio Apartment Storage Must-Haves That Won\'t Break the Budget', href: '/blog/20-studio-apartment-storage-must-haves-under-25' },
  { title: '10 Holiday Storage Ideas for Small Apartments', href: '/blog/holiday-storage-ideas-small-apartments' },
];
