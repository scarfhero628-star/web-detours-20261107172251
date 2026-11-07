const cards = document.getElementById('cards');
const search = document.getElementById('search');
const filters = document.getElementById('filters');
const entries = window.projects;
let category = '전체';

function renderCard(project) {
  const card = document.createElement('a');
  card.className = 'card';
  card.href = project.url;
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
  const visible = entries.filter(project =>
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
search.addEventListener('input', render);
render();
