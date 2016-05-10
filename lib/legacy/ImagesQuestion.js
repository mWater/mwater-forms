var H, ImagePopupComponent, ImagesQuestion, ModalPopupComponent, Question, React, _,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Question = require('./Question');

_ = require('lodash');

React = require('react');

H = React.DOM;

ModalPopupComponent = require('react-library/lib/ModalPopupComponent');

ImagePopupComponent = require('../ImagePopupComponent');

module.exports = ImagesQuestion = (function(superClass) {
  extend(ImagesQuestion, superClass);

  function ImagesQuestion() {
    return ImagesQuestion.__super__.constructor.apply(this, arguments);
  }

  ImagesQuestion.prototype.events = {
    "click #add": "addClick",
    "click .image": "thumbnailClick"
  };

  ImagesQuestion.prototype.updateAnswer = function(answerEl) {
    var canAdd, data, i, image, images, len, noImage, notSupported, results;
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
        results = [];
        for (i = 0, len = images.length; i < len; i++) {
          image = images[i];
          results.push(this.setThumbnailUrl(answerEl.find("#" + image.id), image.id));
        }
        return results;
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
    return this.ctx.imageManager.getImageUrl(id, success, error);
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
    var id;
    id = ev.currentTarget.id;
    return ModalPopupComponent.show((function(_this) {
      return function(onClose) {
        var cover, onRemove, onSetCover;
        onRemove = null;
        onSetCover = null;
        if (!_this.options.readonly) {
          onRemove = function() {
            var images;
            images = _this.getAnswerValue() || [];
            images = _.reject(images, function(img) {
              return img.id === id;
            });
            onClose();
            return _this.setAnswerValue(images);
          };
          cover = _.findWhere(_this.getAnswerValue(), {
            id: id
          }).cover;
          if (!cover) {
            onSetCover = function() {
              var i, image, images, len;
              images = _this.getAnswerValue() || [];
              images = _.map(images, _.clone);
              for (i = 0, len = images.length; i < len; i++) {
                image = images[i];
                if (image.cover != null) {
                  delete image.cover;
                }
                if (image.id === id) {
                  image.cover = true;
                }
              }
              onClose();
              return _this.setAnswerValue(images);
            };
          }
        }
        return React.createElement(ImagePopupComponent, {
          imageManager: _this.ctx.imageManager,
          id: id,
          onClose: onClose,
          onRemove: onRemove,
          onSetCover: onSetCover
        });
      };
    })(this));
  };

  return ImagesQuestion;

})(Question);
