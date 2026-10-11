function ProviderGrid({ providers, onBookProvider, onViewProvider }) {
  if (providers.length === 0) {
    return (
      <div className="glass rounded-xl p-8 text-center animate-lift">
        <h3 className="text-gray-900 font-bold text-lg">Aucun prestataire trouvé</h3>
        <p className="text-gray-500 mt-2">Essaie une autre catégorie ou une compétence plus générale.</p>
      </div>
    )
  }

  return (
    <div className="grid md:grid-cols-3 gap-4">
      {providers.map((provider) => (
        <article key={provider.id} className="glass rounded-xl overflow-hidden animate-lift hover:-translate-y-1 transition-all duration-200">
          <div className="relative h-40 overflow-hidden">
            <img src={provider.cover} alt={provider.role} className="w-full h-full object-cover hover:scale-105 transition-transform duration-200" />
            <span className={`absolute top-3 right-3 shadow-lg inline-flex items-center h-7 px-2 rounded-full text-xs font-black ${
              provider.available ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
            }`}>
              {provider.available ? 'Disponible' : 'Occupé'}
            </span>
          </div>

          <div className="flex gap-3 items-center px-5 mt-[-1.5rem]">
            <img className="w-12 h-12 object-cover rounded-xl border-4 border-white shadow-lg" src={provider.image} alt={provider.name} />
            <div className="pt-4">
              <h3 className="text-gray-900 font-bold">{provider.name}</h3>
              <p className="text-gray-500 text-sm">{provider.role}</p>
            </div>
          </div>

          <p className="text-gray-600 text-sm leading-relaxed px-5 mt-4 min-h-[3rem]">{provider.headline}</p>

          <div className="flex flex-wrap gap-2.5 px-5 mt-4">
            <span className="px-2 py-1 bg-gray-50 rounded-full text-xs font-bold text-gray-500">{provider.category}</span>
            <span className="px-2 py-1 bg-gray-50 rounded-full text-xs font-bold text-gray-500">{provider.location}</span>
            <span className="px-2 py-1 bg-gray-50 rounded-full text-xs font-bold text-gray-500">{provider.responseTime}</span>
          </div>

          <div className="flex flex-wrap gap-2.5 px-5 mt-4">
            {provider.skills.map((skill) => (
              <span key={skill} className="px-2 py-1 bg-gray-50 border border-gray-200 rounded-lg text-xs font-bold text-gray-500">{skill}</span>
            ))}
          </div>

          <div className="grid grid-cols-3 gap-4 px-5 py-4 mt-4 border-t border-gray-100">
            <div>
              <strong className="block text-gray-900 text-sm">{provider.price.toLocaleString('fr-FR')} FCFA</strong>
              <small className="text-gray-400 text-xs">prix de départ</small>
            </div>
            <div>
              <strong className="block text-gray-900 text-sm">{provider.rating}</strong>
              <small className="text-gray-400 text-xs">{provider.missions} missions</small>
            </div>
            <div>
              <strong className="block text-gray-900 text-sm">{provider.successRate}%</strong>
              <small className="text-gray-400 text-xs">réussite</small>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 px-5 pb-5">
            <button onClick={() => onViewProvider(provider)} className="h-11 bg-green-50 text-gabon-green border border-green-200 rounded-xl font-black text-sm hover:bg-green-100 transition-all">
              Profil
            </button>
            <button onClick={() => onBookProvider(provider)} className="card-action text-sm text-center flex items-center justify-center">
              Demander
            </button>
          </div>
        </article>
      ))}
    </div>
  )
}

export default ProviderGrid
