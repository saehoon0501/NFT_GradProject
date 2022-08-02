const express = require('express');

const authRouter = require('./auth');
const userRouter = require('./users');
const postRouter = require('./posts');

const services = express.Router();

services.use('/auth', authRouter);
services.use('/user', userRouter);
services.use('/post', postRouter);

module.exports = services;