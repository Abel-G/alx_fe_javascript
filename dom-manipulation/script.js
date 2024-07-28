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
async function fetchQuotesFromServer() {
  try {
    const response = await fetch('https://jsonplaceholder.typicode.com/posts');
    const data = await response.json();
    // Simulate conflict by modifying a random quote
    const randomIndex = Math.floor(Math.random() * data.length);
    data[randomIndex].text = "Conflicting quote from server";
    return data;
  } catch (error) {
    console.error('Error fetching quotes from server:', error);
  }
}

async function syncQuotesToServer() {
  const serverQuotes = await fetchQuotesFromServer();

  const localQuoteMap = quotes.reduce((map, quote) => {
    map[quote.id] = quote;
    return map;
  }, {});

  const serverQuoteMap = serverQuotes.reduce((map, quote) => {
    map[quote.id] = quote;
    return map;
  }, {});

  // Identify conflicts based on ID and update time
  const conflicts = [];
  for (const id in localQuoteMap) {
    if (serverQuoteMap[id] && localQuoteMap[id].updatedAt < serverQuoteMap[id].updatedAt) {
      conflicts.push({ local: localQuoteMap[id], server: serverQuoteMap[id] });
    }
  }

  if (conflicts.length > 0) {
    handleConflicts(conflicts); // Inform user and resolve conflicts
  } else {
    // No conflicts, update local data with server data
    quotes = serverQuotes;
    saveQuotesToStorage();
    updateCategories();
    displayQuotes(quotes);
    showNotification('Quotes synced successfully!');
  }
}

// No changes needed in handleConflicts and showNotification (already asynchronous)


newQuoteButton.addEventListener('click', showRandomQuote);
