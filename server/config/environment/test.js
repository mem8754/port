/*jslint node: true, nomen: true  */

// Specific configuration for "test" environment

module.exports = {
    port        :   process.env.OPENSHIFT_NODEJS_PORT || process.env.PORT || 3000,
    mongo       :   { uri: 'mongodb://localhost/porttest' },
    DOMAIN      :   'http://localhost'
};