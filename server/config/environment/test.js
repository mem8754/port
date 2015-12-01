/*jslint node: true, nomen: true  */

// Specific configuration for "test" environment

module.exports = {
    
//  MongoDB connection options
    
    mongo: { uri: 'mongodb://localhost/porttest' },

//  Define domain for test environment.
    
    DOMAIN: 'http://localhost'
};