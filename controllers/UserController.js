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
        return res.send(mess)
    }
    const isexist_email = await UserModel.findOne({email})
    if (isexist_email) {
        let mess = 'Such a user already exists'
        return res.send(mess)
    }
    if (!email || !username || password) {
        let mess = 'Fill in all the fields'
        return res.send(mess)
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
            } else {
                return res.send(mess)
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
            return res.send(mess)
        }
        const validPassword = bcrypt.compareSync(password, user.password)
        if (!validPassword) {
            let mess = 'Password is incorrect'
            return res.send(mess)
        }
        req.session.username = user.username;
        return res.redirect('/topics')
    } catch (e) {
        console.log(e)
        let mess = 'Error.Try again'
        return res.send(mess)
    }
};

exports.logout = async (req, res) => {
    try {
        if (req.session.username) {
            req.session.destroy()
            let mess = 'Successfully'
            return res.send(mess)
        } else {
            let mess = 'You are not authorized'
            return res.send(mess)
        }
    } catch (e) {
        console.log(e)
        let mess = 'Error.Try again'
        return res.send(mess)
    }
};


exports.getUsers = async (req, res) => {
    try {
        const users = await UserModel.find()
        res.json(users)
    } catch (e) {
        console.log(e)
    }
};

exports.getlistMode1 = async (req, res) => {
    try {
        const mode1 = await Mode1Model.find()
        res.json(mode1)
    } catch (e) {
        console.log(e)
    }
};


// http.findUser((request, response) => {
//     console.log('server work');
//     if (request.method == 'GET') {
//         // GET -> получить обработать
//         let urlRequest = url.parse(request.url, true);
//         console.log(urlRequest.query.test); // ! GET Params
//         response.end(urlRequest.query.test);
//     }
// }).listen(3000);