import React, { useState, useEffect } from 'react';
import { Container, Typography, Button, CircularProgress, Grid, Paper } from '@mui/material';
import { backend } from 'declarations/backend';

type Player = {
  name: string;
  position: number;
};

type GameState = {
  players: Player[];
  currentTurn: number;
  winner: string | null;
};

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    initGame();
  }, []);

  const initGame = async () => {
    setLoading(true);
    try {
      const result = await backend.initGame(['Player 1', 'Player 2']);
      if ('ok' in result) {
        await fetchGameState();
      } else {
        setError(result.err);
      }
    } catch (err) {
      setError('Failed to initialize game');
    } finally {
      setLoading(false);
    }
  };

  const fetchGameState = async () => {
    try {
      const result = await backend.getGameState();
      if ('ok' in result) {
        setGameState(result.ok);
      } else {
        setError(result.err);
      }
    } catch (err) {
      setError('Failed to fetch game state');
    }
  };

  const rollDiceAndMove = async () => {
    setLoading(true);
    try {
      const rollResult = await backend.rollDice();
      if ('ok' in rollResult) {
        const moveResult = await backend.movePlayer(rollResult.ok);
        if ('ok' in moveResult) {
          await fetchGameState();
        } else {
          setError(moveResult.err);
        }
      } else {
        setError(rollResult.err);
      }
    } catch (err) {
      setError('Failed to roll dice and move');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  if (!gameState) {
    return <Typography>Loading game state...</Typography>;
  }

  return (
    <Container maxWidth="md">
      <Typography variant="h4" gutterBottom>
        Snakes and Ladders
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} md={8}>
          <Paper elevation={3} style={{ padding: '1rem', marginBottom: '1rem' }}>
            <Typography variant="h6">Game Board</Typography>
            {/* Implement game board visualization here */}
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper elevation={3} style={{ padding: '1rem', marginBottom: '1rem' }}>
            <Typography variant="h6">Player Information</Typography>
            {gameState.players.map((player, index) => (
              <Typography key={index}>
                {player.name}: Position {player.position}
              </Typography>
            ))}
          </Paper>
          <Paper elevation={3} style={{ padding: '1rem', marginBottom: '1rem' }}>
            <Typography variant="h6">Current Turn</Typography>
            <Typography>
              {gameState.players[gameState.currentTurn].name}'s turn
            </Typography>
          </Paper>
          <Button
            variant="contained"
            color="primary"
            onClick={rollDiceAndMove}
            disabled={!!gameState.winner}
          >
            Roll Dice
          </Button>
        </Grid>
      </Grid>
      {gameState.winner && (
        <Typography variant="h5" style={{ marginTop: '1rem' }}>
          {gameState.winner} wins!
        </Typography>
      )}
    </Container>
  );
};

export default App;
