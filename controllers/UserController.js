const UserModel = require('../models/UserModel')
const Mode1Model = require('../models/Mode1Model')
const session = require('express-session')
const bcrypt = require("bcrypt");
const {hash} = require("bcrypt");
const http = require('http');
const url = require('url');

exports.register = async (req, res) => {
    const {username, email, password} = req.body
    const isexist_username = await UserModel.findOne({username})
    if (isexist_username) {
        let mess = 'Such a user already exists'
        return res.status(204).render('register.ejs', {message: mess})
    }
    const isexist_email = await UserModel.findOne({email})
    if (isexist_email) {
        let mess = 'Such a user already exists'
        return res.status(204).render('register.ejs', {message: mess})
    }
    if (!email || !username || password) {
        let mess = 'Fill in all the fields'
        return res.status(205).render('register.ejs', {message: mess})
    }
    bcrypt.hash(req.body.password, 10, function(err, hash) {
        const newUser = new UserModel({
            email: req.body.email,
            username: req.body.username,
            password:hash
        });
        newUser.save(function (err) {
            if (err) {
                console.log(err);
                res.send(err)
            } else {
                let mess = 'You have successfully registered'
                res.status(1).render('register.ejs', {message: mess})
            }
        });
    })
};

exports.login = async (req, res) => {
    try {
        const {email, password} = req.body
        const user = await UserModel.findOne({email})
        if (!user) {
            let mess = 'User not found'
            return res.status(206).render('login.ejs', {message: mess})
        }
        const validPassword = bcrypt.compareSync(password, user.password)
        if (!validPassword) {
            let mess = 'Password is incorrect'
            return res.status(207).render('login.ejs', {message: mess})
        }
        req.session.username = user.username;
        return res.status(1).redirect('/topics')
    } catch (e) {
        console.log(e)
        let mess = 'Error.Try again'
        return res.status(208).render('login.ejs', {message: mess})
    }
};

exports.logout = async (req, res) => {
    try {
        if (req.session.username) {
            req.session.destroy()
            let mess = 'Successfully'
            return res.render('login.ejs', {message: mess})
        } else {
            let mess = 'You are not authorized'
            return res.render('login.ejs', {message: mess})
        }
    } catch (e) {
        console.log(e)
        let mess = 'Error.Try again'
        return res.render('login.ejs', {message: mess})
    }
};


exports.getUsers = async (req, res) => {
    try {
        const users = await UserModel.find()
        res.status(200).json(users)
    } catch (e) {
        console.log(e)
    }
};

exports.getlistMode1 = async (req, res) => {
    try {
        const mode1 = await Mode1Model.find()
        res.status(200).json(mode1)
    } catch (e) {
        console.log(e)
    }
};