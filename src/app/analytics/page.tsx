'use client';

import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';

export default function AnalyticsPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-500 to-pink-600 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">Analytics do Aluno</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold">Acerto por Habilidade</h3>
            <p>Matemática: 80%</p>
            <p>Português: 75%</p>
          </div>
          <div>
            <h3 className="font-semibold">Tempo Médio por Questão</h3>
            <p>8 segundos</p>
          </div>
          <div>
            <h3 className="font-semibold">Streak Record</h3>
            <p>5 acertos consecutivos</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}