export type MediaType = 'film' | 'serie';

export type ThemeType = 'classic_red' | 'gold_luxury' | 'cyber_neon' | 'emerald_congo' | 'royal_purple';

export type QualityType = 'HD 1080p' | '4K Ultra HD' | '720p Standard' | '3D / IMAX';

export type DeliveryFormat = 'Clé USB' | 'Transfert Téléphone' | 'Téléchargement Direct' | 'DVD / Blu-Ray' | 'Disque Dur Externe';

export interface MediaItem {
  id: string;
  title: string;
  type: MediaType;
  posterUrl: string;
  bannerUrl: string;
  synopsis: string;
  year: number;
  durationOrSeasons: string; // e.g. "2h 15min" for film or "3 Saisons (36 Ép.)" for series
  genres: string[];
  rating: number; // e.g. 4.8 / 5
  priceUsd: number; // USD fallback or derived
  priceFc?: number; // Custom FC price override (default: 1000 FC film, 1500 FC 1 season, 2500 FC 2 seasons)
  seasonCount?: number; // Total available seasons for series
  trailerUrl?: string; // e.g. youtube embed or trailer link
  
  // Categorization flags requested by user
  isTopFilm?: boolean;
  isTopSerie?: boolean;
  isNouveaute?: boolean;
  
  // Extra details
  cast?: string[];
  director?: string;
  audioLanguages?: string[]; // e.g. ["Français (VF)", "Anglais (VOSTFR)"]
  subtitles?: string[];
  featured?: boolean;
  episodesList?: { season: number; episode: number; title: string }[];
}

export interface CartItem {
  media: MediaItem;
  quantity: number;
  selectedFormat: DeliveryFormat;
  selectedSeasons?: number; // 1 for 1 season (1500 FC), 2 for 2 seasons (2500 FC), etc.
}

export interface CustomerDetails {
  name: string;
  phone: string;
  city: string;
  address: string;
  paymentMethod: 'M-Pesa' | 'Airtel Money' | 'Orange Money' | 'Cash à la livraison' | 'Banque';
  note?: string;
}

export interface ShopSettings {
  whatsappNumber: string; // e.g. "+243972252806" or "243972252806"
  smsNumber: string; // e.g. "+243972252806"
  currencyRateFc: number; // e.g. 2850 FC per 1 USD
  shopName: string;
  shopAddress: string;
  mpesaNumber: string;
  airtelNumber: string;
  orangeNumber: string;
}

export interface OrderRecord {
  id: string;
  date: string;
  customerName: string;
  customerPhone: string;
  city: string;
  itemsSummary: string;
  totalUsd: number;
  totalFc: number;
  status: 'Envoyée WhatsApp' | 'Envoyée SMS' | 'En cours' | 'Livrée';
}
