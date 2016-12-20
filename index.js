import express from 'express';
import path from 'path';
import colors from 'colors';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import bookRouter from './routes/bookRoutes';
import authRouter from './routes/authRoutes';
import passport from 'passport';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import session from 'express-session';

require('./passport')(passport);    // pass passport into our passport config file

const app = express();
const db = mongoose.connect('mongodb://localhost/bookAPI');
const port = process.env.PORT || 6000; 

app.use(morgan('dev'));     // log every request to the console
app.use(cookieParser());    // read cookies (needed for auth)
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

// required for passport
app.use(session({secret: 'meowmixMeowmixPleaseDeliver'}));
app.use(passport.initialize());
app.use(passport.session());

app.use('/api/Auth', authRouter(passport));
app.use('/api/Books', bookRouter());

app.get('/', (req, res) => {
    res.send('meowmix');
});

app.listen(port, (err) => {
    if (err) {
        console.log(colors.red("ERROR!!!!", err));
    } else {
        console.log(colors.green('****** Running server on port ' + port + ' ******'));
    }
});
