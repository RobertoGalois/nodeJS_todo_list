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
		req.session.todoList.push(req.body.todo_input.trim().substring(0,80));
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
.get('/modTodo/:id', (req, res) => {
	checkSessionTodo(req);
	res.status(200).setHeader('Content-Type', 'text/html; charset=utf-8');

	let id = parseInt(req.params.id);
	if (checkId(id, req.session.todoList)) {
		res.render('modTodo.ejs', {todoList: req.session.todoList, todoId: id});
	} else {
		res.redirect('/');
	}
})
.post('/modTodo/', (req, res) => {
	checkSessionTodo(req);

	let id = parseInt(req.body.id);
	if (checkId(id, req.session.todoList)
		&& (checkInputTodo(req.body.todoValue))) {
			req.session.todoList[id] = req.body.todoValue.trim().substring(0, 80);
	}

	res.redirect('/');
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
	if ((typeof (pInput) === 'string')
		&& (pInput.trim() !== '')) {
		return (true);
	}

	return (false);
}
