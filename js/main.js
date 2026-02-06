/************************************************
 * DESPLAZAMIENTO SUAVE PARA EL NAV
 ************************************************/
document.querySelectorAll('nav a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      const headerOffset = 80;
      const elementPosition = target.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  });
});

/************************************************
 * ANIMACIONES AL HACER SCROLL
 ************************************************/
const observerOptions = {
  threshold: 0.2,
  rootMargin: '0px 0px -80px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    } else {
      entry.target.classList.remove('visible');
    }
  });
}, observerOptions);

document.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el));

/************************************************
 * IDIOMAS
 ************************************************/
let currentLanguage = 'es'; // idioma por defecto
let translations = {};

// Cargar idiomas
async function loadLanguages() {
  try {
    translations.es = await (await fetch('languages/es.json')).json();
    translations.en = await (await fetch('languages/en.json')).json();
    console.log('Idiomas cargados');
    changeLanguage(currentLanguage); // aplicar idioma inicial
  } catch (error) {
    console.error('Error al cargar idiomas:', error);
  }
}

// Cambiar idioma
function changeLanguage(lang) {
  currentLanguage = lang;

  // Textos
  document.querySelectorAll('[data-translate]').forEach(el => {
    const keys = el.dataset.translate.split('.');
    let value = translations[lang];
    keys.forEach(k => value = value[k]);
    el.textContent = value;
  });

  // Placeholders
  document.querySelectorAll('[data-translate-placeholder]').forEach(el => {
    const keys = el.dataset.translatePlaceholder.split('.');
    let value = translations[lang];
    keys.forEach(k => value = value[k]);
    el.setAttribute('placeholder', value);
  });

  updateCVLink();
}

// Botones de idioma
document.querySelectorAll('.lang-button').forEach((button, index) => {
  const lang = index === 0 ? 'es' : 'en';
  button.addEventListener('click', () => changeLanguage(lang));
});

// Actualizar CV según idioma
function updateCVLink() {
  const cvLink = document.getElementById('cv-download');
  if (!cvLink) return;

  cvLink.href =
    currentLanguage === 'es'
      ? 'assets/CV/CV_Karen_ES.pdf'
      : 'assets/CV/CV_Karen_EN.pdf';
}

// Cargar idiomas al iniciar
loadLanguages();

/************************************************
 * FORMULARIO DE CONTACTO (FORMSPREE)
 ************************************************/

const formMessages = {
  es: {
    sending: 'Enviando...',
    success: '¡Mensaje enviado correctamente! ✅',
    error: 'No se pudo enviar el mensaje 😕',
    connection: 'Error de conexión 😬',
    send: 'Enviar'
  },
  en: {
    sending: 'Sending...',
    success: 'Message sent successfully! ✅',
    error: 'Message could not be sent 😕',
    connection: 'Connection error 😬',
    send: 'Send'
  }
};

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('contact-form');
  const status = document.getElementById('form-status');

  if (!form || !status) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const button = form.querySelector('button');
    status.textContent = '';
    button.disabled = true;
    button.textContent = formMessages[currentLanguage].sending;

    const formData = new FormData(form);

    try {
      const response = await fetch('https://formspree.io/f/xqelojez', {
        method: 'POST',
        body: formData,
        headers: { Accept: 'application/json' }
      });

      if (response.ok) {
        status.textContent = formMessages[currentLanguage].success;
        status.style.color = 'green';
        form.reset();
      } else {
        status.textContent = formMessages[currentLanguage].error;
        status.style.color = 'red';
      }
    } catch {
      status.textContent = formMessages[currentLanguage].connection;
      status.style.color = 'red';
    } finally {
      button.disabled = false;
      button.textContent = formMessages[currentLanguage].send;
    }
  });
});

