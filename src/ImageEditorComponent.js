let ImageEditorComponent;
import PropTypes from 'prop-types';
import React from 'react';
const R = React.createElement;
import ImageAnswerComponent from './answers/ImageAnswerComponent';

// Edit an image 
export default ImageEditorComponent = (function() {
  ImageEditorComponent = class ImageEditorComponent extends React.Component {
    static initClass() {
      this.propTypes = {
        imageManager: PropTypes.object.isRequired,
        imageAcquirer: PropTypes.object,
        image: PropTypes.object,             // e.g. { id: someid, caption: caption }
        onImageChange: PropTypes.func,       // Called when image changed
        T: PropTypes.func.isRequired,        // Localizer to use
        consentPrompt: PropTypes.string    // Question to prompt for consent
      };
  
      this.childContextTypes = {
        imageManager: PropTypes.object.isRequired,
        imageAcquirer: PropTypes.object,
        T: PropTypes.func.isRequired
      };
        // Localizer to use
    }

    getChildContext() { 
      return {
        imageManager: this.props.imageManager,
        imageAcquirer: this.props.imageAcquirer,
        T: this.props.T
      };
    }

    render() {
      return R(ImageAnswerComponent, { 
        image: this.props.image,
        onImageChange: this.props.onImageChange,
        consentPrompt: this.props.consentPrompt
      }
      );
    }
  };
  ImageEditorComponent.initClass();
  return ImageEditorComponent;
})();
