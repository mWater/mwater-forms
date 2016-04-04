var H, ImagePopupComponent, ImageQuestion, ModalPopupComponent, Question, React,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Question = require('./Question');

React = require('react');

H = React.DOM;

ModalPopupComponent = require('react-library/lib/ModalPopupComponent');

ImagePopupComponent = require('../ImagePopupComponent');

module.exports = ImageQuestion = (function(superClass) {
  extend(ImageQuestion, superClass);

  function ImageQuestion() {
    return ImageQuestion.__super__.constructor.apply(this, arguments);
  }

  ImageQuestion.prototype.events = {
    "click #add": "addClick",
    "click .image": "thumbnailClick"
  };

  ImageQuestion.prototype.updateAnswer = function(answerEl) {
    var canAdd, data, image, noImage, notSupported;
    if (!this.ctx.imageManager) {
      return answerEl.html('<div class="text-warning">' + this.T("Images not available on this platform") + '</div>');
    } else {
      image = this.getAnswerValue();
      notSupported = false;
      if (this.options.readonly) {
        canAdd = false;
      } else if (this.ctx.imageAcquirer) {
        canAdd = image == null;
      } else {
        canAdd = false;
        notSupported = !image;
      }
      noImage = !canAdd && !image && !notSupported;
      data = {
        image: image,
        canAdd: canAdd,
        noImage: noImage,
        notSupported: notSupported
      };
      answerEl.html(require('./templates/ImageQuestion.hbs')(data, {
        helpers: {
          T: this.T
        }
      }));
      if (image) {
        return this.setThumbnailUrl(answerEl.find("#" + image.id), image.id);
      }
    }
  };

  ImageQuestion.prototype.setThumbnailUrl = function(elem, id) {
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

  ImageQuestion.prototype.addClick = function() {
    if (this.options.consentPrompt) {
      if (!confirm(this.options.consentPrompt)) {
        return;
      }
    }
    return this.ctx.imageAcquirer.acquire((function(_this) {
      return function(id) {
        return _this.setAnswerValue({
          id: id
        });
      };
    })(this), this.ctx.error);
  };

  ImageQuestion.prototype.thumbnailClick = function(ev) {
    var id;
    id = ev.currentTarget.id;
    return ModalPopupComponent.show((function(_this) {
      return function(onClose) {
        var onRemove;
        onRemove = function() {
          onClose();
          return _this.setAnswerValue(null);
        };
        return React.createElement(ImagePopupComponent, {
          imageManager: _this.ctx.imageManager,
          id: id,
          onClose: onClose,
          onRemove: onRemove
        });
      };
    })(this));
  };

  return ImageQuestion;

})(Question);
