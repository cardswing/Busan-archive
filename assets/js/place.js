async function loadPlaces(){ const res=await fetch('assets/data/places.json'); return res.json(); }
function qs(name){ return new URLSearchParams(location.search).get(name); }

function initMap(container, coords){
  if(!coords || coords.length!==2){ container.textContent = '좌표 정보가 없습니다.'; return; }
  const [lat,lng]=coords;
  const img = new Image();
  const api = `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=14&size=640x360&markers=color:red|${lat},${lng}&key=YOUR_GOOGLE_MAPS_KEY`;
  img.src = api;
  img.alt = '지도';
  img.style.width='100%';
  container.appendChild(img);
}

loadPlaces().then(all=>{
  const slug = qs('slug');
  const p = all.find(x=>x.slug===slug);
  if(!p){ document.getElementById('place-name').textContent='장소를 찾을 수 없습니다.'; return; }
  document.title = `${p.name} - 부산 민간인 학살`;
  document.getElementById('place-name').textContent = p.name;
  document.getElementById('place-sub').textContent = `${p.district} · ${p.category}`;
  document.getElementById('qr-link').textContent = location.href;

  const facts = document.getElementById('facts');
  const src = (p.sources||[]).map(s=>`<li>출처: ${s}</li>`).join('');
  facts.innerHTML = `
    <li>분류: ${p.category}</li>
    <li>행정동: ${p.district}</li>
    <li>태그: ${(p.tags||[]).join(', ')||'없음'}</li>
    ${src}
  `;

  document.getElementById('content').innerHTML = p.description_html || '<p>세부 서사는 추후 업데이트됩니다.</p>';
  initMap(document.getElementById('map'), p.coords);
});
