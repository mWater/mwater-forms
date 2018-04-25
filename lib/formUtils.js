var _, localizations, uuid;

_ = require('lodash');

localizations = require('../localizations.json');

uuid = require('uuid');

exports.createUid = function() {
  return uuid().replace(/-/g, "");
};

exports.createShortUid = function() {
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
};

exports.createBase32TimeCode = function(date) {
  var base, chars, code, diff, num;
  chars = "23456789ABCDEFGHJLKMNPQRSTUVWXYZ";
  base = new Date(2013, 6, 1, 0, 0, 0, 0);
  diff = Math.floor((date.getTime() - base.getTime()) / 1000);
  code = "";
  while (diff >= 1) {
    num = diff % 32;
    diff = Math.floor(diff / 32);
    code = chars[num] + code;
  }
  return code;
};

exports.isQuestion = function(item) {
  return (item._type != null) && item._type.match(/Question$/);
};

exports.localizeString = function(str, locale) {
  if (str == null) {
    return "";
  }
  if (locale && str[locale]) {
    return str[locale];
  }
  if (str._base && str[str._base]) {
    return str[str._base] || "";
  }
  if (str.en) {
    return str.en;
  }
  return "";
};

exports.priorQuestions = function(formDesign, refItem, rosterId) {
  var appendChildren, questions;
  if (refItem == null) {
    refItem = null;
  }
  if (rosterId == null) {
    rosterId = null;
  }
  questions = [];
  appendChildren = function(parentItem, currentRosterId) {
    var child, j, len, ref, ref1;
    ref = parentItem.contents;
    for (j = 0, len = ref.length; j < len; j++) {
      child = ref[j];
      if ((refItem != null) && child._id === refItem._id) {
        return true;
      }
      if (currentRosterId === rosterId && exports.isQuestion(child)) {
        questions.push(child);
      }
      if (child.contents) {
        if ((ref1 = child._type) === "RosterGroup" || ref1 === "RosterMatrix") {
          if (appendChildren(child, child.rosterId || child._id)) {
            return true;
          }
        } else {
          if (appendChildren(child, currentRosterId)) {
            return true;
          }
        }
      }
    }
    return false;
  };
  appendChildren(formDesign, null);
  return questions;
};

exports.getRosterIds = function(formDesign) {
  var recurse, rosterIds;
  rosterIds = [];
  recurse = function(item) {
    var j, len, ref, ref1, results1, subitem;
    if ((ref = item._type) === "RosterGroup" || ref === "RosterMatrix") {
      rosterIds.push(item.rosterId || item._id);
    }
    if (item.contents) {
      ref1 = item.contents;
      results1 = [];
      for (j = 0, len = ref1.length; j < len; j++) {
        subitem = ref1[j];
        results1.push(recurse(subitem));
      }
      return results1;
    }
  };
  recurse(formDesign);
  return _.uniq(rosterIds);
};

exports.findItem = function(formDesign, itemId) {
  var found, item, j, len, ref;
  ref = formDesign.contents;
  for (j = 0, len = ref.length; j < len; j++) {
    item = ref[j];
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
};

exports.allItems = function(rootItem) {
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
};

exports.prepareQuestion = function(q) {
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
  }
  knownFields = ['_id', '_type', 'text', 'textExprs', 'conditions', 'conditionExpr', 'validations', 'required', 'code', 'hint', 'help', 'alternates', 'commentsField', 'recordLocation', 'recordTimestamp', 'sticky', 'exportId', 'disabled'];
  switch (q._type) {
    case "TextQuestion":
    case "DateQuestion":
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
  ref = _.keys(q);
  for (j = 0, len = ref.length; j < len; j++) {
    key = ref[j];
    if (!_.contains(knownFields, key)) {
      delete q[key];
    }
  }
  return q;
};

exports.changeQuestionType = function(question, newType) {
  question.validations = [];
  delete question.format;
  question._type = newType;
  exports.prepareQuestion(question);
  return question;
};

exports.getAnswerType = function(q) {
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
      throw new Error("Unknown question type " + q._type);
  }
};

exports.isSectioned = function(form) {
  return form.contents.length > 0 && _.every(form.contents, function(item) {
    return item._type === "Section";
  });
};

exports.duplicateItem = function(item, idMap) {
  var calculations, dup, j, key, len, question, ref, ref1, value;
  if (!idMap) {
    idMap = {};
  }
  if ((ref = item._type) === "Form" || ref === "Section") {
    ref1 = exports.priorQuestions(item);
    for (j = 0, len = ref1.length; j < len; j++) {
      question = ref1[j];
      if (!idMap[question._id]) {
        idMap[question._id] = exports.createUid();
      }
    }
  } else if (item._id) {
    idMap[item._id] = exports.createUid();
  }
  dup = _.cloneDeep(item);
  if (dup._id) {
    dup._basedOn = dup._id;
    if (idMap && idMap[dup._id]) {
      dup._id = idMap[dup._id];
    } else {
      dup._id = exports.createUid();
    }
  }
  if (dup.conditions) {
    dup.conditions = _.filter(dup.conditions, (function(_this) {
      return function(cond) {
        if (cond.lhs && cond.lhs.question) {
          if (idMap && idMap[cond.lhs.question]) {
            cond.lhs.question = idMap[cond.lhs.question];
            return true;
          }
          return false;
        }
        return true;
      };
    })(this));
  }
  if (dup.contents) {
    dup.contents = _.map(dup.contents, (function(_this) {
      return function(item) {
        return exports.duplicateItem(item, idMap);
      };
    })(this));
  }
  if (dup.calculations) {
    calculations = _.map(dup.calculations, (function(_this) {
      return function(item) {
        return exports.duplicateItem(item, idMap);
      };
    })(this));
    calculations = JSON.stringify(calculations);
    for (key in idMap) {
      value = idMap[key];
      calculations = calculations.replace(new RegExp(_.escapeRegExp(key), "g"), value);
    }
    calculations = JSON.parse(calculations);
    dup.calculations = calculations;
  }
  return dup;
};

exports.extractLocalizedStrings = function(obj) {
  var item, j, key, len, strs, value;
  if (obj == null) {
    return [];
  }
  if (obj._base != null) {
    return [obj];
  }
  strs = [];
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

exports.updateLocalizations = function(formDesign) {
  var existing, j, k, len, len1, ref, ref1, results1, str;
  formDesign.localizedStrings = formDesign.localizedStrings || [];
  existing = {};
  ref = formDesign.localizedStrings;
  for (j = 0, len = ref.length; j < len; j++) {
    str = ref[j];
    if (str.en) {
      existing[str.en] = true;
    }
  }
  ref1 = localizations.strings;
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
};

exports.hasLocalizations = function(obj, locale) {
  var strs;
  strs = exports.extractLocalizedStrings(obj);
  return _.any(strs, function(str) {
    return str[locale];
  });
};

exports.findEntityQuestion = function(formDesign, entityType) {
  var question;
  question = _.find(exports.priorQuestions(formDesign), function(q) {
    var questionEntityType, siteType;
    if (q._type === "EntityQuestion" && q.entityType === entityType) {
      return q;
    }
    if (q._type === "SiteQuestion") {
      if (q.siteTypes && q.siteTypes[0]) {
        siteType = q.siteTypes[0];
      } else {
        siteType = "Water point";
      }
      questionEntityType = siteType.toLowerCase().replace(new RegExp(' ', 'g'), "_");
      if (questionEntityType === entityType) {
        return q;
      }
    }
  });
  return question;
};

exports.extractEntityReferences = function(formDesign, responseData) {
  var code, entityType, j, k, l, len, len1, len2, len3, len4, m, n, question, ref, ref1, ref10, ref2, ref3, ref4, ref5, ref6, ref7, ref8, ref9, results, rosterEntry, rosterId, value;
  results = [];
  ref = exports.priorQuestions(formDesign);
  for (j = 0, len = ref.length; j < len; j++) {
    question = ref[j];
    switch (exports.getAnswerType(question)) {
      case "site":
        code = (ref1 = responseData[question._id]) != null ? (ref2 = ref1.value) != null ? ref2.code : void 0 : void 0;
        entityType = question.siteTypes ? _.first(question.siteTypes).toLowerCase().replace(new RegExp(' ', 'g'), "_") : "water_point";
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
            entityType = question.siteTypes ? _.first(question.siteTypes).toLowerCase().replace(new RegExp(' ', 'g'), "_") : "water_point";
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
};
