const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const profileSchema = new Schema({
  _id: { type: String },
  guilds: {
    [{ type: String }]: { type: [String] },
  },
});

const Profile = mongoose.model("Profile", profileSchema);
module.exports = Profile;
