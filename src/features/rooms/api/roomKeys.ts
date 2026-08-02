export const roomKeys = {
  all: ['rooms'] as const,
  publicList: (propertyId: string) => [...roomKeys.all, 'public', propertyId] as const,
  ownerList: (propertyId: string) => [...roomKeys.all, 'owner', propertyId] as const,
  detail: (propertyId: string, roomId: string, scope: 'public' | 'owner') => [...roomKeys.all, scope, propertyId, roomId] as const,
};
