import express from 'express';
import User from '../models/userModel';
import bodyParser from 'body-parser'; 

const authRouter = express.Router();

let routes = (passport) => {
    
    authRouter.use(function(req, res, next) {
        res.header("Access-Control-Allow-Origin", "*"); // need to control what site can grab this info
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        next();
    });

    authRouter.use('/users/:userId', (req, res, next) => {
        User.findById(req.params.userId, (err, user) => {
            if (err) {
                res.status(500).send(err);
            } else if (user) {
                req.user = user;
                next();
            } else {
                res.status(404).send('no user found');
            }
        });
    });
    
    
    authRouter.post('/signup', passport.authenticate('local-signup'), (req, res) => {
        res.json(req.user);
    });

    authRouter.route('/users')
        .get((req, res) => {
            let query = {};
            
            User.find(query, (err, users) => {
                if (err) {
                    res.status(500).send(err);
                } else {
                    let returnUsers = [];
                    users.forEach( (element) => {
                        let newUser = element.toJSON();
                        newUser.links = {};
                        newUser.links.self = 'http://' + req.headers.host + '/api/auth/users/' + newUser._id;
                        returnUsers.push(newUser);
                    });
                    res.json(returnUsers);
                }
            });
        });

    authRouter.route('/users/:userId')
        .get( (req, res) => {
            var returnBook = req.user.toJSON();
            res.json(returnBook);
        });    

    authRouter.post('/login', passport.authenticate('local-login'), (req, res) => {
        res.json(req.user);
    });

    return authRouter;
};

module. exports = routes;