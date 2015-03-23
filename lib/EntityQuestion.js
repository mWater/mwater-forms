var EntityQuestion, Question, _,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  __hasProp = {}.hasOwnProperty;

Question = require('./Question');

_ = require('lodash');

module.exports = EntityQuestion = (function(_super) {
  __extends(EntityQuestion, _super);

  function EntityQuestion() {
    return EntityQuestion.__super__.constructor.apply(this, arguments);
  }

  EntityQuestion.prototype.events = {
    'click #change_entity_button': 'selectEntity',
    'click #select_entity_button': 'selectEntity'
  };

  EntityQuestion.prototype.changed = function() {
    return this.setAnswerValue({
      code: this.$("input").val()
    });
  };

  EntityQuestion.prototype.selectEntity = function() {
    if (!this.ctx.selectEntity) {
      return alert(this.T("Not supported on this platform"));
    }
    return this.ctx.selectEntity({
      title: this.options.selectText,
      type: this.options.entityType,
      filter: this.options.entityFilter,
      selectProperties: this.options.selectProperties,
      mapProperty: this.options.mapProperty,
      callback: (function(_this) {
        return function(entityId) {
          _this.setAnswerValue(entityId);
          return _this.ctx.getEntity(_this.options.entityType, entityId, function(entity) {
            if (entity && _this.options.loadLinkedAnswers) {
              return _this.options.loadLinkedAnswers(entity);
            }
          });
        };
      })(this)
    });
  };

  EntityQuestion.prototype.updateAnswer = function(answerEl) {
    var data, val;
    if (!this.ctx.getEntity) {
      answerEl.html('<div class="text-warning">' + this.T("Not supported on this platform") + '</div>');
      return;
    }
    val = this.getAnswerValue();
    if (val) {
      data = {
        entity: val,
        selectText: this.options.selectText
      };
      answerEl.html(require('./templates/EntityQuestion.hbs')(data, {
        helpers: {
          T: this.T
        }
      }));
      return this.ctx.getEntity(this.options.entityType, val, (function(_this) {
        return function(entity) {
          var properties;
          if (entity) {
            properties = _this.formatEntityProperties(entity);
            data = {
              entity: val,
              properties: properties,
              selectText: _this.options.selectText
            };
            return answerEl.html(require('./templates/EntityQuestion.hbs')(data, {
              helpers: {
                T: _this.T
              }
            }));
          } else {
            data = {
              entity: entity,
              propertiesError: _this.T("Data Not Found"),
              selectText: _this.options.selectText
            };
            return answerEl.html(require('./templates/EntityQuestion.hbs')(data, {
              helpers: {
                T: _this.T
              }
            }));
          }
        };
      })(this));
    } else {
      data = {
        selectText: this.options.selectText
      };
      return answerEl.html(require('./templates/EntityQuestion.hbs')(data, {
        helpers: {
          T: this.T
        }
      }));
    }
  };

  EntityQuestion.prototype.formatEntityProperties = function(entity) {
    var localize, name, prop, propUnit, propValue, properties, value, _i, _len, _ref;
    localize = (function(_this) {
      return function(str) {
        return str[_this.options.locale] || str.en;
      };
    })(this);
    properties = [];
    _ref = this.options.displayProperties;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      prop = _ref[_i];
      name = localize(prop.name);
      value = entity[prop.code];
      if (value == null) {
        properties.push({
          name: name,
          value: "-"
        });
      } else {
        switch (prop.type) {
          case "text":
          case "integer":
          case "decimal":
          case "date":
          case "entity":
            properties.push({
              name: name,
              value: value
            });
            break;
          case "enum":
            propValue = _.findWhere(prop.values, {
              code: value
            });
            if (propValue) {
              properties.push({
                name: name,
                value: localize(propValue.name)
              });
            } else {
              properties.push({
                name: name,
                value: "???"
              });
            }
            break;
          case "boolean":
            properties.push({
              name: name,
              value: value ? "true" : "false"
            });
            break;
          case "geometry":
            if (value.type === "Point") {
              properties.push({
                name: name,
                value: value.coordinates[1] + ", " + value.coordinates[0]
              });
            }
            break;
          case "measurement":
            propUnit = _.findWhere(prop.units, {
              code: value.unit
            });
            if (propUnit) {
              properties.push({
                name: name,
                value: value.magnitude + " " + propUnit.symbol
              });
            } else {
              properties.push({
                name: name,
                value: value.magnitude + " " + "???"
              });
            }
            break;
          default:
            properties.push({
              name: name,
              value: "???"
            });
        }
      }
    }
    return properties;
  };

  return EntityQuestion;

})(Question);
