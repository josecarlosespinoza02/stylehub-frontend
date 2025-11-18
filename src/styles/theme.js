// ========================================
// 📁 src/styles/theme.js
// ========================================
export const theme = {
  // 🎨 COLORES
  colors: {
    dark: {
      background: {
        primary: '#0A0A0F',
        secondary: '#13131A',
        tertiary: '#1A1A24',
        elevated: '#20202E',
        hover: '#2A2A3A',
      },
      text: {
        primary: '#FFFFFF',
        secondary: '#A1A1AA',
        tertiary: '#71717A',
        muted: '#52525B',
      },
      border: {
        primary: '#2A2A3A',
        secondary: '#3A3A4A',
      },
      accent: {
        purple: '#8B5CF6',
        pink: '#EC4899',
        blue: '#3B82F6',
        green: '#10B981',
        red: '#EF4444',
        yellow: '#F59E0B',
      },
    },
    light: {
      background: {
        primary: '#FFFFFF',
        secondary: '#F9FAFB',
        tertiary: '#F3F4F6',
        elevated: '#FFFFFF',
        hover: '#F3F4F6',
      },
      text: {
        primary: '#111827',
        secondary: '#6B7280',
        tertiary: '#9CA3AF',
        muted: '#D1D5DB',
      },
      border: {
        primary: '#E5E7EB',
        secondary: '#D1D5DB',
      },
      accent: {
        purple: '#8B5CF6',
        pink: '#EC4899',
        blue: '#3B82F6',
        green: '#10B981',
        red: '#EF4444',
        yellow: '#F59E0B',
      },
    },
  },
  
  // 📊 GRADIENTES
  gradients: {
    primary: 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)',
    secondary: 'linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)',
    success: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
    purple: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    sunset: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    ocean: 'linear-gradient(135deg, #667eea 0%, #06b6d4 100%)',
  },
  
  // 💫 SOMBRAS
  shadows: {
    sm: '0 2px 8px rgba(0, 0, 0, 0.1)',
    md: '0 4px 16px rgba(0, 0, 0, 0.15)',
    lg: '0 8px 32px rgba(0, 0, 0, 0.2)',
    xl: '0 12px 48px rgba(0, 0, 0, 0.25)',
    glow: '0 0 20px rgba(139, 92, 246, 0.4)',
    glowPink: '0 0 20px rgba(236, 72, 153, 0.4)',
  },
  
  // 📐 ANIMACIONES
  animations: {
    fadeIn: 'fadeIn 0.3s ease-in-out',
    slideUp: 'slideUp 0.3s ease-out',
    slideDown: 'slideDown 0.3s ease-out',
    scaleIn: 'scaleIn 0.2s ease-out',
  },
};