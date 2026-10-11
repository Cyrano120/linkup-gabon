export const initialProviders = [
  {
    id: 1,
    name: 'Nora Mba',
    role: 'Developpeuse front-end',
    category: 'Design & Web',
    rating: 4.9,
    missions: 28,
    price: 8000,
    location: 'Nzeng-Ayong',
    available: true,
    image:
      'https://images.unsplash.com/photo-1534751516642-a1af1ef26a56?auto=format&fit=crop&w=900&q=80',
    cover:
      'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80',
    responseTime: '12 min',
    successRate: 98,
    headline: 'Sites vitrines, interfaces React et landing pages pour petits business gabonais.',
    bio: 'Nora aide les petits commerces et associations a creer une presence web propre sans se perdre dans la technique.',
    gallery: [
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1559028012-481c04fa702d?auto=format&fit=crop&w=900&q=80',
    ],
    reviews: [
      { client: 'Nadya', rating: 5, text: 'Elle a livre une page claire pour mon salon de coiffure.' },
      { client: 'Junior', rating: 5, text: 'Tres bonne communication et design propre.' },
    ],
    skills: ['React', 'Landing page', 'Maquette'],
  },
  {
    id: 2,
    name: 'Cedric Aworet',
    role: 'Technicien informatique',
    category: 'Informatique',
    rating: 4.8,
    missions: 35,
    price: 5000,
    location: 'Louis',
    available: true,
    image:
      'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=900&q=80',
    cover:
      'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80',
    responseTime: '8 min',
    successRate: 96,
    headline: 'Depannage rapide a Libreville pour PC, logiciels, imprimantes et reseau wifi.',
    bio: 'Cedric intervient surtout sur les problemes urgents : ordinateur lent, installation, imprimante et wifi.',
    gallery: [
      'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1581090700227-1e37b190418e?auto=format&fit=crop&w=900&q=80',
    ],
    reviews: [
      { client: 'Kevin', rating: 5, text: 'Il a remis mon PC en etat le meme jour.' },
      { client: 'Ariane', rating: 4, text: 'Bon service, explications simples.' },
    ],
    skills: ['PC lent', 'Installation', 'Wifi'],
  },
  {
    id: 3,
    name: 'Sarah Kombila',
    role: 'Coach scolaire',
    category: 'Cours',
    rating: 4.7,
    missions: 19,
    price: 6000,
    location: 'Batterie IV',
    available: false,
    image:
      'https://images.unsplash.com/photo-1499952127939-9bbf5af6c51c?auto=format&fit=crop&w=900&q=80',
    cover:
      'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80',
    responseTime: '1 h',
    successRate: 94,
    headline: 'Soutien scolaire pour eleves et etudiants avant examens, exposes et devoirs.',
    bio: 'Sarah accompagne les eleves avec une methode calme : reprendre les bases, faire des exercices et preparer les controles.',
    gallery: [
      'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=900&q=80',
    ],
    reviews: [
      { client: 'Linda', rating: 5, text: 'Elle m a aidee a preparer mon oral.' },
      { client: 'Davy', rating: 4, text: 'Bonne pedagogie et ponctuelle.' },
    ],
    skills: ['Maths', 'Anglais', 'Revision'],
  },
  {
    id: 4,
    name: 'Jason Bouanga',
    role: 'Livreur express',
    category: 'Livraison',
    rating: 4.6,
    missions: 42,
    price: 3000,
    location: 'Akanda',
    available: true,
    image:
      'https://images.unsplash.com/photo-1522556189639-b150ed9c4330?auto=format&fit=crop&w=900&q=80',
    cover:
      'https://images.unsplash.com/photo-1526367790999-0150786686a2?auto=format&fit=crop&w=1200&q=80',
    responseTime: '15 min',
    successRate: 97,
    headline: 'Livraison de colis, courses et documents entre Akanda, Centre-ville et Owendo.',
    bio: 'Jason gere les petites courses et livraisons urgentes avec confirmation du depart et de l arrivee.',
    gallery: [
      'https://images.unsplash.com/photo-1526367790999-0150786686a2?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1522156373667-4c7234bbd804?auto=format&fit=crop&w=900&q=80',
    ],
    reviews: [
      { client: 'Mireille', rating: 5, text: 'Colis livre rapidement a Akanda.' },
      { client: 'Steve', rating: 4, text: 'Pratique pour les documents urgents.' },
    ],
    skills: ['Courses', 'Colis', 'Express'],
  },
  {
    id: 5,
    name: 'Maeva Rekangalt',
    role: 'Designer freelance',
    category: 'Design & Web',
    rating: 4.8,
    missions: 23,
    price: 7000,
    location: 'Glass',
    available: true,
    image:
      'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=900&q=80',
    cover:
      'https://images.unsplash.com/photo-1558655146-9f40138edfeb?auto=format&fit=crop&w=1200&q=80',
    responseTime: '20 min',
    successRate: 95,
    headline: 'Flyers, logos et visuels WhatsApp pour evenements, commerces et associations.',
    bio: 'Maeva cree des visuels qui parlent aux clients locaux : affiches, statuts WhatsApp, flyers et logos simples.',
    gallery: [
      'https://images.unsplash.com/photo-1558655146-9f40138edfeb?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=900&q=80',
    ],
    reviews: [
      { client: 'Mickael', rating: 5, text: 'Le flyer etait propre et pret pour WhatsApp.' },
      { client: 'Prisca', rating: 5, text: 'Tres bon choix des couleurs.' },
    ],
    skills: ['Logo', 'Flyer', 'Canva'],
  },
  {
    id: 6,
    name: 'Yann Ondo',
    role: 'Monteur video',
    category: 'Design & Web',
    rating: 4.7,
    missions: 17,
    price: 9000,
    location: 'Charbonnages',
    available: true,
    image:
      'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=900&q=80',
    cover:
      'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=1200&q=80',
    responseTime: '25 min',
    successRate: 93,
    headline: 'Videos courtes, reels, sous-titres et montages pour artistes et entrepreneurs.',
    bio: 'Yann transforme des videos brutes en contenus courts pour TikTok, Instagram et WhatsApp.',
    gallery: [
      'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=900&q=80',
    ],
    reviews: [
      { client: 'Bryan', rating: 5, text: 'Le reel avait un rendu tres dynamique.' },
      { client: 'Kelly', rating: 4, text: 'Bon montage et sous-titres propres.' },
    ],
    skills: ['Reels', 'Montage', 'Sous-titres'],
  },
]

export const initialRequests = [
  {
    id: 101,
    title: 'Installer Windows et Office',
    category: 'Informatique',
    budget: 10000,
    location: 'PK12',
    urgency: 'Urgent',
    status: 'Ouverte',
    client: 'Kevin',
    provider: 'En attente',
    candidates: ['Cedric Aworet'],
    description: 'Mon ordinateur a ete formate et je dois le rendre pret pour les cours a l UOB.',
  },
  {
    id: 102,
    title: 'Cours de soutien en anglais',
    category: 'Cours',
    budget: 15000,
    location: 'Batterie IV',
    urgency: 'Cette semaine',
    status: 'En discussion',
    client: 'Linda',
    provider: 'Sarah Kombila',
    candidates: ['Sarah Kombila'],
    description: 'Besoin de deux seances pour preparer un expose oral.',
  },
  {
    id: 103,
    title: 'Creer un flyer pour une activite',
    category: 'Design & Web',
    budget: 12000,
    location: 'Glass',
    urgency: 'Demain',
    status: 'Confirmee',
    client: 'Mickael',
    provider: 'Maeva Rekangalt',
    candidates: ['Maeva Rekangalt', 'Nora Mba'],
    description: 'Besoin d un visuel propre pour annoncer une rencontre etudiante.',
  },
]

export const categories = ['Tous', 'Informatique', 'Cours', 'Livraison', 'Design & Web']

export const statuses = ['Ouverte', 'En discussion', 'Confirmee', 'Terminee']

export const serviceHighlights = [
  {
    title: 'Depannage a Libreville',
    text: 'PC, imprimante, wifi ou logiciel bloque : trouve quelqu un proche de ton quartier.',
    image:
      'https://commons.wikimedia.org/wiki/Special:FilePath/Libreville%20Streetlife%20%2846168296741%29.jpg',
  },
  {
    title: 'Cours et soutien',
    text: 'Revision, expose, anglais, maths ou bureautique avec des profils proches du campus.',
    image:
      'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80',
  },
  {
    title: 'Creation locale',
    text: 'Flyers, logos, reels et sites pour snacks, salons, evenements et petits commerces.',
    image:
      'https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&w=1200&q=80',
  },
]

export const localAreas = [
  'Libreville',
  'Akanda',
  'Owendo',
  'Nzeng-Ayong',
  'Glass',
  'Louis',
  'PK12',
  'Port-Gentil',
]

export const howItWorksSteps = [
  {
    title: 'Tu expliques le besoin',
    text: 'Exemple : un PC a reparer a PK12, un flyer pour une soiree a Glass ou un cours de maths a Batterie IV.',
  },
  {
    title: 'LinkUp rapproche les bons profils',
    text: 'Tu compares les prix, la disponibilite, les competences et le quartier du prestataire.',
  },
  {
    title: 'Vous confirmez sur place',
    text: 'Le client et le prestataire discutent, valident le tarif en FCFA et choisissent Airtel Money, Moov Money ou espece.',
  },
]

export const testimonials = [
  {
    name: 'Ariane, etudiante a l UOB',
    text: 'J ai trouve quelqu un pour remettre mon ordinateur en etat avant un devoir. Le fait de voir le quartier m a rassuree.',
  },
  {
    name: 'Brice, jeune graphiste a Akanda',
    text: 'LinkUp me donne une vitrine simple. Je peux montrer ce que je sais faire sans avoir un gros portfolio.',
  },
  {
    name: 'Nadya, commercante a Nzeng-Ayong',
    text: 'Pour mes flyers WhatsApp, je prefere contacter un jeune du coin qui comprend le style local.',
  },
]

export const initialMessages = [
  {
    id: 1,
    from: 'Cedric A.',
    to: 'Kevin',
    subject: 'Disponibilite depannage PC',
    text: 'Je peux passer apres les cours pour installer Windows et les logiciels demandes.',
  },
  {
    id: 2,
    from: 'Maeva R.',
    to: 'Mickael',
    subject: 'Flyer evenement',
    text: 'J ai besoin du theme, des couleurs et du texte final pour livrer une premiere version.',
  },
]

export const pageStories = {
  market: {
    image:
      'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1400&q=85',
    title: 'Compare les talents avant de choisir.',
    text: 'Chaque profil montre le quartier, les competences, le tarif de depart et le temps de reponse. L objectif est simple : eviter de chercher au hasard dans ses contacts WhatsApp.',
  },
  request: {
    image:
      'https://commons.wikimedia.org/wiki/Special:FilePath/Lbv-march%C3%A9-NKembo3.jpg',
    title: 'Publie une demande claire, comme tu l expliquerais a quelqu un du quartier.',
    text: 'Le client precise le besoin, le budget, le lieu et le delai. La mission devient visible pour les prestataires qui peuvent proposer leur aide.',
  },
  missions: {
    image:
      'https://commons.wikimedia.org/wiki/Special:FilePath/Libreville%20Streetlife%20%2846168296741%29.jpg',
    title: 'Suis les missions sans perdre le fil.',
    text: 'Les demandes passent de ouverte a discussion, puis confirmee et terminee. Le client peut accepter une candidature directement.',
  },
  become: {
    image:
      'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1400&q=85',
    title: 'Transforme une competence en opportunite locale.',
    text: 'Un etudiant, un freelance ou un jeune technicien peut creer un profil, afficher ses services et commencer a recevoir des demandes.',
  },
  messages: {
    image:
      'https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&w=1400&q=85',
    title: 'Discute avant de confirmer.',
    text: 'La messagerie permet d envoyer une precision, proposer un rendez-vous ou confirmer le lieu avant la mission.',
  },
}
