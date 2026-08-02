export const propertyKeys = { all: ['properties'] as const, detail: (propertyId: string, scope: 'public' | 'owner') => [...propertyKeys.all, scope, propertyId] as const };
