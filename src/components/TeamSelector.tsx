import React from 'react';
import { useTheme } from '@/hooks/useTheme';
import { nationalTeamColors } from '@/lib/themes';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const TeamSelector: React.FC = () => {
  const { favoriteTeam, setFavoriteTeam, themeName } = useTheme();

  // Só mostrar se estiver no tema World Cup
  if (themeName !== 'world-cup-2026') {
    return null;
  }

  const teams = Object.keys(nationalTeamColors);

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-center">Escolha seu time favorito</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          {teams.map((team) => {
            const colors = nationalTeamColors[team];
            const isSelected = favoriteTeam === team;

            return (
              <Button
                key={team}
                variant={isSelected ? "default" : "outline"}
                className={`h-16 flex flex-col items-center justify-center gap-1 transition-all duration-200 ${
                  isSelected
                    ? 'ring-2 ring-offset-2 ring-primary shadow-lg scale-105'
                    : 'hover:scale-102'
                }`}
                style={{
                  backgroundColor: isSelected ? colors.primary : undefined,
                  borderColor: colors.primary,
                  color: isSelected ? '#ffffff' : colors.primary,
                }}
                onClick={() => setFavoriteTeam(team)}
              >
                <div
                  className="w-6 h-4 rounded-sm border border-white/20"
                  style={{ backgroundColor: colors.secondary }}
                />
                <span className="text-xs font-medium">{team}</span>
              </Button>
            );
          })}
        </div>

        {favoriteTeam && (
          <div className="mt-4 p-3 bg-muted rounded-lg">
            <p className="text-sm text-center">
              Time selecionado: <strong>{favoriteTeam}</strong>
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};