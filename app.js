const express = require('express');
const keys = require('./config/keys');
const stripe = require('stripe')(keys.stripeSecretKey);
const bodyParser = require('body-parser');
const exphbs =require('express-handlebars');

//create the app
const app = express();

//Handlebars Middleware
app.engine('handlebars', exphbs({defaultLayout:'main'}));
app.set('view engine','handlebars');

//Body parser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

//Set static folder
app.use(express.static(`${__dirname}/public`));

//Index Route
app.get('/',(req, res)=>{
    res.render('index',{
        stripePublishableKey: keys.stripePublishableKey
    });
});


//Charge Route
app.post('/charge',(req, res)=>{
    const amount= 2500;

   stripe.customers.create({
       email: req.body.stripeEmail,
       source: req.body.stripeToken
   })
   .then(customer =>stripe.charges.create({
        amount,
        description: 'Web Development Ebook',
        currency:'gbp',
        customer:customer.id
   }))
   .then(charge => res.render('success'));
});

//Start a port for heroku to deploy or5 5000 if local
const port = process.env.PORT || 5000;

//let the app shose the port that returns a callback function
app.listen(port, ()=> {
    console.log(`Server started on port ${port}`);
});