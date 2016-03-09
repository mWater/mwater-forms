var AdminRegionSelectComponent, H, R, React, ReactDOM;

React = require('react');

ReactDOM = require('react-dom');

R = React.createElement;

H = React.DOM;

AdminRegionSelectComponent = require('./AdminRegionSelectComponent');

global.T = function(str) {
  return str;
};

$(function() {
  var canada, getAdminRegionPath, getSubAdminRegions, manitoba, ontario, render, value;
  canada = {
    id: "canada",
    level: 0,
    name: "Canada",
    type: "Country"
  };
  manitoba = {
    id: "manitoba",
    level: 1,
    name: "Manitoba",
    type: "Province"
  };
  ontario = {
    id: "ontario",
    level: 1,
    name: "Ontario",
    type: "Province"
  };
  getAdminRegionPath = function(id, callback) {
    if (id === 'manitoba') {
      return callback(null, [canada, manitoba]);
    } else if (id === 'ontario') {
      return callback(null, [canada, ontario]);
    } else if (id === "canada") {
      return callback(null, [canada]);
    } else {
      return callback(null, []);
    }
  };
  getSubAdminRegions = function(id, callback) {
    if (id == null) {
      return callback(null, [canada]);
    } else if (id === "canada") {
      return callback(null, [manitoba, ontario]);
    } else {
      return callback(null, []);
    }
  };
  value = "manitoba";
  render = function() {
    var elem, onChange;
    onChange = function(id) {
      console.log(id);
      value = id;
      return render();
    };
    elem = React.createElement(AdminRegionSelectComponent, {
      getAdminRegionPath: getAdminRegionPath,
      getSubAdminRegions: getSubAdminRegions,
      onChange: onChange,
      value: value
    });
    return ReactDOM.render(elem, document.getElementById("main"));
  };
  return render();
});
