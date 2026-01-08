
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
  status: OrderStatus;
  date: string;
}

export interface User {
  name: string;
  email: string;
  photo?: string;
  role: 'admin' | 'client';
}
