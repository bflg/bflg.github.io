/**
 * main.js
 * - Burger-Toggle (.open)
 * - Routing showPage()
 * - Auto-Close Overlay & Resize-Handler
 * - Newsletter-Submit
 */

document.addEventListener('DOMContentLoaded', () => {
  const burger    = document.getElementById('burger');
  const mobileNav = document.getElementById('mobile-nav');
  const logo      = document.getElementById('logo');

  // 1) Burger toggelt Overlay-Klasse
  burger.addEventListener('click', () => {
    mobileNav.classList.toggle('open');
  });

  // 2) Klick auf Link oder Hintergrund schließt Overlay
  mobileNav.addEventListener('click', e => {
    if (e.target.tagName === 'A' || e.target === mobileNav) {
      mobileNav.classList.remove('open');
    }
  });

  // 3) Beim Resize in Desktop einblenden, Overlay schließen
  window.addEventListener('resize', () => {
    if (window.innerWidth >= 640 && mobileNav.classList.contains('open')) {
      mobileNav.classList.remove('open');
    }
  });

  // showPage: blendet .page-content ein/aus
  function showPage(id) {
    document.querySelectorAll('.page-content').forEach(sec => {
      sec.style.display = sec.id === id ? 'block' : 'none';
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Nav-Links & Card-Links
  document.querySelectorAll('[data-target]').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      mobileNav.classList.remove('open');
      showPage(link.dataset.target);
    });
  });

  // Logo → Home
  logo.addEventListener('click', () => showPage('home-page'));

  // Newsletter-Form
  const newsletterForm = document.getElementById('newsletter-form');
  newsletterForm.addEventListener('submit', async e => {
    e.preventDefault();
    const email = e.target.querySelector('input').value.trim();
    if (!email) return;
    try {
      await fetch('/backend/public/api/newsletter.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      alert('Danke für dein Abo!');
      e.target.reset();
    } catch {
      alert('Fehler beim Absenden.');
    }
  });

  // Initial Seite Home
  showPage('home-page');
});
