const express           = require('express');
const router            = express.Router();
const bcrypt            = require('bcryptjs');
const passport          = require('passport');
// User MOdel
const User = require('../models/User');
const { forwardAuthenticated } = require('../config/auth');

// Literally the catalog
// Dashboard Page
router.get('/travel', (req, res) => res.render('travel'));
router.get('/cosmetics', (req, res) => res.render('cosmetics'));
router.get('/wheels', (req, res) => res.render('wheels'));
router.get('/tools', (req, res) => res.render('travel'));
router.get('/glasses', (req, res) => res.render('glasses'));
router.get('/gadgets', (req, res) => res.render('gadgets'));
router.get('/clothes', (req, res) => res.render('clothes'));
router.get('/baby', (req, res) => res.render('baby'));
// Dashboard Page
router.get('/cart', (req, res) => res.render('cart'));


// Dashboard Page
router.get('/contact', (req, res) => res.render('contact'));

// Dashboard Page
router.get('/dashboard', (req, res) => res.render('dashboard'));

// Dashboard Page
router.get('/catalog', (req, res) => res.render('catalog'));

// About Page
router.get('/about', (req, res) => res.render('about'));

// Login Page
router.get('/login', (req, res) => res.render('login'));

// Register Page
router.get('/register', (req, res) => res.render('register'));

// Register Handle 
router.post('/register', (req, res) => {
    const {name, email, password, password2 } = req.body;

    // Validaiton
    let errors = [];

    // Check required fields
    if(!name || !email || !password || !password2) {
        errors.push({msg: 'Please fill in all fields'});
    }

    // Check Passwords Match
    if(password !== password2) {
        errors.push({msg: 'Invalid password!'});
    }

    // Check Passwords is at least 6 characters
    if(password.length < 6) {
        errors.push({msg: 'Password is too short'});
    }

    if(errors.length > 0) {
        res.render('register', {
            errors,
            name,
            email,
            password,
            password2
        });
    } else {
        // Validation Passed
        User.findOne({ email: email})
        .then(user => {
            if(user) {
                // User Exists
                errors.push({ msg: 'Email is already registered.'});
                res.render('register', {
                    errors,
                    name,
                    email,
                    password,
                    password2
                });
            } else {
                const newUser = new User({
                    name,
                    email,
                    password
                });

                // Hash Password
                bcrypt.genSalt(10, (err, salt) => 
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                        if(err) throw err;
                        // Set Pass to hashed 
                        newUser.password = hash;
                        // Save User
                        newUser.save()
                        .then(user => {
                            req.flash('success_msg', 'Registered! You can now log in');
                            res.redirect('/users/login');
                        })
                        .catch(err => console.log(err));
                }))
            }
        });

    }
});
// Login Handle
router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
       successRedirect: '/dashboard',
       failureRedirect: '/users/login',
       failureFlash: true 
    })(req, res, next);
});

// Logout Handle
router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success_message', 'You have logged out!');
    res.redirect('/users/login')
});

module.exports = router;