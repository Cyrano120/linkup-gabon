import { useState } from 'react'
import { categories } from '../data.js'

const emptyForm = {
  client: '', title: '', category: 'Informatique', budget: '', location: '', urgency: "Aujourd'hui", description: '',
}

function RequestForm({ onAddRequest }) {
  const [formData, setFormData] = useState(emptyForm)
  const [error, setError] = useState('')

  function handleChange(e) { setFormData((d) => ({ ...d, [e.target.name]: e.target.value })) }

  function handleSubmit(e) {
    e.preventDefault()
    if (!formData.client || !formData.title || !formData.budget || !formData.location) {
      setError('Remplis le nom, le titre, le budget et le lieu.'); return
    }
    onAddRequest({ ...formData, budget: Number(formData.budget), candidates: [] })
    setFormData(emptyForm); setError('')
  }

  return (
    <form className="glass rounded-xl p-6 md:p-7 space-y-5 animate-lift" onSubmit={handleSubmit}>
      <div>
        <p className="text-gabon-yellow text-xs font-black tracking-widest uppercase">Nouvelle demande</p>
        <h2 className="text-gray-900 font-black text-xl">Publier une mission</h2>
      </div>

      {error && <p className="text-red-700 bg-red-50 p-3 rounded-xl text-sm">{error}</p>}

      <div className="grid md:grid-cols-2 gap-5">
        <label className="grid gap-1.5 text-gray-700 font-bold text-sm">Nom du client
          <input name="client" value={formData.client} onChange={handleChange} placeholder="Ex: Ariane"
            className="h-11 px-4 rounded-xl border border-gray-200 bg-white outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20" />
        </label>
        <label className="grid gap-1.5 text-gray-700 font-bold text-sm">Titre
          <input name="title" value={formData.title} onChange={handleChange} placeholder="Ex: Créer une affiche"
            className="h-11 px-4 rounded-xl border border-gray-200 bg-white outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20" />
        </label>
        <label className="grid gap-1.5 text-gray-700 font-bold text-sm">Catégorie
          <select name="category" value={formData.category} onChange={handleChange}
            className="h-11 px-4 rounded-xl border border-gray-200 bg-white outline-none focus:border-blue-500">
            {categories.filter((c) => c !== 'Tous').map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </label>
        <label className="grid gap-1.5 text-gray-700 font-bold text-sm">Budget FCFA
          <input type="number" min="1000" name="budget" value={formData.budget} onChange={handleChange} placeholder="10000"
            className="h-11 px-4 rounded-xl border border-gray-200 bg-white outline-none focus:border-blue-500" />
        </label>
        <label className="grid gap-1.5 text-gray-700 font-bold text-sm">Lieu
          <input name="location" value={formData.location} onChange={handleChange} placeholder="Campus, quartier..."
            className="h-11 px-4 rounded-xl border border-gray-200 bg-white outline-none focus:border-blue-500" />
        </label>
        <label className="grid gap-1.5 text-gray-700 font-bold text-sm">Délai
          <select name="urgency" value={formData.urgency} onChange={handleChange}
            className="h-11 px-4 rounded-xl border border-gray-200 bg-white outline-none focus:border-blue-500">
            <option>Aujourd'hui</option><option>Demain</option><option>Cette semaine</option><option>Flexible</option>
          </select>
        </label>
      </div>

      <label className="grid gap-1.5 text-gray-700 font-bold text-sm">Description
        <textarea name="description" value={formData.description} onChange={handleChange}
          placeholder="Explique rapidement le besoin, le contexte et le résultat attendu." rows="5"
          className="px-4 py-3 rounded-xl border border-gray-200 bg-white outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 resize-y" />
      </label>

      <button type="submit" className="w-full h-12 bg-gradient-to-r from-gabon-green to-blue-500 text-white font-black rounded-xl shadow-lg hover:-translate-y-0.5 transition-all">
        Publier la mission
      </button>
    </form>
  )
}

export default RequestForm
