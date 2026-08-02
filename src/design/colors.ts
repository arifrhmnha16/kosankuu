export const colors = {
  brand: { 50: '#EFF8FF', 100: '#DDEFFF', 200: '#B9DFFF', 300: '#82C5FF', 400: '#45A8FF', 500: '#168BF2', 600: '#0875D1', 700: '#075DA5', 800: '#10446F', 900: '#102B47' },
  neutral: { 0: '#FFFFFF', 25: '#FBFDFF', 50: '#F5F9FD', 100: '#EDF2F7', 200: '#DDE6EF', 300: '#C6D1DC', 400: '#95A3B3', 500: '#66758A', 600: '#4A596C', 700: '#334155', 800: '#1E293B', 900: '#0F1F33' },
  semantic: {
    success: { background: '#EAF8F0', foreground: '#18794E', border: '#BFE8D1' },
    warning: { background: '#FFF7E6', foreground: '#A15C00', border: '#F3D49A' },
    danger: { background: '#FFF0F0', foreground: '#C0362C', border: '#F4C2BE' },
    info: { background: '#EFF8FF', foreground: '#0875D1', border: '#B9DFFF' },
    pending: { background: '#F5F1FF', foreground: '#6D4CC4', border: '#D8CBF7' },
  },
} as const;

export type SemanticColor = keyof typeof colors.semantic;
