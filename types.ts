
export interface ClothingItem {
  id: string;
  name: string;
  category: string;
  price: number;
  image: string;
  description: string;
}

export interface MeasurementData {
  neck?: number;
  chest?: number;
  waist?: number;
  hips?: number;
  sleeveLength?: number;
  shoulders?: number;
  height?: number;
  weight?: number;
  clothingType?: string;
}

export enum OrderStatus {
  PENDING = 'Aguardando Início',
  MEASURED = 'Medidas Validada',
  IN_CUTTING = 'Em Corte',
  IN_PRODUCTION = 'Costura e Ajustes',
  QUALITY_CHECK = 'Finalização Técnica',
  READY = 'Pronto para Entrega',
  DELIVERED = 'Entregue'
}

export interface Order {
  id: string;
  clientName: string;
  clientEmail: string;
  items: string[];
  clothingType?: string;
  status: OrderStatus;
  date: string;
}

export interface User {
  name: string;
  email: string;
  photo?: string;
  role: 'admin' | 'client';
}

export interface Appointment {
  id: string;
  clientName: string;
  clientEmail: string;
  date: string;
  time: string;
  status: 'confirmed' | 'cancelled';
}

export interface AvailabilitySlot {
  date: string; // ISO date string
  times: string[]; // e.g. ["09:00", "14:00"]
}
