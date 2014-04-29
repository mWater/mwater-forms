var LocationView = require("./LocationView");
var location = {
  latitude: 45,
  longitude: -88,
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