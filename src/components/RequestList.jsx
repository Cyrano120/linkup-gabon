import { statuses } from '../data.js'

function RequestList({ providers, requests, onAcceptCandidate, onApplyToMission, onStatusChange }) {
  return (
    <div className="space-y-4">
      {requests.map((request) => (
        <article key={request.id} className="glass rounded-xl p-6 animate-lift">
          <div className="flex flex-wrap gap-2 items-center mb-4">
            <span className="inline-flex items-center h-7 px-2 bg-blue-50 text-blue-600 rounded-full text-xs font-black">{request.category}</span>
            <span className={`inline-flex items-center h-7 px-2 rounded-full text-xs font-black ${
              request.status === 'Ouverte' ? 'bg-amber-50 text-amber-700' :
              request.status === 'En discussion' ? 'bg-blue-50 text-blue-600' :
              request.status === 'Confirmée' ? 'bg-green-50 text-green-700' :
              'bg-gray-100 text-gray-600'
            }`}>{request.status}</span>
          </div>
          <h3 className="text-gray-900 font-bold text-lg">{request.title}</h3>
          <p className="text-gray-500 text-sm mt-1">{request.description || 'Aucune description ajoutée.'}</p>

          <div className="flex flex-wrap gap-2.5 mt-5">
            <span className="px-2 py-1 bg-gray-50 rounded-full text-xs font-bold text-gray-500">Client: {request.client}</span>
            <span className="px-2 py-1 bg-gray-50 rounded-full text-xs font-bold text-gray-500">Budget: {request.budget.toLocaleString('fr-FR')} FCFA</span>
            <span className="px-2 py-1 bg-gray-50 rounded-full text-xs font-bold text-gray-500">Lieu: {request.location}</span>
            <span className="px-2 py-1 bg-gray-50 rounded-full text-xs font-bold text-gray-500">Délai: {request.urgency}</span>
            <span className="px-2 py-1 bg-gray-50 rounded-full text-xs font-bold text-gray-500">Prestataire: {request.provider || 'En attente'}</span>
          </div>

          <div className="grid md:grid-cols-2 gap-5 mt-5 pt-5 border-t border-gray-100">
            <label className="grid gap-1 text-gray-700 font-bold text-sm">Statut
              <select value={request.status} onChange={(e) => onStatusChange(request.id, e.target.value)}
                className="h-10 px-3 rounded-xl border border-gray-200 bg-white outline-none focus:border-blue-500">
                {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </label>
            <div>
              <h4 className="text-gray-700 font-bold text-sm mb-3">Candidatures</h4>
              {(request.candidates || []).length === 0 ? (
                <p className="text-gray-400 text-sm">Aucune candidature.</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {(request.candidates || []).map((c) => (
                    <button key={c} type="button" onClick={() => onAcceptCandidate(request.id, c)}
                      className="h-9 px-3 bg-green-50 text-gabon-green border border-green-200 rounded-xl font-bold text-xs hover:bg-green-100">
                      Accepter {c}
                    </button>
                  ))}
                </div>
              )}
              <div className="mt-3">
                <select defaultValue="" onChange={(e) => { onApplyToMission(request.id, e.target.value); e.target.value = '' }}
                  className="h-10 px-3 rounded-xl border border-gray-200 bg-white outline-none text-sm focus:border-blue-500 w-full max-w-[200px]">
                  <option value="">Postuler comme...</option>
                  {providers.map((p) => <option key={p.id} value={p.name}>{p.name}</option>)}
                </select>
              </div>
            </div>
          </div>
        </article>
      ))}
    </div>
  )
}

export default RequestList
