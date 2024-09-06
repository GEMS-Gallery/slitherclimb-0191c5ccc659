import React from 'react';
import { Typography } from '@mui/material';

type Player = {
  name: string;
  position: number;
};

type GameState = {
  players: Player[];
  currentTurn: number;
  winner: string | null;
};

type GameBoardProps = {
  gameState: GameState;
};

const snakesAndLadders: { [key: number]: number } = {
  16: 6, 47: 26, 49: 11, 56: 53, 62: 19, 64: 60, 87: 24, 93: 73, 95: 75, 98: 78,
  1: 38, 4: 14, 9: 31, 21: 42, 28: 84, 36: 44, 51: 67, 71: 91, 80: 100
};

const GameBoard: React.FC<GameBoardProps> = ({ gameState }) => {
  const renderCell = (cellNumber: number) => {
    const isSnake = Object.keys(snakesAndLadders).includes(cellNumber.toString()) && snakesAndLadders[cellNumber] < cellNumber;
    const isLadder = Object.keys(snakesAndLadders).includes(cellNumber.toString()) && snakesAndLadders[cellNumber] > cellNumber;
    const cellClass = `cell ${isSnake ? 'snake' : ''} ${isLadder ? 'ladder' : ''}`;

    const playersOnCell = gameState.players.filter(player => player.position === cellNumber);

    return (
      <div key={cellNumber} className={cellClass}>
        <Typography variant="body2">{cellNumber}</Typography>
        {playersOnCell.map((player, index) => (
          <div key={player.name} className={`player player-${index}`} />
        ))}
      </div>
    );
  };

  const cells = Array.from({ length: 100 }, (_, i) => i + 1).reverse();

  return (
    <div className="game-board">
      {cells.map(renderCell)}
    </div>
  );
};

export default GameBoard;
