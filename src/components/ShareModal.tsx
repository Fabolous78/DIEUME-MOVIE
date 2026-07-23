import React, { useState } from 'react';
import { Share2, Copy, Check, Smartphone, Monitor, Globe, QrCode, ExternalLink, X, Send } from 'lucide-react';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  whatsappNumber: string;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  onClose,
  whatsappNumber,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  // Real preview deployment URL or fallback
  const siteUrl = window.location.href.split('?')[0];

  const handleCopy = () => {
    navigator.clipboard.writeText(siteUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const handleNativeShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'DIEUME-MOVIE - Films & Séries HD/4K Bukavu',
        text: 'Regardez et commandez les meilleurs films et séries HD & 4K à Bukavu/Bagira sur DIEUME-MOVIE !',
        url: siteUrl,
      }).catch(() => {});
    } else {
      handleCopy();
    }
  };

  const cleanWhatsapp = whatsappNumber.replace(/[^\d]/g, '');
  const whatsappShareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(
    `🔥 Découvrez *DIEUME-MOVIE Bukavu* ! Téléchargez et commandez vos films & séries HD/4K préférés ici : ${siteUrl}`
  )}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 space-y-5 shadow-2xl relative">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-600 text-white shadow-lg">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-heading font-extrabold text-xl text-white flex items-center gap-2">
                <span>Lien du Site & Partage</span>
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  100% Mobile & PC
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Accès garanti sur tous les smartphones, tablettes et ordinateurs.
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

        {/* Copy Link Input Box */}
        <div className="space-y-2">
          <label className="text-xs font-extrabold text-slate-300 block uppercase tracking-wider">
            Lien Officiel du Site DIEUME-MOVIE
          </label>
          <div className="flex items-center gap-2">
            <div className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-3 text-xs text-amber-300 font-mono truncate select-all">
              {siteUrl}
            </div>
            <button
              onClick={handleCopy}
              className={`px-4 py-3 rounded-xl font-extrabold text-xs flex items-center gap-1.5 shrink-0 transition-all ${
                copied
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
                  : 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-lg shadow-amber-500/20'
              }`}
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 stroke-[3]" />
                  <span>Copié !</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copier</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Share Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <a
            href={whatsappShareUrl}
            target="_blank"
            rel="noreferrer"
            className="p-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 transition-all"
          >
            <Send className="w-4 h-4" />
            <span>Partager sur WhatsApp</span>
          </a>

          <button
            onClick={handleNativeShare}
            className="p-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-extrabold text-xs flex items-center justify-center gap-2 border border-slate-700 transition-all"
          >
            <Share2 className="w-4 h-4 text-amber-400" />
            <span>Partager via Téléphone</span>
          </button>
        </div>

        {/* Cross-device Compatibility Badges */}
        <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800 space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-amber-400 border-b border-slate-800/80 pb-2">
            <span className="flex items-center gap-1.5">
              <Globe className="w-4 h-4 text-emerald-400" />
              <span>Compatibilité Navigateurs Validée :</span>
            </span>
            <span className="text-emerald-400 font-extrabold">100% Fonctionnel</span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs text-slate-300">
            <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-900 border border-slate-800/60">
              <Smartphone className="w-4 h-4 text-sky-400 shrink-0" />
              <div>
                <span className="font-bold text-white block">iPhone / iOS</span>
                <span className="text-[10px] text-slate-400">Safari, Chrome Mobile</span>
              </div>
            </div>

            <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-900 border border-slate-800/60">
              <Smartphone className="w-4 h-4 text-emerald-400 shrink-0" />
              <div>
                <span className="font-bold text-white block">Android</span>
                <span className="text-[10px] text-slate-400">Chrome, Samsung, Opera</span>
              </div>
            </div>

            <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-900 border border-slate-800/60">
              <Monitor className="w-4 h-4 text-amber-400 shrink-0" />
              <div>
                <span className="font-bold text-white block">Ordinateurs / PC</span>
                <span className="text-[10px] text-slate-400">Windows, Mac, Linux</span>
              </div>
            </div>

            <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-900 border border-slate-800/60">
              <Globe className="w-4 h-4 text-purple-400 shrink-0" />
              <div>
                <span className="font-bold text-white block">Connexion 3G / 4G</span>
                <span className="text-[10px] text-slate-400">Optimisé pour la RDC</span>
              </div>
            </div>
          </div>
        </div>

        <p className="text-[11px] text-slate-500 text-center">
          Copiez et envoyez ce lien à tous vos clients et amis à Bukavu, Bagira, Kadutu et Ibanda.
        </p>
      </div>
    </div>
  );
};
