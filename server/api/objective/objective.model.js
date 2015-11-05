/*jslint node: true, nomen: true  */
/*global angular  */

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var objectiveSchema = new Schema(
    {
        productPhase        : String,
        productPhaseNum     : Number,
        phaseObjective      : String,
        objectiveSequence   : Number
    },
    {
        collection              : 'objectives'
    }
);

module.exports = mongoose.model('Objective', objectiveSchema);