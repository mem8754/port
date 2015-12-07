/*jslint node: true, nomen: true  */

var path        =   require('path'),
    _           =   require('lodash'),
    all         =   {
        env         :   process.env.NODE_ENV,
        root        :   path.normalize(__dirname + '/../../..'),        // Root path of server
        port        :   process.env.PORT || 9050,                       // Server port
        passport    :   {
            strategy    :   'saml',
            saml : {
                entryPoint  :   'https://openidp.feide.no/simplesaml/saml2/idp/SSOService.php?',
//                                + "metaAlias=/idp"
//                                + "&spEntityID=http://192.168.1.11:9050/metadata/",
                issuer      :   'http://192.168.1.11:9050',
                path        :   'http://192.168.1.11:9050/login/callback'
            }
        },
        secrets     :   {
            session     :   process.env.SESSION_SECRET  ||  "session-secret",
            cookie      :   process.env.COOKIE_SECRET   ||  "cookie-secret"
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