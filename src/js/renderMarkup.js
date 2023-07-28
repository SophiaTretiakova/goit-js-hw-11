import { refs } from './elements';

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
}

export { renderCards };
