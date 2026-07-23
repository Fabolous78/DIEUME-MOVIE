import React from 'react';
import { Palette, Check, Sparkles, X, Smartphone, Globe, ShieldCheck } from 'lucide-react';
import { ThemeType } from '../types';

interface ThemeSwitcherProps {
  isOpen: boolean;
  onClose: () => void;
  currentTheme: ThemeType;
  onSelectTheme: (theme: ThemeType) => void;
}

export const THEME_CONFIGS: Record<ThemeType, {
  id: ThemeType;
  name: string;
  badge: string;
  description: string;
  bgGradient: string;
  cardPreviewBg: string;
  accentText: string;
  accentBg: string;
  ringColor: string;
}> = {
  classic_red: {
    id: 'classic_red',
    name: 'Rouge Cinéma Netflix',
    badge: 'Classique Red',
    description: 'Style Cinéma emblématique avec contrastes Rouge Rouge & Noir Mat.',
    bgGradient: 'from-red-900 via-slate-950 to-slate-950',
    cardPreviewBg: 'bg-slate-950 border-red-600/50',
    accentText: 'text-red-500',
    accentBg: 'bg-red-600',
    ringColor: 'ring-red-500',
  },
  gold_luxury: {
    id: 'gold_luxury',
    name: 'Or & Noir Prestige',
    badge: 'Luxe VIP',
    description: 'Design haut de gamme avec accents Or Ambré et finitions brillantes.',
    bgGradient: 'from-amber-950 via-slate-950 to-slate-950',
    cardPreviewBg: 'bg-stone-950 border-amber-500/50',
    accentText: 'text-amber-400',
    accentBg: 'bg-amber-500 text-slate-950 font-black',
    ringColor: 'ring-amber-400',
  },
  emerald_congo: {
    id: 'emerald_congo',
    name: 'Émeraude Bukavu VIP',
    badge: 'RDC Congo',
    description: 'Thème exclusif aux couleurs Émeraude & Or en hommage au Kivu.',
    bgGradient: 'from-emerald-950 via-slate-950 to-slate-950',
    cardPreviewBg: 'bg-slate-950 border-emerald-500/50',
    accentText: 'text-emerald-400',
    accentBg: 'bg-emerald-600 text-white font-black',
    ringColor: 'ring-emerald-400',
  },
  cyber_neon: {
    id: 'cyber_neon',
    name: 'Cyber Neon Futuriste',
    badge: 'Cyberpunk',
    description: 'Aura futuriste avec reflets Bleu Cyan, Neon Magenta et lueurs actives.',
    bgGradient: 'from-cyan-950 via-slate-950 to-purple-950',
    cardPreviewBg: 'bg-slate-950 border-cyan-500/50',
    accentText: 'text-cyan-400',
    accentBg: 'bg-cyan-500 text-slate-950 font-black',
    ringColor: 'ring-cyan-400',
  },
  royal_purple: {
    id: 'royal_purple',
    name: 'Pourpre Velvet Sensation',
    badge: 'Série TV VIP',
    description: 'Atmosphère de luxe feutrée en Violet Royal et touche Dorée.',
    bgGradient: 'from-purple-950 via-slate-950 to-slate-950',
    cardPreviewBg: 'bg-slate-950 border-purple-500/50',
    accentText: 'text-purple-400',
    accentBg: 'bg-purple-600 text-white font-black',
    ringColor: 'ring-purple-400',
  },
};

export const ThemeSwitcherModal: React.FC<ThemeSwitcherProps> = ({
  isOpen,
  onClose,
  currentTheme,
  onSelectTheme,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-xl w-full p-6 space-y-5 shadow-2xl relative overflow-hidden">
        
        {/* Glow Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-amber-500 to-purple-600 text-white shadow-lg">
              <Palette className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-heading font-extrabold text-xl text-white flex items-center gap-2">
                <span>Choisir le Style du Site</span>
                <span className="text-[10px] uppercase font-black px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  5 Design Disponibles
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Personnalisez l'apparence visuelle de DIEUME-MOVIE en un clic !
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Theme Cards List */}
        <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
          {(Object.keys(THEME_CONFIGS) as ThemeType[]).map((themeKey) => {
            const theme = THEME_CONFIGS[themeKey];
            const isSelected = currentTheme === themeKey;

            return (
              <div
                key={themeKey}
                onClick={() => onSelectTheme(themeKey)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer relative overflow-hidden flex items-center justify-between gap-4 ${
                  isSelected
                    ? `bg-slate-950 border-amber-500/80 ring-2 ${theme.ringColor} shadow-xl`
                    : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700 hover:bg-slate-950'
                }`}
              >
                {/* Background ambient preview */}
                <div className={`absolute -right-10 -bottom-10 w-32 h-32 rounded-full blur-2xl opacity-30 bg-gradient-to-br ${theme.bgGradient}`} />

                <div className="flex items-center gap-3.5 z-10 min-w-0">
                  {/* Theme Color Circle */}
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${theme.bgGradient} border border-white/20 flex items-center justify-center shrink-0 shadow-md`}>
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>

                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-heading font-extrabold text-sm text-white">
                        {theme.name}
                      </h4>
                      <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-md ${theme.accentBg}`}>
                        {theme.badge}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 line-clamp-2">
                      {theme.description}
                    </p>
                  </div>
                </div>

                {/* Selection Checkmark */}
                <div className="shrink-0 z-10">
                  {isSelected ? (
                    <div className="w-8 h-8 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center shadow-lg font-black">
                      <Check className="w-5 h-5 stroke-[3]" />
                    </div>
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-slate-800 text-slate-500 flex items-center justify-center">
                      <Palette className="w-4 h-4" />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer info */}
        <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 text-xs text-slate-400 flex items-center gap-2 justify-between">
          <div className="flex items-center gap-2">
            <Smartphone className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Compatible avec tous les téléphones (Safari, Chrome, Opera, Firefox)</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition-all"
          >
            Appliquer
          </button>
        </div>
      </div>
    </div>
  );
};
