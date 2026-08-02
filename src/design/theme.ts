import { colors } from './colors';
import { radii } from './radii';
import { shadows } from './shadows';
import { spacing } from './spacing';
import { fontFamilies, typography } from './typography';

export const theme = { colors, spacing, radii, shadows, typography, fontFamilies } as const;
export type AppTheme = typeof theme;
