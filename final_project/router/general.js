const axios = require('axios');
const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {

    const username = req.body.username;
    const password = req.body.password;

    if (!username || !password) {
        return res.status(400).json({
            message: "Username and password are required"
        });
    }

    if (users.find(user => user.username === username)) {
        return res.status(409).json({
            message: "Username already exists"
        });
    }

    users.push({
        username: username,
        password: password
    });

    return res.status(201).json({
        message: "User registered successfully"
    });
});

// Get the book list available in the shop
// Get the book list available in the shop using Async/Await and Axios
public_users.get('/',  function (req, res) {
    res.send(JSON.stringify(books, null, 4));
});
  // Task 10: Get the book list using Async/Await with Axios
public_users.get('/async', async function (req, res) {
    try {
        const response = await axios.get('http://localhost:5000/');
        res.json(response.data);
    } catch (error) {
        res.status(500).json({
            message: "Error fetching books"
        });
    }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {

    const isbn = req.params.isbn;

    res.json(books[isbn]);

});

// Task 11: Get book details by ISBN using Async/Await with Axios
public_users.get('/async/isbn/:isbn', async function (req, res) {
    try {
        const isbn = req.params.isbn;
        const response = await axios.get('http://localhost:5000/isbn/' + isbn);
        res.json(response.data);
    } catch (error) {
        res.status(500).json({
            message: "Error fetching book by ISBN"
        });
    }
});
// Get book details based on author
public_users.get('/author/:author', function (req, res) {

    const author = req.params.author;

    const booksByAuthor = {};

    for (let key in books) {
        if (books[key].author === author) {
            booksByAuthor[key] = books[key];
        }
    }

    res.json(booksByAuthor);

});

// Task 12: Get books by author using Async/Await with Axios
public_users.get('/async/author/:author', async function (req, res) {
    try {
        const author = req.params.author;
        const response = await axios.get('http://localhost:5000/author/' + author);
        res.json(response.data);
    } catch (error) {
        res.status(500).json({
            message: "Error fetching books by author"
        });
    }
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {

    const title = req.params.title;

    const booksByTitle = {};

    for (let key in books) {
        if (books[key].title === title) {
            booksByTitle[key] = books[key];
        }
    }

    res.json(booksByTitle);

});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {

    const isbn = req.params.isbn;

    res.json(books[isbn].reviews);

});
module.exports.general = public_users;
