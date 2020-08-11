
const express = require('express');
const exphbs  = require('express-handlebars');
const app = express();
const path = require('path');
//adding requests for API connections
const request = require('request');
const bodyParser = require('body-parser')

//using body parser
app.use(bodyParser.urlencoded({extended: false}));

//dynamic website using handlebars
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');


//creating Function for later use

function call_api (finishedAPI, ticker) {
//api key pk_1bd00fbd2719449eb05a51c7da5f3dda
let url = 'https://cloud.iexapis.com/stable/stock/'+ ticker +'/quote?token=pk_1bd00fbd2719449eb05a51c7da5f3dda'

//setting up request to Stock API
request(url, {json: true}, (err, res, body) => {
	if (err) { //return error to console for troubleshooting
		return console.log(err);
	};

	if (res.statusCode === 200) { //returning body to console on a 200 return
		console.log(body); //sending body to console
		finishedAPI(body);
		};
	});
};

//home page route GET
app.get('/', function (req, res) {
	
/*
	//this will not work because  the system moves quicker then the call_api function turns data from the API

	// call_api function and assigning it to api var returns undefined
	let api = call_api();
	//console.log api returns undefined
	console.log(api);
    res.render('home', {
    	stuff: api // passing varibale with handle bars to front end
    });
    
    */

    call_api((doneAPI) => {
    	res.render('home', {
    		stock: doneAPI // will render [object object] at this point 
    	});
    }, 'tsla');

});

//home Search box. POST route
// decoding call back with body-parse and passing it into var post_stuff
app.post('/', (req, res) => {
	let post_stuff = req.body.stock_ticker;
	call_api((doneAPI) => {
		res.render('home', {
			stock: doneAPI,
			// post_stuff : post_stuff //to test passthrough of var to search

		});
	}, post_stuff);
});

//about page route
app.get('/about.html', (req, res) => {
	res.render('about');
});

//static routs and html files under public folder
app.use(express.static(path.join(__dirname, 'public')));


//listening on port to run engine
const listener = app.listen(process.env.PORT || 3001, () => {
  console.log('Your app is listening on port ' + listener.address().port)
});