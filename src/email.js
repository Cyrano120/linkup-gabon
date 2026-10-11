import emailjs from '@emailjs/browser'

const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || ''
const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID || ''
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || ''

console.log('🔍 EmailJS check:', {
  key: EMAILJS_PUBLIC_KEY ? 'OK (' + EMAILJS_PUBLIC_KEY.slice(0, 4) + '...)' : 'MANQUANTE',
  service: EMAILJS_SERVICE_ID || 'MANQUANT',
  template: EMAILJS_TEMPLATE_ID || 'MANQUANT',
})

emailjs.init(EMAILJS_PUBLIC_KEY)

export function sendNotification({ to_name, from_name, subject, message }) {
  return emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
    to_name,
    from_name,
    subject: subject || 'Notification LinkUp',
    message: message || 'Pas de message.',
  })
}
