/*jslint node: true, nomen: true  */
/*global angular  */

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var phaseSchema = new Schema(
    {
        productId               : Schema.Types.ObjectId,
        phase                   : Number,
        status                  : [ Number ]
    },
    {
        collection              : 'phases'
    }
);

module.exports = mongoose.model('Phase', phaseSchema);