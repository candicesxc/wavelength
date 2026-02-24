import React, { useEffect, useState } from 'react';
import { getCustomCards, saveCustomCard, deleteCustomCard } from '../../lib/localStorage';
import type { SpectrumCard } from '../../types/game';
import { Button } from '../ui/Button';

interface CardEditorProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CardEditor: React.FC<CardEditorProps> = ({ isOpen, onClose }) => {
  const [cards, setCards] = useState<SpectrumCard[]>([]);
  const [left, setLeft] = useState('');
  const [right, setRight] = useState('');

  useEffect(() => {
    if (isOpen) setCards(getCustomCards());
  }, [isOpen]);

  const handleAdd = () => {
    if (!left.trim() || !right.trim()) return;
    const card: SpectrumCard = {
      id: `c_${Date.now()}`,
      left: left.trim(),
      right: right.trim(),
      isCustom: true,
    };
    saveCustomCard(card);
    setCards(getCustomCards());
    setLeft('');
    setRight('');
  };

  const handleDelete = (id: string) => {
    deleteCustomCard(id);
    setCards(getCustomCards());
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-full max-w-sm bg-slate-900 border-l border-slate-700 z-50 flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-700">
          <h2 className="text-lg font-bold text-white">✏️ Custom Cards</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors text-2xl leading-none"
          >
            ×
          </button>
        </div>

        {/* Add card form */}
        <div className="px-6 py-4 border-b border-slate-700">
          <p className="text-xs text-slate-500 mb-3 uppercase tracking-wider">Add New Card</p>
          <div className="flex gap-2 items-end">
            <div className="flex-1 flex flex-col gap-1">
              <label className="text-xs text-slate-400">Left</label>
              <input
                type="text"
                value={left}
                onChange={e => setLeft(e.target.value)}
                placeholder="e.g. Summer"
                maxLength={30}
                className="bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 text-sm"
              />
            </div>
            <span className="text-slate-600 pb-2 text-sm">↔</span>
            <div className="flex-1 flex flex-col gap-1">
              <label className="text-xs text-slate-400">Right</label>
              <input
                type="text"
                value={right}
                onChange={e => setRight(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter') handleAdd();
                }}
                placeholder="e.g. Winter"
                maxLength={30}
                className="bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 text-sm"
              />
            </div>
            <Button
              variant="primary"
              size="sm"
              onClick={handleAdd}
              disabled={!left.trim() || !right.trim()}
              className="pb-2"
            >
              +
            </Button>
          </div>
        </div>

        {/* Card list */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {cards.length === 0 ? (
            <p className="text-slate-600 text-sm text-center italic mt-4">
              No custom cards yet. Add one above!
            </p>
          ) : (
            <div className="flex flex-col gap-2">
              <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">
                {cards.length} custom card{cards.length !== 1 ? 's' : ''}
              </p>
              {cards.map(card => (
                <div
                  key={card.id}
                  className="flex items-center justify-between bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5"
                >
                  <span className="text-slate-200 text-sm">
                    <span className="text-slate-400">{card.left}</span>
                    <span className="text-slate-600 mx-2">↔</span>
                    <span className="text-slate-400">{card.right}</span>
                  </span>
                  <button
                    onClick={() => handleDelete(card.id)}
                    className="text-slate-600 hover:text-red-400 transition-colors text-lg leading-none ml-2"
                    title="Delete card"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="px-6 py-4 border-t border-slate-700">
          <p className="text-xs text-slate-600 text-center">
            Custom cards are saved locally and mixed with the built-in deck when the game starts.
          </p>
        </div>
      </div>
    </>
  );
};
