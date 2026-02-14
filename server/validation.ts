import { countries, shoeSizeMap } from '../src/constants';
import type { SurveySubmission } from '../src/types';

export const validateSubmission = (submission: Partial<SurveySubmission>): string | null => {
  if (!submission.sizeSystem || !(submission.sizeSystem in shoeSizeMap)) {
    return 'Invalid or missing size system.';
  }

  if (!submission.shoeSize || submission.shoeSize.trim().length === 0) {
    return 'Missing shoe size.';
  }

  if (!submission.country || submission.country.trim().length === 0) {
    return 'Missing country.';
  }

  if (submission.country !== 'Other' && countries.includes(submission.country) === false) {
    return 'Invalid country.';
  }

  if (submission.sailNumber && !/^[a-zA-Z0-9]{2,20}$/.test(submission.sailNumber)) {
    return 'Invalid sail number.';
  }

  if (submission.homeYachtClub) {
    const len = submission.homeYachtClub.trim().length;
    if (len < 2 || len > 60) {
      return 'Invalid home yacht club.';
    }
  }

  if (!submission.consent) {
    return 'Consent is required.';
  }

  if (!submission.timestamp) {
    return 'Missing timestamp.';
  }

  return null;
};
