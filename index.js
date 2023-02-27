const express = require('express');
const app = express();
const port = 3000;
const path = require('path');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.get('/', (req, res) => res.render('index', { message: 'Hello there!' }));

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`));

