import { countries, countryByRegionCode, shoeSizeMap } from './constants';
import type { SizeSystem } from './types';

export interface FormDataShape {
  sizeSystem: '' | SizeSystem;
  shoeSize: string;
  shoeSizeOther: string;
  country: string;
  countryOther: string;
  sailNumber: string;
  homeYachtClub: string;
  consent: boolean;
}

export const detectCountry = (): string => {
  const candidates = [
    typeof navigator !== 'undefined' ? navigator.language : '',
    typeof Intl !== 'undefined' ? Intl.DateTimeFormat().resolvedOptions().locale : '',
  ];

  for (const locale of candidates) {
    if (!locale) continue;
    const region = locale.split(/[-_]/)[1]?.toUpperCase();
    if (region && countryByRegionCode[region] && countries.includes(countryByRegionCode[region])) {
      return countryByRegionCode[region];
    }
  }

  return '';
};

export const validateForm = (data: FormDataShape): Record<string, string> => {
  const errors: Record<string, string> = {};

  if (!data.sizeSystem) {
    errors.sizeSystem = 'Please select a sizing system.';
  }

  if (!data.shoeSize) {
    errors.shoeSize = 'Please select a shoe size.';
  } else if (data.shoeSize === 'Other' && !data.shoeSizeOther.trim()) {
    errors.shoeSizeOther = 'Please provide your shoe size.';
  }

  if (!data.country) {
    errors.country = 'Please select your country.';
  } else if (data.country === 'Other' && !data.countryOther.trim()) {
    errors.countryOther = 'Please provide your country.';
  }

  if (data.sailNumber.trim() && !/^[a-zA-Z0-9]{2,20}$/.test(data.sailNumber.trim())) {
    errors.sailNumber = 'Sail number must be 2–20 letters/numbers.';
  }

  if (data.homeYachtClub.trim()) {
    const len = data.homeYachtClub.trim().length;
    if (len < 2 || len > 60) {
      errors.homeYachtClub = 'Home yacht club must be 2–60 characters.';
    }
  }

  if (!data.consent) {
    errors.consent = 'You must consent before submitting.';
  }

  if (data.sizeSystem && data.shoeSize && data.shoeSize !== 'Other') {
    const allowed = shoeSizeMap[data.sizeSystem];
    if (!allowed.includes(data.shoeSize)) {
      errors.shoeSize = 'Selected shoe size does not match system.';
    }
  }

  return errors;
};
