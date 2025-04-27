export interface SportDifficulty {
  label: string;
  value: number;
}

export const SPORT_DIFFICULTIES = {
  basketball: [
    { label: 'Two-Point Shot', value: 2 },
    { label: 'Three-Point Shot', value: 3 }
  ],
  football: [
    { label: 'Field Goal', value: 3 },
    { label: 'Touchdown', value: 7 }
  ],
  soccer: [
    { label: 'Goal', value: 1 }
  ],
  baseball: [
    { label: 'Single', value: 1 },
    { label: 'Double', value: 2 },
    { label: 'Triple', value: 3 },
    { label: 'Home Run', value: 4 }
  ]
} as const; 