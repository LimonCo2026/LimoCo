export type Category =
  | 'herramientas-manuales'
  | 'herramientas-electricas'
  | 'materiales-construccion'
  | 'plomeria'
  | 'electricidad'
  | 'pinturas-acabados';

export const CATEGORY_LABELS: Record<Category, string> = {
  'herramientas-manuales': 'Herramientas Manuales',
  'herramientas-electricas': 'Herramientas Eléctricas',
  'materiales-construccion': 'Materiales de Construcción',
  plomeria: 'Plomería',
  electricidad: 'Electricidad',
  'pinturas-acabados': 'Pinturas y Acabados',
};

export const CATEGORY_COLORS: Record<Category, string> = {
  'herramientas-manuales': 'bg-slate-100 text-slate-700',
  'herramientas-electricas': 'bg-blue-100 text-blue-700',
  'materiales-construccion': 'bg-orange-100 text-orange-700',
  plomeria: 'bg-cyan-100 text-cyan-700',
  electricidad: 'bg-yellow-100 text-yellow-700',
  'pinturas-acabados': 'bg-purple-100 text-purple-700',
};

export interface Product {
  id: string;
  name: string;
  category: Category;
  stock: number;
  minStock: number;
  buyPrice: number;
  sellPrice: number;
  createdAt: string;
}

export interface Entry {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  supplier: string;
  date: string;
  createdAt: string;
}

export interface Exit {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  type: 'venta' | 'consumo-interno';
  date: string;
  createdAt: string;
}

export interface User {
  id: string;
  username: string;
  name: string;
  role: 'admin' | 'staff';
  password: string;
}
