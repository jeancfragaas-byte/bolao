
import React, { useState, useEffect, useMemo } from 'react';
import { 
  RoundData, 
  PARTICIPANTS, 
  Outcome, 
  Match, 
  TEAMS 
} from './types';
import MatchCard from './components/MatchCard';
import { 
  LayoutDashboard, 
  ListOrdered, 
  Trophy, 
  History, 
  PlusCircle, 
  Save, 
  ChevronLeft, 
  ChevronRight, 
  TrendingUp,
  Medal,
  Award
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Cell, 
  LineChart, 
  Line, 
  Legend 
} from 'recharts';

// Full schedule for 38 rounds based on user input
const PREDEFINED_ROUNDS: Record<number, [string, string][]> = {
  1: [['Fluminense', 'Grêmio'], ['Botafogo', 'Cruzeiro'], ['São Paulo', 'Flamengo'], ['Corinthians', 'Bahia'], ['Mirassol', 'Vasco'], ['Atlético-MG', 'Palmeiras'], ['Internacional', 'Athletico-PR'], ['Coritiba', 'Red Bull Bragantino'], ['Vitória', 'Remo'], ['Chapecoense', 'Santos']],
  2: [['Flamengo', 'Internacional'], ['Vasco', 'Chapecoense'], ['Santos', 'São Paulo'], ['Palmeiras', 'Vitória'], ['Red Bull Bragantino', 'Atlético-MG'], ['Cruzeiro', 'Coritiba'], ['Grêmio', 'Botafogo'], ['Athletico-PR', 'Corinthians'], ['Bahia', 'Fluminense'], ['Remo', 'Mirassol']],
  3: [['Fluminense', 'Botafogo'], ['Vasco', 'Bahia'], ['São Paulo', 'Grêmio'], ['Corinthians', 'Red Bull Bragantino'], ['Mirassol', 'Cruzeiro'], ['Atlético-MG', 'Remo'], ['Internacional', 'Palmeiras'], ['Athletico-PR', 'Santos'], ['Vitória', 'Flamengo'], ['Chapecoense', 'Coritiba']],
  4: [['Flamengo', 'Mirassol'], ['Botafogo', 'Vitória'], ['Santos', 'Vasco'], ['Palmeiras', 'Fluminense'], ['Red Bull Bragantino', 'Athletico-PR'], ['Cruzeiro', 'Corinthians'], ['Grêmio', 'Atlético-MG'], ['Coritiba', 'São Paulo'], ['Bahia', 'Chapecoense'], ['Remo', 'Internacional']],
  5: [['Flamengo', 'Cruzeiro'], ['Vasco', 'Palmeiras'], ['São Paulo', 'Chapecoense'], ['Corinthians', 'Coritiba'], ['Mirassol', 'Santos'], ['Atlético-MG', 'Internacional'], ['Grêmio', 'Red Bull Bragantino'], ['Athletico-PR', 'Botafogo'], ['Bahia', 'Vitória'], ['Remo', 'Fluminense']],
  6: [['Fluminense', 'Athletico-PR'], ['Botafogo', 'Flamengo'], ['Santos', 'Corinthians'], ['Palmeiras', 'Mirassol'], ['Red Bull Bragantino', 'São Paulo'], ['Cruzeiro', 'Vasco'], ['Internacional', 'Bahia'], ['Coritiba', 'Remo'], ['Vitória', 'Atlético-MG'], ['Chapecoense', 'Grêmio']],
  7: [['Flamengo', 'Remo'], ['Vasco', 'Fluminense'], ['Santos', 'Internacional'], ['Palmeiras', 'Botafogo'], ['Mirassol', 'Coritiba'], ['Atlético-MG', 'São Paulo'], ['Grêmio', 'Vitória'], ['Athletico-PR', 'Cruzeiro'], ['Bahia', 'Red Bull Bragantino'], ['Chapecoense', 'Corinthians']],
  8: [['Fluminense', 'Atlético-MG'], ['Vasco', 'Grêmio'], ['São Paulo', 'Palmeiras'], ['Corinthians', 'Flamengo'], ['Red Bull Bragantino', 'Botafogo'], ['Cruzeiro', 'Santos'], ['Internacional', 'Chapecoense'], ['Athletico-PR', 'Coritiba'], ['Vitória', 'Mirassol'], ['Remo', 'Bahia']],
  9: [['Fluminense', 'Corinthians'], ['Botafogo', 'Mirassol'], ['Santos', 'Remo'], ['Palmeiras', 'Grêmio'], ['Red Bull Bragantino', 'Flamengo'], ['Cruzeiro', 'Vitória'], ['Internacional', 'São Paulo'], ['Coritiba', 'Vasco'], ['Bahia', 'Athletico-PR'], ['Chapecoense', 'Atlético-MG']],
  10: [['Flamengo', 'Santos'], ['Vasco', 'Botafogo'], ['São Paulo', 'Cruzeiro'], ['Corinthians', 'Internacional'], ['Mirassol', 'Red Bull Bragantino'], ['Atlético-MG', 'Athletico-PR'], ['Grêmio', 'Remo'], ['Coritiba', 'Fluminense'], ['Bahia', 'Palmeiras'], ['Chapecoense', 'Vitória']],
  11: [['Fluminense', 'Flamengo'], ['Botafogo', 'Coritiba'], ['Santos', 'Atlético-MG'], ['Corinthians', 'Palmeiras'], ['Mirassol', 'Bahia'], ['Cruzeiro', 'Red Bull Bragantino'], ['Internacional', 'Grêmio'], ['Athletico-PR', 'Chapecoense'], ['Vitória', 'São Paulo'], ['Remo', 'Vasco']],
  12: [['Flamengo', 'Bahia'], ['Vasco', 'São Paulo'], ['Santos', 'Fluminense'], ['Palmeiras', 'Athletico-PR'], ['Red Bull Bragantino', 'Remo'], ['Cruzeiro', 'Grêmio'], ['Internacional', 'Mirassol'], ['Coritiba', 'Atlético-MG'], ['Vitória', 'Corinthians'], ['Chapecoense', 'Botafogo']],
  13: [['Fluminense', 'Chapecoense'], ['Botafogo', 'Internacional'], ['São Paulo', 'Mirassol'], ['Corinthians', 'Vasco'], ['Red Bull Bragantino', 'Palmeiras'], ['Atlético-MG', 'Flamengo'], ['Grêmio', 'Coritiba'], ['Athletico-PR', 'Vitória'], ['Bahia', 'Santos'], ['Remo', 'Cruzeiro']],
  14: [['Flamengo', 'Vasco'], ['Botafogo', 'Remo'], ['São Paulo', 'Bahia'], ['Palmeiras', 'Santos'], ['Mirassol', 'Corinthians'], ['Cruzeiro', 'Atlético-MG'], ['Internacional', 'Fluminense'], ['Athletico-PR', 'Grêmio'], ['Vitória', 'Coritiba'], ['Chapecoense', 'Red Bull Bragantino']],
  15: [['Fluminense', 'Vitória'], ['Vasco', 'Athletico-PR'], ['Santos', 'Red Bull Bragantino'], ['Corinthians', 'São Paulo'], ['Mirassol', 'Chapecoense'], ['Atlético-MG', 'Botafogo'], ['Grêmio', 'Flamengo'], ['Coritiba', 'Internacional'], ['Bahia', 'Cruzeiro'], ['Remo', 'Palmeiras']],
  16: [['Fluminense', 'São Paulo'], ['Botafogo', 'Corinthians'], ['Santos', 'Coritiba'], ['Palmeiras', 'Cruzeiro'], ['Red Bull Bragantino', 'Vitória'], ['Atlético-MG', 'Mirassol'], ['Internacional', 'Vasco'], ['Athletico-PR', 'Flamengo'], ['Bahia', 'Grêmio'], ['Chapecoense', 'Remo']],
  17: [['Flamengo', 'Palmeiras'], ['Vasco', 'Red Bull Bragantino'], ['São Paulo', 'Botafogo'], ['Corinthians', 'Atlético-MG'], ['Mirassol', 'Fluminense'], ['Cruzeiro', 'Chapecoense'], ['Grêmio', 'Santos'], ['Coritiba', 'Bahia'], ['Vitória', 'Internacional'], ['Remo', 'Athletico-PR']],
  18: [['Flamengo', 'Coritiba'], ['Vasco', 'Atlético-MG'], ['Santos', 'Vitória'], ['Palmeiras', 'Chapecoense'], ['Red Bull Bragantino', 'Internacional'], ['Cruzeiro', 'Fluminense'], ['Grêmio', 'Corinthians'], ['Athletico-PR', 'Mirassol'], ['Bahia', 'Botafogo'], ['Remo', 'São Paulo']],
  19: [['Fluminense', 'Red Bull Bragantino'], ['Botafogo', 'Santos'], ['São Paulo', 'Athletico-PR'], ['Corinthians', 'Remo'], ['Mirassol', 'Grêmio'], ['Atlético-MG', 'Bahia'], ['Internacional', 'Cruzeiro'], ['Coritiba', 'Palmeiras'], ['Vitória', 'Vasco'], ['Chapecoense', 'Flamengo']],
  20: [['Flamengo', 'São Paulo'], ['Vasco', 'Mirassol'], ['Santos', 'Chapecoense'], ['Palmeiras', 'Atlético-MG'], ['Red Bull Bragantino', 'Coritiba'], ['Cruzeiro', 'Botafogo'], ['Grêmio', 'Fluminense'], ['Athletico-PR', 'Internacional'], ['Bahia', 'Corinthians'], ['Remo', 'Vitória']],
  21: [['Fluminense', 'Bahia'], ['Botafogo', 'Grêmio'], ['São Paulo', 'Santos'], ['Corinthians', 'Athletico-PR'], ['Mirassol', 'Remo'], ['Atlético-MG', 'Red Bull Bragantino'], ['Internacional', 'Flamengo'], ['Coritiba', 'Cruzeiro'], ['Vitória', 'Palmeiras'], ['Chapecoense', 'Vasco']],
  22: [['Flamengo', 'Vitória'], ['Botafogo', 'Fluminense'], ['Santos', 'Athletico-PR'], ['Palmeiras', 'Internacional'], ['Red Bull Bragantino', 'Corinthians'], ['Cruzeiro', 'Mirassol'], ['Grêmio', 'São Paulo'], ['Coritiba', 'Chapecoense'], ['Bahia', 'Vasco'], ['Remo', 'Atlético-MG']],
  23: [['Fluminense', 'Palmeiras'], ['Vasco', 'Santos'], ['São Paulo', 'Coritiba'], ['Corinthians', 'Cruzeiro'], ['Mirassol', 'Flamengo'], ['Atlético-MG', 'Grêmio'], ['Internacional', 'Remo'], ['Athletico-PR', 'Red Bull Bragantino'], ['Vitória', 'Botafogo'], ['Chapecoense', 'Bahia']],
  24: [['Fluminense', 'Remo'], ['Botafogo', 'Athletico-PR'], ['Santos', 'Mirassol'], ['Palmeiras', 'Vasco'], ['Red Bull Bragantino', 'Grêmio'], ['Cruzeiro', 'Flamengo'], ['Internacional', 'Atlético-MG'], ['Coritiba', 'Corinthians'], ['Vitória', 'Bahia'], ['Chapecoense', 'São Paulo']],
  25: [['Flamengo', 'Botafogo'], ['Vasco', 'Cruzeiro'], ['São Paulo', 'Red Bull Bragantino'], ['Corinthians', 'Santos'], ['Mirassol', 'Palmeiras'], ['Atlético-MG', 'Vitória'], ['Grêmio', 'Chapecoense'], ['Athletico-PR', 'Fluminense'], ['Bahia', 'Internacional'], ['Remo', 'Coritiba']],
  26: [['Fluminense', 'Vasco'], ['Botafogo', 'Palmeiras'], ['São Paulo', 'Atlético-MG'], ['Corinthians', 'Chapecoense'], ['Red Bull Bragantino', 'Bahia'], ['Cruzeiro', 'Athletico-PR'], ['Internacional', 'Santos'], ['Coritiba', 'Mirassol'], ['Vitória', 'Grêmio'], ['Remo', 'Flamengo']],
  27: [['Flamengo', 'Corinthians'], ['Botafogo', 'Red Bull Bragantino'], ['Santos', 'Cruzeiro'], ['Palmeiras', 'São Paulo'], ['Mirassol', 'Vitória'], ['Atlético-MG', 'Fluminense'], ['Grêmio', 'Vasco'], ['Coritiba', 'Athletico-PR'], ['Bahia', 'Remo'], ['Chapecoense', 'Internacional']],
  28: [['Flamengo', 'Red Bull Bragantino'], ['Vasco', 'Coritiba'], ['São Paulo', 'Internacional'], ['Corinthians', 'Fluminense'], ['Mirassol', 'Botafogo'], ['Atlético-MG', 'Chapecoense'], ['Grêmio', 'Palmeiras'], ['Athletico-PR', 'Bahia'], ['Vitória', 'Cruzeiro'], ['Remo', 'Santos']],
  29: [['Fluminense', 'Coritiba'], ['Botafogo', 'Vasco'], ['Santos', 'Flamengo'], ['Palmeiras', 'Bahia'], ['Red Bull Bragantino', 'Mirassol'], ['Cruzeiro', 'São Paulo'], ['Internacional', 'Corinthians'], ['Athletico-PR', 'Atlético-MG'], ['Vitória', 'Chapecoense'], ['Remo', 'Grêmio']],
  30: [['Flamengo', 'Fluminense'], ['Vasco', 'Remo'], ['São Paulo', 'Vitória'], ['Palmeiras', 'Corinthians'], ['Red Bull Bragantino', 'Cruzeiro'], ['Atlético-MG', 'Santos'], ['Grêmio', 'Internacional'], ['Coritiba', 'Botafogo'], ['Bahia', 'Mirassol'], ['Chapecoense', 'Athletico-PR']],
  31: [['Fluminense', 'Santos'], ['Botafogo', 'Chapecoense'], ['São Paulo', 'Vasco'], ['Corinthians', 'Vitória'], ['Mirassol', 'Internacional'], ['Atlético-MG', 'Coritiba'], ['Grêmio', 'Cruzeiro'], ['Athletico-PR', 'Palmeiras'], ['Bahia', 'Flamengo'], ['Remo', 'Red Bull Bragantino']],
  32: [['Flamengo', 'Atlético-MG'], ['Vasco', 'Corinthians'], ['Santos', 'Bahia'], ['Palmeiras', 'Red Bull Bragantino'], ['Mirassol', 'São Paulo'], ['Cruzeiro', 'Remo'], ['Internacional', 'Botafogo'], ['Coritiba', 'Grêmio'], ['Vitória', 'Athletico-PR'], ['Chapecoense', 'Fluminense']],
  33: [['Fluminense', 'Internacional'], ['Vasco', 'Flamengo'], ['Santos', 'Palmeiras'], ['Corinthians', 'Mirassol'], ['Red Bull Bragantino', 'Chapecoense'], ['Atlético-MG', 'Cruzeiro'], ['Grêmio', 'Athletico-PR'], ['Coritiba', 'Vitória'], ['Bahia', 'São Paulo'], ['Remo', 'Botafogo']],
  34: [['Flamengo', 'Grêmio'], ['Botafogo', 'Atlético-MG'], ['São Paulo', 'Corinthians'], ['Palmeiras', 'Remo'], ['Red Bull Bragantino', 'Santos'], ['Cruzeiro', 'Bahia'], ['Internacional', 'Coritiba'], ['Athletico-PR', 'Vasco'], ['Vitória', 'Fluminense'], ['Chapecoense', 'Mirassol']],
  35: [['Flamengo', 'Athletico-PR'], ['Vasco', 'Internacional'], ['São Paulo', 'Fluminense'], ['Corinthians', 'Botafogo'], ['Mirassol', 'Atlético-MG'], ['Cruzeiro', 'Palmeiras'], ['Grêmio', 'Bahia'], ['Coritiba', 'Santos'], ['Vitória', 'Red Bull Bragantino'], ['Remo', 'Chapecoense']],
  36: [['Fluminense', 'Mirassol'], ['Botafogo', 'São Paulo'], ['Santos', 'Grêmio'], ['Palmeiras', 'Flamengo'], ['Red Bull Bragantino', 'Vasco'], ['Atlético-MG', 'Corinthians'], ['Internacional', 'Vitória'], ['Athletico-PR', 'Remo'], ['Bahia', 'Coritiba'], ['Chapecoense', 'Cruzeiro']],
  37: [['Fluminense', 'Cruzeiro'], ['Botafogo', 'Bahia'], ['São Paulo', 'Remo'], ['Corinthians', 'Grêmio'], ['Mirassol', 'Athletico-PR'], ['Atlético-MG', 'Vasco'], ['Internacional', 'Red Bull Bragantino'], ['Coritiba', 'Flamengo'], ['Vitória', 'Santos'], ['Chapecoense', 'Palmeiras']],
  38: [['Flamengo', 'Chapecoense'], ['Vasco', 'Vitória'], ['Santos', 'Botafogo'], ['Palmeiras', 'Coritiba'], ['Red Bull Bragantino', 'Fluminense'], ['Cruzeiro', 'Internacional'], ['Grêmio', 'Mirassol'], ['Athletico-PR', 'São Paulo'], ['Bahia', 'Atlético-MG'], ['Remo', 'Corinthians']]
};

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'rounds' | 'history'>('dashboard');
  const [rounds, setRounds] = useState<RoundData[]>(() => {
    const saved = localStorage.getItem('brasileirao_2026_rounds');
    return saved ? JSON.parse(saved) : [];
  });
  const [currentEditingRound, setCurrentEditingRound] = useState<number>(() => {
    const saved = localStorage.getItem('brasileirao_2026_rounds');
    const parsed = saved ? JSON.parse(saved) : [];
    return parsed.length > 0 ? parsed.length : 1;
  });
  const [activeRoundData, setActiveRoundData] = useState<RoundData | null>(null);

  // Sincronizar com localStorage
  useEffect(() => {
    localStorage.setItem('brasileirao_2026_rounds', JSON.stringify(rounds));
  }, [rounds]);

  // Carregar ou inicializar rodada ativa
  useEffect(() => {
    const existing = rounds.find(r => r.number === currentEditingRound);
    if (existing) {
      setActiveRoundData(JSON.parse(JSON.stringify(existing)));
    } else {
      let newMatches: Match[] = [];
      const predefined = PREDEFINED_ROUNDS[currentEditingRound];

      if (predefined) {
        newMatches = predefined.map((teams, i) => ({
          id: `r${currentEditingRound}-m${i}`,
          homeTeam: teams[0],
          awayTeam: teams[1],
        }));
      } else {
        newMatches = Array.from({ length: 10 }, (_, i) => ({
          id: `r${currentEditingRound}-m${i}`,
          homeTeam: TEAMS[(i * 2) % TEAMS.length],
          awayTeam: TEAMS[(i * 2 + 1) % TEAMS.length],
        }));
      }

      setActiveRoundData({
        number: currentEditingRound,
        matches: newMatches,
        participantGuesses: PARTICIPANTS.map(p => ({
          participantName: p,
          guesses: {}
        }))
      });
    }
  }, [currentEditingRound, rounds]);

  const calculateScores = useMemo(() => {
    const totalScores: Record<string, number> = {};
    const roundScores: Record<number, Record<string, number>> = {};
    
    PARTICIPANTS.forEach(p => (totalScores[p] = 0));

    const sortedRounds = [...rounds].sort((a, b) => a.number - b.number);
    
    sortedRounds.forEach(round => {
      roundScores[round.number] = {};
      PARTICIPANTS.forEach(p => {
        let pts = 0;
        const pGuess = round.participantGuesses.find(pg => pg.participantName === p);
        if (pGuess) {
          round.matches.forEach(m => {
            if (m.result && pGuess.guesses[m.id] === m.result) {
              pts += 1;
            }
          });
        }
        roundScores[round.number][p] = pts;
        totalScores[p] += pts;
      });
    });

    const ranking = PARTICIPANTS.map(name => ({
      nome: name,
      pontos: totalScores[name]
    })).sort((a, b) => b.pontos - a.pontos);

    const rankedList = ranking.map((r, i, arr) => {
      let realPos = 1;
      for (let j = 0; j < i; j++) {
        if (arr[j].pontos > r.pontos) realPos++;
      }
      return { ...r, posicao: realPos };
    });

    return { totalScores, roundScores, ranking: rankedList };
  }, [rounds]);

  const saveRound = () => {
    if (!activeRoundData) return;
    setRounds(prev => {
      const filtered = prev.filter(r => r.number !== activeRoundData.number);
      return [...filtered, activeRoundData].sort((a, b) => a.number - b.number);
    });
    alert(`Rodada ${activeRoundData.number} salva com sucesso!`);
  };

  const updateMatchScore = (id: string, homeScore: number | undefined, awayScore: number | undefined) => {
    if (!activeRoundData) return;
    
    let result: Outcome | undefined = undefined;
    if (homeScore !== undefined && awayScore !== undefined) {
      if (homeScore > awayScore) result = 'HOME';
      else if (awayScore > homeScore) result = 'AWAY';
      else result = 'DRAW';
    }

    setActiveRoundData({
      ...activeRoundData,
      matches: activeRoundData.matches.map(m => m.id === id ? { ...m, homeScore, awayScore, result } : m)
    });
  };

  const updateParticipantGuess = (participant: string, matchId: string, outcome: Outcome) => {
    if (!activeRoundData) return;
    setActiveRoundData({
      ...activeRoundData,
      participantGuesses: activeRoundData.participantGuesses.map(pg => 
        pg.participantName === participant 
          ? { ...pg, guesses: { ...pg.guesses, [matchId]: outcome } }
          : pg
      )
    });
  };

  const COLORS = ['#006437', '#FFDF00', '#00416A', '#D00000'];

  const getMedalIcon = (pos: number) => {
    switch(pos) {
      case 1: return <Trophy className="text-yellow-500 w-8 h-8 drop-shadow-md" />;
      case 2: return <Medal className="text-slate-400 w-8 h-8 drop-shadow-md" />;
      case 3: return <Medal className="text-orange-600 w-8 h-8 drop-shadow-md" />;
      default: return <Award className="text-slate-200 w-8 h-8 opacity-50" />;
    }
  };

  const getRankingStyles = (pos: number) => {
    switch(pos) {
      case 1: return "border-yellow-400 bg-gradient-to-br from-white to-yellow-50 shadow-yellow-100";
      case 2: return "border-slate-300 bg-gradient-to-br from-white to-slate-50 shadow-slate-100";
      case 3: return "border-orange-200 bg-gradient-to-br from-white to-orange-50 shadow-orange-100";
      default: return "border-slate-100 bg-white";
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      <header className="bg-brasileirao-green text-white px-6 py-4 shadow-lg sticky top-0 z-50">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Trophy className="text-brasileirao-yellow w-8 h-8" />
            <h1 className="text-xl font-extrabold tracking-tight">BRASILEIRÃO 2026 <span className="text-brasileirao-yellow">PALPITES</span></h1>
          </div>
          <div className="text-xs font-medium bg-white/10 px-3 py-1 rounded-full text-white/80">
            Calendário Oficial Atualizado
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex gap-4 mb-8 overflow-x-auto pb-2 scrollbar-hide">
          <TabButton active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} icon={<LayoutDashboard size={18}/>} label="Geral" />
          <TabButton active={activeTab === 'rounds'} onClick={() => setActiveTab('rounds')} icon={<PlusCircle size={18}/>} label="Gerenciar Rodada" />
          <TabButton active={activeTab === 'history'} onClick={() => setActiveTab('history')} icon={<History size={18}/>} label="Histórico" />
        </div>

        {activeTab === 'dashboard' && (
          <div className="space-y-8 animate-in fade-in duration-500">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {calculateScores.ranking.map((rank) => (
                <div key={rank.nome} className={`relative overflow-hidden border-2 rounded-3xl p-6 shadow-sm transition-all hover:scale-[1.02] ${getRankingStyles(rank.posicao)}`}>
                  <div className="absolute -top-2 -right-2 opacity-10 scale-150">
                    {getMedalIcon(rank.posicao)}
                  </div>
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{rank.posicao}º LUGAR</p>
                      <h3 className="text-xl font-black text-slate-800 tracking-tight">{rank.nome}</h3>
                    </div>
                    {getMedalIcon(rank.posicao)}
                  </div>
                  <div className="mt-2 flex items-baseline gap-1">
                    <span className={`text-4xl font-black ${rank.posicao === 1 ? 'text-yellow-600' : 'text-brasileirao-green'}`}>{rank.pontos}</span>
                    <span className="text-sm font-bold text-slate-400">PONTOS</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
                <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                  <ListOrdered className="text-brasileirao-green" /> Gráfico de Pontuação
                </h3>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={calculateScores.ranking}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="nome" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 10}} />
                      <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                      <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}} />
                      <Bar dataKey="pontos" radius={[10, 10, 0, 0]}>
                        {calculateScores.ranking.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
                <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                  <TrendingUp className="text-brasileirao-green" /> Evolução por Rodada
                </h3>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={rounds.sort((a, b) => a.number - b.number).map(r => ({
                      name: `R${r.number}`,
                      ...calculateScores.roundScores[r.number]
                    }))}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10}} />
                      <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10}} />
                      <Tooltip contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}} />
                      <Legend verticalAlign="top" height={36} iconType="circle" wrapperStyle={{paddingBottom: '20px'}} />
                      {PARTICIPANTS.map((p, i) => (
                        <Line key={p} type="monotone" dataKey={p} stroke={COLORS[i]} strokeWidth={4} dot={{r: 4, strokeWidth: 2, fill: 'white'}} activeDot={{r: 6, strokeWidth: 0}} />
                      ))}
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'rounds' && activeRoundData && (
          <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex items-center justify-between bg-white p-5 rounded-3xl shadow-sm border border-slate-100">
              <div className="flex items-center gap-6">
                <button onClick={() => setCurrentEditingRound(Math.max(1, currentEditingRound - 1))} className="p-3 hover:bg-slate-100 rounded-2xl transition-all border border-transparent hover:border-slate-200"><ChevronLeft /></button>
                <div className="text-center min-w-[140px]">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">RODADA ATUAL</p>
                  <p className="text-3xl font-black text-brasileirao-green">{currentEditingRound}</p>
                </div>
                <button onClick={() => setCurrentEditingRound(Math.min(38, currentEditingRound + 1))} className="p-3 hover:bg-slate-100 rounded-2xl transition-all border border-transparent hover:border-slate-200"><ChevronRight /></button>
              </div>
              <button onClick={saveRound} className="bg-brasileirao-green hover:bg-green-800 text-white px-8 py-4 rounded-2xl font-black flex items-center gap-3 transition-all shadow-xl hover:-translate-y-1 active:scale-95">
                <Save size={20} /> SALVAR DADOS
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activeRoundData.matches.map((match) => (
                <MatchCard 
                  key={match.id} 
                  match={match} 
                  onUpdateScore={updateMatchScore}
                  guesses={activeRoundData.participantGuesses.reduce((acc, curr) => ({...acc, [curr.participantName]: curr.guesses[match.id]}), {})}
                  onUpdateGuess={updateParticipantGuess}
                />
              ))}
            </div>
          </div>
        )}

        {activeTab === 'history' && (
          <div className="space-y-8 animate-in fade-in duration-500">
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
              <h2 className="text-xl font-black mb-6 flex items-center gap-2">
                <History className="text-brasileirao-green" /> Histórico de Rodadas Salvas
              </h2>
              <div className="overflow-x-auto rounded-2xl border border-slate-100">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 border-b border-slate-100">
                    <tr>
                      <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">Rodada</th>
                      {PARTICIPANTS.map(p => <th key={p} className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest text-center">{p}</th>)}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {rounds.length === 0 ? (
                      <tr><td colSpan={5} className="px-8 py-16 text-center text-slate-400 font-medium italic">Nenhum dado registrado até o momento.</td></tr>
                    ) : (
                      [...rounds].sort((a,b) => a.number - b.number).map(r => (
                        <tr key={r.number} className="hover:bg-slate-50/80 transition-colors">
                          <td className="px-8 py-5 font-black text-brasileirao-green">RODADA {r.number}</td>
                          {PARTICIPANTS.map(p => (
                            <td key={p} className="px-8 py-5 font-bold text-slate-700 text-center">
                              <span className="bg-slate-100 px-3 py-1 rounded-full text-sm">
                                {calculateScores.roundScores[r.number]?.[p] || 0} pts
                              </span>
                            </td>
                          ))}
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-slate-200 p-2 md:hidden flex justify-around items-center z-50">
        <MobileNavItem active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} icon={<LayoutDashboard size={24}/>} label="Geral" />
        <MobileNavItem active={activeTab === 'rounds'} onClick={() => setActiveTab('rounds')} icon={<PlusCircle size={24}/>} label="Rodada" />
        <MobileNavItem active={activeTab === 'history'} onClick={() => setActiveTab('history')} icon={<History size={24}/>} label="Histórico" />
      </nav>
    </div>
  );
};

const TabButton: React.FC<{active: boolean, onClick: () => void, icon: React.ReactNode, label: string}> = ({ active, onClick, icon, label }) => (
  <button onClick={onClick} className={`flex items-center gap-3 px-8 py-4 rounded-2xl font-black transition-all whitespace-nowrap ${active ? 'bg-brasileirao-green text-white shadow-xl shadow-green-900/20' : 'bg-white text-slate-500 border border-slate-100 hover:bg-slate-50'}`}>
    {icon} {label}
  </button>
);

const MobileNavItem: React.FC<{active: boolean, onClick: () => void, icon: React.ReactNode, label: string}> = ({ active, onClick, icon, label }) => (
  <button onClick={onClick} className={`flex flex-col items-center gap-1 p-2 transition-all ${active ? 'text-brasileirao-green scale-110' : 'text-slate-400'}`}>
    {icon} <span className="text-[10px] font-black uppercase tracking-widest">{label}</span>
  </button>
);

export default App;
