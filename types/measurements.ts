// Tipos para mediciones corporales (cm)

export type BodyPartId =
  | 'brazos'
  | 'antebrazo'
  | 'pecho'
  | 'cintura'
  | 'abdomen'
  | 'cadera'
  | 'muslos'
  | 'piernas'
  | 'cuello'
  | 'hombros';

export interface BodyPart {
  id: BodyPartId;
  name: string;
}

export interface BodyMeasurement {
  id: string;
  bodyPartId: BodyPartId;
  value: number; // en cm
  date: string; // ISO string
  notes?: string;
}

export const BODY_PARTS: BodyPart[] = [
  { id: 'brazos', name: 'Brazos' },
  { id: 'antebrazo', name: 'Antebrazo' },
  { id: 'pecho', name: 'Pecho' },
  { id: 'cintura', name: 'Cintura' },
  { id: 'abdomen', name: 'Abdomen' },
  { id: 'cadera', name: 'Cadera' },
  { id: 'muslos', name: 'Muslos' },
  { id: 'piernas', name: 'Piernas' },
  { id: 'cuello', name: 'Cuello' },
  { id: 'hombros', name: 'Hombros' },
];
