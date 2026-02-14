import type { SizeSystem } from './types';

const withHalfSizes = (start: number, end: number): string[] => {
  const values: string[] = [];
  for (let value = start; value <= end; value += 0.5) {
    values.push(Number.isInteger(value) ? `${value}` : value.toFixed(1));
  }
  return values;
};

export const shoeSizeMap: Record<SizeSystem, string[]> = {
  'US Men': withHalfSizes(6, 14),
  'US Women': withHalfSizes(5, 12),
  EU: Array.from({ length: 13 }, (_, index) => `${36 + index}`),
  UK: withHalfSizes(3, 13),
};

export const countries = [
  'Australia', 'Austria', 'Belgium', 'Brazil', 'Canada', 'Chile', 'China', 'Croatia',
  'Czech Republic', 'Denmark', 'Finland', 'France', 'Germany', 'Greece', 'Hong Kong',
  'Hungary', 'Iceland', 'India', 'Indonesia', 'Ireland', 'Israel', 'Italy', 'Japan',
  'Malaysia', 'Mexico', 'Netherlands', 'New Zealand', 'Norway', 'Philippines', 'Poland',
  'Portugal', 'Singapore', 'South Africa', 'South Korea', 'Spain', 'Sweden', 'Switzerland',
  'Taiwan', 'Thailand', 'Turkey', 'United Arab Emirates', 'United Kingdom', 'United States',
  'Vietnam'
];

export const countryByRegionCode: Record<string, string> = {
  AU: 'Australia', AT: 'Austria', BE: 'Belgium', BR: 'Brazil', CA: 'Canada', CL: 'Chile',
  CN: 'China', HR: 'Croatia', CZ: 'Czech Republic', DK: 'Denmark', FI: 'Finland', FR: 'France',
  DE: 'Germany', GR: 'Greece', HK: 'Hong Kong', HU: 'Hungary', IS: 'Iceland', IN: 'India',
  ID: 'Indonesia', IE: 'Ireland', IL: 'Israel', IT: 'Italy', JP: 'Japan', MY: 'Malaysia',
  MX: 'Mexico', NL: 'Netherlands', NZ: 'New Zealand', NO: 'Norway', PH: 'Philippines',
  PL: 'Poland', PT: 'Portugal', SG: 'Singapore', ZA: 'South Africa', KR: 'South Korea',
  ES: 'Spain', SE: 'Sweden', CH: 'Switzerland', TW: 'Taiwan', TH: 'Thailand', TR: 'Turkey',
  AE: 'United Arab Emirates', GB: 'United Kingdom', US: 'United States', VN: 'Vietnam'
};
