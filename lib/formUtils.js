"use strict";

var _, localizations, uuid;

_ = require('lodash');
localizations = require('../localizations.json');
uuid = require('uuid'); // Create ~ 128-bit uid without dashes

exports.createUid = function () {
  return uuid().replace(/-/g, "");
}; // Create short unique id, with ~42 bits randomness to keep unique amoung a few choices


exports.createShortUid = function () {
  var chrs, i, id, j;
  chrs = "abcdefghjklmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ123456789";

  while (true) {
    id = "";

    for (i = j = 1; j <= 7; i = ++j) {
      id = id + chrs[_.random(0, chrs.length - 1)];
    }

    if (_.find(this.model, {
      id: id
    }) == null) {
      break;
    }
  }

  return id;
}; // Create a base32 time code to write on forms


exports.createBase32TimeCode = function (date) {
  var base, chars, code, diff, num; // Characters to use (skip 1, I, 0, O)

  chars = "23456789ABCDEFGHJLKMNPQRSTUVWXYZ"; // Subtract date from July 1, 2013

  base = new Date(2013, 6, 1, 0, 0, 0, 0); // Get seconds since

  diff = Math.floor((date.getTime() - base.getTime()) / 1000); // Convert to array of base 32 characters

  code = "";

  while (diff >= 1) {
    num = diff % 32;
    diff = Math.floor(diff / 32);
    code = chars[num] + code;
  }

  return code;
};

exports.isQuestion = function (item) {
  return item._type != null && item._type.match(/Question$/);
};

exports.localizeString = function (str, locale) {
  // If null, return empty string
  if (str == null) {
    return "";
  } // Return for locale if present


  if (locale && str[locale]) {
    return str[locale];
  } // Return base if present


  if (str._base && str[str._base]) {
    return str[str._base] || "";
  } // Return english


  if (str.en) {
    return str.en;
  }

  return "";
}; // Gets all questions in form before reference item specified
// refItem can be null for all questions
// rosterId is the rosterId to use. null for only top-level


exports.priorQuestions = function (formDesign) {
  var refItem = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
  var rosterId = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

  var _appendChildren, questions;

  questions = []; // Append all child items

  _appendChildren = function appendChildren(parentItem, currentRosterId) {
    var child, j, len, ref, ref1;
    ref = parentItem.contents;

    for (j = 0, len = ref.length; j < len; j++) {
      child = ref[j]; // If ids match, abort

      if (refItem != null && child._id === refItem._id) {
        return true;
      }

      if (currentRosterId === rosterId && exports.isQuestion(child)) {
        questions.push(child);
      }

      if (child.contents) {
        if ((ref1 = child._type) === "RosterGroup" || ref1 === "RosterMatrix") {
          if (_appendChildren(child, child.rosterId || child._id)) {
            return true;
          }
        } else {
          if (_appendChildren(child, currentRosterId)) {
            return true;
          }
        }
      }
    }

    return false;
  };

  _appendChildren(formDesign, null);

  return questions;
};

exports.getRosterIds = function (formDesign) {
  var _recurse, rosterIds;

  rosterIds = [];

  _recurse = function recurse(item) {
    var j, len, ref, ref1, results1, subitem;

    if ((ref = item._type) === "RosterGroup" || ref === "RosterMatrix") {
      rosterIds.push(item.rosterId || item._id);
    }

    if (item.contents) {
      ref1 = item.contents;
      results1 = [];

      for (j = 0, len = ref1.length; j < len; j++) {
        subitem = ref1[j];
        results1.push(_recurse(subitem));
      }

      return results1;
    }
  };

  _recurse(formDesign);

  return _.uniq(rosterIds);
}; // Finds an item by id in a form


exports.findItem = function (formDesign, itemId) {
  var found, item, j, len, ref;
  ref = formDesign.contents;

  for (j = 0, len = ref.length; j < len; j++) {
    item = ref[j]; // If ids match

    if (item._id === itemId) {
      return item;
    }

    if (item.contents) {
      found = exports.findItem(item, itemId);

      if (found) {
        return found;
      }
    }
  }
}; // All items under an item including self


exports.allItems = function (rootItem) {
  var item, items, j, len, ref;
  items = [];
  items.push(rootItem);

  if (rootItem.contents) {
    ref = rootItem.contents;

    for (j = 0, len = ref.length; j < len; j++) {
      item = ref[j];
      items = items.concat(exports.allItems(item));
    }
  }

  return items;
}; // Fills question with default values and removes extraneous fields


exports.prepareQuestion = function (q) {
  var j, key, knownFields, len, ref;

  _.defaults(q, {
    _id: exports.createUid(),
    text: {},
    conditions: [],
    validations: [],
    required: false
  });

  switch (q._type) {
    case "TextQuestion":
      _.defaults(q, {
        format: "singleline"
      });

      break;

    case "NumberQuestion":
    case "NumberColumnQuestion":
      _.defaults(q, {
        decimal: true
      });

      break;

    case "DropdownQuestion":
    case "RadioQuestion":
    case "MulticheckQuestion":
    case "DropdownColumnQuestion":
      _.defaults(q, {
        choices: []
      });

      break;

    case "SiteColumnQuestion":
      _.defaults(q, {
        siteType: "water_point"
      });

      break;

    case "LikertQuestion":
      _.defaults(q, {
        items: [],
        choices: []
      });

      break;

    case "DateQuestion":
      // , "DateTimeQuestion"??
      _.defaults(q, {
        format: "YYYY-MM-DD"
      });

      break;

    case "UnitsQuestion":
    case "UnitsColumnQuestion":
      _.defaults(q, {
        units: [],
        defaultUnits: null,
        unitsPosition: "suffix",
        decimal: true
      });

      break;

    case "LocationQuestion":
      _.defaults(q, {
        calculateAdminRegion: true
      });

      break;

    case "CheckQuestion":
      _.defaults(q, {
        label: {}
      });

      break;

    case "EntityQuestion":
      _.defaults(q, {
        entityFilter: {},
        displayProperties: [],
        selectionMode: "external",
        selectProperties: [],
        selectText: {
          _base: "en",
          en: "Select"
        },
        propertyLinks: []
      });

      break;

    case "LikertQuestion":
      _.defaults(q, {
        items: [],
        choices: []
      });

      break;

    case "MatrixQuestion":
      _.defaults(q, {
        items: [],
        columns: []
      });

      break;

    case "AquagenxCBTQuestion":
      _.defaults(q, {});

  } // Get known fields


  knownFields = ['_id', '_type', 'text', 'textExprs', 'conditions', 'conditionExpr', 'validations', 'required', 'code', 'hint', 'help', 'alternates', 'commentsField', 'recordLocation', 'recordTimestamp', 'sticky', 'exportId', 'disabled'];

  switch (q._type) {
    case "TextQuestion":
    case "DateQuestion":
      //, "DateTimeQuestion"
      knownFields.push("format");
      break;

    case "NumberQuestion":
    case "NumberColumnQuestion":
      knownFields.push("decimal");
      break;

    case "DropdownQuestion":
    case "RadioQuestion":
    case "MulticheckQuestion":
    case "DropdownColumnQuestion":
      knownFields.push("choices");
      break;

    case "LikertQuestion":
      knownFields.push("items");
      knownFields.push("choices");
      break;

    case "UnitsQuestion":
    case "UnitsColumnQuestion":
      knownFields.push("decimal");
      knownFields.push("units");
      knownFields.push("defaultUnits");
      knownFields.push("unitsPosition");
      break;

    case "CheckQuestion":
      knownFields.push("label");
      break;

    case "SiteQuestion":
      knownFields.push("siteTypes");
      break;

    case "SiteColumnQuestion":
      knownFields.push("siteType");
      break;

    case "ImageQuestion":
    case "ImagesQuestion":
      knownFields.push("consentPrompt");
      break;

    case "EntityQuestion":
      knownFields.push("entityType");
      knownFields.push("entityFilter");
      knownFields.push("displayProperties");
      knownFields.push("selectionMode");
      knownFields.push("selectProperties");
      knownFields.push("mapProperty");
      knownFields.push("selectText");
      knownFields.push("propertyLinks");
      knownFields.push("hidden");
      knownFields.push("createEntity");
      break;

    case "AdminRegionQuestion":
      knownFields.push("defaultValue");
      break;

    case "MatrixQuestion":
      knownFields.push("items");
      knownFields.push("columns");
      break;

    case "LocationQuestion":
      knownFields.push("calculateAdminRegion");
  }

  ref = _.keys(q); // Strip unknown fields

  for (j = 0, len = ref.length; j < len; j++) {
    key = ref[j];

    if (!_.contains(knownFields, key)) {
      delete q[key];
    }
  }

  return q;
};

exports.changeQuestionType = function (question, newType) {
  // Clear validations (they are type specific)
  question.validations = []; // Clear format (type specific)

  delete question.format; // Set type

  question._type = newType; // Prepare question to ensure correct fields

  exports.prepareQuestion(question);
  return question;
}; // Gets type of the answer: text, number, choice, choices, date, units, boolean, location, image, images, texts, site, entity, admin_region, items_choices, matrix, aquagenx_cbt


exports.getAnswerType = function (q) {
  switch (q._type) {
    case "TextQuestion":
    case "TextColumnQuestion":
      return "text";

    case "NumberQuestion":
    case "NumberColumnQuestion":
    case "StopwatchQuestion":
      return "number";

    case "DropdownQuestion":
    case "RadioQuestion":
    case "DropdownColumnQuestion":
      return "choice";

    case "MulticheckQuestion":
      return "choices";

    case "DateQuestion":
    case "DateColumnQuestion":
      // , "DateTimeQuestion"??
      return "date";

    case "UnitsQuestion":
    case "UnitsColumnQuestion":
      return "units";

    case "CheckQuestion":
    case "CheckColumnQuestion":
      return "boolean";

    case "LocationQuestion":
      return "location";

    case "ImageQuestion":
      return "image";

    case "ImagesQuestion":
      return "images";

    case "TextListQuestion":
      return "texts";

    case "SiteQuestion":
    case "SiteColumnQuestion":
      return "site";

    case "BarcodeQuestion":
      return "text";

    case "EntityQuestion":
      return "entity";

    case "AdminRegionQuestion":
      return "admin_region";

    case "MatrixQuestion":
      return "matrix";

    case "LikertQuestion":
      return "items_choices";

    case "AquagenxCBTQuestion":
      return "aquagenx_cbt";

    default:
      throw new Error("Unknown question type ".concat(q._type));
  }
}; // Check if a form is all sections


exports.isSectioned = function (form) {
  return form.contents.length > 0 && _.every(form.contents, function (item) {
    return item._type === "Section";
  });
}; // Duplicates an item (form design, section or question)
// idMap is a map of old _ids to new _ids. If any not present, new uid will be used


exports.duplicateItem = function (item, idMap) {
  var calculations, dup, j, key, len, question, ref, ref1, value; // If form or section and ids not mapped, map ids

  if (!idMap) {
    idMap = {};
  }

  if ((ref = item._type) === "Form" || ref === "Section") {
    ref1 = exports.priorQuestions(item);

    for (j = 0, len = ref1.length; j < len; j++) {
      question = ref1[j]; // Map non-mapped ones

      if (!idMap[question._id]) {
        idMap[question._id] = exports.createUid();
      }
    }
  } else if (item._id) {
    idMap[item._id] = exports.createUid();
  }

  dup = _.cloneDeep(item);
  delete dup.confidential;
  delete dup.confidentialRadius; // Set up id

  if (dup._id) {
    dup._basedOn = dup._id;

    if (idMap && idMap[dup._id]) {
      dup._id = idMap[dup._id];
    } else {
      dup._id = exports.createUid();
    }
  } // Fix condition references, or remove conditions


  if (dup.conditions) {
    dup.conditions = _.filter(dup.conditions, function (cond) {
      if (cond.lhs && cond.lhs.question) {
        // Check if in id
        if (idMap && idMap[cond.lhs.question]) {
          // Map id
          cond.lhs.question = idMap[cond.lhs.question];
          return true;
        } // Could not be mapped


        return false;
      } // For future AND and OR TODO


      return true;
    });
  } // Duplicate contents


  if (dup.contents) {
    dup.contents = _.map(dup.contents, function (item) {
      return exports.duplicateItem(item, idMap);
    });
  }

  if (dup.calculations) {
    calculations = _.map(dup.calculations, function (item) {
      return exports.duplicateItem(item, idMap);
    });
    calculations = JSON.stringify(calculations); // Replace each part of idMap

    for (key in idMap) {
      value = idMap[key];
      calculations = calculations.replace(new RegExp(_.escapeRegExp(key), "g"), value);
    }

    calculations = JSON.parse(calculations);
    dup.calculations = calculations;
  }

  return dup;
}; // Finds all localized strings in an object


exports.extractLocalizedStrings = function (obj) {
  var item, j, key, len, strs, value;

  if (obj == null) {
    return [];
  } // Return self if string


  if (obj._base != null) {
    return [obj];
  }

  strs = []; // If array, concat each

  if (_.isArray(obj)) {
    for (j = 0, len = obj.length; j < len; j++) {
      item = obj[j];
      strs = strs.concat(this.extractLocalizedStrings(item));
    }
  } else if (_.isObject(obj)) {
    for (key in obj) {
      value = obj[key];
      strs = strs.concat(this.extractLocalizedStrings(value));
    }
  }

  return strs;
};

exports.updateLocalizations = function (formDesign) {
  var existing, j, k, len, len1, ref, ref1, results1, str;
  formDesign.localizedStrings = formDesign.localizedStrings || []; // Map existing ones in form

  existing = {};
  ref = formDesign.localizedStrings;

  for (j = 0, len = ref.length; j < len; j++) {
    str = ref[j];

    if (str.en) {
      existing[str.en] = true;
    }
  }

  ref1 = localizations.strings; // Add new localizations

  results1 = [];

  for (k = 0, len1 = ref1.length; k < len1; k++) {
    str = ref1[k];

    if (str.en && !existing[str.en] && !str._unused) {
      formDesign.localizedStrings.push(str);
      results1.push(existing[str.en] = true);
    } else {
      results1.push(void 0);
    }
  }

  return results1;
}; // Determines if has at least one localization in locale


exports.hasLocalizations = function (obj, locale) {
  var strs;
  strs = exports.extractLocalizedStrings(obj);
  return _.any(strs, function (str) {
    return str[locale];
  });
}; // Finds an entity question of the specified type, or a legacy site question


exports.findEntityQuestion = function (formDesign, entityType) {
  var j, len, question, ref, rosterId;
  question = _.find(exports.priorQuestions(formDesign), function (q) {
    var questionEntityType;

    if (q._type === "EntityQuestion" && q.entityType === entityType) {
      return q;
    }

    if (q._type === "SiteQuestion") {
      questionEntityType = exports.getSiteEntityType(q);

      if (questionEntityType === entityType) {
        return q;
      }
    }
  });

  if (!question) {
    ref = exports.getRosterIds(formDesign);

    for (j = 0, len = ref.length; j < len; j++) {
      rosterId = ref[j];
      question = _.find(exports.priorQuestions(formDesign, null, rosterId), function (q) {
        var questionEntityType;

        if (q._type === "EntityQuestion" && q.entityType === entityType) {
          return q;
        }

        if (q._type === "SiteColumnQuestion" && q.siteType === entityType) {
          return q;
        }

        if (q._type === "SiteQuestion") {
          questionEntityType = exports.getSiteEntityType(q);

          if (questionEntityType === entityType) {
            return q;
          }
        }
      });
    }
  }

  return question;
}; // Finds all references to entities in a response. Returns array of: 
// {
//   question: _id of question
//   roster: _id of roster entry, null if not in roster
//   entityType: e.g. "water_point"
//   property: property code (e.g "_id" or "code") of entity that is referenced in value
//   value: value of entity property that is referenced
// }


exports.extractEntityReferences = function (formDesign, responseData) {
  var code, entityType, j, k, l, len, len1, len2, len3, len4, m, n, question, ref, ref1, ref10, ref2, ref3, ref4, ref5, ref6, ref7, ref8, ref9, results, rosterEntry, rosterId, value;
  results = [];
  ref = exports.priorQuestions(formDesign); // Handle non-roster

  for (j = 0, len = ref.length; j < len; j++) {
    question = ref[j];

    switch (exports.getAnswerType(question)) {
      case "site":
        code = (ref1 = responseData[question._id]) != null ? (ref2 = ref1.value) != null ? ref2.code : void 0 : void 0;
        entityType = exports.getSiteEntityType(question);

        if (code) {
          results.push({
            question: question._id,
            entityType: entityType,
            property: "code",
            value: code
          });
        }

        break;

      case "entity":
        value = (ref3 = responseData[question._id]) != null ? ref3.value : void 0;

        if (value) {
          results.push({
            question: question._id,
            entityType: question.entityType,
            property: "_id",
            value: value
          });
        }

    }
  }

  ref4 = exports.getRosterIds(formDesign);

  for (k = 0, len1 = ref4.length; k < len1; k++) {
    rosterId = ref4[k];
    ref5 = exports.priorQuestions(formDesign, null, rosterId);

    for (l = 0, len2 = ref5.length; l < len2; l++) {
      question = ref5[l];

      switch (exports.getAnswerType(question)) {
        case "site":
          ref6 = responseData[rosterId] || [];

          for (m = 0, len3 = ref6.length; m < len3; m++) {
            rosterEntry = ref6[m];
            code = (ref7 = rosterEntry.data[question._id]) != null ? (ref8 = ref7.value) != null ? ref8.code : void 0 : void 0;
            entityType = exports.getSiteEntityType(question);

            if (code) {
              results.push({
                question: question._id,
                roster: rosterEntry._id,
                entityType: entityType,
                property: "code",
                value: code
              });
            }
          }

          break;

        case "entity":
          ref9 = responseData[rosterId] || [];

          for (n = 0, len4 = ref9.length; n < len4; n++) {
            rosterEntry = ref9[n];
            value = (ref10 = rosterEntry.data[question._id]) != null ? ref10.value : void 0;

            if (value) {
              results.push({
                question: question._id,
                roster: rosterEntry._id,
                entityType: question.entityType,
                property: "_id",
                value: value
              });
            }
          }

      }
    }
  }

  return results;
}; // Gets the entity type (e.g. "water_point") for a site question


exports.getSiteEntityType = function (question) {
  var entityType;
  entityType = question.siteTypes && question.siteTypes[0] ? _.first(question.siteTypes).toLowerCase().replace(new RegExp(' ', 'g'), "_") : "water_point";
  return entityType;
};