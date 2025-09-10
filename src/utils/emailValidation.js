// ========================================
// UTILIDADES PARA VALIDACIÓN DE EMAIL
// ========================================

// Lista de dominios de email temporales/falsos comunes
const TEMPORARY_EMAIL_DOMAINS = [
  '10minutemail.com',
  'tempmail.org',
  'guerrillamail.com',
  'mailinator.com',
  'temp-mail.org',
  'throwaway.email',
  'getnada.com',
  'maildrop.cc',
  'yopmail.com',
  'sharklasers.com',
  'guerrillamailblock.com',
  'pokemail.net',
  'spam4.me',
  'bccto.me',
  'chacuo.net',
  'dispostable.com',
  'mailnesia.com',
  'meltmail.com',
  'mohmal.com',
  'mytrashmail.com',
  'nada.email',
  'nada.ltd',
  'notmailinator.com',
  'nowmymail.com',
  'spamgourmet.com',
  'spamhereplease.com',
  'spamhole.com',
  'spam.la',
  'spammotel.com',
  'spamobox.com',
  'spamspot.com',
  'spamthis.co.uk',
  'spamthisplease.com',
  'superrito.com',
  'thisisnotmyrealemail.com',
  'tittbit.in',
  'toomail.biz',
  'toomail.com',
  'trash-amil.com',
  'trashmail.at',
  'trashmail.com',
  'trashmail.de',
  'trashmail.net',
  'trashymail.com',
  'trashymail.net',
  'trbvm.com',
  'tyldd.com',
  'uggsrock.com',
  'wegwerfadresse.de',
  'wegwerfmail.de',
  'wetrainbayarea.com',
  'wetrainbayarea.org',
  'wh4f.org',
  'whatiaas.com',
  'whatpaas.com',
  'whatsaas.com',
  'whopy.com',
  'wilemail.com',
  'willselfdestruct.com',
  'wuzup.net',
  'wuzupmail.net',
  'www.e4ward.com',
  'www.gishpuppy.com',
  'www.mailinator.com',
  'www.mailmetrash.com',
  'www.4warding.com',
  'yeah.net',
  'yopmail.net',
  'yopmail.org',
  'ypmail.webarnak.fr',
  'cool.fr.nf',
  'jetable.fr.nf',
  'nospam.ze.tc',
  'nomail.xl.cx',
  'mega.zik.dj',
  'speed.1s.fr',
  'courriel.fr.nf',
  'moncourrier.fr.nf',
  'monemail.fr.nf',
  'monmail.fr.nf',
  'test.com',
  'example.com',
  'example.org',
  'example.net',
  'localhost',
  'invalid.com'
]

// Validar formato de email
export const isValidEmailFormat = (email) => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
  return emailRegex.test(email)
}

// Verificar si es un dominio temporal
export const isTemporaryEmail = (email) => {
  const domain = email.split('@')[1]?.toLowerCase()
  return TEMPORARY_EMAIL_DOMAINS.includes(domain)
}

// Validar email completo (formato + no temporal)
export const validateEmail = (email) => {
  if (!email) {
    return {
      isValid: false,
      message: 'El email es requerido'
    }
  }

  if (!isValidEmailFormat(email)) {
    return {
      isValid: false,
      message: 'El formato del email no es válido'
    }
  }

  if (isTemporaryEmail(email)) {
    return {
      isValid: false,
      message: 'No se permiten emails temporales. Por favor usa un email real.'
    }
  }

  return {
    isValid: true,
    message: 'Email válido'
  }
}

// Verificar si el email existe realmente (opcional - requiere API externa)
export const verifyEmailExists = async (email) => {
  try {
    // Esta función podría integrarse con servicios como:
    // - Hunter.io
    // - ZeroBounce
    // - EmailValidator
    // Por ahora retornamos true para no bloquear el registro
    return {
      exists: true,
      message: 'Email verificado'
    }
  } catch (error) {
    console.error('Error verificando email:', error)
    return {
      exists: true, // Asumir que existe si hay error
      message: 'No se pudo verificar el email'
    }
  }
}
