import Notiflix from 'notiflix';
import axios from 'axios';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const API_KEY = '38365619-1621c1d79dbc4654c84d21e00';
const BASE_URL = 'https://pixabay.com/api/';
const SEARCH_TYPE = 'photo';
const ORIENTATION = 'horizontal';
const SAFE_SEARCH = true;
const DEFAULT_LIMIT = 40;

const refs = {
  searchFormEl: document.querySelector('.search-form'),
  searchInputEl: document.querySelector('.search-input'),
  submitBtnEl: document.querySelector('.submit-btn'),
  galleryEl: document.querySelector('.gallery'),
  loadBtnEl: document.querySelector('.load-more'),
};

let lightbox = new SimpleLightbox('.gallery a');

let page = 1;
let limit = DEFAULT_LIMIT;

window.addEventListener('load', () => {
  refs.loadBtnEl.classList.add('hidden');
});

async function fetchImages(url) {
  try {
    const response = await axios.get(url);
    const data = response.data;
    const matches = data.hits;

    if (!matches.length) {
      throw new Error(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    }

    return matches.map(image => ({
      webformatURL: image.webformatURL,
      largeImageURL: image.largeImageURL,
      tags: image.tags,
      likes: image.likes,
      views: image.views,
      comments: image.comments,
      downloads: image.downloads,
    }));
  } catch (error) {
    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
    return;
  }
}

refs.searchFormEl.addEventListener('submit', handleSearchSubmit);

function handleSearchSubmit(event) {
  event.preventDefault();
  page = 1;
  refs.galleryEl.innerHTML = '';
  refs.searchInputEl.value = refs.searchInputEl.value.trim();
  if (!refs.searchInputEl.value) {
    Notiflix.Notify.failure(
      'Sorry, your search query is empty. Please enter what you want to search.'
    );
    refs.loadBtnEl.classList.add('hidden');
    return;
  }
  const searchInput = refs.searchInputEl.value;
  const url = generatePixabayURL(searchInput);
  fetchImages(url).then(data => {
    renderCards(data);
    page = 2;
    lightbox = lightbox.refresh();
    refs.loadBtnEl.addEventListener('click', handleLoadMoreClick);
  });
  refs.loadBtnEl.classList.remove('hidden');
}

function generatePixabayURL(query) {
  const params = new URLSearchParams({
    key: API_KEY,
    q: query,
    image_type: SEARCH_TYPE,
    orientation: ORIENTATION,
    safesearch: SAFE_SEARCH,
    per_page: limit,
    page,
  });
  console.log(`${BASE_URL}?${params}`);
  return `${BASE_URL}?${params}`;
}

function handleLoadMoreClick() {
  const searchInput = refs.searchInputEl.value;
  const url = generatePixabayURL(searchInput);
  fetchImages(url).then(data => {
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

function renderCards(data) {
  const cards = data
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => {
        return `
    <a href="${largeImageURL}">
      <div class="photo-card">
        <div class="img-back">
          <img src="${webformatURL}" alt="${tags}" loading="lazy" class="img"/>
        </div>
        <div class="info">
          <p class="info-item">
            <b>Likes: </b>${likes}
          </p>
          <p class="info-item">
            <b>Views: </b>${views}
          </p>
          <p class="info-item">
            <b>Comments: </b>${comments}
          </p>
          <p class="info-item">
            <b>Downloads: </b>${downloads}
          </p>
        </div>
      </div>
    </a>
  `;
      }
    )
    .join('');
  refs.galleryEl.insertAdjacentHTML('beforeend', cards);
  refs.searchInputEl.value = '';
}
