import { localAreas } from '../data.js'

function Footer({ onViewChange }) {
  return (
    <footer className="w-[min(1180px,calc(100%-2rem))] mx-auto mb-4 overflow-hidden rounded-2xl border border-white/20 shadow-2xl animate-lift"
      style={{ background: 'linear-gradient(135deg, rgba(7,21,32,0.96), rgba(3,57,42,0.94))' }}>
      <div className="h-1.5 bg-gradient-to-r from-gabon-green via-gabon-yellow to-gabon-blue" />

      <div className="grid md:grid-cols-[1.25fr_repeat(3,1fr)] gap-6 md:gap-8 p-8 md:p-10">
        <div className="flex gap-4 items-start">
          <span className="relative grid place-items-center w-11 h-11 gradient-gabon text-white rounded-2xl shrink-0 shadow-lg">
            <span className="absolute w-6 h-6 bg-white/90 rounded-full" style={{ borderRadius: '50% 50% 50% 0', transform: 'rotate(-45deg)' }} />
            <span className="relative z-1 text-green-900 font-black text-sm">LU</span>
          </span>
          <div>
            <h2 className="text-white font-black text-xl">LinkUp Gabon</h2>
            <p className="text-white/70 mt-2 leading-relaxed text-sm">
              La marketplace de proximité pour trouver rapidement un prestataire fiable autour de Libreville, Akanda, Owendo et Port-Gentil.
            </p>
          </div>
        </div>

        <div className="grid gap-2 content-start">
          <h3 className="text-gabon-yellow font-bold text-sm">Navigation</h3>
          {['home', 'market', 'request', 'become'].map((v) => (
            <button key={v} onClick={() => onViewChange(v)}
              className="w-fit text-white/70 bg-transparent border-0 text-left text-sm hover:text-gabon-yellow transition-colors">
              {v === 'home' ? 'Accueil' : v === 'market' ? 'Services' : v === 'request' ? 'Publier une mission' : 'Devenir prestataire'}
            </button>
          ))}
        </div>

        <div className="grid gap-2 content-start">
          <h3 className="text-gabon-yellow font-bold text-sm">Services populaires</h3>
          {['Dépannage informatique', 'Cours particuliers', 'Livraison rapide', 'Design, flyers et reels'].map((s) => (
            <span key={s} className="text-white/70 text-sm">{s}</span>
          ))}
        </div>

        <div className="grid gap-2 content-start">
          <h3 className="text-gabon-yellow font-bold text-sm">Contact</h3>
          {['WhatsApp: +241 77 00 00 00', 'Email: contact@linkup.ga', 'Paiement: Airtel Money, Moov Money, espèce'].map((c) => (
            <span key={c} className="text-white/70 text-sm">{c}</span>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between gap-4 mx-8 md:mx-10 mb-6 p-5 bg-white/10 border border-white/20 rounded-xl">
        <div>
          <h3 className="text-white font-bold">Prototype pensé pour le terrain</h3>
          <p className="text-white/70 text-sm mt-1">LinkUp gère les demandes, candidatures, messages et profils prestataires.</p>
        </div>
        <button onClick={() => onViewChange('request')} className="h-11 px-4 bg-gabon-yellow text-green-900 font-black rounded-xl whitespace-nowrap">
          Publier une mission
        </button>
      </div>

      <div className="flex flex-wrap gap-3 px-8 md:px-10 pb-6">
        {localAreas.map((a) => (
          <span key={a} className="px-3 py-2 bg-gabon-yellow text-green-900 rounded-full font-bold text-sm">{a}</span>
        ))}
      </div>

      <div className="flex justify-between gap-4 px-8 md:px-10 py-5 bg-black/20 text-white/70 text-sm">
        <span>LinkUp Gabon - Projet React</span>
        <span>Confidentialité - Conditions - Aide</span>
      </div>
    </footer>
  )
}

export default Footer
