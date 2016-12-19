import Book from '../models/bookModel';
import express from 'express';
import bodyParser from 'body-parser';

const bookRouter = express.Router();

console.log("BOOK!!!!!", Book);

var routes = () => {
    bookRouter.route('/')
        .post((req, res) => {
            const book = new Book(req.body);       // creating a new book instance in mongo
            
            book.save();        // saving it in the database
            
            res.status(201).send(book);
        })
        .get(function(req, res) {
            var query = {}; 

            if (req.query.genre) {              // this allows you to decide what can be queried and what can't.
                query.genre = req.query.genre;
            }

            Book.find(query, (err, books) => {
                if (err) {
                    res.status(500).send(err);
                } else {
                    res.json(books);
                }
            });
        });

    bookRouter.route('/:bookId')
        .get((req, res) => {
            Book.findById(req.params.bookId, (err, book) => {
                if (err) {
                    res.status(500).send(err);
                } else {
                    res.json(book)
                }
            });
        });  

    return bookRouter;
};


module.exports = routes;