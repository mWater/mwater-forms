var ControlList;

module.exports = ControlList = (function() {
  function ControlList(contents, view) {
    var content, j, len, ref;
    this.contents = contents;
    this.view = view;
    ref = this.contents;
    for (j = 0, len = ref.length; j < len; j++) {
      content = ref[j];
      this.view.listenTo(content, 'nextQuestion', this.focusNextQuestion.bind(this, content));
    }
  }

  ControlList.prototype.focusNextQuestion = function(content) {
    var index;
    index = this.contents.indexOf(content);
    index++;
    while (index < this.contents.length) {
      content = this.contents[index];
      if (content.visible) {
        content.setFocus(this.view.$el[0].offsetTop);
        return true;
      }
      index++;
    }
    return false;
  };

  ControlList.prototype.validate = function() {
    var i, items, j, ref, results;
    items = _.filter(this.contents, function(c) {
      return c.visible && c.validate;
    });
    results = _.map(items, function(item) {
      return item.validate();
    });
    for (i = j = 0, ref = items.length; 0 <= ref ? j < ref : j > ref; i = 0 <= ref ? ++j : --j) {
      if (results[i]) {
        items[i].$el.scrollintoview();
      }
    }
    return !_.any(results);
  };

  return ControlList;

})();
