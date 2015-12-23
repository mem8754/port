/*jslint node: true, nomen: true  */

var path        =   require('path'),
    _           =   require('lodash'),
    allEnvs     =   {
        env         :   process.env.NODE_ENV,
        root        :   path.normalize(__dirname + '/../../..'),        // Root path of server
        secrets     :   { session     :   process.env.SESSION_SECRET  ||  "session-secret",
                          cookie      :   process.env.COOKIE_SECRET   ||  "cookie-secret" },
        mongo       :   { options     :   { db : { safe : true } } }
    };

module.exports = _.merge(allEnvs, require('./' + process.env.NODE_ENV + '.js') || {});