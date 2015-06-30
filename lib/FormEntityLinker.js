var FormEntityLinker, _;

_ = require('lodash');

module.exports = FormEntityLinker = (function() {
  function FormEntityLinker(entity, getProperty, formModel, isQuestionVisible) {
    this.entity = entity;
    this.getProperty = getProperty;
    this.model = formModel;
    this.isQuestionVisible = isQuestionVisible;
  }

  FormEntityLinker.prototype.loadToForm = function(propLink) {
    var answer, code, mapping, ref, val;
    if ((ref = propLink.direction) !== "load" && ref !== "both") {
      return;
    }
    answer = this.model.get(propLink.questionId) || {};
    answer = _.cloneDeep(answer);
    code = this.getProperty(propLink.propertyId).code;
    val = this.entity[code];
    if (val == null) {
      return;
    }
    switch (propLink.type) {
      case "direct":
        answer.value = val;
        return this.model.set(propLink.questionId, answer);
      case "geometry:location":
        if (val.type === "Point") {
          if (answer.value == null) {
            answer.value = {};
          }
          answer.value.latitude = val.coordinates[1];
          answer.value.longitude = val.coordinates[0];
          return this.model.set(propLink.questionId, answer);
        }
        break;
      case "enum:choice":
        mapping = _.findWhere(propLink.mappings, {
          from: val
        });
        if (mapping) {
          answer.value = mapping.to;
          return this.model.set(propLink.questionId, answer);
        }
        break;
      case "boolean:choices":
        answer.value = answer.value || [];
        if (val === true) {
          if (!_.contains(answer.value, propLink.choice)) {
            answer.value.push(propLink.choice);
            return this.model.set(propLink.questionId, answer);
          }
        } else {
          if (_.contains(answer.value, propLink.choice)) {
            answer.value = _.without(answer.value, propLink.choice);
            return this.model.set(propLink.questionId, _.cloneDeep(answer));
          }
        }
        break;
      case "boolean:choice":
        mapping = _.findWhere(propLink.mappings, {
          from: (val ? "true" : "false")
        });
        if (mapping) {
          answer.value = mapping.to;
          return this.model.set(propLink.questionId, answer);
        }
        break;
      case "boolean:alternate":
        if (val) {
          answer.alternate = propLink.alternate;
        } else {
          answer.alternate = null;
        }
        return this.model.set(propLink.questionId, answer);
      case "measurement:units":
        mapping = _.findWhere(propLink.mappings, {
          from: val.unit
        });
        if (mapping) {
          answer.value = {
            quantity: val.magnitude,
            units: mapping.to
          };
          return this.model.set(propLink.questionId, answer);
        }
        break;
      case "text:specify":
        answer.specify = answer.specify || {};
        answer.specify[propLink.choice] = val;
        return this.model.set(propLink.questionId, answer);
      case "decimal:location_accuracy":
        if (!answer.value) {
          answer.value = {};
        }
        answer.value.accuracy = val;
        return this.model.set(propLink.questionId, answer);
      case "decimal:location_altitude":
        if (answer.value == null) {
          answer.value = {};
        }
        answer.value.altitude = val;
        return this.model.set(propLink.questionId, answer);
      default:
        throw new Error("Unknown link type " + propLink.type);
    }
  };

  FormEntityLinker.prototype.saveFromForm = function(propLink) {
    var answer, code, mapping, ref;
    if ((ref = propLink.direction) !== "save" && ref !== "both") {
      return;
    }
    if (this.isQuestionVisible) {
      if (!this.isQuestionVisible(propLink.questionId)) {
        return;
      }
    }
    answer = this.model.get(propLink.questionId) || {};
    code = this.getProperty(propLink.propertyId).code;
    switch (propLink.type) {
      case "direct":
        if (answer.value != null) {
          return this.entity[code] = answer.value;
        } else {
          return this.entity[code] = null;
        }
        break;
      case "geometry:location":
        if ((answer.value != null) && (answer.value.longitude != null) && (answer.value.latitude != null)) {
          return this.entity[code] = {
            type: "Point",
            coordinates: [answer.value.longitude, answer.value.latitude]
          };
        }
        break;
      case "enum:choice":
        mapping = _.findWhere(propLink.mappings, {
          to: answer.value
        });
        if (mapping) {
          return this.entity[code] = mapping.from;
        }
        break;
      case "boolean:choices":
        if (_.isArray(answer.value)) {
          return this.entity[code] = _.contains(answer.value, propLink.choice);
        }
        break;
      case "boolean:choice":
        mapping = _.findWhere(propLink.mappings, {
          to: answer.value
        });
        if (mapping) {
          return this.entity[code] = mapping.from === "true";
        }
        break;
      case "boolean:alternate":
        return this.entity[code] = answer.alternate === propLink.alternate;
      case "measurement:units":
        if (answer.value != null) {
          mapping = _.findWhere(propLink.mappings, {
            to: answer.value.units
          });
          if (mapping && (answer.value.quantity != null)) {
            return this.entity[code] = {
              magnitude: answer.value.quantity,
              unit: mapping.from
            };
          } else {
            return this.entity[code] = null;
          }
        }
        break;
      case "text:specify":
        if (answer.specify && (answer.specify[propLink.choice] != null)) {
          return this.entity[code] = answer.specify[propLink.choice];
        }
        break;
      case "decimal:location_altitude":
        if (answer.value != null) {
          return this.entity[code] = answer.value.altitude;
        }
        break;
      case "decimal:location_accuracy":
        if (answer.value != null) {
          return this.entity[code] = answer.value.accuracy;
        }
        break;
      default:
        throw new Error("Unknown link type " + propLink.type);
    }
  };

  return FormEntityLinker;

})();
