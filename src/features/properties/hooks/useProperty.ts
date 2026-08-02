import { useQuery } from '@tanstack/react-query';
import { getOwnerProperty, getPublicProperty } from '../api/propertyApi';
import { propertyKeys } from '../api/propertyKeys';

export function usePublicProperty(propertyId: string | null) {
  return useQuery({ queryKey: propertyKeys.detail(propertyId ?? 'unconfigured', 'public'), queryFn: () => getPublicProperty(propertyId!), enabled: Boolean(propertyId) });
}
export function useOwnerProperty(propertyId: string | null) {
  return useQuery({ queryKey: propertyKeys.detail(propertyId ?? 'unconfigured', 'owner'), queryFn: () => getOwnerProperty(propertyId!), enabled: Boolean(propertyId) });
}
