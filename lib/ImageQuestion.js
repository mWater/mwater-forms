var ImageQuestion, Question,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  __hasProp = {}.hasOwnProperty;

Question = require('./Question');

module.exports = ImageQuestion = (function(_super) {
  __extends(ImageQuestion, _super);

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
    var id, remove;
    id = ev.currentTarget.id;
    remove = (function(_this) {
      return function() {
        return _this.setAnswerValue(null);
      };
    })(this);
    if (this.ctx.displayImage != null) {
      return this.ctx.displayImage({
        id: id,
        remove: remove
      });
    }
  };

  return ImageQuestion;

})(Question);
