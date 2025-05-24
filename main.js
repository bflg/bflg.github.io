/**
 * main.js
 * - Burger-Menü
 * - Seiten-Routing (showPage)
 * - Newsletter & Kontakt Formulare
 */

// main.js
document.addEventListener('DOMContentLoaded', () => {
  const burger    = document.getElementById('burger')
  const mobileNav = document.getElementById('mobile-nav')

  // 1) Burger togglet die Klasse "open"
  burger.addEventListener('click', () => {
    mobileNav.classList.toggle('open')
  })

  // 2) Klick auf einen Nav-Link schließt das Overlay
  mobileNav.addEventListener('click', e => {
    if (e.target.tagName === 'A') {
      mobileNav.classList.remove('open')
    }
  })

  // 3) Klick außerhalb der Links (auf das Overlay selbst) schließt ebenfalls
  mobileNav.addEventListener('click', e => {
    if (e.target === mobileNav) {
      mobileNav.classList.remove('open')
    }
  })

  // 4) Fenster-Resize: schließe Overlay, sobald man wieder ins Desktop-Layout geht
  window.addEventListener('resize', () => {
    if (window.innerWidth >= 640 && mobileNav.classList.contains('open')) {
      mobileNav.classList.remove('open')
    }
  })
  
  // ... dein restliches showPage(), form-Handling etc. bleibt unverändert ...



  /**
   * Zeigt nur die angegebene Seite,
   * versteckt alle anderen .page-content-Sektionen
   */
  function showPage(id) {
    document.querySelectorAll('.page-content').forEach(sec => {
      sec.style.display = sec.id === id ? 'block' : 'none';
    });
    // scroll immer nach oben
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Routing-Links (nav + card-Links + footer)
  document.querySelectorAll('[data-target]').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      const target = link.dataset.target;
      mobileNav.style.display = 'none';
      showPage(target);
    });
  });

  // Logo klick → Home
  logo.addEventListener('click', () => showPage('home-page'));

  // Newsletter Formulare (Header & Footer)
  ['newsletter-form', 'newsletter-form-footer'].forEach(formId => {
    const form = document.getElementById(formId);
    form.addEventListener('submit', async e => {
      e.preventDefault();
      const email =
        form.querySelector('input[type="email"]').value.trim();
      if (!email) return;
      try {
        await fetch('/backend/public/api/newsletter.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email })
        });
        alert('Danke für dein Abo!');
        form.reset();
      } catch {
        alert('Fehler beim Absenden.');
      }
    });
  });

  // Kontakt-Formular (optional, falls aktiv)
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', async e => {
      e.preventDefault();
      const data = {
        name:    e.target.name.value.trim(),
        email:   e.target.email.value.trim(),
        message: e.target.message.value.trim()
      };
      try {
        await fetch('/backend/public/api/contact.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
        alert('Nachricht gesendet!');
        contactForm.reset();
        showPage('home-page');
      } catch {
        alert('Fehler beim Absenden.');
      }
    });
  }

  // Initial: Home anzeigen
  showPage('home-page');
});
