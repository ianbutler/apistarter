import express from 'express';
import User from '../models/userModel';
import bodyParser from 'body-parser'; 
import jwt from 'jwt-simple';

const authRouter = express.Router();

let routes = (passport) => {
    
    authRouter.use(function(req, res, next) {
        res.header("Access-Control-Allow-Origin", "*"); // need to control what site can grab this info
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        next();
    });

    // authRouter.use('/users/:userId', (req, res, next) => {
    //     User.findById(req.params.userId, (err, user) => {
    //         if (err) {
    //             res.status(500).send(err);
    //         } else if (user) {
    //             req.user = user;
    //             next();
    //         } else {
    //             res.status(404).send('no user found');
    //         }
    //     });
    // });
    
    
    // authRouter.post('/signup', passport.authenticate('local-signup'), (req, res) => {
    //     res.json(req.user);
    // });
    
    // new version
    authRouter.post('/signup', (req, res) => {
        if (!req.body.email || !req.body.password) {
            res.json({
                success: false,
                message: 'Please pass email and password.'
            });
        } else {
            var newUser = new User({
                email: req.body.email,
                password: req.body.password
            });
            
            newUser.save(function(err) {
                if (err) {
                    res.json({
                        success: false,
                        message: 'Email already exists'
                    });
                } else {
                    res.json({
                        success: true,
                        message: 'Successful created user'
                    });
                }
            })
        }
    });

    authRouter.post('/authenticate', function(req, res) {
        User.findOne({
            email: req.body.email
        }, (err, user) => {
            if (err) {
                console.log("error", err);
                return;
            } 

            if (!user) {
                return res.status(403).send({
                    success: false,
                    message: "Authentication failed.  User not found."
                });
            } else {
                user.comparePassword(req.body.password, (err, isMatch) => {
                    if (isMatch && !err) {
                        var token = jwt.encode(user, "secretMeowKey");
                        res.json({
                            success: true,
                            token: 'JWT ' + token
                        });
                    } else {
                        res.json({
                            success: false,
                            message: 'Authentication failed.  Wrong password.'
                        });
                    }
                });
            }
        })
    });

    authRouter.get('/memberinfo', 
        passport.authenticate('jwt', {session: false}), 
        function(req, res){
            var token = getToken(req.headers);
            
            console.log('token', token);

            if (token) {
                var decoded = jwt.decode(token, "secretMeowKey");
                User.findOne({
                    email: decoded.email
                }, (err, user) => {
                    if (err) {
                        console.log("err", err);
                        return;
                    }

                    if (!user) {
                        return res.status(403).send({
                            success: false,
                            message: 'Authentication failed.  Use not found.'
                        });
                    } else {
                        res.json({success: true, message: 'Welcome in the member area ' + user.email + '!'});
                    }
                });
            } else {
                return res.status(403).send({
                    success: false,
                    message: 'No token provided.'
                });
            }
    });

    function getToken(headers) {
        console.log("getToken()())()()()(()()())");
        if (headers && headers.authorization) {
            var parted = headers.authorization.split(' ');
            if (parted.length === 2) {
                return parted[1];
            } else {
                return null;
            }
        } else {
            return null;
        }
    }

    // authRouter.route('/users')
    //     .get((req, res) => {
    //         let query = {};
            
    //         User.find(query, (err, users) => {
    //             if (err) {
    //                 res.status(500).send(err);
    //             } else {
    //                 let returnUsers = [];
    //                 users.forEach( (element) => {
    //                     let newUser = element.toJSON();
    //                     newUser.links = {};
    //                     newUser.links.self = 'http://' + req.headers.host + '/api/auth/users/' + newUser._id;
    //                     returnUsers.push(newUser);
    //                 });
    //                 res.json(returnUsers);
    //             }
    //         });
    //     });

    // authRouter.route('/users/:userId')
    //     .get( (req, res) => {
    //         var returnBook = req.user.toJSON();
    //         res.json(returnBook);
    //     });    

    // authRouter.post('/login', passport.authenticate('local-login'), (req, res) => {
    //     res.json(req.user);
    // });

    return authRouter;
};

module. exports = routes;