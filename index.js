const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

const PORT = process.env.PORT || 3000;

// Sample database (in-memory JSON storage)
let books = [];

// Create a New Book (C)
app.post('/books', (req, res) => {
    const { book_id, title, author, genre, year, copies } = req.body;
    
    if (!book_id || !title || !author || !genre || !year || !copies) {
        return res.status(400).json({ error: 'All book attributes are required.' });
    }
    
    if (books.some(book => book.book_id === book_id)) {
        return res.status(409).json({ error: 'Book with this ID already exists.' });
    }
    
    const newBook = { book_id, title, author, genre, year, copies };
    books.push(newBook);
    res.status(201).json(newBook);
});

// Retrieve All Books (R)
app.get('/books', (req, res) => {
    res.json(books);
});

// Retrieve a Specific Book by ID (R)
app.get('/books/:id', (req, res) => {
    const book = books.find(b => b.book_id === req.params.id);
    if (!book) {
        return res.status(404).json({ error: 'Book not found.' });
    }
    res.json(book);
});

// Update Book Information (U)
app.put('/books/:id', (req, res) => {
    const book = books.find(b => b.book_id === req.params.id);
    if (!book) {
        return res.status(404).json({ error: 'Book not found.' });
    }
    
    const { title, author, genre, year, copies } = req.body;
    if (title) book.title = title;
    if (author) book.author = author;
    if (genre) book.genre = genre;
    if (year) book.year = year;
    if (copies) book.copies = copies;
    
    res.json(book);
});

// Delete a Book (D)
app.delete('/books/:id', (req, res) => {
    const bookIndex = books.findIndex(b => b.book_id === req.params.id);
    if (bookIndex === -1) {
        return res.status(404).json({ error: 'Book not found.' });
    }
    
    books.splice(bookIndex, 1);
    res.json({ message: 'Book deleted successfully.' });
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});

