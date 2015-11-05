/*jslint node: true, nomen: true  */
/*global angular  */

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var milestoneSchema = new Schema(
    {
        groupId             : Schema.Types.ObjectId,
        objectiveId         : Schema.Types.ObjectId,
        phaseNum            : Number,
        objectiveMilestone  : String,
        milestoneSeq        : String
    },
    {
        collection          : 'milestones'
    }
);

module.exports = mongoose.model('Milestone', milestoneSchema);