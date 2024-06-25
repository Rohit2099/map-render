const express = require("express");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const loginRouter = express.Router();
const User = require('../models/User');
const { check, validationResult } = require('express-validator');


const authenticateToken = (req, res, next) => {
    const token = req.header("Authorization").split(" ")[1];
    if (!token) return res.status(401).json({ message: "Access denied" });
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ message: "Invalid token" });
        req.user = user;
        next();
    });
};

loginRouter.post("/register",
    [
        check("username", "Username is required").not().isEmpty(),
        check("password", "Password is required").isLength({ min: 2 }),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { username, password } = req.body;

        try {
            let user = await User.findOne({ username });
            if (user) {
                return res.status(400).json({ message: "User already exists" });
            }

            user = new User({
                username,
                password: bcrypt.hashSync(password, 10),
            });
            await user.save();

            const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
                expiresIn: "1h",
            });
            res.status(201).json({ token });
        } catch (error) {
            res.status(500).json({ message: "Unable to register" });
        }
    }
);

loginRouter.post("/login", async (req, res) => {
    const { username, password } = req.body;
    debugger;
    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const isMatch = bcrypt.compareSync(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
            expiresIn: "1h",
        });
        res.status(200).json({ token });
    } catch (error) {
        res.status(500).json({ message: "Unable to login" });
    }
});

module.exports = {loginRouter, authenticateToken};
