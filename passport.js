//import {Strategy} from 'passport-local';
import User from './models/userModel';
import {Strategy as JwtStrategy, ExtractJwt} from 'passport-jwt';



module.exports = (passport) => {
    var options = {
        secretOrKey: "secretMeowKey",
        jwtFromRequest: ExtractJwt.fromAuthHeader()
    };
    passport.use(new JwtStrategy(options, function(jwt_payload, done) {
        User.findOne({id: jwt_payload.id}, function(err, user) {
            // this section could probably use a password check.
            if (err) {
                return done(err, false);
            }
            if (user) {
                done(null, user);
            } else {
                done(null, false);
            }
        });
    }));
};

// module.exports = (passport) => {

//     // passport session setup
    
//     // required for persistent login sessions
//     // passport needs ability to serialize and unserialize users out of session

//     // used to serialize the user for the session
//     passport.serializeUser((user, done) => {
//         done(null, user.id);
//     });

//     // used to deserialize the user
//     passport.deserializeUser((id, done) => {
//         User.findById(id, function(err, user) {
//             done(err, user);
//         }); 
//     });

//     // Local Signup
//     passport.use('local-signup', new Strategy({
//         usernameField: 'email',
//         passwordField: 'password',
//         passReqToCallback: true
//     }, (req, email, password, done) => {

//         // asynch 
//         // User.findOne won't fire unless data is sent back
//         process.nextTick(() => {

//             // find a user whose email is the same as the forms email
//             // we are checking to see if the user trying to login already exists
//             User.findOne({'local.email': email}, (err, user) => {
//                 if (err) {
//                     return done(err);
//                 }

//                 // check to see if theres already a user with that email
//                 if (user) {
//                     return done(null, false);
//                 } else {

//                     // if there is no user with that email
//                     // create the user
//                     var newUser = new User();

//                     // set the user's local credentials
//                     newUser.local.email = email;
//                     newUser.local.password = newUser.generateHash(password);

//                     // save the user
//                     newUser.save((err) => {
//                         if (err) {
//                             throw err;
//                         } 

//                         return done(null, newUser);
//                     });
//                 }
//             });
//         });
//     }));

//     // Local Signin
//     passport.use('local-login', new Strategy({
//         // by default, local strategy uses username and password, we will override with email
//         usernameField: 'email',
//         passwordField: 'password',
//         passReqToCallback: true         // allows us to pass back the entire request to the callback
//     }, (req, email, password, done) => {

//         // find a user whose email is the same as the forms email
//         // we are checking to see if the user trying to login already exists
//         User.findOne({ 'local.email': email }, (err, user) => {
            
//             if (err) {
//                 return done(err);
//             }

//             if (!user) {
//                 return done(null, false);
//             }

//             // if user is found but password is wrong
//             if (!user.validPassword(password)) {
//                 return done(null, false);
//             }

//             // all is well, return successful user
//             return done(null, user);
//         });
        
//     }));


// };