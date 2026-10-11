const navItems = [
  { id: 'home', label: 'Accueil' },
  { id: 'market', label: 'Services' },
  { id: 'request', label: 'Publier' },
  { id: 'missions', label: 'Missions' },
  { id: 'become', label: 'Devenir prestataire' },
  { id: 'messages', label: 'Messages' },
]

function Header({ activeView, onViewChange, user, onLogout }) {
  return (
    <header className="sticky top-0 z-20 flex items-center justify-between gap-4 px-4 md:px-10 py-3 bg-white/80 border-b border-white/30 backdrop-blur-lg">
      <button className="flex items-center gap-2 text-gray-900 bg-transparent border-0 font-black" onClick={() => onViewChange('home')}>
        <span className="relative grid place-items-center w-11 h-11 gradient-gabon text-white rounded-2xl text-xs shadow-lg">
          <span className="absolute w-6 h-6 bg-white/90 rounded-full" style={{ borderRadius: '50% 50% 50% 0', transform: 'rotate(-45deg)' }} />
          <span className="relative z-1 text-green-900 font-black text-sm">LU</span>
        </span>
        <span className="grid leading-tight text-left">
          <strong className="font-black text-sm">LinkUp</strong>
          <small className="text-gabon-green text-[0.65rem] font-black tracking-widest uppercase">Gabon</small>
        </span>
      </button>

      <nav className="flex items-center gap-1 overflow-x-auto">
        {navItems.map((item) => (
          <button
            key={item.id}
            className={`min-h-9 px-3 whitespace-nowrap rounded-lg font-bold text-sm transition-all ${
              activeView === item.id ? 'bg-green-50 text-gabon-green' : 'text-gray-500 bg-transparent'
            }`}
            onClick={() => onViewChange(item.id)}
          >
            {item.label}
          </button>
        ))}
      </nav>

      {user && (
        <div className="flex items-center gap-2">
          <span className="text-green-900 font-bold text-sm max-w-[120px] truncate">
            {user.displayName || user.email?.split('@')[0]}
          </span>
          <button onClick={onLogout} className="h-8 px-2 text-red-600 bg-red-50 border border-red-200 rounded-lg font-black text-xs">
            Quitter
          </button>
        </div>
      )}
    </header>
  )
}

export default Header
