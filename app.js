// Referenzen
const toggle = document.querySelector('.nav-toggle');
const menu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');

// 1. Toggle-Handler bleibt
toggle.addEventListener('click', () => menu.classList.toggle('show'));

// 2. Klick auf Link zur bereits aktiven Seite schließt das Menu
navLinks.forEach(link => {
  link.addEventListener('click', e => {
    const targetHash = link.getAttribute('href');
    if (location.hash === targetHash) {
      menu.classList.remove('show');
    }
    // Ansonsten übernimmt der Routing-Mechanismus das Schließen
  });
});

// 3. Klick außerhalb des Menüs schließt es
document.addEventListener('click', e => {
  if (!menu.contains(e.target) && !toggle.contains(e.target)) {
    menu.classList.remove('show');
  }
});

// 4. ESC-Taste schließt das Menu
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    menu.classList.remove('show');
  }
});

// ... rest of your routing and newsletter code follows ...


// Elemente
const blogListEl = document.getElementById('blog-list');
const blogPostEl = document.getElementById('blog-post');

// Blog aus JSON laden
async function loadPosts() {
  try {
    const res = await fetch('posts.json');
    const posts = await res.json();
    renderBlogList(posts);
  } catch (err) {
    blogListEl.innerHTML = '<p>Fehler beim Laden der Blog-Daten.</p>';
  }
}

// Grid mit Cards darstellen
function renderBlogList(posts) {
  blogPostEl.innerHTML = '';
  blogListEl.innerHTML = posts.map(p => `
    <div class="card">
      <img src="${p.image}" alt="${p.title}">
      <div class="card-content">
        <h3 class="card-title"><a href="#blog/${p.id}">${p.title}</a></h3>
        <div class="card-date">${p.date}</div>
        <div class="card-tags">
          ${p.tags.map(tag => `<span>${tag}</span>`).join('')}
        </div>
        <p class="card-excerpt">${p.excerpt}</p>
        <p><a href="#blog/${p.id}">Weiterlesen →</a></p>
      </div>
    </div>
  `).join('');
}

// Einzelnen Artikel anzeigen
async function renderBlogPost(id) {
  try {
    const res = await fetch('posts.json');
    const posts = await res.json();
    const post = posts.find(p => p.id === id);
    if (!post) throw new Error();
    blogListEl.innerHTML = '';
    blogPostEl.innerHTML = `
      <article class="post-full">
        <img src="${post.image}" alt="${post.title}">
        <h3>${post.title}</h3>
        <time datetime="${post.date}" class="card-date">${post.date}</time>
        <div class="card-tags">
          ${post.tags.map(tag => `<span>${tag}</span>`).join('')}
        </div>
        ${post.content}
        <p><a href="#blog">← zurück zum Blog</a></p>
      </article>
    `;
  } catch {
    blogPostEl.innerHTML = '<p>Beitrag nicht gefunden oder Fehler beim Laden.</p>';
  }
}

// Hash-Routing & Seitenwechsel
const pages = document.querySelectorAll('.page');
function showPage() {
  const hash = location.hash.slice(1) || 'home';
  if (hash.startsWith('blog')) {
    pages.forEach(p => p.id === 'blog' ? p.classList.add('active') : p.classList.remove('active'));
    const [, postId] = hash.split('/');
    postId ? renderBlogPost(postId) : loadPosts();
  } else {
    pages.forEach(p => p.id === hash ? p.classList.add('active') : p.classList.remove('active'));
  }
  menu.classList.remove('show');
}

window.addEventListener('hashchange', showPage);
window.addEventListener('load', () => {
  showPage();
  if (location.hash.startsWith('#blog')) loadPosts();
});

// Newsletter-Form
document.getElementById('signup-form').addEventListener('submit', async e => {
  e.preventDefault();
  const email = e.target.email.value.trim();
  const msg = document.getElementById('msg');
  if (!email) return;
  try {
    // hier API-Call zum Newsletter-Service einfügen
    await new Promise(r => setTimeout(r, 600));
    msg.textContent = 'Danke! Du bist angemeldet.';
    msg.style.color = 'var(--accent)';
    e.target.reset();
  } catch {
    msg.textContent = 'Fehler. Bitte später erneut versuchen.';
    msg.style.color = 'tomato';
  }
});
