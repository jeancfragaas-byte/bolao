
import React from 'react';
import { Match, Outcome, PARTICIPANTS } from '../types';

interface MatchCardProps {
  match: Match;
  onUpdateScore: (id: string, homeScore: number | undefined, awayScore: number | undefined) => void;
  guesses: Record<string, Outcome>; // participantName -> Outcome
  onUpdateGuess: (participant: string, matchId: string, outcome: Outcome) => void;
}

const MatchCard: React.FC<MatchCardProps> = ({ match, onUpdateScore, guesses, onUpdateGuess }) => {
  const options: { label: string; value: Outcome }[] = [
    { label: 'Casa', value: 'HOME' },
    { label: 'Empate', value: 'DRAW' },
    { label: 'Fora', value: 'AWAY' },
  ];

  const handleHomeScoreChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value === '' ? undefined : parseInt(e.target.value, 10);
    onUpdateScore(match.id, val, match.awayScore);
  };

  const handleAwayScoreChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value === '' ? undefined : parseInt(e.target.value, 10);
    onUpdateScore(match.id, match.homeScore, val);
  };

  return (
    <div className="bg-white border rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4 border-b pb-2 gap-2">
        <span className="font-bold text-gray-800 text-sm flex-1">{match.homeTeam}</span>
        <div className="flex items-center gap-1">
          <input
            type="number"
            min="0"
            value={match.homeScore ?? ''}
            onChange={handleHomeScoreChange}
            className="w-10 h-8 text-center border rounded-md font-bold text-brasileirao-green focus:ring-2 focus:ring-brasileirao-green outline-none"
            placeholder="-"
          />
          <span className="text-gray-400 font-bold">x</span>
          <input
            type="number"
            min="0"
            value={match.awayScore ?? ''}
            onChange={handleAwayScoreChange}
            className="w-10 h-8 text-center border rounded-md font-bold text-brasileirao-green focus:ring-2 focus:ring-brasileirao-green outline-none"
            placeholder="-"
          />
        </div>
        <span className="font-bold text-gray-800 text-sm flex-1 text-right">{match.awayTeam}</span>
      </div>

      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <label className="block text-xs font-semibold text-gray-500 uppercase">Resultado Calculado</label>
          {match.result && (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-brasileirao-green/10 text-brasileirao-green">
              {match.result === 'HOME' ? 'Vitória Casa' : match.result === 'AWAY' ? 'Vitória Fora' : 'Empate'}
            </span>
          )}
        </div>
      </div>

      <div className="space-y-3 pt-2 border-t border-dashed">
        <label className="block text-xs font-semibold text-gray-500 uppercase">Palpites dos Participantes</label>
        {PARTICIPANTS.map((participant) => (
          <div key={participant} className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">{participant}</span>
            <div className="flex gap-1.5">
              {options.map((opt) => {
                const isCorrect = match.result && guesses[participant] === match.result;
                const isSelected = guesses[participant] === opt.value;
                
                return (
                  <button
                    key={opt.value}
                    onClick={() => onUpdateGuess(participant, match.id, opt.value)}
                    className={`px-2.5 py-1 rounded text-[10px] font-bold border transition-all ${
                      isSelected
                        ? isCorrect && match.result
                          ? 'bg-green-500 text-white border-green-500 shadow-sm'
                          : match.result && !isCorrect 
                            ? 'bg-red-400 text-white border-red-400 shadow-sm'
                            : 'bg-brasileirao-yellow text-gray-900 border-brasileirao-yellow shadow-inner'
                        : 'bg-white text-gray-400 border-gray-100 hover:bg-gray-50'
                    }`}
                  >
                    {opt.label[0]}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MatchCard;
