// Load the module dependencies
const User = require('mongoose').model('User');
const passport = require('passport');

//Create a new error handling controller method
const getErrorMessage = function(err) {
    
    //Define the error messge variable
    const message = '';

    //If an internal MongoDB error occurs get the error messages
    if (err.code) {
        switch (err.code) {
            //If a unique index error occurs set the message error
            case 11000:
            case 11001:
                message = 'Username already exists';
                break;
            //If a general error occurs set the message error
            default:
                message = 'Somthing went wrong';
        }
    } else {
        //Grab the first error message from a list of possible errors
        for (const errName in err.errors) {
            if (err.errors[errName].messages) message = err.errors[errName].message;
        }
    }

    //Return the message error
    return message;
};

//Create a new controller method that renders the signin page
exports.renderSignin = function(req, res, next) {
    //If user is not connected render the signin page, otherwise redirect the user back to the main application page
    if (!req.user) {
        //Use the 'response' object to render the signup page
        res.render('signin', {
            // Set the title page variable
            title: 'Sign-in Form',
            // Set the flash message variable
            messages: req.flash('error') || req.flash('info')
        });
    } else {
        return res.redirect('/');
    }
};

//Create a new controller method that renders the signup page
exports.renderSignup = function(req, res, next) {
    //If user is not connected render the signup
    if (!req.user) {
        //Use the 'response' object to render the signup page
        res.render('signup', {
            //Set the page title variable
            title: 'Sign-up Form',
            //Set the flash message variable
            messages: req.flash('error')
        });
    } else {
        return res.redirect('/');
    }
};

//Create a new controller method that creates new 'regular' users
exports.signup = function(req, res, next) {
    //If user is not connected, create and login a new user, otherwise redirect the user back to the main application page
    if (!req.user) {
        //create a new 'User' model instance
        const user = new User(req.body);
        const messasge = null;

        //Set the user provider property
        user.provider = 'local';

        //Try saving the new user document
        user.save((err) => {
            //If an error occurs, use the flash messages to report the error
            if (err) {
                //Use the error handling method to get the error messsage
                const message = getErrorMessage(err);

                //Set the flash messages
                req.flash('error', message);

                //Redirect the user back to the signup page
                return res.redirect('/signup');
            }

            //If the user was created successfully use the Passport 'login' method to login
            req.login(user, (err) => {
                //If a login error occurs move to the next middleware
                if (err) return next(err);

                //Redirect the user back to the main application page
                return res.redirect('/');
            });
        });
    } else {
        return res.redirect('/');
    }
};

//Create a new controller method for signing out
exports.signout = function(req, res) {

    //Use the Passport 'logout' method to logout
    req.logout();

    //Redirect the user back to the main application page
    res.redirect('/');
};
