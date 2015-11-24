/*jslint node: true, nomen: true  */


//  "Production" environment configuration

module.exports = {
    
// Server IP address
    
    ip          :   process.env.OPENSHIFT_NODEJS_IP ||
                    process.env.IP ||
                    '172.27.18.69',

// Server port
    
    port        :   process.env.OPENSHIFT_NODEJS_PORT ||
                    process.env.PORT ||
                    8080,

// MongoDB connection options
    
    mongo       :   {
        uri: process.env.MONGOLAB_URI ||
             process.env.MONGOHQ_URL ||
             process.env.OPENSHIFT_MONGODB_DB_URL + process.env.OPENSHIFT_APP_NAME ||
             'mongodb://localhost/port'
    },

// Domain entry point for production
    
    DOMAIN      :   process.env.DOMAIN || 'http://web01-imp.dev.ena.net',

// Passport production configuration parameters
        
    passport    :   {
        saml        :   {
            callbackUrl :   'http://web01-imp.dev.ena.net/login/callback',
            issuer      :   'http://web01-imp.dev.ena.net'
        }
    }
};