import React, { useState, useEffect, useRef } from 'react';

// Minesweeper Types
interface Cell {
  x: number;
  y: number;
  isMine: boolean;
  isRevealed: boolean;
  isFlagged: boolean;
  neighborMines: number;
}

export default function MinesApp() {
  const [grid, setGrid] = useState<Cell[][]>([]);
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'won' | 'lost'>('idle');
  const [minesCount, setMinesCount] = useState(10);
  const [timer, setTimer] = useState(0);
  const [face, setFace] = useState<'🙂' | '😮' | '😎' | '😵'>('🙂');
  const [mobileFlagMode, setMobileFlagMode] = useState(false); // Helps mobile touch devices flag cell
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const GRID_SIZE = 9;
  const TOTAL_MINES = 10;

  // Initialize board blank
  useEffect(() => {
    resetGame();
    return () => stopTimer();
  }, []);

  // Timer runner
  useEffect(() => {
    if (gameState === 'playing') {
      timerIntervalRef.current = setInterval(() => {
        setTimer((prev) => Math.min(prev + 1, 999));
      }, 1000);
    } else {
      stopTimer();
    }
  }, [gameState]);

  const stopTimer = () => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
  };

  // Generate a random retro grid
  const resetGame = () => {
    setGameState('idle');
    setTimer(0);
    setMinesCount(TOTAL_MINES);
    setFace('🙂');
    setMobileFlagMode(false);

    // Build empty cells
    const initialGrid: Cell[][] = [];
    for (let x = 0; x < GRID_SIZE; x++) {
      const row: Cell[] = [];
      for (let y = 0; y < GRID_SIZE; y++) {
        row.push({
          x,
          y,
          isMine: false,
          isRevealed: false,
          isFlagged: false,
          neighborMines: 0
        });
      }
      initialGrid.push(row);
    }
    setGrid(initialGrid);
  };

  // Setup mines after the first click to guarantee safety on step 1
  const initializeMines = (initialGrid: Cell[][], clickedX: number, clickedY: number) => {
    let minesPlaced = 0;
    const workingGrid = [...initialGrid.map(row => [...row])];

    while (minesPlaced < TOTAL_MINES) {
      const rx = Math.floor(Math.random() * GRID_SIZE);
      const ry = Math.floor(Math.random() * GRID_SIZE);

      // Prevent spawning mine on clicked cell or on an existing mine
      if (
        (rx === clickedX && ry === clickedY) ||
        workingGrid[rx][ry].isMine ||
        (Math.abs(rx - clickedX) <= 1 && Math.abs(ry - clickedY) <= 1) // Safe 3x3 start zone
      ) {
        continue;
      }

      workingGrid[rx][ry].isMine = true;
      minesPlaced++;
    }

    // Precalculate neighbor mine counters
    for (let x = 0; x < GRID_SIZE; x++) {
      for (let y = 0; y < GRID_SIZE; y++) {
        if (workingGrid[x][y].isMine) continue;
        let count = 0;

        // Traverse 3x3 surrounding zone
        for (let dx = -1; dx <= 1; dx++) {
          for (let dy = -1; dy <= 1; dy++) {
            const nx = x + dx;
            const ny = y + dy;
            if (nx >= 0 && nx < GRID_SIZE && ny >= 0 && ny < GRID_SIZE) {
              if (workingGrid[nx][ny].isMine) count++;
            }
          }
        }
        workingGrid[x][y].neighborMines = count;
      }
    }

    return workingGrid;
  };

  // Run click-to-sweep cell actions
  const handleCellClick = (x: number, y: number) => {
    if (gameState === 'won' || gameState === 'lost') return;

    let currentGrid = [...grid.map(row => [...row])];
    let isFirstStep = gameState === 'idle';

    if (isFirstStep) {
      currentGrid = initializeMines(currentGrid, x, y);
      setGameState('playing');
    }

    const cell = currentGrid[x][y];
    if (cell.isRevealed || cell.isFlagged) return;

    // Sweeping mode or Flagging mode depending on mobile flag toggle
    if (mobileFlagMode) {
      handleFlagCell(x, y);
      return;
    }

    // Step on a mine? Lose!
    if (cell.isMine) {
      revealAllMines(currentGrid, x, y);
      setGameState('lost');
      setFace('😵');
      return;
    }

    // Otherwise reveal cell recursively if blank
    revealCell(currentGrid, x, y);
    setGrid(currentGrid);

    // Check for Win condition
    checkWinCondition(currentGrid);
  };

  // Handle right click or touch to flag cell
  const handleCellRightClick = (e: React.MouseEvent, x: number, y: number) => {
    e.preventDefault();
    if (gameState === 'idle') setGameState('playing');
    handleFlagCell(x, y);
  };

  const handleFlagCell = (x: number, y: number) => {
    if (gameState === 'won' || gameState === 'lost') return;
    
    const currentGrid = [...grid.map(row => [...row])];
    const cell = currentGrid[x][y];
    if (cell.isRevealed) return;

    cell.isFlagged = !cell.isFlagged;
    setGrid(currentGrid);
    
    // Increment/decrement active flags
    setMinesCount((prev) => prev + (cell.isFlagged ? -1 : 1));
  };

  // Recursive flooding algorithm to clear blank neighbor cells
  const revealCell = (gridRef: Cell[][], x: number, y: number) => {
    const queue: [number, number][] = [[x, y]];

    while (queue.length > 0) {
      const [cx, cy] = queue.shift()!;
      if (cx < 0 || cx >= GRID_SIZE || cy < 0 || cy >= GRID_SIZE) continue;

      const current = gridRef[cx][cy];
      if (current.isRevealed || current.isFlagged) continue;

      current.isRevealed = true;

      // If neighbor sweep shows 0 mines, push neighbors to queue
      if (current.neighborMines === 0 && !current.isMine) {
        for (let dx = -1; dx <= 1; dx++) {
          for (let dy = -1; dy <= 1; dy++) {
            const nx = cx + dx;
            const ny = cy + dy;
            if (nx >= 0 && nx < GRID_SIZE && ny >= 0 && ny < GRID_SIZE) {
              const target = gridRef[nx][ny];
              if (!target.isRevealed && !target.isFlagged && !target.isMine) {
                queue.push([nx, ny]);
              }
            }
          }
        }
      }
    }
  };

  // Reveal all mines on-loss
  const revealAllMines = (gridRef: Cell[][], failX: number, failY: number) => {
    for (let x = 0; x < GRID_SIZE; x++) {
      for (let y = 0; y < GRID_SIZE; y++) {
        const cell = gridRef[x][y];
        if (cell.isMine) {
          cell.isRevealed = true;
        }
      }
    }
    setGrid(gridRef);
  };

  // Check if non-mined cells are all cleared
  const checkWinCondition = (gridRef: Cell[][]) => {
    let unrevealedSafeCells = 0;
    for (let x = 0; x < GRID_SIZE; x++) {
      for (let y = 0; y < GRID_SIZE; y++) {
        const cell = gridRef[x][y];
        if (!cell.isMine && !cell.isRevealed) {
          unrevealedSafeCells++;
        }
      }
    }

    if (unrevealedSafeCells === 0) {
      // Flag remaining mines automatically
      const wonGrid = gridRef.map(row => 
        row.map(cell => (cell.isMine ? { ...cell, isFlagged: true } : cell))
      );
      setGrid(wonGrid);
      setMinesCount(0);
      setGameState('won');
      setFace('😎');
    }
  };

  // Color coordinate mines count numbers
  const getNumberColorClass = (count: number) => {
    switch (count) {
      case 1: return 'text-blue-800 font-bold';
      case 2: return 'text-emerald-700 font-bold';
      case 3: return 'text-red-700 font-bold';
      case 4: return 'text-indigo-900 font-bold';
      case 5: return 'text-amber-800 font-bold';
      default: return 'text-teal-800 font-bold';
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full p-2 bg-[#c0c0c0] win95-outset select-none select-none">
      {/* Game Frame */}
      <div className="p-2 border-2 border-t-white border-l-white border-b-neutral-700 border-r-neutral-700 bg-[#c0c0c0] flex flex-col items-center">
        
        {/* Score Board header panel */}
        <div className="w-full flex items-center justify-between px-3 py-1.5 win95-inset-depressed bg-[#c0c0c0] mb-3">
          {/* Active mines left */}
          <div className="bg-black text-rose-500 font-mono text-xl font-bold px-2 py-0.5 win95-inset tracking-widest min-w-[50px] text-center">
            {String(Math.max(0, minesCount)).padStart(3, '0')}
          </div>

          {/* Reset center Smiley */}
          <button
            id="mines-smiley"
            onClick={resetGame}
            onMouseDown={() => gameState === 'playing' && setFace('😮')}
            onMouseUp={() => gameState === 'playing' && setFace('🙂')}
            className="w-8 h-8 text-lg flex items-center justify-center win95-button border-2"
          >
            {face}
          </button>

          {/* Electronic Stopwatch */}
          <div className="bg-black text-rose-500 font-mono text-xl font-bold px-2 py-0.5 win95-inset tracking-widest min-w-[50px] text-center">
            {String(timer).padStart(3, '0')}
          </div>
        </div>

        {/* 9x9 Cells Board Canvas */}
        <div className="win95-inset p-1.5 bg-[#808080]">
          <div className="grid grid-cols-9 gap-[1.5px] bg-[#808080]">
            {grid.map((row, x) =>
              row.map((cell, y) => {
                const isRevealed = cell.isRevealed;
                const isFlagged = cell.isFlagged;
                const hasMine = cell.isMine;

                return (
                  <button
                    key={`${x}-${y}`}
                    id={`cell-${x}-${y}`}
                    onClick={() => handleCellClick(x, y)}
                    onContextMenu={(e) => handleCellRightClick(e, x, y)}
                    className={`w-7 h-7 flex items-center justify-center shrink-0 p-0 text-center select-none ${
                      isRevealed
                        ? 'bg-neutral-300 border-t border-l border-neutral-500' // Flat revealed outline
                        : 'win95-button bg-neutral-200 border-2' // Beveled pushable button
                    }`}
                  >
                    {isRevealed ? (
                      hasMine ? (
                        <span className="text-sm select-none">💣</span>
                      ) : cell.neighborMines > 0 ? (
                        <span className={`text-xs select-none ${getNumberColorClass(cell.neighborMines)}`}>
                          {cell.neighborMines}
                        </span>
                      ) : (
                        ''
                      )
                    ) : isFlagged ? (
                      <span className="text-xs select-none">🚩</span>
                    ) : (
                      ''
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Dynamic game over footer dialogue */}
        <div className="w-full mt-3 flex justify-between items-center px-1">
          {/* Mobile-Friendly flag cursor mode toggle */}
          <button
            id="mobile-flag-toggle"
            onClick={() => setMobileFlagMode(!mobileFlagMode)}
            className={`px-3 py-1 text-[10px] font-mono font-bold win95-button ${
              mobileFlagMode ? 'win95-inset-depressed bg-[#dedede] text-blue-900 border-1' : ''
            }`}
          >
            Mode: {mobileFlagMode ? '🚩 Flagging' : '⛏️ Sweeping'}
          </button>

          {gameState === 'won' && (
            <span className="text-[10px] text-emerald-800 font-bold uppercase animate-pulse">
              🎉 Win Registered!
            </span>
          )}
          {gameState === 'lost' && (
            <span className="text-[10px] text-red-800 font-bold uppercase animate-pulse">
              💥 Kaboom! Game Over
            </span>
          )}
          {gameState === 'playing' && (
            <span className="text-[10px] text-neutral-600 font-bold uppercase">
              🧹 Mining active
            </span>
          )}
          {gameState === 'idle' && (
            <span className="text-[10px] text-neutral-500 font-bold uppercase">
              ⚡ Safe click active
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
