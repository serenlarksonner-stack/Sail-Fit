export type SizeSystem = 'US Men' | 'US Women' | 'EU' | 'UK';

export interface SurveySubmission {
  timestamp: string;
  sizeSystem: SizeSystem;
  shoeSize: string;
  country: string;
  sailNumber?: string;
  homeYachtClub?: string;
  consent: boolean;
}
