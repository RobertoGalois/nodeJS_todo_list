const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const entities = require('html-entities').XmlEntities; 
const fs = require('fs');

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


/**************************/
/**** ROUTE management ****/
/**************************/

/*****/
/* / */
/*****/
app.get('/', (req, res) => {
	checkSessionTodo(req);
	res.status(200).setHeader('Content-Type', 'text/html; charset=utf-8');
	res.render('index.ejs', { todoList : req.session.todoList });
})
/*****************/
/* /getTodoList  */
/*****************/
.post('/getTodoList', (req, res) => {
	checkSessionTodo(req);
	res.status(200).setHeader('Content-Type', 'application/json; charset=utf-8');
	res.send(JSON.stringify({ todoList : req.session.todoList }));
})
/*************/
/* /addTodo  */
/*************/
.post('/addTodo', (req, res) => {
	checkSessionTodo(req);
	if (checkInputTodo(req.body.todo_input)){
		req.session.todoList.push(entities.encode(req.body.todo_input.trim().substring(0,80)));
	}

	res.status(200).redirect('/');

})
/************/
/* /delTodo */
/************/
.post('/delTodo/', (req, res) => {
	checkSessionTodo(req);
	res.status(200).setHeader('Content-Type', 'text/html; charset=utf-8');

	let id = parseInt(req.body.id);
	if (checkId(id, req.session.todoList)) {
		req.session.todoList.splice(id, 1);
	}

	res.redirect('/');
})
/************/
/* /modTodo */
/************/
.post('/modTodo/', (req, res) => {
	checkSessionTodo(req);

	let id = parseInt(req.body.todoId);
	if (checkId(id, req.session.todoList)
		&& (checkInputTodo(req.body.todoValue))) {
			req.session.todoList[id] = entities.encode(req.body.todoValue.trim().substring(0, 80));
	}

	res.redirect('/');
})
.get('/imgs/list.png', (req, res) => {
	res.status(200).setHeader('Content-Type', 'image/png');
	res.send(fs.readFileSync('./views/imgs/list.png'));
})
/**************/
/* ELSE route */
/**************/
.use((req, res) => {
	res.status(301).redirect('/');
})

/***************/
/**** FINAL ****/
/***************/
app.listen(8080);


/*******************/
/**** FUNCTIONS ****/
/*******************/
function checkSessionTodo(req) {
	if ((typeof (req.session.todoList) === 'undefined')
	|| (!(req.session.todoList instanceof Array))) {
		req.session.todoList = [];
	}
}

function checkId(pId, pTodoList) {
	if ((Number.isInteger(pId))
		&& (pId < pTodoList.length)) {
		return (true);
	}

	return (false);
}

function checkInputTodo(pInput) {
	if ((typeof (pInput) === typeof ('pouet'))
		&& (pInput.trim() !== '')) {
		return (true);
	}

	return (false);
}
