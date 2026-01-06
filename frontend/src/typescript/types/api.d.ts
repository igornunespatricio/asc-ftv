export interface Game {
  match_date: string;
  winner1: string;
  winner2: string;
  loser1: string;
  loser2: string;
  score_winner: number;
  score_loser: number;
}

export interface User {
  username: string;
  email: string;
  role: string;
  active: boolean;
  createdAt: string;
}

export interface RankingEntry {
  position: number;
  player: string;
  points: number;
  matches: number;
  wins: number;
  losses: number;
  efficiency: number;
}

export interface GameFormData {
  match_date: string;
  winner1: string;
  winner2: string;
  loser1: string;
  loser2: string;
  score_winner: string;
  score_loser: string;
}

export interface ApiResponse {
  id?: string;
  message?: string;
}
