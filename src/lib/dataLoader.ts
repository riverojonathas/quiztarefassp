import { InMemoryRepository } from '../infra/adapters/InMemoryRepository';
import { Question, LeaderboardEntry } from '../domain/models';
import fs from 'fs';
import path from 'path';

export const loadMockData = (repo: InMemoryRepository) => {
  // Load questions
  const mathQuestions: Question[] = JSON.parse(
    fs.readFileSync(path.join(process.cwd(), 'data/questions.math.json'), 'utf-8')
  );
  const portQuestions: Question[] = JSON.parse(
    fs.readFileSync(path.join(process.cwd(), 'data/questions.port.json'), 'utf-8')
  );
  repo.setQuestions([...mathQuestions, ...portQuestions]);

  // Load leaderboard
  const leaderboard: LeaderboardEntry[] = JSON.parse(
    fs.readFileSync(path.join(process.cwd(), 'data/leaderboard.seed.json'), 'utf-8')
  );
  repo.setLeaderboard(leaderboard);
};