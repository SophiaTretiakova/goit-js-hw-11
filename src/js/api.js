import { refs } from './elements';
import Notiflix from 'notiflix';
import { renderCards } from './renderMarkup';
import axios from 'axios';

const API_KEY = '38365619-1621c1d79dbc4654c84d21e00';
const BASE_URL = 'https://pixabay.com/api/';
const SEARCH_TYPE = 'photo';
const ORIENTATION = 'horizontal';
const SAFE_SEARCH = true;
const DEFAULT_LIMIT = 40;
let page = 1;

async function fetchImages(url) {
  try {
    const response = await axios.get(url);
    const data = response.data;
    const matches = data.hits;

    if (!matches.length) {
      refs.galleryEl.innerHTML = '';
      refs.loadBtnEl.classList.add('hidden');
      throw new Error(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    }
    refs.loaderEl.classList.remove('hidden');
    return { data: matches, totalHits: data.totalHits };
  } catch (error) {
    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
    return;
  }
}

export { fetchImages };
