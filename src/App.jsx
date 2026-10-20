import { useEffect, useMemo, useState } from 'react'
import Header from './components/Header.jsx'
import ProviderGrid from './components/ProviderGrid.jsx'
import RequestForm from './components/RequestForm.jsx'
import RequestList from './components/RequestList.jsx'
import ProviderForm from './components/ProviderForm.jsx'
import Footer from './components/Footer.jsx'
import Login from './components/Login.jsx'
import Register from './components/Register.jsx'
import {
  categories, initialProviders, initialRequests,
  howItWorksSteps, localAreas, pageStories, serviceHighlights, testimonials,
} from './data.js'
import { useAuth } from './AuthContext'
import {
  subscribeToCollection, subscribeToMessages, addDocument, updateDocument, seedCollection,
} from './firestore.js'
import { db } from './firebase.js'
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore'
import { sendNotification } from './email.js'

function App() {
  const { user, loading: authLoading, logout } = useAuth()
  const [activeView, setActiveView] = useState('home')
  const [selectedCategory, setSelectedCategory] = useState('Tous')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedArea, setSelectedArea] = useState('Tous')
  const [maxBudget, setMaxBudget] = useState('')
  const [availableOnly, setAvailableOnly] = useState(false)
  const [selectedProvider, setSelectedProvider] = useState(null)
  const [profileProvider, setProfileProvider] = useState(null)
  const [toast, setToast] = useState('')
  const [providers, setProviders] = useState([])
  const [requests, setRequests] = useState([])
  const [messages, setMessages] = useState([])
  const [showAuth, setShowAuth] = useState('login')
  const [authKey, setAuthKey] = useState(0)
  const [booking, setBooking] = useState({
    client: '', title: '', description: '', budget: '', location: '', urgency: "Aujourd'hui",
  })
  const [newMessage, setNewMessage] = useState({
    to: '', toUid: '', subject: '', text: '',
  })

  useEffect(() => {
    if (!toast) return
    const timer = setTimeout(() => setToast(''), 2600)
    return () => clearTimeout(timer)
  }, [toast])

  useEffect(() => {
    if (!user) return
    const unsubProviders = subscribeToCollection('providers', (data) => {
      if (data.length === 0) { seedInitialData(); return }
      setProviders(data)
    })
    return () => unsubProviders()
  }, [user])

  useEffect(() => {
    if (!user) return
    const unsubRequests = subscribeToCollection('requests', (data) => {
      setRequests(data.map((r) => ({ ...r, candidates: r.candidates || [], provider: r.provider || 'En attente' })))
    })
    return () => unsubRequests()
  }, [user])

  useEffect(() => {
    if (!user) return
    // Le flux ne contient que les conversations de l'utilisateur connecté :
    // le filtrage est fait par la requête (`participants array-contains`),
    // donc aussi par les règles de sécurité Firestore.
    const unsubMessages = subscribeToMessages(user.uid, (data) => setMessages(data))
    return () => unsubMessages()
  }, [user])

  async function seedInitialData() {
    // Une mission amorcée doit porter un client identifiable.
    await Promise.all([
      seedCollection('providers', initialProviders),
      seedCollection('requests', initialRequests.map((r) => ({
        ...r, candidates: r.candidates || [], provider: r.provider || 'En attente',
        clientUid: user?.uid, candidateUids: [],
      }))),
    ])
    // Les messages ne sont plus amorcés : une conversation privée exige deux
    // comptes réels. Inventer des participants produirait des documents
    // illisibles, refusés par les règles de sécurité.
  }

  const filteredProviders = useMemo(() => {
    const search = searchTerm.trim().toLowerCase()
    return providers.filter((p) => {
      const matchCat = selectedCategory === 'Tous' || p.category === selectedCategory
      const matchArea = selectedArea === 'Tous' || p.location === selectedArea
      const matchBudget = !maxBudget || p.price <= Number(maxBudget)
      const matchAvail = !availableOnly || p.available
      const matchSearch = p.name.toLowerCase().includes(search) || p.role.toLowerCase().includes(search) ||
        (p.skills || []).join(' ').toLowerCase().includes(search) || p.location.toLowerCase().includes(search)
      return matchCat && matchArea && matchBudget && matchAvail && matchSearch
    })
  }, [availableOnly, maxBudget, providers, searchTerm, selectedArea, selectedCategory])

  const verifiedProviders = providers.filter((p) => p.available)

  function notify(msg) { setToast(msg) }

  async function addRequest(newRequest) {
    await addDocument('requests', {
      ...newRequest, id: Date.now(), status: 'Ouverte', provider: 'En attente',
      candidates: [], candidateUids: [], clientUid: user?.uid,
    })
    setActiveView('missions')
    notify('Mission publiée avec succès.')
    if (user) {
      sendNotification({ to_name: user.displayName || user.email, from_name: 'LinkUp Gabon',
        subject: 'Mission publiée', message: `Votre mission "${newRequest.title}" a été publiée.` })
        .then(() => notify('Email de confirmation envoyé.'))
        .catch((err) => console.error('EmailJS error:', err))
    }
  }

  async function addProvider(newProvider) {
    await addDocument('providers', {
      ...newProvider, id: Date.now(), rating: 4.5, missions: 0, available: true,
      responseTime: '30 min', successRate: 90,
      skills: newProvider.skills.split(',').map((s) => s.trim()).filter(Boolean),
    })
    setActiveView('market')
    notify('Profil prestataire ajouté.')
  }

  async function updateRequestStatus(requestId, nextStatus) {
    const req = requests.find((r) => r.id === requestId)
    if (req) await updateDocument('requests', req._firestoreId, { status: nextStatus })
    notify('Statut mis à jour.')
  }

  async function applyToMission(requestId, providerName) {
    if (!providerName) { notify('Choisis un prestataire.'); return }
    const req = requests.find((r) => r.id === requestId)
    if (!req) return
    if (req.candidates.includes(providerName)) { notify(`${providerName} a déjà postulé.`); return }

    // `candidates` et `candidateUids` restent alignés : l'index du nom donne
    // l'index de l'UID, ce qui permet de retrouver le candidat retenu.
    const candidateUids = [...(req.candidateUids || [])]
    const candidateUid = providers.find((p) => p.name === providerName)?.createdBy
    if (candidateUid && !candidateUids.includes(candidateUid)) candidateUids.push(candidateUid)

    await updateDocument('requests', req._firestoreId, {
      candidates: [...req.candidates, providerName],
      candidateUids,
      status: req.status === 'Ouverte' ? 'En discussion' : req.status,
    })
    notify(`${providerName} a postulé.`)
  }

  async function acceptCandidate(requestId, providerName) {
    const req = requests.find((r) => r.id === requestId)
    if (!req) return

    const index = req.candidates.indexOf(providerName)
    const providerUid = req.candidateUids?.[index]
      || providers.find((p) => p.name === providerName)?.createdBy

    await updateDocument('requests', req._firestoreId, {
      provider: providerName,
      status: 'Confirmée',
      ...(providerUid ? { providerUid } : {}),
    })

    if (user && providerUid && providerUid !== user.uid) {
      await addDocument('messages', {
        id: Date.now(), from: 'LinkUp', to: providerName, subject: 'Mission confirmée',
        text: `${providerName} a été retenu.`,
        fromUid: user.uid, toUid: providerUid, participants: [user.uid, providerUid],
      })
    }
    notify('Candidature acceptée.')
  }

  function openBooking(provider) {
    setSelectedProvider(provider)
    setBooking({ client: '', title: `Demande pour ${provider.role}`, description: '', budget: provider.price, location: provider.location, urgency: "Aujourd'hui" })
  }

  function handleBookingChange(e) { setBooking((b) => ({ ...b, [e.target.name]: e.target.value })) }

  async function submitBooking(e) {
    e.preventDefault()
    if (!booking.client || !booking.title || !booking.description || !booking.budget) { notify('Complète les champs obligatoires.'); return }
    const providerUid = selectedProvider.createdBy
    await addDocument('requests', {
      ...booking, id: Date.now(), category: selectedProvider.category, budget: Number(booking.budget),
      provider: selectedProvider.name, candidates: [selectedProvider.name],
      candidateUids: providerUid ? [providerUid] : [],
      status: 'En discussion', clientUid: user?.uid,
      ...(providerUid ? { providerUid } : {}),
    })
    setSelectedProvider(null)

    // Conversation privée : seulement si le prestataire a un compte réel et
    // si ce n'est pas l'utilisateur lui-même.
    if (user && providerUid && providerUid !== user.uid) {
      await addDocument('messages', {
        id: Date.now() + 1, from: booking.client, to: selectedProvider.name,
        subject: booking.title, text: `Nouvelle demande pour ${selectedProvider.name}.`,
        fromUid: user.uid, toUid: providerUid, participants: [user.uid, providerUid],
      })
    }
    notify('Demande envoyée.')
  }

  function handleMessageChange(e) { setNewMessage((m) => ({ ...m, [e.target.name]: e.target.value })) }

  /**
   * Destinataire réel : on choisit un prestataire, pas un nom libre.
   * Un message privé exige un UID de destinataire ; laisser saisir un nom
   * produirait des messages que personne ne pourrait lire.
   */
  function handleRecipientChange(e) {
    const provider = providers.find((p) => String(p.id) === e.target.value)
    setNewMessage((m) => ({
      ...m,
      to: provider?.name || '',
      toUid: provider?.createdBy || '',
    }))
  }

  async function sendMessage(e) {
    e.preventDefault()
    const from = user?.displayName || user?.email?.split('@')[0] || 'Client'
    if (!newMessage.toUid || !newMessage.subject || !newMessage.text) {
      notify('Choisis un destinataire, puis renseigne l’objet et le message.')
      return
    }
    if (!user) { notify('Connecte-toi pour envoyer un message.'); return }
    if (newMessage.toUid === user.uid) { notify('Tu ne peux pas t’écrire à toi-même.'); return }

    await addDocument('messages', {
      id: Date.now(),
      from,
      to: newMessage.to,
      subject: newMessage.subject,
      text: newMessage.text,
      fromUid: user.uid,
      toUid: newMessage.toUid,
      participants: [user.uid, newMessage.toUid],
    })
    setNewMessage({ to: '', toUid: '', subject: '', text: '' })
    notify('Message envoyé.')
  }

  async function resetDemoData() {
    for (const coll of ['providers', 'requests', 'messages']) {
      const snap = await getDocs(collection(db, coll))
      await Promise.all(snap.docs.map((d) => deleteDoc(doc(db, coll, d.id))))
    }
    await seedInitialData()
    setSelectedCategory('Tous'); setSelectedArea('Tous'); setSearchTerm(''); setMaxBudget(''); setAvailableOnly(false)
    notify('Données de démo restaurées.')
  }

  if (authLoading) {
    return (
      <div className="min-h-screen grid place-items-center">
        <p className="text-white text-lg">Chargement...</p>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen grid place-items-center p-4">
        {showAuth === 'login' ? (
          <Login key={`login-${authKey}`} onToggleView={() => setShowAuth('register')} />
        ) : (
          <Register key={`register-${authKey}`} onToggleView={() => setShowAuth('login')} />
        )}
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <Header activeView={activeView} onViewChange={setActiveView} user={user} onLogout={() => { logout(); setAuthKey((k) => k + 1) }} />

      {toast && (
        <div className="fixed right-4 bottom-4 z-50 max-w-xs px-4 py-3 bg-gray-900 text-white rounded-xl shadow-2xl animate-lift">
          {toast}
        </div>
      )}

      <main className="w-full max-w-6xl mx-auto px-5 md:px-8 lg:px-10">
        {activeView === 'home' && (
          <section className="py-12 md:py-16 space-y-6 md:space-y-10">
            <div className="relative min-h-[620px] overflow-hidden rounded-2xl border border-white/20 shadow-2xl animate-lift">
              <img
                src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1600&q=85"
                alt="Professionnels africains"
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="relative z-10 gradient-hero min-h-[620px] flex items-center px-6 md:px-12">
                <div className="max-w-2xl">
                  <p className="text-gabon-yellow text-xs font-black tracking-widest uppercase mb-3">Services locaux à la demande</p>
                  <h1 className="text-white font-black leading-[0.94] text-5xl md:text-7xl lg:text-8xl">Le bon talent, au bon moment, près de chez toi.</h1>
                  <p className="text-white/80 text-lg mt-5 max-w-xl leading-relaxed">
                    De Nzeng-Ayong à Akanda, LinkUp connecte clients, étudiants et freelances pour des missions rapides payables en FCFA, Airtel Money ou Moov Money.
                  </p>
                  <div className="flex flex-wrap gap-4 mt-10">
                    <button onClick={() => setActiveView('market')} className="h-12 px-5 bg-gradient-to-r from-gabon-green-action to-blue-500 text-white font-black rounded-xl shadow-lg hover:-translate-y-0.5 hover:shadow-2xl transition-all">
                      Trouver un prestataire
                    </button>
                    <button onClick={() => setActiveView('request')} className="h-12 px-5 bg-white/20 text-white font-black rounded-xl border border-white/30 hover:-translate-y-0.5 transition-all">
                      Publier une mission
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-3 mt-6">
                    {['Libreville', 'Akanda', 'Owendo', 'Port-Gentil'].map((a) => (
                      <span key={a} className="px-3 py-2 text-white bg-white/20 rounded-full border border-white/25 text-sm font-bold animate-float">{a}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <section className="relative overflow-hidden rounded-2xl p-8 md:p-10 text-white border border-white/20 shadow-xl animate-lift"
              style={{ background: 'linear-gradient(135deg, rgba(0,158,96,0.92), rgba(58,117,196,0.88))' }}>
              <div className="grid md:grid-cols-2 gap-4 items-center">
                <div>
                  <p className="text-gabon-yellow text-xs font-black tracking-widest uppercase mb-3">Ancrée au Gabon</p>
                  <h2 className="font-black text-3xl md:text-5xl leading-tight">Une application pensée pour les vrais besoins du quotidien.</h2>
                  <p className="text-white/80 mt-4 leading-relaxed">LinkUp parle le langage du terrain : quartiers connus, budgets en FCFA, contact rapide, paiement mobile et missions courtes.</p>
                </div>
                <div className="flex flex-wrap gap-2 justify-end">
                  {localAreas.map((a) => (
                    <span key={a} className="px-3 py-2 bg-white/85 text-green-900 rounded-full font-bold text-sm">{a}</span>
                  ))}
                </div>
              </div>
            </section>

            <section className="space-y-6 md:space-y-8">
              <div className="max-w-2xl">
                <p className="text-gabon-yellow text-xs font-black tracking-widest uppercase">Comment ça marche</p>
                <h2 className="text-white font-black text-3xl md:text-4xl">Une logique simple, proche des habitudes locales.</h2>
              </div>
              <div className="grid md:grid-cols-3 gap-5 md:gap-6">
                {howItWorksSteps.map((step, i) => (
                  <article key={step.title} className="relative glass rounded-xl p-5 overflow-hidden animate-lift">
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-gabon-green via-gabon-yellow to-gabon-blue" />
                    <span className="inline-grid place-items-center w-10 h-10 bg-green-900 text-white rounded-full font-black">{String(i + 1).padStart(2, '0')}</span>
                    <h3 className="text-gray-900 font-bold text-lg mt-4">{step.title}</h3>
                    <p className="text-gray-500 mt-2 leading-relaxed">{step.text}</p>
                  </article>
                ))}
              </div>
            </section>

              <div className="grid md:grid-cols-[0.8fr_1.2fr] gap-5 md:gap-6">
              <div className="glass rounded-xl overflow-hidden flex flex-col md:flex-row animate-lift">
                <img src={verifiedProviders[0]?.image} alt={verifiedProviders[0]?.name} className="w-full md:w-44 h-56 object-cover" />
                <div className="p-5 flex flex-col gap-4 justify-center">
                  <span className="badge-success w-fit">Disponible maintenant</span>
                  <h2 className="text-gray-900 font-black text-xl">{verifiedProviders[0]?.name}</h2>
                  <p className="text-gray-500 text-sm">{verifiedProviders[0]?.headline}</p>
                  <button onClick={() => openBooking(verifiedProviders[0])} className="card-action self-start">Envoyer une demande</button>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-5 md:gap-6">
                {serviceHighlights.map((s) => (
                  <article key={s.title} className="glass rounded-xl overflow-hidden animate-lift">
                    <img src={s.image} alt={s.title} className="w-full h-32 object-cover" />
                    <div className="p-5">
                      <h3 className="text-gray-900 font-bold">{s.title}</h3>
                      <p className="text-gray-500 text-sm mt-2 leading-relaxed">{s.text}</p>
                    </div>
                  </article>
                ))}
              </div>
            </div>

            <section className="grid md:grid-cols-[1.35fr_0.65fr_0.65fr] gap-5 md:gap-6">
              <article className="glass rounded-xl overflow-hidden flex flex-col md:flex-row animate-lift">
                <img src="https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1400&q=85" alt="Collaboration" className="w-full md:w-1/2 h-64 object-cover" />
                <div className="p-6 md:p-7 flex flex-col justify-center">
                  <p className="text-gabon-yellow text-xs font-black tracking-widest uppercase mb-2">Pourquoi LinkUp</p>
                  <h2 className="text-gray-900 font-black text-2xl md:text-4xl leading-tight">Parce que beaucoup de talents existent déjà autour de nous.</h2>
                  <p className="text-gray-500 mt-3 leading-relaxed">Le problème n'est pas toujours le manque de compétence. LinkUp sert de pont.</p>
                </div>
              </article>
              <article className="rounded-xl p-6 md:p-8 text-white flex flex-col justify-center gap-4 animate-lift" style={{ background: 'linear-gradient(135deg, #03392a, #0f7a45)' }}>
                <strong className="font-black text-5xl md:text-7xl leading-none">+180</strong>
                <span className="font-bold leading-relaxed">missions possibles chaque mois entre étudiants, freelances et petits commerces</span>
              </article>
              <article className="rounded-xl p-6 md:p-8 text-green-900 flex flex-col justify-center gap-4 animate-lift" style={{ background: 'linear-gradient(135deg, #fcd116, #ffef8a)' }}>
                <strong className="font-black text-5xl md:text-7xl leading-none">FCFA</strong>
                <span className="font-bold leading-relaxed">budgets clairs, négociés avant la mission et adaptés au contexte local</span>
              </article>
            </section>

            <section className="space-y-6 md:space-y-8">
              <div className="max-w-2xl">
                <p className="text-gabon-yellow text-xs font-black tracking-widest uppercase">Ils pourraient l'utiliser</p>
                <h2 className="text-white font-black text-3xl md:text-4xl">Des cas proches de la vraie vie.</h2>
              </div>
              <div className="grid md:grid-cols-3 gap-5 md:gap-6">
                {testimonials.map((t) => (
                  <article key={t.name} className="glass rounded-xl p-5 animate-lift">
                    <p className="text-gray-600 leading-relaxed">"{t.text}"</p>
                    <strong className="block mt-4 text-gabon-green">{t.name}</strong>
                  </article>
                ))}
              </div>
            </section>
          </section>
        )}

        {activeView === 'market' && (
          <section className="py-12 md:py-16 space-y-5 md:space-y-6">
            <div className="page-hero-card">
              <div>
                <p className="text-gabon-yellow text-xs font-black tracking-widest uppercase">Services disponibles</p>
                <h1 className="text-white font-black text-3xl md:text-5xl leading-tight">{pageStories.market.title}</h1>
                <p className="text-white/80 mt-3 leading-relaxed">{pageStories.market.text}</p>
              </div>
            </div>
            <div className="flex flex-wrap justify-between items-end gap-5">
              <div>
                <p className="text-gabon-yellow text-xs font-black tracking-widest uppercase">Marketplace</p>
                <h2 className="text-white font-black text-2xl md:text-3xl">Choisis un prestataire</h2>
              </div>
              <button onClick={resetDemoData} className="h-10 px-4 bg-gabon-yellow text-green-900 font-black rounded-lg hover:opacity-90 transition-all">Réinitialiser</button>
            </div>
            <div className="flex flex-wrap gap-4">
              <input type="search" placeholder="Rechercher..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                className="h-12 px-4 rounded-xl border border-gray-200 bg-white text-gray-900 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 flex-1 min-w-[200px]" />
              <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}
                className="h-12 px-4 rounded-xl border border-gray-200 bg-white text-gray-900 outline-none">
                {categories.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
              <select value={selectedArea} onChange={(e) => setSelectedArea(e.target.value)}
                className="h-12 px-4 rounded-xl border border-gray-200 bg-white text-gray-900 outline-none">
                <option value="Tous">Tous les quartiers</option>
                {localAreas.map((a) => <option key={a} value={a}>{a}</option>)}
              </select>
              <input type="number" min="1000" placeholder="Budget max" value={maxBudget} onChange={(e) => setMaxBudget(e.target.value)}
                className="h-12 px-4 rounded-xl border border-gray-200 bg-white text-gray-900 outline-none w-36" />
              <label className="flex items-center gap-2 h-12 px-4 rounded-xl bg-white/15 border border-white/25 text-white font-bold">
                <input type="checkbox" checked={availableOnly} onChange={(e) => setAvailableOnly(e.target.checked)} className="w-auto" />
                Disponible
              </label>
            </div>
            <ProviderGrid providers={filteredProviders} onBookProvider={openBooking} onViewProvider={setProfileProvider} />
          </section>
        )}

        {activeView === 'request' && (
          <section className="py-12 md:py-16 grid md:grid-cols-[1.15fr_0.85fr] gap-5 md:gap-6 items-start">
            <div className="space-y-4 md:space-y-5">
              <div className="page-hero-card compact-card">
                <div>
                  <p className="text-gabon-yellow text-xs font-black tracking-widest uppercase">Côté client</p>
                  <h1 className="text-white font-black text-3xl md:text-4xl leading-tight">{pageStories.request.title}</h1>
                  <p className="text-white/80 mt-3 leading-relaxed">{pageStories.request.text}</p>
                </div>
              </div>
              <RequestForm onAddRequest={addRequest} />
            </div>
            <aside className="glass rounded-xl p-6 md:p-7 space-y-5 animate-lift">
              <img src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=800&q=80" alt="Marché" className="w-full h-48 object-cover rounded-lg" />
              <p className="text-gabon-yellow text-xs font-black tracking-widest uppercase">Conseil terrain</p>
              <h2 className="text-gray-900 font-black text-xl">Plus la demande est précise, plus la réponse arrive vite.</h2>
              <p className="text-gray-500 leading-relaxed text-sm">Ajoute le quartier exact, un budget réaliste et ce que tu attends à la fin de la mission.</p>
            </aside>
          </section>
        )}

        {activeView === 'missions' && (
          <section className="py-12 md:py-16 space-y-5 md:space-y-6">
            <div className="page-hero-card">
              <div>
                <p className="text-gabon-yellow text-xs font-black tracking-widest uppercase">Suivi des missions</p>
                <h1 className="text-white font-black text-3xl md:text-5xl leading-tight">{pageStories.missions.title}</h1>
                <p className="text-white/80 mt-3 leading-relaxed">{pageStories.missions.text}</p>
              </div>
            </div>
            <div>
              <p className="text-gabon-yellow text-xs font-black tracking-widest uppercase">Missions</p>
              <h2 className="text-white font-black text-2xl md:text-3xl">Demandes, candidatures et statuts</h2>
            </div>
            <RequestList providers={providers} requests={requests} onAcceptCandidate={acceptCandidate} onApplyToMission={applyToMission} onStatusChange={updateRequestStatus} />
          </section>
        )}

        {activeView === 'become' && (
          <section className="py-12 md:py-16 grid md:grid-cols-[1.15fr_0.85fr] gap-5 md:gap-6 items-start">
            <div className="space-y-5 md:space-y-6">
              <div className="page-hero-card compact-card">
                <div>
                  <p className="text-gabon-yellow text-xs font-black tracking-widest uppercase">Côté prestataire</p>
                  <h1 className="text-white font-black text-3xl md:text-4xl leading-tight">{pageStories.become.title}</h1>
                  <p className="text-white/80 mt-3 leading-relaxed">{pageStories.become.text}</p>
                </div>
              </div>
              <ProviderForm onAddProvider={addProvider} />
            </div>
            <aside className="glass rounded-xl p-6 md:p-7 space-y-4 animate-lift">
              <p className="text-gabon-yellow text-xs font-black tracking-widest uppercase">Profil solide</p>
              <h2 className="text-gray-900 font-black text-xl">Ce qui inspire confiance</h2>
              <ul className="space-y-4 text-gray-600 leading-relaxed pl-5">
                <li>Un service clair et facile à comprendre.</li>
                <li>Un quartier ou une zone d'intervention précise.</li>
                <li>Un prix de départ honnête en FCFA.</li>
                <li>Des compétences séparées par des virgules.</li>
              </ul>
            </aside>
          </section>
        )}

        {activeView === 'messages' && (
          <section className="py-12 md:py-16 space-y-5 md:space-y-6">
            <div className="page-hero-card">
              <div>
                <p className="text-gabon-yellow text-xs font-black tracking-widest uppercase">Messagerie</p>
                <h1 className="text-white font-black text-3xl md:text-5xl leading-tight">{pageStories.messages.title}</h1>
                <p className="text-white/80 mt-3 leading-relaxed">{pageStories.messages.text}</p>
              </div>
            </div>
            <div>
              <p className="text-gabon-yellow text-xs font-black tracking-widest uppercase">Messages</p>
              <h2 className="text-white font-black text-2xl md:text-3xl">Conversations liées aux missions</h2>
            </div>
            <form className="glass rounded-xl p-6 md:p-7 space-y-5 animate-lift" onSubmit={sendMessage}>
              <div className="grid md:grid-cols-2 gap-5">
                <label className="grid gap-1 text-gray-700 font-bold">
                  Ton nom
                  <input
                    value={user?.displayName || user?.email?.split('@')[0] || ''}
                    readOnly
                    className="h-11 px-4 rounded-xl border border-gray-200 bg-gray-50 text-gray-500 outline-none"
                  />
                </label>
                <label className="grid gap-1 text-gray-700 font-bold">
                  Destinataire
                  <select
                    value={providers.find((p) => p.createdBy === newMessage.toUid)?.id ?? ''}
                    onChange={handleRecipientChange}
                    className="h-11 px-4 rounded-xl border border-gray-200 bg-white outline-none focus:border-blue-500"
                  >
                    <option value="">Choisir un prestataire</option>
                    {providers.map((provider) => (
                      <option key={provider.id} value={provider.id} disabled={!provider.createdBy}>
                        {provider.name}{provider.createdBy ? '' : ' (sans compte)'}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <label className="grid gap-1 text-gray-700 font-bold">
                  Sujet
                  <input name="subject" value={newMessage.subject} onChange={handleMessageChange} className="h-11 px-4 rounded-xl border border-gray-200 bg-white outline-none focus:border-blue-500" />
                </label>
                <label className="grid gap-1 text-gray-700 font-bold">
                  Contexte
                  <select name="subject" value={newMessage.subject} onChange={handleMessageChange} className="h-11 px-4 rounded-xl border border-gray-200 bg-white outline-none focus:border-blue-500">
                    <option value="">Choisir un modèle</option>
                    <option value="Disponibilité pour la mission">Disponibilité</option>
                    <option value="Confirmation du lieu">Confirmation du lieu</option>
                    <option value="Négociation du budget">Négociation du budget</option>
                  </select>
                </label>
              </div>
              <label className="grid gap-1.5 text-gray-700 font-bold">
                Message
                <textarea name="text" value={newMessage.text} onChange={handleMessageChange} rows="4" placeholder="Ex: Bonjour, je suis disponible demain à 15h..." className="px-4 py-3 rounded-xl border border-gray-200 bg-white outline-none focus:border-blue-500 resize-y" />
              </label>
              <button type="submit" className="h-11 px-5 bg-gradient-to-r from-gabon-green-action to-blue-500 text-white font-black rounded-xl shadow-lg hover:-translate-y-0.5 transition-all w-fit">Envoyer</button>
            </form>
            <div className="space-y-3">
              {messages.map((msg) => (
                <article key={msg.id} className={`flex gap-3 items-start animate-lift ${msg.from.toLowerCase() === 'linkup' ? 'flex-row-reverse' : ''}`}>
                  <div className="w-10 h-10 rounded-full gradient-gabon grid place-items-center text-white font-black shrink-0">{msg.from[0]}</div>
                  <div className={`glass rounded-xl p-4 max-w-xl ${msg.from.toLowerCase() === 'linkup' ? 'rounded-tr-sm' : 'rounded-tl-sm'}`}>
                    <span className="text-gabon-green font-bold text-sm">{msg.from} → {msg.to || 'LinkUp'}</span>
                    <h3 className="text-gray-900 font-bold mt-1">{msg.subject}</h3>
                    <p className="text-gray-600 mt-1 leading-relaxed">{msg.text}</p>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}
      </main>

      <Footer onViewChange={setActiveView} />

      {selectedProvider && (
        <div className="fixed inset-0 z-50 grid place-items-center p-4 bg-black/55" onClick={() => setSelectedProvider(null)}>
          <form className="glass rounded-xl p-8 w-full max-w-lg max-h-[80vh] overflow-y-auto space-y-5 md:space-y-6 animate-lift" onClick={(e) => e.stopPropagation()} onSubmit={submitBooking}>
            <button type="button" onClick={() => setSelectedProvider(null)} className="float-right h-9 px-3 bg-gray-100 text-gray-600 rounded-lg font-bold hover:bg-gray-200">Fermer</button>
            <p className="text-gabon-yellow text-xs font-black tracking-widest uppercase">Demande directe</p>
            <h2 className="text-gray-900 font-black text-2xl">Contacter {selectedProvider.name}</h2>
            <p className="text-gray-500 text-sm">{selectedProvider.headline}</p>
                          <label className="grid gap-1.5 text-gray-700 font-bold">Ton nom <input name="client" value={booking.client} onChange={handleBookingChange} className="h-11 px-4 rounded-xl border border-gray-200 outline-none focus:border-blue-500" /></label>
            <label className="grid gap-1 text-gray-700 font-bold">Titre <input name="title" value={booking.title} onChange={handleBookingChange} className="h-11 px-4 rounded-xl border border-gray-200 outline-none focus:border-blue-500" /></label>
            <label className="grid gap-1 text-gray-700 font-bold">Description <textarea name="description" value={booking.description} onChange={handleBookingChange} rows="3" className="px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-blue-500 resize-y" /></label>
            <div className="grid md:grid-cols-2 gap-4">
              <label className="grid gap-1 text-gray-700 font-bold">Budget FCFA <input type="number" min="1000" name="budget" value={booking.budget} onChange={handleBookingChange} className="h-11 px-4 rounded-xl border border-gray-200 outline-none focus:border-blue-500" /></label>
              <label className="grid gap-1 text-gray-700 font-bold">Délai <select name="urgency" value={booking.urgency} onChange={handleBookingChange} className="h-11 px-4 rounded-xl border border-gray-200 outline-none focus:border-blue-500">
                <option>Aujourd'hui</option><option>Demain</option><option>Cette semaine</option><option>Flexible</option>
              </select></label>
            </div>
            <label className="grid gap-1 text-gray-700 font-bold">Lieu <input name="location" value={booking.location} onChange={handleBookingChange} className="h-11 px-4 rounded-xl border border-gray-200 outline-none focus:border-blue-500" /></label>
            <button type="submit" className="w-full h-12 bg-gradient-to-r from-gabon-green-action to-blue-500 text-white font-black rounded-xl shadow-lg">Envoyer la demande</button>
          </form>
        </div>
      )}

      {profileProvider && (
        <div className="fixed inset-0 z-50 grid place-items-center p-4 bg-black/55" onClick={() => setProfileProvider(null)}>
          <div className="glass rounded-xl p-8 w-full max-w-2xl max-h-[80vh] overflow-y-auto space-y-6 animate-lift" onClick={(e) => e.stopPropagation()}>
            <button type="button" onClick={() => setProfileProvider(null)} className="float-right h-9 px-3 bg-gray-100 text-gray-600 rounded-lg font-bold hover:bg-gray-200">Fermer</button>
            <div className="flex gap-4 items-center">
              <img src={profileProvider.image} alt={profileProvider.name} className="w-36 h-36 object-cover rounded-xl" />
              <div>
                <p className="text-gabon-yellow text-xs font-black tracking-widest uppercase">Profil prestataire</p>
                <h2 className="text-gray-900 font-black text-3xl">{profileProvider.name}</h2>
                <p className="text-gray-600 mt-1">{profileProvider.bio}</p>
                <div className="flex flex-wrap gap-2 mt-3">
                  <span className="px-3 py-1 bg-gray-100 rounded-full text-sm font-bold text-gray-600">{profileProvider.location}</span>
                  <span className="px-3 py-1 bg-gray-100 rounded-full text-sm font-bold text-gray-600">{profileProvider.category}</span>
                  <span className="px-3 py-1 bg-gray-100 rounded-full text-sm font-bold text-gray-600">{profileProvider.rating}/5</span>
                  <span className="px-3 py-1 bg-gray-100 rounded-full text-sm font-bold text-gray-600">{profileProvider.price.toLocaleString('fr-FR')} FCFA</span>
                </div>
              </div>
            </div>
            {profileProvider.gallery && (
              <div className="grid md:grid-cols-2 gap-3">
                {profileProvider.gallery.map((img) => (
                  <img key={img} src={img} alt="" className="w-full h-44 object-cover rounded-xl" />
                ))}
              </div>
            )}
            <div>
              <h3 className="text-gray-900 font-bold text-lg mb-3">Compétences</h3>
              <div className="flex flex-wrap gap-2">
                {profileProvider.skills.map((skill) => (
                  <span key={skill} className="px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-sm font-bold text-gray-600">{skill}</span>
                ))}
              </div>
            </div>
            {profileProvider.reviews && (
              <div>
                <h3 className="text-gray-900 font-bold text-lg mb-3">Avis clients</h3>
            <div className="space-y-4 md:space-y-5">
                  {profileProvider.reviews.map((review) => (
                    <article key={review.client} className="p-3 bg-gray-50 border border-gray-200 rounded-xl">
                      <strong className="text-gray-900">{review.client}</strong>
                      <span className="block text-amber-700 my-1">{'★'.repeat(review.rating)}</span>
                      <p className="text-gray-600 text-sm">{review.text}</p>
                    </article>
                  ))}
                </div>
              </div>
            )}
            <button onClick={() => { setProfileProvider(null); openBooking(profileProvider) }} className="w-full h-12 bg-gradient-to-r from-gabon-green-action to-blue-500 text-white font-black rounded-xl shadow-lg">
              Contacter ce prestataire
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
