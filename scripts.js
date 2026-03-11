// Active nav link
(function setActiveNav(){
  const here = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(a=>{
    const href = a.getAttribute('href');
    if (href === here) a.classList.add('active');
  });
})();

// Theme toggle + Accent color persistence
(function themeControls(){
  const root = document.documentElement;
  const themeToggle = document.getElementById('themeToggle');
  const accentPicker = document.getElementById('accentPicker');

  // Load saved settings
  const savedTheme = localStorage.getItem('theme');
  const savedAccent = localStorage.getItem('accent');
  if (savedTheme) document.documentElement.setAttribute('data-theme', savedTheme);
  if (savedAccent){
    root.style.setProperty('--accent', savedAccent);
    if (accentPicker) accentPicker.value = savedAccent;
  }

  // Toggle theme
  if (themeToggle){
    themeToggle.addEventListener('click', ()=>{
      const current = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', current);
      localStorage.setItem('theme', current);
    });
  }

  // Change accent
  if (accentPicker){
    accentPicker.addEventListener('input', (e)=>{
      root.style.setProperty('--accent', e.target.value);
      localStorage.setItem('accent', e.target.value);
    });
  }
})();

// Gallery lightbox (Bootstrap Modal)
(function galleryLightbox(){
  const links = document.querySelectorAll('a.lightbox');
  const modalEl = document.getElementById('lightboxModal');
  if (!links.length || !modalEl) return;

  const img = document.getElementById('lightboxImage');
  const caption = document.getElementById('lightboxCaption');
  const modal = new bootstrap.Modal(modalEl);

  links.forEach(a=>{
    a.addEventListener('click', (e)=>{
      e.preventDefault();
      img.src = a.getAttribute('href');
      caption.textContent = a.dataset.caption || '';
      modal.show();
    });
  });
})();

// Booking helpers: prefill from query + construct mailto/WhatsApp links
(function bookingHelpers(){
  const form = document.getElementById('bookingForm');
  if (!form) return;

  // Prefill service from query string
  const params = new URLSearchParams(location.search);
  const service = params.get('service');
  if (service) form.elements['service'].value = service;

  const emailBtn = document.getElementById('emailSubmit');
  const waBtn = document.getElementById('waSubmit');

  function buildMessage(){
    const fn = form.elements['firstName'].value.trim();
    const ln = form.elements['lastName'].value.trim();
    const ph = form.elements['phone'].value.trim();
    const em = form.elements['email'].value.trim();
    const sv = form.elements['service'].value;
    const dt = form.elements['date'].value;
    const tm = form.elements['time'].value;
    const nt = form.elements['notes'].value.trim();

    const lines = [
      `Booking Request - Ria's Nail Do`,
      `Name: ${fn} ${ln}`,
      `Phone: ${ph}`,
      `Email: ${em || '-'}`,
      `Service: ${sv}`,
      `Date: ${dt}`,
      `Time: ${tm}`,
      `Notes: ${nt || '-'}`,
    ];
    return lines.join('\n');
  }

  // Email submit via mailto
  if (emailBtn){
    emailBtn.addEventListener('click', ()=>{
      if (!form.reportValidity()) return;
      const body = encodeURIComponent(buildMessage());
      const subject = encodeURIComponent('Booking Request - Ria\'s Nail Do');
      location.href = `mailto:mariaOD158@outlook.com?subject=${subject}&body=${body}`;
    });
  }

  // WhatsApp submit
  if (waBtn){
    waBtn.addEventListener('click', ()=>{
      if (!form.reportValidity()) return;
      const msg = encodeURIComponent(buildMessage());
      // TODO: Replace the number with your real WhatsApp number
      const number = '26760000000';
      window.open(`https://wa.me/${number}?text=${msg}`, '_blank');
    });
  }
})();
