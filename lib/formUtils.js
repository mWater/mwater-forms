var localizations, _;

_ = require('lodash');

localizations = require('../localizations.json');

exports.createUid = function() {
  return 'zxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xyz]/g, function(c) {
    var r, v;
    r = Math.random() * 16 | 0;
    v = c === 'x' ? r : c === 'y' ? r & 0x3 | 0x8 : r | 0xC;
    return v.toString(16);
  });
};

exports.createShortUid = function() {
  var chrs, i, id, _i;
  chrs = "abcdefghjklmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ123456789";
  while (true) {
    id = "";
    for (i = _i = 1; _i <= 7; i = ++_i) {
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
  if ((str == null) || !str._base) {
    return "";
  }
  if (str[locale || "en"]) {
    return str[locale || "en"];
  }
  return str[str._base] || "";
};

exports.priorQuestions = function(form, refItem) {
  var item, item2, priors, _i, _j, _len, _len1, _ref, _ref1;
  priors = [];
  _ref = form.contents;
  for (_i = 0, _len = _ref.length; _i < _len; _i++) {
    item = _ref[_i];
    if ((refItem != null) && item._id === refItem._id) {
      return priors;
    }
    if (exports.isQuestion(item)) {
      priors.push(item);
    }
    if (item._type === "Section") {
      _ref1 = item.contents;
      for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
        item2 = _ref1[_j];
        if ((refItem != null) && item2._id === refItem._id) {
          return priors;
        }
        if (exports.isQuestion(item2)) {
          priors.push(item2);
        }
      }
    }
  }
  return priors;
};

exports.findItem = function(form, questionId) {
  var item, item2, _i, _j, _len, _len1, _ref, _ref1;
  _ref = form.contents;
  for (_i = 0, _len = _ref.length; _i < _len; _i++) {
    item = _ref[_i];
    if (item._id === questionId) {
      return item;
    }
    if (item._type === "Section") {
      _ref1 = item.contents;
      for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
        item2 = _ref1[_j];
        if (item2._id === questionId) {
          return item2;
        }
      }
    }
  }
};

exports.prepareQuestion = function(q) {
  var key, knownFields, _i, _len, _ref;
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
      _.defaults(q, {
        decimal: true
      });
      break;
    case "DropdownQuestion":
    case "RadioQuestion":
    case "MulticheckQuestion":
      _.defaults(q, {
        choices: []
      });
      break;
    case "DateQuestion":
      _.defaults(q, {
        format: "YYYY-MM-DD"
      });
      break;
    case "UnitsQuestion":
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
  knownFields = ['_id', '_type', 'text', 'conditions', 'validations', 'required', 'code', 'hint', 'help', 'alternates', 'commentsField', 'recordLocation', 'recordTimestamp', 'sticky', 'exportId'];
  switch (q._type) {
    case "TextQuestion":
    case "DateQuestion":
      knownFields.push("format");
      break;
    case "NumberQuestion":
      knownFields.push("decimal");
      break;
    case "DropdownQuestion":
    case "RadioQuestion":
    case "MulticheckQuestion":
      knownFields.push("choices");
      break;
    case "UnitsQuestion":
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
  }
  _ref = _.keys(q);
  for (_i = 0, _len = _ref.length; _i < _len; _i++) {
    key = _ref[_i];
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
      return "text";
    case "NumberQuestion":
      return "number";
    case "DropdownQuestion":
    case "RadioQuestion":
      return "choice";
    case "MulticheckQuestion":
      return "choices";
    case "DateQuestion":
      return "date";
    case "UnitsQuestion":
      return "units";
    case "CheckQuestion":
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
    case "EntityQuestion":
      return "entity";
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
  var dup, question, _i, _len, _ref, _ref1;
  if (!idMap && ((_ref = item._type) === "Form" || _ref === "Section")) {
    idMap = {};
    _ref1 = exports.priorQuestions(item);
    for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
      question = _ref1[_i];
      idMap[question._id] = exports.createUid();
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

exports.updateLocalizations = function(form) {
  var existing, str, _i, _j, _len, _len1, _ref, _ref1, _results;
  form.localizedStrings = form.localizedStrings || [];
  existing = {};
  _ref = form.localizedStrings;
  for (_i = 0, _len = _ref.length; _i < _len; _i++) {
    str = _ref[_i];
    if (str.en) {
      existing[str.en] = true;
    }
  }
  _ref1 = localizations.strings;
  _results = [];
  for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
    str = _ref1[_j];
    if (str.en && !existing[str.en]) {
      form.localizedStrings.push(str);
      _results.push(existing[str.en] = true);
    } else {
      _results.push(void 0);
    }
  }
  return _results;
};
