const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const leaderboardSchema = new Schema({

    _id: {type: String},
    name: {type: String},
    words_today: {type: Number},
    avg_daily_words: {type: Number}

});

const Leaderboard = mongoose.model("Leaderboard", leaderboardSchema);
module.exports = Leaderboard;