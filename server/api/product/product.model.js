/*jslint node: true, nomen: true  */
/*global angular  */

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var productSchema = new Schema(
    {
        productName             : String,
        productVersion          : String,
        productOverview         : String,
        productManager          : Schema.Types.ObjectId,
        businessPriority        : String,
        businessRank            : Number,
        businessFactors         : {
            retention           : Boolean,
            growth              : Boolean,
            diversification     : Boolean,
            architecture        : Boolean,
            riskMitigation      : Boolean
        },
        start                   : [ String ],
        finish                  : [ String ],
        comment                 : [ String ],
        phase                   : String,
        complete                : Boolean
    },
    {
        collection              : 'products'
    }
);

module.exports = mongoose.model('Product', productSchema);