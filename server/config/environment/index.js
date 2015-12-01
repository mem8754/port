/*jslint node: true, nomen: true  */

var path        =   require('path'),
    _           =   require('lodash'),
    all         =   {
        env         :   process.env.NODE_ENV,
        root        :   path.normalize(__dirname + '/../../..'),        // Root path of server
        port        :   process.env.PORT || 9050,                       // Server port
        passport    :   {
            strategy    :   'saml',
            saml        :   {
                callbackUrl :   'http://192.168.1.107:9050/login/callback',
                entryPoint  :   'https://openidp.feide.no/simplesaml/saml2/idp/SSOService.php',
                issuer      :   'http://192.168.1.107:9050'
            }
        },
        secrets     :   {
            session     :   process.env.SESSION_SECRET || "session-secret",
            cookie      :   process.env.COOKIE_SECRET || "cookie-secret"
        },
        mongo       :   {
            options     :   {
                db          :   {
                    safe        : true
                }
            }
        }
    };

module.exports = _.merge(all, require('./' + process.env.NODE_ENV + '.js') || {});