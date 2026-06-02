'use client';

import { Product, Entry, Exit, User } from './types';
import { SEED_PRODUCTS, SEED_ENTRIES, SEED_EXITS } from './seed-data';

const KEYS = {
  products: 'stockpro_products',
  entries: 'stockpro_entries',
  exits: 'stockpro_exits',
  session: 'stockpro_session',
};

const USERS: User[] = [
  { id: 'u1', username: 'admin', password: 'admin123', name: 'Eduardo Limón', role: 'admin' },
  { id: 'u2', username: 'personal', password: 'staff123', name: 'Ana Martínez', role: 'staff' },
];

function get<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function set<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(key, JSON.stringify(value));
}

function ensureSeeded(): void {
  if (!localStorage.getItem(KEYS.products)) set(KEYS.products, SEED_PRODUCTS);
  if (!localStorage.getItem(KEYS.entries)) set(KEYS.entries, SEED_ENTRIES);
  if (!localStorage.getItem(KEYS.exits)) set(KEYS.exits, SEED_EXITS);
}

// --- Auth ---

export function login(username: string, password: string): User | null {
  const user = USERS.find((u) => u.username === username && u.password === password);
  if (user) {
    set(KEYS.session, user);
    ensureSeeded();
  }
  return user ?? null;
}

export function logout(): void {
  localStorage.removeItem(KEYS.session);
}

export function getSession(): User | null {
  return get<User | null>(KEYS.session, null);
}

// --- Products ---

export function getProducts(): Product[] {
  return get<Product[]>(KEYS.products, []);
}

export function saveProduct(product: Product): void {
  const all = getProducts();
  const idx = all.findIndex((p) => p.id === product.id);
  if (idx >= 0) all[idx] = product;
  else all.push(product);
  set(KEYS.products, all);
}

export function deleteProduct(id: string): void {
  set(KEYS.products, getProducts().filter((p) => p.id !== id));
}

export function generateId(): string {
  return Math.random().toString(36).slice(2, 10);
}

// --- Entries ---

export function getEntries(): Entry[] {
  return get<Entry[]>(KEYS.entries, []);
}

export function addEntry(entry: Entry): void {
  const entries = getEntries();
  entries.unshift(entry);
  set(KEYS.entries, entries);

  // Update product stock
  const products = getProducts();
  const product = products.find((p) => p.id === entry.productId);
  if (product) {
    product.stock += entry.quantity;
    saveProduct(product);
  }
}

// --- Exits ---

export function getExits(): Exit[] {
  return get<Exit[]>(KEYS.exits, []);
}

export function addExit(exit: Exit): void {
  const exits = getExits();
  exits.unshift(exit);
  set(KEYS.exits, exits);

  // Update product stock
  const products = getProducts();
  const product = products.find((p) => p.id === exit.productId);
  if (product) {
    product.stock = Math.max(0, product.stock - exit.quantity);
    saveProduct(product);
  }
}

// --- Reports ---

export function getLowStockProducts(): Product[] {
  return getProducts().filter((p) => p.stock <= p.minStock);
}

export function getTodayEntries(): Entry[] {
  const today = new Date().toISOString().split('T')[0];
  return getEntries().filter((e) => e.date === today);
}

export function getTodayExits(): Exit[] {
  const today = new Date().toISOString().split('T')[0];
  return getExits().filter((e) => e.date === today);
}
