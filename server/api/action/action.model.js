/*jslint node: true, nomen: true  */
/*global angular  */

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var actionSchema = new Schema(
    {
        productId           : Schema.Types.ObjectId,
        groupId             : Schema.Types.ObjectId,
        milestoneId         : Schema.Types.ObjectId,
        phaseNum            : Number,
        actionStatus        : Number
    },
    {
        collection          : 'actions'
    }
);

module.exports = mongoose.model('Action', actionSchema);