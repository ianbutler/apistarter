import Book from '../models/bookModel';
import express from 'express';
import bodyParser from 'body-parser';

const bookRouter = express.Router();

console.log("BOOK!!!!!", Book);

var routes = () => {
    bookRouter.use('/:bookId', (req, res, next) => {
        Book.findById(req.params.bookId, (err, book) => {
            if (err) {
                res.status(500).send(err);
            } else if (book) {
                req.book = book;
                next();
            } else {
                res.status(404).send('no book found');
            }
        });
    });
    
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
                res.json(book)
            });
        })
        .put((req, res) => {            
            req.book.title = req.body.title;
            req.book.author = req.body.author;
            req.book.genre = req.body.genre;
            req.book.read = req.body.read;
            req.book.save((err) => {
                if (err) {
                    res.status(500).send(err);
                } else {
                    res.json(req.book);
                }
            });
        })
        .patch((req, res) => {
            if (req.body._id) {
                delete req.body._id;
            }
            for (let p in req.body) {
                req.book[p] = req.body[p];
            }
            req.book.save((err) => {
                if (err) {
                    res.status(500).send(err);
                } else {
                    res.json(req.book);
                }
            });
        })
        .delete((req, res) => {
            req.book.remove(function(err) {
                if (err) {
                    res.status(500).send(err);
                } else {
                    res.status(204).send('Removed');    // means removed
                }
            })
        });

    return bookRouter;
};


module.exports = routes;