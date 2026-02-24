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

  // Error toast
  const errorBanner = error && (
    <div
      className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-red-900 border border-red-600 text-red-100 px-6 py-3 rounded-2xl shadow-xl flex items-center gap-3 cursor-pointer"
      onClick={clearError}
    >
      <span>⚠️ {error}</span>
      <span className="text-red-300 text-xs">tap to dismiss</span>
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
