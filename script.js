const listingCards = [...document.querySelectorAll('[data-listing]')];
const categoryButtons = [...document.querySelectorAll('[data-category]')].filter((button) => button.classList.contains('category'));
const searchForm = document.querySelector('[data-search-form]');
const locationInput = document.querySelector('[data-location-input]');
const guestSelect = document.querySelector('[data-guest-select]');
const resultCount = document.querySelector('[data-result-count]');
const emptyState = document.querySelector('[data-empty-state]');
const hostDialog = document.querySelector('[data-host-dialog]');

let selectedCategory = 'all';

function updateListings() {
  const searchTerm = locationInput.value.trim().toLowerCase();
  const minimumGuests = Number(guestSelect.value);
  let visibleCount = 0;

  listingCards.forEach((card) => {
    const matchesLocation = !searchTerm || card.dataset.location.includes(searchTerm);
    const matchesCategory = selectedCategory === 'all' || card.dataset.category === selectedCategory;
    const matchesGuests = Number(card.dataset.guests) >= minimumGuests;
    const isVisible = matchesLocation && matchesCategory && matchesGuests;

    card.hidden = !isVisible;
    if (isVisible) visibleCount += 1;
  });

  resultCount.textContent = `${visibleCount} ${visibleCount === 1 ? 'stay' : 'stays'}`;
  emptyState.hidden = visibleCount !== 0;
}

categoryButtons.forEach((button) => {
  button.addEventListener('click', () => {
    selectedCategory = button.dataset.category;
    categoryButtons.forEach((categoryButton) => categoryButton.classList.toggle('active', categoryButton === button));
    updateListings();
  });
});

searchForm.addEventListener('submit', (event) => {
  event.preventDefault();
  updateListings();
  document.querySelector('#stays').scrollIntoView({ behavior: 'smooth' });
});

guestSelect.addEventListener('change', updateListings);

listingCards.forEach((card) => {
  const saveButton = card.querySelector('[data-save-button]');
  saveButton.addEventListener('click', () => {
    const isSaved = saveButton.classList.toggle('saved');
    saveButton.textContent = isSaved ? '♥' : '♡';
    saveButton.setAttribute('aria-label', isSaved ? 'Remove saved stay' : 'Save stay');
  });
});

document.querySelector('[data-host-button]').addEventListener('click', () => hostDialog.showModal());
document.querySelectorAll('[data-dialog-close]').forEach((button) => button.addEventListener('click', () => hostDialog.close()));

updateListings();
