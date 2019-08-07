const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');

const app = express();
/**********/
/** USES **/
/**********/
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

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


/***************************/
/** GET & POST management **/
/***************************/
app.get('/', (req, res) => {
	checkSessionTodo(req);

	res.status(200).setHeader('Content-Type', 'text/html');
	res.render('index.ejs', {todoList: req.session.todoList});
})
.get('/addTodo', (req, res) => {
	res.status(200).setHeader('Content-Type', 'text/html');
	res.send('Ajouter une todo');
})
.post('/addTodo', (req, res) => {
	checkSessionTodo(req);
	if ((typeof (req.body.todo_input) == 'string')
		&& (req.body.todo_input !== '')){
		req.session.todoList.push(req.body.todo_input.substring(0,80));
	}

	res.status(200).redirect('/');

})
.get('/delTodo/:id', (req, res) => {
	checkSessionTodo(req);
	res.status(200).setHeader('Content-Type', 'text/html');

	//check if id is a correct value
	if ((Number.isInteger(parseInt(req.params.id)))
		&& (req.params.id < req.session.todoList.length)) {
		req.session.todoList.splice(req.params.id, 1);
	}

	res.redirect('/');
})
.use((req, res) => {
	res.status(301).redirect('/');
})

app.listen(8080);



/**************/
/* FUNCTIONS **/
/**************/
function checkSessionTodo(req) {
	if ((typeof (req.session.todoList) === 'undefined')
	|| (!(req.session.todoList instanceof Array))) {
		req.session.todoList = [];
	}
}
