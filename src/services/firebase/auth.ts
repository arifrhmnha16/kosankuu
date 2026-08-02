// Metro resolves auth.native.ts on native and auth.web.ts on web.
// This fallback gives TypeScript a platform-neutral module target.
export { getFirebaseAuth } from './auth.web';
