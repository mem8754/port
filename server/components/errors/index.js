/*jslint node: true, nomen: true  */

/**
 * Error responses
 */

module.exports[404] = function pageNotFound(req, res) {
    'use strict';
    var viewFilePath = '404',
        statusCode = 404,
        result = {
            status: statusCode
        };

    res.status(result.status);
    res.render(viewFilePath, function (err) {
        if (err) { return res.status(result.status).json(result); }

        res.render(viewFilePath);
    });
};
