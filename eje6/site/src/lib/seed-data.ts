import { Product, Entry, Exit } from './types';

export const SEED_PRODUCTS: Product[] = [
  // Herramientas manuales
  { id: 'p1', name: 'Martillo de acero 1kg', category: 'herramientas-manuales', stock: 45, minStock: 10, buyPrice: 85, sellPrice: 130, createdAt: '2026-04-01' },
  { id: 'p2', name: 'Destornillador Phillips #2', category: 'herramientas-manuales', stock: 8, minStock: 15, buyPrice: 28, sellPrice: 45, createdAt: '2026-04-01' },
  { id: 'p3', name: 'Llave ajustable 10"', category: 'herramientas-manuales', stock: 22, minStock: 8, buyPrice: 95, sellPrice: 145, createdAt: '2026-04-01' },
  { id: 'p4', name: 'Cinta métrica 5m', category: 'herramientas-manuales', stock: 30, minStock: 12, buyPrice: 38, sellPrice: 60, createdAt: '2026-04-02' },
  { id: 'p5', name: 'Nivel de burbuja 60cm', category: 'herramientas-manuales', stock: 3, minStock: 5, buyPrice: 72, sellPrice: 110, createdAt: '2026-04-02' },
  { id: 'p6', name: 'Pinzas de punta', category: 'herramientas-manuales', stock: 18, minStock: 10, buyPrice: 45, sellPrice: 70, createdAt: '2026-04-03' },
  { id: 'p7', name: 'Serrucho 20"', category: 'herramientas-manuales', stock: 12, minStock: 6, buyPrice: 110, sellPrice: 165, createdAt: '2026-04-03' },

  // Herramientas eléctricas
  { id: 'p8', name: 'Taladro percutor 750W', category: 'herramientas-electricas', stock: 7, minStock: 3, buyPrice: 850, sellPrice: 1250, createdAt: '2026-04-01' },
  { id: 'p9', name: 'Amoladora 4.5" 850W', category: 'herramientas-electricas', stock: 5, minStock: 2, buyPrice: 720, sellPrice: 1050, createdAt: '2026-04-01' },
  { id: 'p10', name: 'Sierra circular 7.25"', category: 'herramientas-electricas', stock: 2, minStock: 3, buyPrice: 1200, sellPrice: 1750, createdAt: '2026-04-02' },
  { id: 'p11', name: 'Atornillador a batería 12V', category: 'herramientas-electricas', stock: 9, minStock: 3, buyPrice: 450, sellPrice: 680, createdAt: '2026-04-04' },

  // Materiales de construcción
  { id: 'p12', name: 'Cemento CEMEX 50kg', category: 'materiales-construccion', stock: 120, minStock: 30, buyPrice: 165, sellPrice: 210, createdAt: '2026-04-01' },
  { id: 'p13', name: 'Block de concreto 15x20x40', category: 'materiales-construccion', stock: 500, minStock: 100, buyPrice: 8, sellPrice: 14, createdAt: '2026-04-01' },
  { id: 'p14', name: 'Varilla de acero 3/8" x 6m', category: 'materiales-construccion', stock: 25, minStock: 20, buyPrice: 95, sellPrice: 140, createdAt: '2026-04-02' },
  { id: 'p15', name: 'Tabique rojo 6x12x24cm', category: 'materiales-construccion', stock: 1200, minStock: 200, buyPrice: 4, sellPrice: 7, createdAt: '2026-04-03' },

  // Plomería
  { id: 'p16', name: 'Tubo PVC hidráulico 1/2" x 6m', category: 'plomeria', stock: 40, minStock: 15, buyPrice: 48, sellPrice: 75, createdAt: '2026-04-01' },
  { id: 'p17', name: 'Codo PVC 1/2" 90°', category: 'plomeria', stock: 200, minStock: 50, buyPrice: 3, sellPrice: 6, createdAt: '2026-04-01' },
  { id: 'p18', name: 'Llave de paso 1/2" metálica', category: 'plomeria', stock: 4, minStock: 10, buyPrice: 85, sellPrice: 130, createdAt: '2026-04-02' },
  { id: 'p19', name: 'Cinta teflón (10 unidades)', category: 'plomeria', stock: 60, minStock: 20, buyPrice: 5, sellPrice: 10, createdAt: '2026-04-03' },
  { id: 'p20', name: 'Llave de baño completa', category: 'plomeria', stock: 8, minStock: 5, buyPrice: 380, sellPrice: 560, createdAt: '2026-04-04' },

  // Electricidad
  { id: 'p21', name: 'Cable THW cal.12 (rollo 100m)', category: 'electricidad', stock: 12, minStock: 5, buyPrice: 890, sellPrice: 1280, createdAt: '2026-04-01' },
  { id: 'p22', name: 'Interruptor sencillo', category: 'electricidad', stock: 55, minStock: 20, buyPrice: 22, sellPrice: 38, createdAt: '2026-04-01' },
  { id: 'p23', name: 'Contacto doble polarizado', category: 'electricidad', stock: 48, minStock: 20, buyPrice: 28, sellPrice: 45, createdAt: '2026-04-02' },
  { id: 'p24', name: 'Foco LED 9W (caja 10 pzas)', category: 'electricidad', stock: 3, minStock: 8, buyPrice: 180, sellPrice: 260, createdAt: '2026-04-03' },
  { id: 'p25', name: 'Caja de registro 10x10', category: 'electricidad', stock: 35, minStock: 15, buyPrice: 18, sellPrice: 32, createdAt: '2026-04-04' },

  // Pinturas y acabados
  { id: 'p26', name: 'Pintura vinílica blanca 4L', category: 'pinturas-acabados', stock: 28, minStock: 10, buyPrice: 195, sellPrice: 280, createdAt: '2026-04-01' },
  { id: 'p27', name: 'Sellador universal 1L', category: 'pinturas-acabados', stock: 15, minStock: 8, buyPrice: 85, sellPrice: 130, createdAt: '2026-04-02' },
  { id: 'p28', name: 'Pintura esmalte rojo 1L', category: 'pinturas-acabados', stock: 6, minStock: 5, buyPrice: 95, sellPrice: 145, createdAt: '2026-04-02' },
  { id: 'p29', name: 'Lija al agua 220 (25 hojas)', category: 'pinturas-acabados', stock: 2, minStock: 10, buyPrice: 42, sellPrice: 65, createdAt: '2026-04-03' },
  { id: 'p30', name: 'Rodillo de 9" con charola', category: 'pinturas-acabados', stock: 20, minStock: 8, buyPrice: 65, sellPrice: 95, createdAt: '2026-04-04' },
];

const today = new Date().toISOString().split('T')[0];
const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

export const SEED_ENTRIES: Entry[] = [
  { id: 'e1', productId: 'p1', productName: 'Martillo de acero 1kg', quantity: 20, supplier: 'Distribuidora Ferreteros SA', date: yesterday, createdAt: yesterday },
  { id: 'e2', productId: 'p12', productName: 'Cemento CEMEX 50kg', quantity: 50, supplier: 'CEMEX México', date: yesterday, createdAt: yesterday },
  { id: 'e3', productId: 'p21', productName: 'Cable THW cal.12 (rollo 100m)', quantity: 5, supplier: 'Conductores Monterrey', date: today, createdAt: today },
  { id: 'e4', productId: 'p26', productName: 'Pintura vinílica blanca 4L', quantity: 12, supplier: 'Pinturas Comex', date: today, createdAt: today },
];

export const SEED_EXITS: Exit[] = [
  { id: 'x1', productId: 'p1', productName: 'Martillo de acero 1kg', quantity: 3, type: 'venta', date: yesterday, createdAt: yesterday },
  { id: 'x2', productId: 'p17', productName: 'Codo PVC 1/2" 90°', quantity: 25, type: 'venta', date: yesterday, createdAt: yesterday },
  { id: 'x3', productId: 'p22', productName: 'Interruptor sencillo', quantity: 10, type: 'venta', date: today, createdAt: today },
  { id: 'x4', productId: 'p4', productName: 'Cinta métrica 5m', quantity: 2, type: 'consumo-interno', date: today, createdAt: today },
];
