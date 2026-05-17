const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const doExist = (username) => {
    let usernamearr = users.filter((user) => user.username === username);
    if (usernamearr.length > 0){
        return true;
    }
    else{
        return false;
    }
}

public_users.post("/register", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;
  if (username && password){
    if(!doExist(username)){
        users.push({"username": username, "password": password});
        return res.status(200).json({message: "User successfully registered. Now you can login"});
    }
    else{
        res.status(404).json({message: "User already exists"});
    }
  }
  return res.status(404).json({message: "Unable to register user"});
});

// Get the book list available in the shop
// public_users.get('/',function (req, res) {
//   //Write your code here
//   return res.status(200).send(JSON.stringify(books, null, 4));
// });
const getBooks = async () => {
    return books;
};

public_users.get('/', async function (req, res) {

    try {
        const bookList = await getBooks();
        return res.status(200).json(bookList);
    } catch (error) {
        return res.status(500).json({
            message: "Error fetching books"
        });
    }
});

// Get book details based on ISBN
// public_users.get('/isbn/:isbn',function (req, res) {
//   //Write your code here
//   const isbn = req.params.isbn;
//   return res.status(200).json(books[isbn]);
//  });

const getBookByISBN = async (isbn) => {
    if (books[isbn]) {
        return books[isbn];
    } else {
        throw new Error("Book not found");
    }
};
public_users.get("/isbn/:isbn", async (req, res) => {
    try{
    const isbn = req.params.isbn;
    const book = await getBookByISBN(isbn);
    return res.status(200).json(book);
    }
    catch(error){
        return res.status(400).json({message: error.message});
    }
})

  
// // Get book details based on author
// public_users.get('/author/:author',function (req, res) {
//   //Write your code here
//   const author = req.params.author;
//   const filteredbook = Object.keys(books)
//   .filter(key => books[key].author === author)
//   .map(key => books[key]);
//   return res.status(200).json(filteredbook);
// });

const getBooksByAuthor = async (author) => {

    const filteredBooks = Object.keys(books)
        .filter(key => books[key].author === author)
        .map(key => books[key]);

    if (filteredBooks.length > 0) {
        return filteredBooks;
    } else {
        throw new Error("No books found for this author");
    }
};

public_users.get('/author/:author', async function (req, res) {

    try {
        const author = req.params.author;
        const booksList = await getBooksByAuthor(author);
        return res.status(200).json(booksList);
    } catch (error) {
        return res.status(404).json({
            message: error.message
        });
    }
});

// Get all books based on title
// public_users.get('/title/:title',function (req, res) {
//   //Write your code here
//   const title = req.params.title;
//   const filteredbook = Object.keys(books)
//   .filter(key => books[key].title === title)
//   .map(key => books[key]);
//   return res.status(200).json(filteredbook);
// });
const getBooksByTitle = async (title) => {

    const filteredBooks = Object.keys(books)
        .filter(key => books[key].title === title)
        .map(key => books[key]);

    if (filteredBooks.length > 0) {
        return filteredBooks;
    } else {
        throw new Error("No books found with this title");
    }
};

public_users.get('/title/:title', async function (req, res) {
    try {
        const title = req.params.title;
        const booksList = await getBooksByTitle(title);
        return res.status(200).json(booksList);
    } catch (error) {
        return res.status(404).json({
            message: error.message
        });
    }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  const review = books[isbn].reviews;
  return res.status(200).json(review);
});

module.exports.general = public_users;