
import { ClothingItem, Order, OrderStatus, Appointment, AvailabilitySlot } from './types';

export const WHATSAPP_NUMBER = '5571984060628'; 
export const ADMIN_EMAIL = 'fiodelinholtda@gmail.com';
export const ATELIER_ADDRESS = 'Salvador, Bahia';

export const COLLECTION_ITEMS: ClothingItem[] = [
  {
    id: '1',
    name: 'Vestido de Seda Imperial',
    category: 'Gala',
    price: 3200,
    image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&q=80&w=800',
    description: 'Fluidez impecável em seda pura, com drapeado manual exclusivo.'
  },
  {
    id: '2',
    name: 'Costume Italiano Super 150',
    category: 'Alfaiataria',
    price: 4500,
    image: 'https://images.unsplash.com/photo-1594932224828-b4b059b6f6f2?auto=format&fit=crop&q=80&w=800',
    description: 'Corte slim em lã fria de altíssima gramatura.'
  },
  {
    id: '5',
    name: 'Camisa Linho Mistura',
    category: 'Essentiels',
    price: 380,
    image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&q=80&w=800',
    description: 'Leveza e frescor para o dia a dia, com acabamento em botões de madrepérola.'
  },
  {
    id: '6',
    name: 'T-Shirt Algodão Egípcio',
    category: 'Essentiels',
    price: 195,
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=800',
    description: 'Toque sedoso e durabilidade extrema. A base de qualquer guarda-roupa de luxo.'
  },
  {
    id: '3',
    name: 'Blazer Velvet D’Or',
    category: 'Casual Luxo',
    price: 1850,
    image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&q=80&w=800',
    description: 'Veludo alemão com botões banhados a ouro.'
  },
  {
    id: '7',
    name: 'Bermuda Chino Riviera',
    category: 'Essentiels',
    price: 290,
    image: 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?auto=format&fit=crop&q=80&w=800',
    description: 'Corte clássico em sarja acetinada com elastano para máximo conforto.'
  },
  {
    id: '8',
    name: 'Gravata de Seda Artesanal',
    category: 'Acessórios',
    price: 220,
    image: 'https://images.unsplash.com/photo-1598033129183-c4f50c7176c8?auto=format&fit=crop&q=80&w=800',
    description: 'Padrões clássicos tecidos à mão, o detalhe final para sua elegância.'
  },
  {
    id: '4',
    name: 'Saia Plissée Riviera',
    category: 'Feminino',
    price: 980,
    image: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&q=80&w=800',
    description: 'Leveza e movimento inspirado na costa francesa.'
  }
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'FL-2024-001',
    clientName: 'Ana Beatriz',
    clientEmail: 'cliente@exemplo.com',
    items: ['Vestido de Seda Imperial'],
    status: OrderStatus.IN_PRODUCTION,
    date: '15/05/2024'
  }
];

const generateFixedAvailability = (): AvailabilitySlot[] => {
  const slots: AvailabilitySlot[] = [];
  const today = new Date();
  const times = ['16:30', '16:50', '17:10', '17:30'];

  for (let i = 1; i <= 21; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    const dayOfWeek = date.getDay();
    if (dayOfWeek >= 1 && dayOfWeek <= 5) {
      slots.push({
        date: date.toISOString().split('T')[0],
        times: [...times]
      });
    }
  }
  return slots;
};

export const INITIAL_AVAILABILITY: AvailabilitySlot[] = generateFixedAvailability();

export const INITIAL_APPOINTMENTS: Appointment[] = [
  {
    id: 'APP-1020',
    clientName: 'Mariana Costa',
    clientEmail: 'mariana@email.com',
    date: INITIAL_AVAILABILITY[0]?.date || '2024-06-20',
    time: '16:30',
    status: 'confirmed'
  }
];
