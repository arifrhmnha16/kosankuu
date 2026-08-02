import type { Timestamp } from 'firebase/firestore';

export interface PropertyHighlight { id: string; title: string; description: string; icon?: string; }
export interface PropertyFaq { id: string; question: string; answer: string; }
export interface PropertyDocument {
  id: string; name: string; shortDescription: string; description?: string; address: string;
  village?: string; district?: string; regency?: string; province?: string; postalCode?: string;
  locationLabel: string; latitude?: number; longitude?: number; mapsUrl?: string;
  whatsappNumber?: string; email?: string; heroImageUrl?: string; galleryImageUrls: string[];
  facilities: string[]; highlights: PropertyHighlight[]; faq: PropertyFaq[]; isPublished: boolean;
  createdAt: Timestamp; updatedAt: Timestamp;
}
