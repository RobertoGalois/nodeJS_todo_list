const express = require('express');

const app = express();

app.get('/', function (req, res) {
	res.status(200).setHeader('Content-Type', 'text/html');
	res.render('index.ejs');
});

app.listen(8080);

