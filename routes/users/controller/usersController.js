const User = require('../model/User')
const jwt = require('jsonwebtoken')
const { createUser, hashPassword, comparePasswords } = require('./usersHelper')

module.exports = {
    login: async (req, res) => {
        try {
            // console.log(req.headers);
            // console.log(req.body);
            
            //check if user exists / get the user form the db
            let foundUser = await User.findOne({email: req.body.email})
            if (!foundUser) {
                 throw {
                    status: 404,
                    message: "User Not Found"
                }
            }          

            // check if password matches
            let checkedPassword = await comparePasswords(req.body.password, foundUser.password)
            if (!checkedPassword) {
                throw {
                    status: 401,
                    message: "Invalid Password"
                }
            }
            // console.log(foundUser)
            let payload = {
                id: foundUser._id,
                email: foundUser.email
            }

            let expiration = new Number
            if (req.body.isRemember) {
                expiration = 60*60*24*7
            } else {
                expiration = 60*15
            }
            let token = await jwt.sign(payload, process.env.SUPER_SECRET_KEY, {expiresIn: expiration})
            
            res.status(200).json({
                user: {
                    email: foundUser.email,
                    firstname: foundUser.firstname,
                    lastname: foundUser.lastname
                },
                message: "Successful Login!!",
                token: token
            })  
        } catch (error) {
            res.status(error.status).json(error.message)
        }
    },
    register: async (req, res) => {
        try {
            //if foundUser exists throw an error
            let foundUser = await User.findOne({email: req.body.email})
            if (foundUser) {
                throw {
                    status: 409,
                    message: "User Exists"
                }
            } 

            let newUser = await createUser(req.body)
            
            // hash password
            let hashedPassword = await hashPassword(newUser.password)
            // console.log(hashedPassword);

            //update newUser object with hashed password
            newUser.password = hashedPassword

            //saves newUser to DB
            let savedUser = await newUser.save()

            res.status(200).json({
                    email: savedUser.email,
                    firstname: savedUser.firstname,
                    lastname: savedUser.lastname,
                    message: "Successfully Registered"
                }) 
        } catch (error) {
            res.status(error.status).json(error.message)
        }
        
    },
    authtoken: async (req, res) => {
        console.log('!@-------req.decoded-------@!')
        console.log(req.decoded)
        
        let foundUser = await User.findById(req.decoded.id)

        // you can re-issue the token to reset the expiration,
        // this isn't less secure, it is a design decision that can be less secure
        //
        // let payload = {
        //     id: foundUser._id,
        //     email: foundUser.email
        // }
        // let token = await jwt.sign(payload, process.env.SUPER_SECRET_KEY, {expiresIn: 5*60})
        // res.status(200).json({
        //     email: foundUser.email,
        //     message: "Successful Token Login!!",
        //     token: token
        // })

        res.status(200).json({
            email: foundUser.email,
            firstname: foundUser.firstname,
            lastname: foundUser.lastname,
            message: "Successful Token Login!!"
        })


    },
    deleteUser: async (req, res) => {
        try {
            let foundUser = await User.findByIdAndDelete(req.decoded.id)
            // console.log(foundUser)
            res.send(true)
        } catch (error) {
            res.send(false)
        }
        
    }
    

}

// const login = (req, res) => {
//     return {
//         email: req.body.email
//     }
// }
//
// module.exports = {
//     login
// }