const express = require('express');
const session = require('express-session');

const app = express();

function checkSessionTodo(req) {
	if ((typeof (req.session.todoList) === 'undefined')
	|| (!(req.session.todoList instanceof Array))) {
		req.session.todoList = [];
	}
}

app.set('trust proxy', 1);

app.use(session({
	secret: 'bordel de merde',
	resave: false,
	saveUninitialized: true,
	cookie: { 
		path: '/',
		httpOnly: 'true',
		saveUninitialized: true,
		sameSite: true,
		secure: false,
		maxAge: 15552000000		//6 months
	}
}));

app.get('/', (req, res) => {
	//if first connection
	checkSessionTodo(req);

	//test
	req.session.todoList = ['manger', 'dormir', 'faire caca'];

	res.status(200).setHeader('Content-Type', 'text/html');
	res.render('index.ejs', {todoList: req.session.todoList});
})
.get('/addTodo', (req, res) => {
	res.status(200).setHeader('Content-Type', 'text/html');
	res.send('Ajouter une todo');
})
.post('/addTodo', (req, res) => {
	//checkSessionTodo(req);
	res.send(req.session.todoList);

})
.get('/delTodo', (req, res) => {
	res.status(200).setHeader('Content-Type', 'text/html');
	res.send('supprimer une todo');

})
.use((req, res) => {
	res.status(301).redirect('/');
})

app.listen(8080);

