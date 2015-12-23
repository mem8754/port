/*jslint node: true  */

'use strict';

var express = require('express'),
    auth = require('../../config/auth'),
    controller = require('./user.controller');

var router = express.Router();

router.get('/', controller.index);
router.get('/:id', controller.show);
//  router.post('/', controller.create);
router.put('/:id', auth.ensureAuthenticated, controller.update);
router.patch('/:id', auth.ensureAuthenticated, controller.update);
router.delete('/:id', auth.ensureAuthenticated, controller.destroy);
router.get('/byEmail/:email', controller.findByEmail);

module.exports = router;