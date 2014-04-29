var LocationView = require("./LocationView");
var location = {
  latitude: 45,
  longitude: -88,
  accuracy: 12
};

var locationView = new LocationView({
  readonly: false,
  loc: location
});

$(function() {
  $("#content").append(locationView.el);
});


//create demo folder
//move bundle.js in there and add index.html