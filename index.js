import express from 'express';
import path from 'path';
import colors from 'colors';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import bookRouter from './routes/bookRoutes';

const db = mongoose.connect('mongodb://localhost/bookAPI');

const app = express();
const port = process.env.PORT || 6000; 

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

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
