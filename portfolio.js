const cards = document.getElementById('cards');
const search = document.getElementById('search');
const filters = document.getElementById('filters');
const entries = window.projects;
const profile = window.profile;
const featuredSection = document.getElementById('featured');
const byId = new Map(entries.map(project => [project.id, project]));
const featuredEntries = [...new Set(profile.featured)].map(id => byId.get(id)).filter(Boolean);
const featuredIds = new Set(featuredEntries.map(project => project.id));
let category = '전체';

if (profile.name) {
  document.getElementById('title').textContent = profile.name;
  document.title = profile.name + ' · 딴짓 수집함';
}
document.getElementById('intro').textContent = profile.intro;

function renderCard(project) {
  const card = document.createElement('a');
  card.className = 'card';
  const localFolder = location.protocol === 'file:' && project.url.startsWith('apps/') && project.url.endsWith('/');
  card.href = localFolder ? project.url + 'index.html' : project.url;
  card.target = '_blank';
  card.rel = 'noopener';
  const art = document.createElement('div');
  art.className = 'art ' + project.tone;
  art.setAttribute('aria-hidden', 'true');
  if (project.image) {
    const image = document.createElement('img');
    image.src = project.image;
    image.alt = '';
    image.loading = 'lazy';
    art.append(image);
  } else {
    const mark = document.createElement('span');
    mark.textContent = project.mark || '✦';
    art.append(mark);
  }
  const content = document.createElement('div');
  content.className = 'card-copy';
  const tag = document.createElement('span');
  tag.className = 'category';
  tag.textContent = project.category;
  const title = document.createElement('h3');
  title.textContent = project.title;
  const description = document.createElement('p');
  description.textContent = project.description;
  const launch = document.createElement('span');
  launch.className = 'launch';
  launch.textContent = '열어 보기 ↗';
  content.append(tag, title, description, launch);
  card.append(art, content);
  return card;
}

function render() {
  const term = search.value.trim().toLocaleLowerCase('ko');
  const narrowing = term.length > 0 || category !== '전체';
  featuredSection.hidden = narrowing || featuredEntries.length === 0;
  document.getElementById('collection').textContent = narrowing ? '찾은 딴짓' : '더 많은 딴짓';
  const collection = narrowing ? entries : entries.filter(project => !featuredIds.has(project.id));
  const visible = collection.filter(project =>
    (category === '전체' || project.category === category) &&
    (project.title + ' ' + project.description).toLocaleLowerCase('ko').includes(term)
  );
  cards.replaceChildren(...visible.map(renderCard));
  document.getElementById('results').textContent = visible.length + '개 / 전체 ' + entries.length + '개';
  document.getElementById('empty').hidden = visible.length > 0;
}

for (const name of ['전체', ...new Set(entries.map(project => project.category))]) {
  const button = document.createElement('button');
  button.type = 'button';
  button.textContent = name;
  button.setAttribute('aria-pressed', String(category === name));
  button.addEventListener('click', () => {
    category = name;
    for (const item of filters.children) item.setAttribute('aria-pressed', String(item === button));
    render();
  });
  filters.append(button);
}
document.getElementById('featured-cards').replaceChildren(...featuredEntries.map(renderCard));
search.addEventListener('input', render);
render();
