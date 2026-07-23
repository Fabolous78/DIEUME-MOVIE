import { CartItem, CustomerDetails, MediaItem, OrderRecord, ShopSettings } from '../types';
import { DEFAULT_SHOP_SETTINGS, INITIAL_MEDIA_ITEMS } from '../data/initialData';

const STORAGE_KEY_MEDIA = 'cinezone_media_catalog_v1';
const STORAGE_KEY_SETTINGS = 'cinezone_shop_settings_v1';
const STORAGE_KEY_ORDERS = 'cinezone_order_history_v1';
const STORAGE_KEY_ADMIN_PASS = 'cinezone_admin_password_v1';

export function formatPriceUsd(usd: number): string {
  return `${usd.toFixed(2).replace('.', ',')} $`;
}

export function formatPriceFc(usd: number, rateFc: number): string {
  const fc = Math.round(usd * rateFc);
  return `${fc.toLocaleString('fr-FR')} FC`;
}

export function formatFc(fc: number): string {
  return `${Math.round(fc).toLocaleString('fr-FR')} FC`;
}

export function cleanPhoneNumber(phone: string): string {
  // Remove non digits except leading plus
  return phone.replace(/[^\d+]/g, '').replace(/^00/, '+');
}

/**
 * Calculates base media item price in Francs Congolais (FC) based on rules:
 * - Film: 1,000 FC
 * - Série (1 saison): 1,500 FC
 * - Série (2 saisons): 2,500 FC
 */
export function getMediaPriceFc(item: MediaItem, selectedSeasons: number = 1): number {
  if (item.type === 'film') {
    return item.priceFc && item.priceFc > 0 ? item.priceFc : 1000;
  }
  // Serie pricing rules
  if (selectedSeasons === 2) {
    return 2500; // Pack 2 saisons / 2 séries = 2 500 FC
  } else if (selectedSeasons === 1) {
    return 1500; // 1 saison / 1 série = 1 500 FC
  } else if (selectedSeasons > 2) {
    return 2500 + (selectedSeasons - 2) * 1000;
  }
  return 1500;
}

export function getFormatPriceSurchargeFc(format: string): number {
  return 0; // Aucun supplément pour le support (Clé USB, Transfert, DVD, etc.)
}

export function getFormatPriceSurcharge(format: string): number {
  return getFormatPriceSurchargeFc(format) / 2850;
}

export function calculateMediaTotalFc(
  item: MediaItem, 
  quantity: number = 1, 
  selectedSeasons: number = 1, 
  format?: string
): number {
  const surchargeFc = format ? getFormatPriceSurchargeFc(format) : 0;
  const qty = Math.max(1, quantity);

  if (item.type === 'film') {
    // 1 film = 1 000 FC, 2 films = 1 500 FC
    const pairs = Math.floor(qty / 2);
    const singles = qty % 2;
    const filmPrice = (pairs * 1500) + (singles * 1000);
    return filmPrice + (surchargeFc * qty);
  } else {
    // Serie: 1 saison/série = 1 500 FC, 2 saisons/séries = 2 500 FC
    const totalSeasons = (selectedSeasons || 1) * qty;
    const pairs = Math.floor(totalSeasons / 2);
    const singles = totalSeasons % 2;
    const seriePrice = (pairs * 2500) + (singles * 1500);
    return seriePrice + (surchargeFc * qty);
  }
}

export function calculateCartItemTotalFc(item: CartItem): number {
  return calculateMediaTotalFc(
    item.media,
    item.quantity || 1,
    item.selectedSeasons || 1,
    item.selectedFormat
  );
}

export function calculateCartTotalFc(cart: CartItem[]): number {
  let totalFilmUnits = 0;
  let totalSerieUnits = 0;
  let extraFormatFc = 0;

  cart.forEach(item => {
    const qty = item.quantity || 1;
    extraFormatFc += getFormatPriceSurchargeFc(item.selectedFormat) * qty;

    if (item.media.type === 'film') {
      totalFilmUnits += qty;
    } else {
      const seasons = item.selectedSeasons || 1;
      totalSerieUnits += seasons * qty;
    }
  });

  // Calculate Film total: 1 film = 1000 FC, 2 films = 1500 FC
  const filmPairs = Math.floor(totalFilmUnits / 2);
  const filmSingles = totalFilmUnits % 2;
  const filmTotal = (filmPairs * 1500) + (filmSingles * 1000);

  // Calculate Serie total: 1 serie = 1500 FC, 2 series = 2500 FC
  const seriePairs = Math.floor(totalSerieUnits / 2);
  const serieSingles = totalSerieUnits % 2;
  const serieTotal = (seriePairs * 2500) + (serieSingles * 1500);

  return filmTotal + serieTotal + extraFormatFc;
}

export function calculateCartTotal(cart: CartItem[], rateFc: number = 2850): number {
  return calculateCartTotalFc(cart) / rateFc;
}

export function generateOrderTextSummary(
  cart: CartItem[],
  customer: CustomerDetails,
  totalUsd: number,
  rateFc: number
): string {
  const totalFc = calculateCartTotalFc(cart);
  const totalFcFormatted = formatFc(totalFc);
  const totalUsdFormatted = formatPriceUsd(totalFc / rateFc);
  const dateStr = new Date().toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  let text = `🎬 *NOUVELLE COMMANDE - CineFab (Bukavu/Bagira)*\n`;
  text += `📅 Date : ${dateStr}\n`;
  text += `------------------------------------\n`;
  text += `👤 *CLIENT* : ${customer.name || 'Non spécifié'}\n`;
  text += `📞 *TÉLÉPHONE* : ${customer.phone || 'Non spécifié'}\n`;
  text += `📍 *VILLE / ADRESSE* : ${customer.city || ''} ${customer.address ? '- ' + customer.address : ''}\n`;
  text += `💳 *PAIEMENT* : ${customer.paymentMethod}\n`;
  if (customer.note) {
    text += `📝 *NOTE* : ${customer.note}\n`;
  }
  text += `------------------------------------\n`;
  text += `📦 *ARTICLES COMMANDÉS* :\n\n`;

  cart.forEach((item, index) => {
    const unitFc = getMediaPriceFc(item.media, item.selectedSeasons || 1) + getFormatPriceSurchargeFc(item.selectedFormat);
    const lineTotalFc = unitFc * item.quantity;

    const seasonText = item.media.type === 'serie' 
      ? ` • ${item.selectedSeasons === 2 ? 'Pack 2 Saisons (2 500 FC)' : item.selectedSeasons ? `${item.selectedSeasons} Saison(s)` : '1 Saison (1 500 FC)'}`
      : ' • Film (1 000 FC)';

    text += `${index + 1}. *${item.media.title}* (${item.media.type === 'serie' ? 'Série' : 'Film'}${seasonText})\n`;
    text += `   • Format : ${item.selectedFormat}\n`;
    text += `   • Qté : ${item.quantity} x ${formatFc(unitFc)}\n`;
    text += `   • Sous-total : *${formatFc(lineTotalFc)}* (~ ${formatPriceUsd(lineTotalFc / rateFc)})\n\n`;
  });

  text += `------------------------------------\n`;
  text += `💰 *TOTAL À PAYER* : *${totalFcFormatted}* (~ *${totalUsdFormatted}*)\n`;
  text += `------------------------------------\n`;
  text += `Merci de confirmer la disponibilité et les modalités de livraison.`;

  return text;
}

export function generateWhatsAppUrl(
  phone: string,
  cart: CartItem[],
  customer: CustomerDetails,
  totalUsd: number,
  rateFc: number
): string {
  const cleanedPhone = cleanPhoneNumber(phone).replace('+', '');
  const rawText = generateOrderTextSummary(cart, customer, totalUsd, rateFc);
  const encodedText = encodeURIComponent(rawText);
  return `https://wa.me/${cleanedPhone}?text=${encodedText}`;
}

export function generateSmsUrl(
  phone: string,
  cart: CartItem[],
  customer: CustomerDetails,
  totalUsd: number,
  rateFc: number
): string {
  const cleanedPhone = cleanPhoneNumber(phone);
  const rawText = generateOrderTextSummary(cart, customer, totalUsd, rateFc);
  const encodedText = encodeURIComponent(rawText);
  return `sms:${cleanedPhone}?body=${encodedText}`;
}

// Storage functions
export function getStoredMedia(): MediaItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_MEDIA);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Error reading media storage', e);
  }
  return INITIAL_MEDIA_ITEMS;
}

export function saveStoredMedia(items: MediaItem[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_MEDIA, JSON.stringify(items));
  } catch (e) {
    console.error('Error saving media storage', e);
  }
}

export function getStoredSettings(): ShopSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_SETTINGS);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error('Error reading settings storage', e);
  }
  return DEFAULT_SHOP_SETTINGS;
}

export function saveStoredSettings(settings: ShopSettings): void {
  try {
    localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(settings));
  } catch (e) {
    console.error('Error saving settings storage', e);
  }
}

export function getAdminPassword(): string {
  return localStorage.getItem(STORAGE_KEY_ADMIN_PASS) || '7896';
}

export function setAdminPassword(newPass: string): void {
  localStorage.setItem(STORAGE_KEY_ADMIN_PASS, newPass);
}

// Customer profile storage
const STORAGE_KEY_CUSTOMER_NAME = 'cinefab_customer_name';
const STORAGE_KEY_CUSTOMER_PROFILES = 'cinefab_customer_profiles';

export function getStoredCustomerName(): string {
  return localStorage.getItem(STORAGE_KEY_CUSTOMER_NAME) || '';
}

export function setStoredCustomerName(name: string): void {
  localStorage.setItem(STORAGE_KEY_CUSTOMER_NAME, name.trim());
}

export function clearStoredCustomerName(): void {
  localStorage.removeItem(STORAGE_KEY_CUSTOMER_NAME);
}

export interface CustomerProfile {
  name: string;
  phone: string;
  city: string;
  address: string;
}

export function getStoredCustomerProfile(name: string): CustomerProfile | null {
  if (!name) return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY_CUSTOMER_PROFILES);
    if (raw) {
      const profiles = JSON.parse(raw);
      return profiles[name.toLowerCase()] || null;
    }
  } catch (e) {
    console.error('Error reading customer profiles', e);
  }
  return null;
}

export function saveCustomerProfile(profile: CustomerProfile): void {
  if (!profile.name) return;
  try {
    const raw = localStorage.getItem(STORAGE_KEY_CUSTOMER_PROFILES);
    const profiles = raw ? JSON.parse(raw) : {};
    profiles[profile.name.toLowerCase()] = profile;
    localStorage.setItem(STORAGE_KEY_CUSTOMER_PROFILES, JSON.stringify(profiles));
  } catch (e) {
    console.error('Error saving customer profile', e);
  }
}

export function getStoredOrders(): OrderRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_ORDERS);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error('Error reading orders storage', e);
  }
  return [];
}

export function saveOrder(order: OrderRecord): void {
  try {
    const orders = getStoredOrders();
    orders.unshift(order);
    localStorage.setItem(STORAGE_KEY_ORDERS, JSON.stringify(orders));
  } catch (e) {
    console.error('Error saving order', e);
  }
}
