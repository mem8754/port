/*jslint node: true, nomen: true  */

//  "Development" environment configuration

module.exports = {
    port        :   process.env.OPENSHIFT_NODEJS_PORT || process.env.PORT || 9050,
    mongo       :   { uri: 'mongodb://localhost/port' },
    DOMAIN      :   'http://localhost'
};
