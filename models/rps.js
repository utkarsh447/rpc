var db = require("./database.js");

var user_model = db.Model.extend({
  tableName: "rps",
  idAttribute: "id"

});

var rps = db.Collection.extend({
  model: rps_model
});

module.exports = {
  rps_model: db.model("rps_model", rps_model),
  rps: db.collection("rps", rps)
};
