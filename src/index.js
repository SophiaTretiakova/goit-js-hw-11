import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { fetchImages } from './js/api';
import { refs } from './js/elements';
import { renderCards } from './js/renderMarkup';

let lightbox = new SimpleLightbox('.gallery a');

const API_KEY = '38365619-1621c1d79dbc4654c84d21e00';
const BASE_URL = 'https://pixabay.com/api/';
const SEARCH_TYPE = 'photo';
const ORIENTATION = 'horizontal';
const SAFE_SEARCH = true;
const DEFAULT_LIMIT = 40;
let page = 1;

window.addEventListener('load', () => {
  refs.loadBtnEl.classList.add('hidden');
});

refs.searchFormEl.addEventListener('submit', handleSearchSubmit);

function handleSearchSubmit(event) {
  refs.loaderEl.classList.remove('hidden');
  event.preventDefault();
  page = 1;
  refs.galleryEl.innerHTML = '';
  refs.searchInputEl.value = refs.searchInputEl.value.trim();
  if (!refs.searchInputEl.value.trim()) {
    Notiflix.Notify.failure(
      'Sorry, your search query is empty. Please enter what you want to search.'
    );
    refs.galleryEl.innerHTML = '';
    refs.loadBtnEl.classList.add('hidden');
    return;
  }
  const searchInput = refs.searchInputEl.value;
  const url = generatePixabayURL(searchInput);
  fetchImages(url).then(({ data, totalHits }) => {
    console.log(page < totalHits / DEFAULT_LIMIT);
    if (Math.ceil(page < totalHits / DEFAULT_LIMIT)) {
      refs.loadBtnEl.classList.remove('hidden');
    }
    renderCards(data);
    page = 2;
    lightbox = lightbox.refresh();
    refs.loadBtnEl.addEventListener('click', handleLoadMoreClick);
    refs.loaderEl.classList.add('hidden');
  });
}

function handleLoadMoreClick() {
  const searchInput = refs.searchInputEl.value;
  const url = generatePixabayURL(searchInput);
  fetchImages(url).then(({ data, totalHits }) => {
    if (Math.ceil(page > totalHits / DEFAULT_LIMIT)) {
      refs.loaderEl.classList.add('hidden');
      refs.loadBtnEl.classList.add('hidden');
    }
    renderCards(data);
    page += 1;
    const { height: cardHeight } = document
      .querySelector('.gallery')
      .firstElementChild.getBoundingClientRect();
    lightbox = lightbox.refresh();
    window.scrollBy({
      top: cardHeight * 2,
      behavior: 'smooth',
    });
  });
}

function generatePixabayURL(query) {
  const params = new URLSearchParams({
    key: API_KEY,
    q: query,
    image_type: SEARCH_TYPE,
    orientation: ORIENTATION,
    safesearch: SAFE_SEARCH,
    per_page: DEFAULT_LIMIT,
    page,
  });
  console.log(`${BASE_URL}?${params}`);
  return `${BASE_URL}?${params}`;
}
