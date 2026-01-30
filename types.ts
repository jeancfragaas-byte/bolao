
export type Outcome = 'HOME' | 'AWAY' | 'DRAW';

export interface Match {
  id: string;
  homeTeam: string;
  awayTeam: string;
  homeScore?: number;
  awayScore?: number;
  result?: Outcome;
}

export interface ParticipantGuesses {
  participantName: string;
  guesses: Record<string, Outcome>; // matchId -> outcome
}

export interface RoundData {
  number: number;
  matches: Match[];
  participantGuesses: ParticipantGuesses[];
}

export interface RankingEntry {
  posicao: number;
  nome: string;
  pontos: number;
}

export interface SystemResponse {
  rodada: number;
  pontuacao_rodada: Record<string, number>;
  pontuacao_total: Record<string, number>;
  ranking: RankingEntry[];
}

export const PARTICIPANTS = ['Brenno', 'Caio', 'Jean', 'João'];

export const TEAMS = [
  'Fluminense', 'Grêmio', 'Botafogo', 'Cruzeiro', 'São Paulo', 'Flamengo',
  'Corinthians', 'Bahia', 'Mirassol', 'Vasco', 'Atlético-MG', 'Palmeiras',
  'Internacional', 'Athletico-PR', 'Coritiba', 'Red Bull Bragantino',
  'Vitória', 'Remo', 'Chapecoense', 'Santos'
];
