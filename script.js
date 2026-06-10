const LEAD_ENDPOINT = 'https://lead-relay.leestygpt.workers.dev/lead/SM7B9TGYNF';

document.addEventListener('DOMContentLoaded', () => {
  // Year
  const yr = document.getElementById('year');
  if (yr) yr.textContent = new Date().getFullYear();

  // Sticky header
  const header = document.getElementById('header');
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 20);
  }, { passive: true });

  // Burger
  const burger = document.getElementById('burger');
  const nav = document.getElementById('nav');
  burger?.addEventListener('click', () => {
    burger.classList.toggle('is-open');
    nav.classList.toggle('is-open');
  });
  nav?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    burger.classList.remove('is-open');
    nav.classList.remove('is-open');
  }));

  // Reveal on scroll
  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('is-visible'); observer.unobserve(e.target); } });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

  // FAQ accordion
  document.querySelectorAll('.faq__item details').forEach(d => {
    d.addEventListener('toggle', () => {
      if (d.open) document.querySelectorAll('.faq__item details').forEach(o => { if (o !== d) o.removeAttribute('open'); });
    });
  });

  // Form
  const form = document.getElementById('leadForm');
  form?.addEventListener('submit', async e => {
    e.preventDefault();
    const btn = form.querySelector('[type=submit]');
    const orig = btn.textContent;
    btn.textContent = 'Отправляю...';
    btn.disabled = true;

    const data = Object.fromEntries(new FormData(form).entries());
    delete data._gotcha;
    if (data._gotcha) return;

    try {
      const res = await fetch(LEAD_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (res.ok) {
        form.innerHTML = '<div class="form__success"><div class="form__success-icon">✓</div><h3>Заявка отправлена!</h3><p>Я свяжусь с вами в ближайшее время. Если хотите быстрее — напишите в Telegram <a href="https://t.me/venera_yak">@venera_yak</a></p></div>';
      } else throw new Error();
    } catch {
      btn.textContent = orig;
      btn.disabled = false;
      alert('Ошибка отправки. Напишите напрямую в Telegram: @venera_yak');
    }
  });
});
