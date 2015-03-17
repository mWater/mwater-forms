var ImagesQuestion, Question, _,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  __hasProp = {}.hasOwnProperty;

Question = require('./Question');

_ = require('underscore');

module.exports = ImagesQuestion = (function(_super) {
  __extends(ImagesQuestion, _super);

  function ImagesQuestion() {
    return ImagesQuestion.__super__.constructor.apply(this, arguments);
  }

  ImagesQuestion.prototype.events = {
    "click #add": "addClick",
    "click .image": "thumbnailClick"
  };

  ImagesQuestion.prototype.updateAnswer = function(answerEl) {
    var canAdd, data, image, images, noImage, notSupported, _i, _len, _results;
    if (!this.ctx.imageManager) {
      return answerEl.html('<div class="text-warning">' + this.T("Images not available on this platform") + '</div>');
    } else {
      images = this.getAnswerValue();
      notSupported = false;
      if (this.options.readonly) {
        canAdd = false;
      } else if (this.ctx.imageAcquirer) {
        canAdd = true;
      } else {
        canAdd = false;
        notSupported = !images || images.length === 0;
      }
      noImage = !canAdd && (!images || images.length === 0) && !notSupported;
      data = {
        images: images,
        canAdd: canAdd,
        noImage: noImage,
        notSupported: notSupported
      };
      answerEl.html(require('./templates/ImagesQuestion.hbs')(data, {
        helpers: {
          T: this.T
        }
      }));
      if (images) {
        _results = [];
        for (_i = 0, _len = images.length; _i < _len; _i++) {
          image = images[_i];
          _results.push(this.setThumbnailUrl(answerEl.find("#" + image.id), image.id));
        }
        return _results;
      }
    }
  };

  ImagesQuestion.prototype.setThumbnailUrl = function(elem, id) {
    var error, success;
    success = (function(_this) {
      return function(url) {
        return elem.attr("src", url);
      };
    })(this);
    error = (function(_this) {
      return function() {
        return elem.attr("src", "img/no-image-icon.jpg");
      };
    })(this);
    return this.ctx.imageManager.getImageThumbnailUrl(id, success, error);
  };

  ImagesQuestion.prototype.addClick = function() {
    if (this.options.consentPrompt) {
      if (!confirm(this.options.consentPrompt)) {
        return;
      }
    }
    return this.ctx.imageAcquirer.acquire((function(_this) {
      return function(id) {
        var images;
        images = _this.getAnswerValue() || [];
        images = images.slice(0);
        images.push({
          id: id
        });
        if (images.length === 1) {
          images[0].cover = true;
        }
        return _this.setAnswerValue(images);
      };
    })(this), this.ctx.error);
  };

  ImagesQuestion.prototype.thumbnailClick = function(ev) {
    var cover, id, remove, setCover;
    id = ev.currentTarget.id;
    remove = null;
    setCover = null;
    if (!this.options.readonly) {
      remove = (function(_this) {
        return function() {
          var images;
          images = _this.getAnswerValue() || [];
          images = _.reject(images, function(img) {
            return img.id === id;
          });
          return _this.setAnswerValue(images);
        };
      })(this);
      cover = _.findWhere(this.getAnswerValue(), {
        id: id
      }).cover;
      if (!cover) {
        setCover = (function(_this) {
          return function() {
            var image, images, _i, _len;
            images = _this.getAnswerValue() || [];
            images = _.map(images, _.clone);
            for (_i = 0, _len = images.length; _i < _len; _i++) {
              image = images[_i];
              if (image.cover != null) {
                delete image.cover;
              }
              if (image.id === id) {
                image.cover = true;
              }
            }
            return _this.setAnswerValue(images);
          };
        })(this);
      }
    }
    if (this.ctx.displayImage != null) {
      return this.ctx.displayImage({
        id: id,
        remove: remove,
        setCover: setCover
      });
    }
  };

  return ImagesQuestion;

})(Question);
