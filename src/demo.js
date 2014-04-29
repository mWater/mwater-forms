var LocationView = require("./LocationView");
//Mexico
var location = {
  latitude: 19.432,
  longitude: -99.1,
  accuracy: 70
};

var locationView = new LocationView({
  readonly: false,
  loc: location
});

$(function() {
  $("#content").append(locationView.el);
  $("#accuracySlider").val(location.accuracy).on("change", function(){
    var val = $(this).val();
    $("#accuracy").html(val);
    var pos = locationView.currentLoc;
    pos.accuracy = val;
    locationView.render();
  });
});

//create demo folder
//move bundle.js in there and add index.html