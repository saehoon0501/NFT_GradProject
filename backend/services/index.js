const express = require('express');

const authRouter = require('./auth');
const userRouter = require('./users');
const postRouter = require('./posts');
const pollRouter = require('./polls');
const uploadRouter = require('./uploads');
const billboardRouter = require('./billboard');

const services = express.Router();

services.use('/auth', authRouter);
services.use('/user', userRouter);
services.use('/post', postRouter);
services.use('/poll', pollRouter);
services.use('/uploads', uploadRouter);
services.use('/billboard', billboardRouter);


module.exports = services;