var _, localizations, uuid;

_ = require('lodash');

localizations = require('../localizations.json');

uuid = require('node-uuid');

exports.createUid = function() {
  return uuid.v4().replace(/-/g, "");
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
  if (str[locale || "en"]) {
    return str[locale || "en"];
  }
  if (str._base) {
    return str[str._base] || "";
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
    var j, len, ref, ref1, results, subitem;
    if ((ref = item._type) === "RosterGroup" || ref === "RosterMatrix") {
      rosterIds.push(item.rosterId || item._id);
    }
    if (item.contents) {
      ref1 = item.contents;
      results = [];
      for (j = 0, len = ref1.length; j < len; j++) {
        subitem = ref1[j];
        results.push(recurse(subitem));
      }
      return results;
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
  }
  knownFields = ['_id', '_type', 'text', 'textExprs', 'conditions', 'validations', 'required', 'code', 'hint', 'help', 'alternates', 'commentsField', 'recordLocation', 'recordTimestamp', 'sticky', 'exportId'];
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
      knownFields.push("contents");
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
    default:
      throw new Error("Unknown question type");
  }
};

exports.isSectioned = function(form) {
  return form.contents.length > 0 && _.every(form.contents, function(item) {
    return item._type === "Section";
  });
};

exports.duplicateItem = function(item, idMap) {
  var dup, j, len, question, ref, ref1;
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

exports.updateLocalizations = function(form) {
  var existing, j, k, len, len1, ref, ref1, results, str;
  form.localizedStrings = form.localizedStrings || [];
  existing = {};
  ref = form.localizedStrings;
  for (j = 0, len = ref.length; j < len; j++) {
    str = ref[j];
    if (str.en) {
      existing[str.en] = true;
    }
  }
  ref1 = localizations.strings;
  results = [];
  for (k = 0, len1 = ref1.length; k < len1; k++) {
    str = ref1[k];
    if (str.en && !existing[str.en]) {
      form.localizedStrings.push(str);
      results.push(existing[str.en] = true);
    } else {
      results.push(void 0);
    }
  }
  return results;
};

exports.hasLocalizations = function(obj, locale) {
  var strs;
  strs = exports.extractLocalizedStrings(obj);
  return _.any(strs, function(str) {
    return str[locale];
  });
};

exports.findEntityQuestion = function(form, entityType) {
  var question;
  question = _.find(exports.priorQuestions(form), function(q) {
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
