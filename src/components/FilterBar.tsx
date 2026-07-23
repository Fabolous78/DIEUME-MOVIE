import React from 'react';
import { Filter, Film, Tv, Flame, Star, ArrowUpDown } from 'lucide-react';
import { MediaType } from '../types';

interface FilterBarProps {
  selectedType: 'all' | 'film' | 'serie';
  setSelectedType: (type: 'all' | 'film' | 'serie') => void;
  selectedGenre: string;
  setSelectedGenre: (genre: string) => void;
  sortBy: 'popular' | 'newest' | 'price_asc' | 'price_desc' | 'rating';
  setSortBy: (sort: 'popular' | 'newest' | 'price_asc' | 'price_desc' | 'rating') => void;
  allGenres: string[];
  totalResults: number;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  selectedType,
  setSelectedType,
  selectedGenre,
  setSelectedGenre,
  sortBy,
  setSortBy,
  allGenres,
  totalResults,
}) => {
  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 mb-6 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-4">
        
        {/* Type pills */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-950 rounded-xl border border-slate-800">
          <button
            onClick={() => setSelectedType('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              selectedType === 'all'
                ? 'bg-red-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Tous ({totalResults})
          </button>

          <button
            onClick={() => setSelectedType('film')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
              selectedType === 'film'
                ? 'bg-amber-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Film className="w-3.5 h-3.5" />
            <span>Films</span>
          </button>

          <button
            onClick={() => setSelectedType('serie')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
              selectedType === 'serie'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Tv className="w-3.5 h-3.5" />
            <span>Séries</span>
          </button>
        </div>

        {/* Sort Selector */}
        <div className="flex items-center gap-2">
          <ArrowUpDown className="w-4 h-4 text-slate-400" />
          <span className="text-xs text-slate-400 font-medium hidden sm:inline">Trier par :</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-xl px-3 py-1.5 font-semibold focus:outline-none focus:border-red-500"
          >
            <option value="popular">Plus populaires</option>
            <option value="newest">Nouveautés récents</option>
            <option value="rating">Meilleures notes</option>
            <option value="price_asc">Prix croissant ($)</option>
            <option value="price_desc">Prix décroissant ($)</option>
          </select>
        </div>

      </div>

      {/* Tariff Offer Announcement Banner */}
      <div className="flex flex-wrap items-center justify-between gap-2 p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs font-semibold">
        <div className="flex items-center gap-2 text-amber-400">
          <Film className="w-3.5 h-3.5 text-amber-500 shrink-0" />
          <span><strong>Films :</strong> 1 Film = 1 000 FC <span className="text-emerald-400 font-bold">• 2 Films = 1 500 FC</span></span>
        </div>
        <div className="flex items-center gap-2 text-purple-300">
          <Tv className="w-3.5 h-3.5 text-purple-400 shrink-0" />
          <span><strong>Séries :</strong> 1 Série = 1 500 FC <span className="text-amber-300 font-bold">• 2 Séries = 2 500 FC</span></span>
        </div>
      </div>

      {/* Genre pills horizontal scroll */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-1 pb-1">
        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider shrink-0 flex items-center gap-1">
          <Filter className="w-3 h-3" /> Genre :
        </span>

        <button
          onClick={() => setSelectedGenre('all')}
          className={`px-3 py-1 rounded-full text-xs font-semibold shrink-0 transition-all ${
            selectedGenre === 'all'
              ? 'bg-slate-200 text-slate-950 font-bold'
              : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          Tous les genres
        </button>

        {allGenres.map((g) => (
          <button
            key={g}
            onClick={() => setSelectedGenre(g)}
            className={`px-3 py-1 rounded-full text-xs font-semibold shrink-0 transition-all ${
              selectedGenre === g
                ? 'bg-red-600 text-white font-bold'
                : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            {g}
          </button>
        ))}
      </div>
    </div>
  );
};
