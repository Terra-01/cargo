export type FrameStyle = 'browser' | 'phone' | 'card';

export interface BackgroundPreset {
  id: string;
  label: string;
  // CSS background string OR null for transparent
  background: string | null;
}

export const backgroundPresets: BackgroundPreset[] = [
  { id: 'transparent',  label: 'Transparent', background: null },
  { id: 'paper',        label: 'Paper',       background: '#F5F1EA' },
  { id: 'ink',          label: 'Ink',         background: '#18181B' },
  { id: 'dusk',         label: 'Dusk',        background: 'linear-gradient(135deg, #C2410C 0%, #FCD34D 100%)' },
  { id: 'tokyo',        label: 'Tokyo',       background: 'linear-gradient(135deg, #0A0A0A 0%, #7F1D1D 50%, #FB7185 100%)' },
  { id: 'soft',         label: 'Soft',        background: 'linear-gradient(135deg, #C7E2D3 0%, #DDD6FE 100%)' },
  { id: 'memphis',      label: 'Memphis',     background: 'linear-gradient(135deg, #FACC15 0%, #EC4899 100%)' },
];

export const frameStyles: { id: FrameStyle; label: string; description: string }[] = [
  { id: 'browser', label: 'Browser', description: 'Mac-style window chrome with traffic lights' },
  { id: 'phone',   label: 'Phone',   description: 'Rounded silhouette' },
  { id: 'card',    label: 'Card',    description: 'Just radius + shadow, no chrome' },
];
