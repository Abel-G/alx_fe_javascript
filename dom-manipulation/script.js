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

newQuoteButton.addEventListener('click', showRandomQuote);
