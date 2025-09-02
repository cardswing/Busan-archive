async function loadPlaces() {
  const res = await fetch('assets/data/places.json');
  const data = await res.json();
  return data;
}

function cardTpl(p){
  return `
  <article class="card">
    <h3><a href="place.html?slug=${encodeURIComponent(p.slug)}">${p.name}</a></h3>
    <p>${p.district} · ${p.category}</p>
    <p>${p.summary}</p>
    <div class="tags">${[p.category, ...(p.tags||[])].map(t=>`<span class="badge">${t}</span>`).join('')}</div>
  </article>`;
}

function render(list){
  const el = document.getElementById('cards');
  el.innerHTML = list.map(cardTpl).join('');
}

function setupSearch(all){
  const q = document.getElementById('search');
  const tagBtns = document.querySelectorAll('.tag');
  let activeTag = null;
  function apply(){
    const term = (q.value||'').trim();
    const filtered = all.filter(p=>{
      const hay = [p.name,p.district,p.category,...(p.tags||[])].join(' ').toLowerCase();
      const okTerm = term ? hay.includes(term.toLowerCase()) : true;
      const okTag = activeTag ? (p.tags||[]).includes(activeTag) || p.category===activeTag : true;
      return okTerm && okTag;
    });
    render(filtered);
  }
  q.addEventListener('input', apply);
  tagBtns.forEach(b=>{
    b.addEventListener('click', ()=>{
      activeTag = (activeTag===b.dataset.tag) ? null : b.dataset.tag;
      tagBtns.forEach(x=>x.classList.toggle('active', x===b && !!activeTag));
      apply();
    });
  });
  apply();
}

loadPlaces().then(ps=>{ render(ps); setupSearch(ps); });
