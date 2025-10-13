// Tipos e configurações de temas
export interface Theme {
  name: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
    success: string;
    error: string;
    warning: string;
  };
  fonts: {
    primary: string;
    secondary: string;
  };
  spacing: {
    small: string;
    medium: string;
    large: string;
  };
  borderRadius: string;
  shadows: {
    small: string;
    medium: string;
    large: string;
  };
}

// Tema padrão (atual)
export const defaultTheme: Theme = {
  name: 'default',
  colors: {
    primary: '#3b82f6', // blue-500
    secondary: '#6366f1', // indigo-500
    accent: '#8b5cf6', // violet-500
    background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 25%, #f0f9ff 50%, #e0f2fe 75%, #f0f9ff 100%)',
    surface: '#ffffff',
    text: '#1f2937', // gray-800
    textSecondary: '#6b7280', // gray-500
    success: '#10b981', // emerald-500
    error: '#ef4444', // red-500
    warning: '#f59e0b', // amber-500
  },
  fonts: {
    primary: 'Inter, system-ui, sans-serif',
    secondary: 'Inter, system-ui, sans-serif',
  },
  spacing: {
    small: '0.5rem',
    medium: '1rem',
    large: '1.5rem',
  },
  borderRadius: '0.75rem',
  shadows: {
    small: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    medium: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    large: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  },
};

// Tema da Copa do Mundo 2026 (base)
export const worldCup2026Theme: Theme = {
  name: 'world-cup-2026',
  colors: {
    primary: '#1e40af', // blue-800 (azul FIFA)
    secondary: '#dc2626', // red-600 (vermelho FIFA)
    accent: '#fbbf24', // amber-400 (ouro)
    background: 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 25%, #3b82f6 50%, #60a5fa 75%, #93c5fd 100%)', // tons de azul
    surface: '#ffffff',
    text: '#0f172a', // slate-900
    textSecondary: '#475569', // slate-600
    success: '#059669', // emerald-600
    error: '#dc2626', // red-600
    warning: '#d97706', // amber-600
  },
  fonts: {
    primary: 'Inter, system-ui, sans-serif',
    secondary: 'Inter, system-ui, sans-serif',
  },
  spacing: {
    small: '0.5rem',
    medium: '1rem',
    large: '1.5rem',
  },
  borderRadius: '0.75rem',
  shadows: {
    small: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    medium: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    large: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  },
};

// Mapeamento de seleções nacionais para cores
export const nationalTeamColors: Record<string, { primary: string; secondary: string }> = {
  'Brasil': { primary: '#009739', secondary: '#FEDD00' }, // Verde e amarelo
  'Argentina': { primary: '#74C2E1', secondary: '#FFFFFF' }, // Celeste e branco
  'México': { primary: '#006341', secondary: '#C8102E' }, // Verde e vermelho
  'Estados Unidos': { primary: '#B22234', secondary: '#FFFFFF' }, // Vermelho e branco
  'Canadá': { primary: '#FF0000', secondary: '#FFFFFF' }, // Vermelho e branco
  'Uruguai': { primary: '#001489', secondary: '#FFFFFF' }, // Azul e branco
  'Colômbia': { primary: '#FFCD00', secondary: '#0033A0' }, // Amarelo e azul
  'Peru': { primary: '#C8102E', secondary: '#FFFFFF' }, // Vermelho e branco
  'Chile': { primary: '#D52B1E', secondary: '#FFFFFF' }, // Vermelho e branco
  'Equador': { primary: '#FFD100', secondary: '#007A33' }, // Amarelo e verde
  'Venezuela': { primary: '#0033A0', secondary: '#C8102E' }, // Azul e vermelho
  'Paraguai': { primary: '#D52B1E', secondary: '#0033A0' }, // Vermelho e azul
  'Bolívia': { primary: '#D52B1E', secondary: '#FDEE00' }, // Vermelho e amarelo
  'Alemanha': { primary: '#000000', secondary: '#DD0000' }, // Preto e vermelho
  'França': { primary: '#002654', secondary: '#ED2939' }, // Azul e vermelho
  'Espanha': { primary: '#C8102E', secondary: '#FFC400' }, // Vermelho e amarelo
  'Inglaterra': { primary: '#012169', secondary: '#C8102E' }, // Azul e vermelho
  'Itália': { primary: '#009246', secondary: '#F1F2F1' }, // Verde e branco
  'Portugal': { primary: '#FF0000', secondary: '#006600' }, // Vermelho e verde
  'Holanda': { primary: '#FF4F00', secondary: '#FFFFFF' }, // Laranja e branco
  'Bélgica': { primary: '#000000', secondary: '#FFD100' }, // Preto e amarelo
  'Croácia': { primary: '#FF0000', secondary: '#FFFFFF' }, // Vermelho e branco
  'Dinamarca': { primary: '#C8102E', secondary: '#FFFFFF' }, // Vermelho e branco
  'Suécia': { primary: '#004B87', secondary: '#FFCD00' }, // Azul e amarelo
  'Noruega': { primary: '#002868', secondary: '#EF2B2D' }, // Azul e vermelho
  'Polônia': { primary: '#DC143C', secondary: '#FFFFFF' }, // Vermelho e branco
  'Ucrânia': { primary: '#005BBB', secondary: '#FFD500' }, // Azul e amarelo
  'Sérvia': { primary: '#0F1D41', secondary: '#DC143C' }, // Azul e vermelho
  'Suíça': { primary: '#FF0000', secondary: '#FFFFFF' }, // Vermelho e branco
  'Turquia': { primary: '#E30A17', secondary: '#FFFFFF' }, // Vermelho e branco
  'Áustria': { primary: '#ED2939', secondary: '#FFFFFF' }, // Vermelho e branco
  'Hungria': { primary: '#CD2A3E', secondary: '#FFFFFF' }, // Vermelho e branco
  'República Tcheca': { primary: '#D7141A', secondary: '#FFFFFF' }, // Vermelho e branco
  'Romênia': { primary: '#002B7F', secondary: '#FCD116' }, // Azul e amarelo
  'Grécia': { primary: '#0D5EAF', secondary: '#FFFFFF' }, // Azul e branco
  'Rússia': { primary: '#FFFFFF', secondary: '#DA0010' }, // Branco e vermelho
  'Arábia Saudita': { primary: '#006C35', secondary: '#FFFFFF' }, // Verde e branco
  'Japão': { primary: '#BC002D', secondary: '#FFFFFF' }, // Vermelho e branco
  'Coreia do Sul': { primary: '#0047A0', secondary: '#FFFFFF' }, // Azul e branco
  'Austrália': { primary: '#012169', secondary: '#E4002B' }, // Azul e vermelho
  'Irã': { primary: '#239F40', secondary: '#FFFFFF' }, // Verde e branco
  'Catar': { primary: '#8D1B3D', secondary: '#FFFFFF' }, // Borgonha e branco
  'Emirados Árabes Unidos': { primary: '#FF0000', secondary: '#FFFFFF' }, // Vermelho e branco
  'Marrocos': { primary: '#C1272D', secondary: '#006233' }, // Vermelho e verde
  'Tunísia': { primary: '#E70013', secondary: '#FFFFFF' }, // Vermelho e branco
  'Argélia': { primary: '#006233', secondary: '#FFFFFF' }, // Verde e branco
  'Nigéria': { primary: '#008751', secondary: '#FFFFFF' }, // Verde e branco
  'Egito': { primary: '#CE1126', secondary: '#FFFFFF' }, // Vermelho e branco
  'Senegal': { primary: '#00853F', secondary: '#FFFFFF' }, // Verde e branco
  'Camarões': { primary: '#007A5E', secondary: '#FFFFFF' }, // Verde e branco
  'Gana': { primary: '#CE1126', secondary: '#FFD100' }, // Vermelho e amarelo
  'Costa do Marfim': { primary: '#FF8200', secondary: '#009E60' }, // Laranja e verde
  'África do Sul': { primary: '#FFB612', secondary: '#007A4D' }, // Amarelo e verde
};

// Lista de temas disponíveis
export const availableThemes = {
  default: defaultTheme,
  'world-cup-2026': worldCup2026Theme,
} as const;

export type ThemeName = keyof typeof availableThemes;