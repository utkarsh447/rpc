var db = require("./database.js");

var rps_model = db.Model.extend({
  tableName: "rps",
  idAttribute: "id",

  user: function () {
    return this.belongsTo("user", "id");
  }
});

var rps = db.Collection.extend({
  model: rps_model
});

module.exports = {
  rps_model: db.model("rps_model", rps_model),
  rps: db.collection("rps", rps)
};

