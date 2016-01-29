var Backbone, Sections, _, ezlocalize,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Backbone = require('backbone');

_ = require('lodash');

if (process.browser) {
  require('./jquery-scrollintoview');
}

ezlocalize = require('ez-localize');

module.exports = Sections = (function(superClass) {
  extend(Sections, superClass);

  function Sections() {
    return Sections.__super__.constructor.apply(this, arguments);
  }

  Sections.prototype.className = "survey";

  Sections.prototype.initialize = function(options) {
    this.options = options || {};
    this.sections = this.options.sections;
    this.T = options.T || ezlocalize.defaultT;
    this.render();
    this.listenTo(this.model, "change", this.renderNextPrev);
    this.showSection(0);
  };

  Sections.prototype.events = {
    "click #discard": "discard",
    "click #close": "close",
    "click .next": "nextSection",
    "click .prev": "prevSection",
    "click .finish": "finish",
    "click a.section-crumb": "crumbSection"
  };

  Sections.prototype.finish = function() {
    var section;
    section = this.sections[this.section];
    if (section.validate()) {
      return this.trigger("complete");
    }
  };

  Sections.prototype.close = function() {
    return this.trigger("close");
  };

  Sections.prototype.discard = function() {
    return this.trigger("discard");
  };

  Sections.prototype.crumbSection = function(e) {
    var index;
    index = parseInt(e.target.getAttribute("data-value"));
    return this.showSection(index);
  };

  Sections.prototype.getNextSectionIndex = function() {
    var i;
    i = this.section + 1;
    while (i < this.sections.length) {
      if (this.sections[i].shouldBeVisible()) {
        return i;
      }
      i++;
    }
  };

  Sections.prototype.getPrevSectionIndex = function() {
    var i;
    i = this.section - 1;
    while (i >= 0) {
      if (this.sections[i].shouldBeVisible()) {
        return i;
      }
      i--;
    }
  };

  Sections.prototype.nextSection = function() {
    var section;
    section = this.sections[this.section];
    if (section.validate()) {
      return this.showSection(this.getNextSectionIndex());
    }
  };

  Sections.prototype.prevSection = function() {
    return this.showSection(this.getPrevSectionIndex());
  };

  Sections.prototype.showSection = function(index) {
    var data, sectionsIndex, visibleSections;
    this.section = index;
    _.each(this.sections, function(s) {
      return s.$el.hide();
    });
    this.sections[index].$el.show();
    visibleSections = _.filter(_.take(this.sections, index + 1), function(s) {
      return s.shouldBeVisible();
    });
    index = 1;
    sectionsIndex = _.map(_.initial(visibleSections), function(s) {
      return {
        label: (index++) + "."
      };
    });
    data = {
      lastSectionLabel: index + ". " + (_.last(visibleSections).name) + " ",
      sectionsIndex: sectionsIndex
    };
    this.$(".breadcrumb").html(require('./templates/Sections_breadcrumbs.hbs')(data, {
      helpers: {
        T: this.T
      }
    }));
    this.renderNextPrev();
    return this.$el.scrollintoview();
  };

  Sections.prototype.renderNextPrev = function() {
    this.$(".prev").toggle(this.getPrevSectionIndex() != null);
    this.$(".next").toggle(this.getNextSectionIndex() != null);
    return this.$(".finish").toggle(this.getNextSectionIndex() == null);
  };

  Sections.prototype.render = function() {
    var sectionsEl;
    this.$el.html(require('./templates/Sections.hbs')({
      submitLabel: this.options.submitLabel,
      discardLabel: this.options.discardLabel,
      allowSaveForLater: this.options.allowSaveForLater
    }, {
      helpers: {
        T: this.T
      }
    }));
    sectionsEl = this.$(".sections");
    _.each(this.sections, function(s) {
      return sectionsEl.append(s.$el);
    });
    return this;
  };

  Sections.prototype.remove = function() {
    var j, len, ref, section;
    ref = this.sections;
    for (j = 0, len = ref.length; j < len; j++) {
      section = ref[j];
      section.remove();
    }
    return Sections.__super__.remove.call(this);
  };

  return Sections;

})(Backbone.View);
