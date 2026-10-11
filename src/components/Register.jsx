import { useState } from 'react'
import { useAuth } from '../AuthContext'

function Register({ onToggleView }) {
  const { register } = useAuth()
  const [displayName, setDisplayName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  async function handleSubmit(e) {
    e.preventDefault(); setError('')
    try { await register(email, password, displayName) }
    catch (err) { setError(err.message.replace('Firebase: ', '')) }
  }

  return (
    <div className="w-full grid place-items-center p-4">
      <form className="glass rounded-xl p-8 w-full max-w-md space-y-5 animate-lift" onSubmit={handleSubmit} autoComplete="off">
        <div>
          <p className="text-gabon-yellow text-xs font-black tracking-widest uppercase">Inscription</p>
          <h2 className="text-gray-900 font-black text-2xl">Créer un compte</h2>
        </div>

        {error && <p className="text-red-700 bg-red-50 p-3 rounded-xl text-sm">{error}</p>}

        <div className="grid gap-5">
          <label className="grid gap-1.5 text-gray-700 font-bold text-sm">Nom
            <input value={displayName} onChange={(e) => setDisplayName(e.target.value)} required
              className="h-11 px-4 rounded-xl border border-gray-200 bg-white outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20" />
          </label>
          <label className="grid gap-1.5 text-gray-700 font-bold text-sm">Email
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="off"
              className="h-11 px-4 rounded-xl border border-gray-200 bg-white outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20" />
          </label>
          <label className="grid gap-1.5 text-gray-700 font-bold text-sm">Mot de passe
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6}
              className="h-11 px-4 rounded-xl border border-gray-200 bg-white outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20" />
          </label>
        </div>

        <button type="submit" className="w-full h-12 bg-gradient-to-r from-gabon-green to-blue-500 text-white font-black rounded-xl shadow-lg hover:-translate-y-0.5 transition-all">
          Créer mon compte
        </button>

        <p className="text-center text-gray-500 text-sm">
          Déjà un compte ?{' '}
          <button type="button" onClick={onToggleView} className="text-gabon-green font-black bg-transparent border-0 cursor-pointer hover:underline">
            Se connecter
          </button>
        </p>
      </form>
    </div>
  )
}

export default Register
