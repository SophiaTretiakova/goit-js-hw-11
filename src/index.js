import Notiflix from 'notiflix';
import axios from 'axios';
const API_KEY = '38365619-1621c1d79dbc4654c84d21e00';
axios.defaults.headers.common['x-api-key'] = API_KEY;

async function fetchCats() {
  const paramsObj = {
    key: API_KEY,
    q: 'cat',
    image_type: 'photo',
    orientation: 'horizontal',
    safe_search: true,
  };

  const params = new URLSearchParams(paramsObj);
  const url = 'https://pixabay.com/api/?' + params.toString();
  const response = axios.get(url, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json',
    },
  });
  console.log(response);
}

fetchCats()
  .then(data => {
    return data.hits;
  })
  .then(cat => {
    console.log(cat);
  });
