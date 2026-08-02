export const MAIN_PROPERTY_ID = 'manzsa-residence';
const propertyId = process.env.EXPO_PUBLIC_PROPERTY_ID?.trim();

export const publicAppConfig = {
  propertyId: propertyId || MAIN_PROPERTY_ID,
} as const;
