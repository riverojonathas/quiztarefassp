import React from 'react';
import { useTheme } from '@/hooks/useTheme';

export const ThemeTest: React.FC = () => {
  const { themeName, favoriteTeam, theme } = useTheme();

  return (
    <div className="p-4 bg-card border border-border rounded-lg">
      <h3 className="text-lg font-semibold mb-2">Debug do Tema</h3>
      <div className="space-y-2 text-sm">
        <p><strong>Tema atual:</strong> {themeName}</p>
        <p><strong>Time favorito:</strong> {favoriteTeam || 'Nenhum'}</p>
        <p><strong>Cor primária do tema:</strong> {theme.colors.primary}</p>
        <p><strong>Cor secundária do tema:</strong> {theme.colors.secondary}</p>
      </div>

      {/* Teste visual das cores */}
      <div className="mt-4 space-y-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded bg-primary border"></div>
          <span>Cor primária aplicada</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded bg-secondary border"></div>
          <span>Cor secundária aplicada</span>
        </div>
      </div>
    </div>
  );
};