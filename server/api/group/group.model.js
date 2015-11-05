/*jslint node: true, nomen: true  */
/*global angular  */

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var groupSchema = new Schema(
    {
        groupName: String,
        groupNum:  Number,
        opsId:     Number
    },
    {
        collection: 'groups'
    }
);

module.exports = mongoose.model('Group', groupSchema);