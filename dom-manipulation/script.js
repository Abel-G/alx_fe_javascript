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

newQuoteButton.addEventListener('click', showRandomQuote);
