const express = require('express');
const router = express.Router();
const Joi = require('joi');
const validateRequest = require('_middleware/validate-request');
const authorize = require('_middleware/authorize')
// const userService = require('./user.service');
const eventService = require('./event.service');

// routes
// router.post('/authenticate', authenticateSchema, authenticate);
// router.post('/register', registerSchema, register);
// router.get('/', authorize(), getAll);
// router.get('/', getAll);

// router.get('/current', authorize(), getCurrent);
router.get('/:id',authorize(), getEventByOwner);
router.post('/', authorize(), addEvent);

module.exports = router;

//[2021-09-01 PO]
function getEventByOwner(req, res, next) {
    eventService.getEventByOwner(req.params.id)
        .then(event => res.json(event))
        .catch(next);
}

function addEvent(req, res, next) {
    eventService.create(req.body)
        .then(() => res.json({message: 'Add event successful'}))
        .catch(next);
}