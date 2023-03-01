const express = require('express');
const app = express();
const port = 3000;
const path = require('path');
const homepage = require('./controllers/homepage');



const sqlite3 = require('sqlite3');



// Init database to file
let db = new sqlite3.Database('database.sqlite', (err) => {
    if (err) {
        console.error(err.message)
    }
    console.log('Connected to the database.')
})

db.qa = function query(sql, values) {
    return new Promise((resolve, reject) => {
        db.all(sql, values, (err, rows) => {
            if (err) {
                console.error(err.message);
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });
}

db.q = function query(sql, values) {
    return new Promise((resolve, reject) => {
        db.get(sql, values, (err, row) => {
            if (err) {
                console.error(err.message);
                reject(err);
            } else {
                resolve(row);
            }
        });
    });
}
// Check if the database is empty
db.get("SELECT name FROM sqlite_master WHERE type='table' AND name='Articles'", async (err, row) => {
    if (err) {
        console.error(err.message)
    }
    // If the database is empty, create the table and insert some data
    if (row === undefined) {
        db.serialize(async () => {
            //init table
            await db.q('CREATE TABLE `Articles` (id INTEGER PRIMARY KEY AUTOINCREMENT, title VARCHAR(255), content VARCHAR(255), author VARCHAR(255), date DATE)');

            //insert data
            await db.q('INSERT INTO `Articles` (title, content, author, date) VALUES (?, ?, ?, ?)', ['Article 1', 'Content 1', 'Author 1', '2020-01-01']);
            await db.q('INSERT INTO `Articles`(title, content, author, date) VALUES (?, ?, ?, ?)', ['Article 2', 'Content 2', 'Author 2', '2020-01-02']);
            await db.q('INSERT INTO `Articles` (title, content, author, date) VALUES (?, ?, ?, ?)', ['Article 3', 'Content 3', 'Author 3', '2020-01-03']);
        })
    }
    });

app.use(function (req, res, next) {

    req.db = db

    next()
})

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    // Redirect to courses
    res.redirect('/homepage')
})

app.get('/homepage', homepage.index);
app.get('/homepage/:articleId', homepage.view);
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})

