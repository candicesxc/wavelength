import { useState } from 'react';
import { useGameState } from './hooks/useGameState';
import { EntryScreen } from './components/screens/EntryScreen';
import { LobbyScreen } from './components/screens/LobbyScreen';
import { ClueGivingScreen } from './components/screens/ClueGivingScreen';
import { GuessingScreen } from './components/screens/GuessingScreen';
import { LeftRightScreen } from './components/screens/LeftRightScreen';
import { ScoringScreen } from './components/screens/ScoringScreen';
import { GameOverScreen } from './components/screens/GameOverScreen';
import { CardEditor } from './components/editor/CardEditor';

function App() {
  const { gameState, psychicTarget, localPlayerId, error, clearError } = useGameState();
  const [isCardEditorOpen, setIsCardEditorOpen] = useState(false);

  // Error toast — styled with original palette
  const errorBanner = error && (
    <div
      style={{
        position: 'fixed', top: 16, left: '50%', transform: 'translateX(-50%)',
        zIndex: 999,
        background: '#2D2F50',
        border: '2px solid #B9373B',
        color: '#F1ECC2',
        padding: '12px 24px',
        borderRadius: 16,
        boxShadow: '0 8px 32px rgba(0,0,0,0.6)',
        display: 'flex', alignItems: 'center', gap: 12,
        cursor: 'pointer',
        fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif',
        fontSize: 14,
      }}
      onClick={clearError}
    >
      <span>⚠️ {error}</span>
      <span style={{ color: '#80AAB2', fontSize: 12 }}>tap to dismiss</span>
    </div>
  );

  // No game state → entry screen
  if (!gameState) {
    return (
      <>
        {errorBanner}
        <EntryScreen />
        <CardEditor isOpen={isCardEditorOpen} onClose={() => setIsCardEditorOpen(false)} />
      </>
    );
  }

  const renderScreen = () => {
    switch (gameState.phase) {
      case 'LOBBY':
        return (
          <LobbyScreen
            gameState={gameState}
            localPlayerId={localPlayerId}
            onOpenCardEditor={() => setIsCardEditorOpen(true)}
          />
        );

      case 'CLUE_GIVING':
        return (
          <ClueGivingScreen
            gameState={gameState}
            localPlayerId={localPlayerId}
            psychicTarget={psychicTarget}
          />
        );

      case 'GUESSING':
        return <GuessingScreen gameState={gameState} localPlayerId={localPlayerId} />;

      case 'LEFT_RIGHT':
        return <LeftRightScreen gameState={gameState} localPlayerId={localPlayerId} />;

      case 'SCORING':
        return <ScoringScreen gameState={gameState} localPlayerId={localPlayerId} />;

      case 'GAME_OVER':
        return <GameOverScreen gameState={gameState} localPlayerId={localPlayerId} />;

      default:
        return <EntryScreen />;
    }
  };

  return (
    <>
      {errorBanner}
      {renderScreen()}
      <CardEditor isOpen={isCardEditorOpen} onClose={() => setIsCardEditorOpen(false)} />
    </>
  );
}

export default App;
