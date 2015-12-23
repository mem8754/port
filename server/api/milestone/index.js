/*jslint node: true  */

'use strict';

var express = require('express'),
    auth = require('../../config/auth'),
    controller = require('./milestone.controller');

var router = express.Router();

router.get('/', controller.index);
router.get('/:id', controller.show);
router.post('/', auth.ensureAuthenticated, controller.create);
router.put('/:id', auth.ensureAuthenticated, controller.update);
router.patch('/:id', auth.ensureAuthenticated, controller.update);
router.delete('/:id', auth.ensureAuthenticated, controller.destroy);

module.exports = router;