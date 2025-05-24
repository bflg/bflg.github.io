/**
 * main.js
 * - Burger-Menü
 * - Seiten-Routing (showPage)
 * - Newsletter & Kontakt Formulare
 */

document.addEventListener('DOMContentLoaded', () => {
  // Elemente holen
  const burger    = document.getElementById('burger');
  const mobileNav = document.getElementById('mobile-nav');
  const logo      = document.getElementById('logo');

  // Toggle Mobile-Nav
  burger.addEventListener('click', () => {
    mobileNav.style.display =
      mobileNav.style.display === 'flex' ? 'none' : 'flex';
  });

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
