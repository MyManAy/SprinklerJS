const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const timelySchema = new Schema({
    count: {type: Number, default: 0},
    words: {type: Number, default: 0},
});

const leaderboardSchema = new Schema({

    _id: {type: String},
    name: {type: String},
    words_total: {type: Number, default: 0},
    timely: {
        use_date: {type: Number},
        daily: timelySchema,
        weekly: timelySchema,
        yearly: timelySchema
    }

});

const Leaderboard = mongoose.model("Leaderboard", leaderboardSchema);
module.exports = Leaderboard;