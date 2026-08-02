import NetInfo from '@react-native-community/netinfo';
import { useEffect, useState } from 'react';

export function useNetworkStatus() {
  const [isOffline, setIsOffline] = useState(false);
  useEffect(() => NetInfo.addEventListener((state) => setIsOffline(state.isConnected === false)), []);
  return { isOffline };
}
