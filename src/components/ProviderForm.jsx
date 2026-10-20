import { useState } from 'react'
import { categories } from '../data.js'

const emptyProvider = { name: '', role: '', category: 'Informatique', price: '', location: '', headline: '', skills: '' }

function ProviderForm({ onAddProvider }) {
  const [formData, setFormData] = useState(emptyProvider)
  const [error, setError] = useState('')

  function handleChange(e) { setFormData((d) => ({ ...d, [e.target.name]: e.target.value })) }

  function handleSubmit(e) {
    e.preventDefault()
    if (!formData.name || !formData.role || !formData.price || !formData.skills) {
      setError('Remplis au moins le nom, le service, le prix et les compétences.'); return
    }
    onAddProvider({ ...formData, price: Number(formData.price) })
    setFormData(emptyProvider); setError('')
  }

  return (
    <form className="glass rounded-xl p-6 md:p-7 space-y-5 animate-lift" onSubmit={handleSubmit}>
      <div>
        <p className="text-gabon-yellow text-xs font-black tracking-widest uppercase">Nouveau prestataire</p>
        <h2 className="text-gray-900 font-black text-xl">Créer un profil</h2>
      </div>

      {error && <p className="text-red-700 bg-red-50 p-3 rounded-xl text-sm">{error}</p>}

      <div className="grid md:grid-cols-2 gap-5">
        <label className="grid gap-1.5 text-gray-700 font-bold text-sm">Nom
          <input name="name" value={formData.name} onChange={handleChange}
            className="h-11 px-4 rounded-xl border border-gray-200 bg-white outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20" />
        </label>
        <label className="grid gap-1.5 text-gray-700 font-bold text-sm">Service proposé
          <input name="role" value={formData.role} onChange={handleChange} placeholder="Ex: Photographe événementiel"
            className="h-11 px-4 rounded-xl border border-gray-200 bg-white outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20" />
        </label>
        <label className="grid gap-1.5 text-gray-700 font-bold text-sm">Catégorie
          <select name="category" value={formData.category} onChange={handleChange}
            className="h-11 px-4 rounded-xl border border-gray-200 bg-white outline-none focus:border-blue-500">
            {categories.filter((c) => c !== 'Tous').map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </label>
        <label className="grid gap-1.5 text-gray-700 font-bold text-sm">Prix de départ (FCFA)
          <input type="number" min="1000" name="price" value={formData.price} onChange={handleChange}
            className="h-11 px-4 rounded-xl border border-gray-200 bg-white outline-none focus:border-blue-500" />
        </label>
      </div>

      <label className="grid gap-1.5 text-gray-700 font-bold text-sm">Lieu
        <input name="location" value={formData.location} onChange={handleChange}
          className="h-11 px-4 rounded-xl border border-gray-200 bg-white outline-none focus:border-blue-500" />
      </label>
      <label className="grid gap-1.5 text-gray-700 font-bold text-sm">Phrase de présentation
        <textarea name="headline" value={formData.headline} onChange={handleChange} rows="3"
          className="px-4 py-3 rounded-xl border border-gray-200 bg-white outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 resize-y" />
      </label>
      <label className="grid gap-1.5 text-gray-700 font-bold text-sm">Compétences (séparées par des virgules)
        <input name="skills" value={formData.skills} onChange={handleChange} placeholder="Ex: Photo, Retouche, Montage"
          className="h-11 px-4 rounded-xl border border-gray-200 bg-white outline-none focus:border-blue-500" />
      </label>

      <button type="submit" className="w-full h-12 bg-gradient-to-r from-gabon-green-action to-blue-500 text-white font-black rounded-xl shadow-lg hover:-translate-y-0.5 transition-all">
        Ajouter le profil
      </button>
    </form>
  )
}

export default ProviderForm
