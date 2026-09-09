const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
return users.some(user => user.username === username);
}

const authenticatedUser = (username, password) => {
    return users.some(user => user.username === username && user.password === password);
}

//only registered users can login
regd_users.post("/login", (req, res) => {

    const username = req.body.username;
    const password = req.body.password;

    if (!isValid(username)) {
        return res.status(401).json({
            message: "Invalid username"
        });
    }

    if (!authenticatedUser(username, password)) {
        return res.status(401).json({
            message: "Invalid password"
        });
    }

    const accessToken = jwt.sign(
        { username: username },
        "access",
        { expiresIn: 60 * 60 }
    );

    req.session.authorization = {
        accessToken: accessToken,
        username: username
    };

    return res.status(200).json({
        message: "Login successful",
        accessToken: accessToken
    });
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {

    const isbn = req.params.isbn;
    const review = req.query.review;
    const username = req.session.authorization.username;

    if (!books[isbn]) {
        return res.status(404).json({
            message: "Book not found"
        });
    }

    books[isbn].reviews[username] = review;

    return res.status(200).json({
        message: "Review added successfully"
    });
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {

    const isbn = req.params.isbn;
    const username = req.session.authorization.username;

    if (!books[isbn]) {
        return res.status(404).json({
            message: "Book not found"
        });
    }

    if (books[isbn].reviews[username]) {
        delete books[isbn].reviews[username];

        return res.status(200).json({
            message: "Review deleted successfully"
        });
    }

    return res.status(404).json({
        message: "Review not found"
    });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
