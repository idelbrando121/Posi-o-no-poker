import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  RotateCw, 
  User, 
  Settings2, 
  Maximize2,
  Square,
  Circle
} from 'lucide-react';
import { cn } from './lib/utils';

// Types & Interfaces
type TableShape = 'round' | 'oval' | 'square';
type PositionType = 'EP' | 'MP' | 'LP' | 'BLIND';

interface PositionInfo {
  name: string;
  type: PositionType;
  tip: string;
  color: string;
}

// Constants
const POSITIONS_COUNT = 9;

// Mapping according to user request:
const POSITION_MAP: Record<number, PositionInfo> = {
  0: { 
    name: 'BTN', 
    type: 'LP', 
    color: 'bg-amber-400',
    tip: 'Melhor posição! Jogue agressivo, roube blinds e controle o pote pós-flop.' 
  },
  1: { 
    name: 'SB', 
    type: 'BLIND', 
    color: 'bg-red-500',
    tip: 'Fora de posição em todas as rodadas. Jogue com muito cuidado e mãos fortes.' 
  },
  2: { 
    name: 'BB', 
    type: 'BLIND', 
    color: 'bg-red-600',
    tip: 'O último a agir pré-flop. Defenda o blind contra steals, mas cuidado com o pós-flop.' 
  },
  3: { 
    name: 'UTG+2', 
    type: 'EP', 
    color: 'bg-blue-600',
    tip: 'Posição inicial. Exige mãos de valor alto (Broadways e pares altos).' 
  },
  4: { 
    name: 'UTG+1', 
    type: 'EP', 
    color: 'bg-blue-700',
    tip: 'Range muito fechado. Evite mãos especulativas aqui.' 
  },
  5: { 
    name: 'UTG', 
    type: 'EP', 
    color: 'bg-blue-800',
    tip: 'O primeiro a agir pré-flop (Under the Gun). Apenas o topo do seu range.' 
  },
  6: { 
    name: 'LJ', 
    type: 'MP', 
    color: 'bg-emerald-600',
    tip: 'Lojack. Início da transição para um jogo um pouco mais solto.' 
  },
  7: { 
    name: 'HJ', 
    type: 'MP', 
    color: 'bg-emerald-500',
    tip: 'Hijack. Ótima posição para começar a pressionar as posições iniciais.' 
  },
  8: { 
    name: 'CO', 
    type: 'LP', 
    color: 'bg-amber-500',
    tip: 'Cutoff. Quase tão bom quanto o botão. Ótimo para steals.' 
  },
};

export default function App() {
  const [selectionMode, setSelectionMode] = useState<'user' | 'button'>('user');
  const [tableShape, setTableShape] = useState<TableShape>('oval');
  const [buttonIndex, setButtonIndex] = useState(0);
  const [userIndex, setUserIndex] = useState(2); // Default to BB
  const [isRotating, setIsRotating] = useState(false);

  // Calculate current positions
  const playerPosition = useMemo(() => {
    const diff = (userIndex - buttonIndex + POSITIONS_COUNT) % POSITIONS_COUNT;
    return POSITION_MAP[diff];
  }, [buttonIndex, userIndex]);

  const handleSeatClick = (index: number) => {
    if (selectionMode === 'user') {
      setUserIndex(index);
    } else {
      setButtonIndex(index);
    }
  };

  const rotateButton = () => {
    setIsRotating(true);
    setButtonIndex((prev) => (prev + 1) % POSITIONS_COUNT);
    setTimeout(() => setIsRotating(false), 500);
  };

  const getSeatCoords = (index: number, shape: TableShape) => {
    const angle = (index * (360 / POSITIONS_COUNT) + 90) * (Math.PI / 180);
    
    if (shape === 'round') {
      return {
        x: 50 + 40 * Math.cos(angle),
        y: 50 + 40 * Math.sin(angle),
      };
    } else if (shape === 'oval') {
      return {
        x: 50 + 44 * Math.cos(angle),
        y: 50 + 36 * Math.sin(angle),
      };
    } else { // square
      const cos = Math.cos(angle);
      const sin = Math.sin(angle);
      const scale = 1 / Math.max(Math.abs(cos), Math.abs(sin));
      return {
        x: 50 + 38 * cos * scale,
        y: 50 + 32 * sin * scale,
      };
    }
  };

  const getSeatLabel = (i: number) => {
    const d = (i - buttonIndex + POSITIONS_COUNT) % POSITIONS_COUNT;
    return POSITION_MAP[d].name;
  };

  return (
    <div className="h-screen w-full bg-[#0f172a] text-slate-200 font-sans flex flex-col overflow-hidden select-none">
      {/* Header Section */}
      <header className="h-20 px-8 border-b border-slate-800 flex items-center justify-between bg-slate-900/50 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-500 rounded-lg flex items-center justify-center text-slate-950 font-bold shadow-lg shadow-emerald-500/20">
            9X
          </div>
          <div>
            <h1 className="text-xl font-semibold tracking-tight">MTT Position Master</h1>
            <p className="text-xs text-slate-500 uppercase tracking-widest font-medium">Simulador de Posições 9-Max</p>
          </div>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={rotateButton}
            disabled={isRotating}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-md text-sm font-semibold transition-colors flex items-center gap-2 disabled:opacity-50 active:scale-95 shadow-lg shadow-emerald-900/20"
          >
            <span>Girar Dealer (B)</span>
            <RotateCw size={16} className={cn(isRotating && "animate-spin")} />
          </button>
        </div>
      </header>

      <main className="flex-1 flex p-8 gap-8 overflow-hidden">
        {/* Left Sidebar */}
        <aside className="w-64 flex flex-col gap-8 flex-shrink-0">
          <section>
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Formato da Mesa</h3>
            <div className="grid grid-cols-1 gap-2">
              {[
                { id: 'round', label: 'Redonda', icon: <Circle size={14} /> },
                { id: 'oval', label: 'Oval', icon: <Maximize2 size={14} /> },
                { id: 'square', label: 'Quadrada', icon: <Square size={14} /> }
              ].map((s) => (
                <button
                  key={s.id}
                  onClick={() => setTableShape(s.id as TableShape)}
                  className={cn(
                    "flex items-center gap-3 p-3 border transition-all rounded-lg text-sm",
                    tableShape === s.id 
                      ? "bg-emerald-500/10 border-emerald-500/50 text-emerald-400 font-medium" 
                      : "bg-slate-800/50 border-slate-700 text-slate-300 hover:border-slate-600"
                  )}
                >
                  <div className={cn(
                    "w-6 h-6 flex items-center justify-center rounded border-2",
                    tableShape === s.id ? "border-emerald-500" : "border-slate-500"
                  )}>
                    {s.icon}
                  </div>
                  {s.label}
                </button>
              ))}
            </div>
          </section>

          <section>
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Modo de Seleção</h3>
            <div className="space-y-2">
              <button
                onClick={() => setSelectionMode('user')}
                className={cn(
                  "w-full flex items-center gap-3 p-3 border transition-all rounded-lg text-sm",
                  selectionMode === 'user' 
                    ? "bg-emerald-500/10 border-emerald-500/50 text-emerald-400 font-medium" 
                    : "bg-slate-800/50 border-slate-700 text-slate-300 hover:border-slate-600"
                )}
              >
                <div className="w-6 h-6 rounded-full bg-emerald-500 text-slate-950 font-black flex items-center justify-center text-[10px]">V</div>
                Definir Você (V)
              </button>
              <button
                onClick={() => setSelectionMode('button')}
                className={cn(
                  "w-full flex items-center gap-3 p-3 border transition-all rounded-lg text-sm",
                  selectionMode === 'button' 
                    ? "bg-yellow-400/10 border-yellow-400/50 text-yellow-400 font-medium" 
                    : "bg-slate-800/50 border-slate-700 text-slate-300 hover:border-slate-600"
                )}
              >
                <div className="w-6 h-6 rounded-full bg-yellow-400 text-slate-950 font-black flex items-center justify-center text-[10px]">B</div>
                Definir Botão (B)
              </button>
            </div>
          </section>

          <section>
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Legenda</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-yellow-400 text-slate-950 font-bold flex items-center justify-center text-xs shadow-lg shadow-yellow-500/20 ring-2 ring-yellow-400/50">B</div>
                <span className="text-sm text-slate-400">Dealer (Botão)</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-emerald-500 text-slate-950 font-bold flex items-center justify-center text-xs shadow-lg shadow-emerald-500/20 ring-2 ring-emerald-500/50">V</div>
                <span className="text-sm text-slate-400">Você (Jogador)</span>
              </div>
            </div>
          </section>
        </aside>

        {/* Central View */}
        <div className="flex-1 flex flex-col items-center justify-center relative overflow-hidden">
          <div className="relative w-full h-full flex items-center justify-center max-h-[600px]">
            {/* The Table */}
            <motion.div 
              id="poker-table-surface"
              layout
              className={cn(
                "poker-table-felt w-full h-full relative transition-all duration-700 border-[12px] border-[#1e293b] shadow-2xl flex items-center justify-center ring-1 ring-emerald-500/30",
                tableShape === 'round' ? 'rounded-full' : tableShape === 'oval' ? 'rounded-[200px]' : 'rounded-[60px]'
              )}
            >
              <div className="absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-none">
                <div className="w-[80%] h-[80%] border border-emerald-800/30 rounded-full flex items-center justify-center">
                  <span className="text-emerald-500/10 text-4xl font-black uppercase tracking-[1em] select-none">TEXAS HOLD'EM</span>
                </div>
              </div>

              {/* Seats */}
              {Array.from({ length: POSITIONS_COUNT }).map((_, i) => {
                const { x, y } = getSeatCoords(i, tableShape);
                const isButton = buttonIndex === i;
                const isUser = userIndex === i;
                const posName = getSeatLabel(i);
                
                return (
                  <motion.div
                    key={i}
                    layout
                    initial={false}
                    animate={{ left: `${x}%`, top: `${y}%` }}
                    transition={{ type: 'spring', stiffness: 200, damping: 25 }}
                    style={{ transform: 'translate(-50%, -50%)' }}
                    className="absolute z-10"
                  >
                    <div className="flex flex-col items-center gap-2">
                       <button
                        onClick={() => handleSeatClick(i)}
                        className={cn(
                          "relative w-14 h-14 rounded-full border-4 flex items-center justify-center transition-all duration-300",
                          isUser 
                            ? "bg-emerald-500 border-slate-900 shadow-xl shadow-emerald-500/20 ring-2 ring-emerald-500/50" 
                            : isButton 
                              ? "bg-yellow-400 border-slate-900 shadow-xl shadow-yellow-500/20 ring-2 ring-yellow-400/50"
                              : "bg-slate-800 border-slate-700 text-slate-500 hover:border-slate-500"
                        )}
                      >
                         <span className={cn(
                           "text-lg font-black italic",
                           isUser || isButton ? "text-slate-950" : "text-slate-600"
                         )}>
                           {isUser ? 'V' : isButton ? 'B' : i + 1}
                         </span>
                      </button>
                      <div className={cn(
                        "px-2 py-0.5 rounded-full text-[10px] font-bold text-center transition-colors truncate max-w-[80px]",
                        isUser || isButton ? "bg-slate-900 text-white" : "text-slate-500"
                      )}>
                        {posName}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </div>

        {/* Right Info Panel */}
        <aside className="w-80 flex flex-col gap-6 flex-shrink-0">
          <AnimatePresence mode="wait">
            <motion.div 
              key={`${userIndex}-${buttonIndex}`}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl"
            >
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Status do Jogador</h3>
              <div className="text-4xl font-black text-white tracking-tighter mb-1">{playerPosition.name}</div>
              <div className={cn(
                "inline-block px-2 py-1 text-[10px] font-bold rounded border mb-4 uppercase",
                playerPosition.type === 'LP' ? "bg-amber-500/10 text-amber-500 border-amber-500/20" :
                playerPosition.type === 'EP' ? "bg-blue-500/10 text-blue-400 border-blue-500/20" :
                playerPosition.type === 'MP' ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" :
                "bg-red-500/10 text-red-500 border-red-500/20"
              )}>
                {playerPosition.type === 'LP' ? 'Late Position (LP)' :
                 playerPosition.type === 'MP' ? 'Middle Position (MP)' :
                 playerPosition.type === 'EP' ? 'Early Position (EP)' :
                 'Blinds'}
              </div>
              <div className="h-px bg-slate-800 w-full mb-4"></div>
              <p className="text-sm text-slate-400 leading-relaxed min-h-[80px]">
                {playerPosition.tip}
              </p>
            </motion.div>
          </AnimatePresence>

          <div className="bg-slate-900/50 border border-slate-800/50 rounded-2xl p-6">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Dica Estratégica</h3>
            <div className="flex gap-4">
              <div className="w-1 h-auto bg-emerald-500 rounded-full"></div>
              <p className="text-sm text-slate-300 italic leading-relaxed">
                "Posição é tudo no poker. Agir por último permite que você veja as ações de todos antes de decidir o seu movimento."
              </p>
            </div>
          </div>

          <div className="mt-auto">
            <div className="flex justify-between items-center text-xs text-slate-600 font-medium">
              <span>SIMULAÇÃO ATIVA</span>
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
            </div>
          </div>
        </aside>
      </main>

      {/* Footer Bar */}
      <footer className="h-12 border-t border-slate-800 bg-slate-900 flex items-center px-8 text-[11px] text-slate-500 justify-between font-mono uppercase tracking-tighter flex-shrink-0">
        <div>9-MAX MTT • ALGORITMO POSITION-SYNC • SEAT_{userIndex + 1}_SELECTED</div>
        <div className="text-emerald-500/50 flex items-center gap-4">
          <span>PRO VERSION v2.4.1</span>
          <span className="text-slate-700">|</span>
          <span>STABLE_UI</span>
        </div>
      </footer>
    </div>
  );
}
