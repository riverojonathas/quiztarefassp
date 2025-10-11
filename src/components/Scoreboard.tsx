'use client';

import { PlayerState } from '../domain/models';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

interface ScoreboardProps {
  players: PlayerState[];
}

export function Scoreboard({ players }: ScoreboardProps) {
  const sortedPlayers = [...players].sort((a, b) => b.score - a.score);

  return (
    <Card className="w-full max-w-2xl mx-auto md:max-w-xl">
      <CardHeader>
        <CardTitle className="text-lg md:text-base">Placar</CardTitle>
      </CardHeader>
      <CardContent>
        <table
          className="w-full"
          role="table"
          aria-label="Tabela de pontuação dos jogadores"
          aria-live="polite"
          aria-atomic="false"
        >
          <thead className="sr-only">
            <tr>
              <th scope="col">Posição</th>
              <th scope="col">Jogador</th>
              <th scope="col">Sequência</th>
              <th scope="col">Pontuação</th>
            </tr>
          </thead>
          <tbody>
            {sortedPlayers.map((player, index) => (
              <tr
                key={player.userId}
                className="flex justify-between items-center py-3 md:py-2 px-2 md:px-0"
                role="row"
              >
                <td
                  className="text-left text-base md:text-sm"
                  role="cell"
                  aria-label={`Posição ${index + 1}`}
                >
                  <span aria-hidden="true">{index + 1}.</span>
                </td>
                <td
                  className="flex-1 text-left text-base md:text-sm px-2"
                  role="cell"
                  aria-label={`Jogador ${player.userId}`}
                >
                  <span aria-hidden="true">{player.userId}</span>
                  {player.streak > 0 && (
                    <span
                      className="ml-1 text-sm"
                      aria-label={`Sequência de ${player.streak} acertos consecutivos`}
                      role="img"
                      aria-hidden="false"
                    >
                      🔥{player.streak}
                    </span>
                  )}
                </td>
                <td
                  className="text-right font-bold text-base md:text-sm"
                  role="cell"
                  aria-label={`${player.score} pontos`}
                >
                  <span aria-hidden="true">{player.score} pts</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
}