/*jslint node: true, nomen: true  */
/*global angular  */

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var userSchema = new Schema(
    {
        firstName       : String,
        lastName        : String,
        email           : String,
        groupId         : Schema.Types.ObjectId,
        editor          : Boolean,
        admin           : Boolean,
        approved        : Boolean
    },
    {
        collection: 'users'
    }
);

module.exports = mongoose.model('Users', userSchema);