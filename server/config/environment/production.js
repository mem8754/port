/*jslint node: true, nomen: true  */


//  "Production" environment configuration

module.exports = {
    ip          :   process.env.OPENSHIFT_NODEJS_IP || process.env.IP || '172.27.18.69',
    port        :   process.env.OPENSHIFT_NODEJS_PORT || process.env.PORT || 8080,
    mongo       :   { uri : process.env.MONGOLAB_URI ||
                            process.env.MONGOHQ_URL ||
                            process.env.OPENSHIFT_MONGODB_DB_URL + process.env.OPENSHIFT_APP_NAME ||
                            'mongodb://localhost/port' },
    DOMAIN      :   process.env.DOMAIN || 'http://web01-imp.dev.ena.net'
};