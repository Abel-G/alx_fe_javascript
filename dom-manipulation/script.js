const quoteDisplay = document.getElementById('quoteDisplay');
const newQuoteButton = document.getElementById('newQuote');
const newQuoteText = document.getElementById('newQuoteText');
const newQuoteCategory = document.getElementById('newQuoteCategory');

let quotes = [
  { text: 'The only way to do great work is to love what you do.', category: 'Work' },

];

function showRandomQuote() {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const randomQuote = quotes[randomIndex];
  quoteDisplay.innerHTML = `"${randomQuote.text}" - ${randomQuote.category}`;
}
function createAddQuoteForm() {
  const quoteText = document.createElement('input');
  quoteText.type = 'text';
  quoteText.placeholder = 'Enter a new quote';
  quoteText.id = 'newQuoteText';

  const quoteCategory = document.createElement('input');
  quoteCategory.type = 'text';
  quoteCategory.placeholder = 'Enter quote category';
  quoteCategory.id = 'newQuoteCategory';

  const addQuoteButton = document.createElement('button');
  addQuoteButton.textContent = 'Add Quote';
  addQuoteButton.onclick = addQuote;

  quoteFormContainer.appendChild(quoteText);
  quoteFormContainer.appendChild(quoteCategory);
  quoteFormContainer.appendChild(addQuoteButton);

  document.body.appendChild(quoteFormContainer);
}
function addQuote() {
  const newQuote = {
    text: newQuoteText.value,
    category: newQuoteCategory.value
  };
  quotes.push(newQuote);
  showRandomQuote(); 
  newQuoteText.value = '';
  newQuoteCategory.value = '';
}
const STORAGE_KEY = 'quotes';

function loadQuotesFromStorage() {
  const storedQuotes = localStorage.getItem(STORAGE_KEY);
  if (storedQuotes) {
    quotes = JSON.parse(storedQuotes);
  }
}

function saveQuotesToStorage() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(quotes));
}

function exportQuotes() {
  const data = new Blob([JSON.stringify(quotes)], { type: 'application/json' });
  const url = URL.createObjectURL(data);
  const link = document.createElement('a');
  link.href = url;
  link.download   
 = 'quotes.json';
  link.click();
  URL.revokeObjectURL(url);
}
function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function(event) {
    const importedQuotes = JSON.parse(event.target.result);
    quotes.push(...importedQuotes);
    saveQuotes();
    alert('Quotes imported successfully!');
  };
  fileReader.readAsText(event.target.files[0]);
}
function loadCategoriesFromStorage() {
  const storedCategories = localStorage.getItem(STORAGE_KEY_CATEGORIES);
  if (storedCategories) {
    categories = JSON.parse(storedCategories);
  }
}

function saveCategoriesToStorage() {
  localStorage.setItem(STORAGE_KEY_CATEGORIES, JSON.stringify(categories));
}

function loadFilterFromStorage() {
  const storedFilter = localStorage.getItem(STORAGE_KEY_FILTER);
  if (storedFilter) {
    categoryFilter.value = storedFilter;
  }
}

function saveFilterToStorage(filter) {
  localStorage.setItem(STORAGE_KEY_FILTER, filter);
}

function filterQuotes() {
  const selectedCategory = categoryFilter.value;
  saveFilterToStorage(selectedCategory);

  if (selectedCategory === 'all') {
    displayQuotes(quotes);
  } else {
    const filteredQuotes = quotes.filter(quote => quote.category === selectedCategory);
    displayQuotes(filteredQuotes);
  }
}

function displayQuotes(quotesToDisplay) {
  quoteDisplay.innerHTML = '';
  quotesToDisplay.forEach(quote => {
    const quoteElement = document.createElement('p');
    quoteElement.textContent = `"${quote.text}" - ${quote.category}`;
    quoteDisplay.appendChild(quoteElement);
  });
}

function updateCategories() {
  categories = [...new Set(quotes.map(quote => quote.category))];
  saveCategoriesToStorage();

  // Populate the category filter dropdown
  categoryFilter.innerHTML = '';
  categoryFilter.appendChild(new Option('All Categories', 'all'));
  categories.forEach(category => {
    categoryFilter.appendChild(new Option(category, category));
  });
}
function populateCategories() {
  // Clear the existing options in the dropdown
  categoryFilter.innerHTML = '';
  const allCategoriesOption = document.createElement('option');
  allCategoriesOption.value = 'all';
  allCategoriesOption.text = 'All Categories';
  categoryFilter.appendChild(allCategoriesOption);
  categories.forEach(category => {
    const categoryOption = document.createElement('option');
    categoryOption.value = category;
    categoryOption.text = category;
    categoryFilter.appendChild(categoryOption);   

  });
}
newQuoteButton.addEventListener('click', showRandomQuote);
