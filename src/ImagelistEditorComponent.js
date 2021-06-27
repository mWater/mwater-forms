let ImagelistEditorComponent;
import PropTypes from 'prop-types';
import React from 'react';
const R = React.createElement;
import ImagesAnswerComponent from './answers/ImagesAnswerComponent';

// Edit an image list
export default ImagelistEditorComponent = (function() {
  ImagelistEditorComponent = class ImagelistEditorComponent extends React.Component {
    static initClass() {
      this.propTypes = {
        imageManager: PropTypes.object.isRequired,
        imageAcquirer: PropTypes.object,
        imagelist: PropTypes.array,             // e.g. [{ id: someid, caption: caption }]
        onImagelistChange: PropTypes.func,       // Called when image list changed
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
      return R(ImagesAnswerComponent, { 
        imagelist: this.props.imagelist,
        onImagelistChange: this.props.onImagelistChange,
        consentPrompt: this.props.consentPrompt
      }
      );
    }
  };
  ImagelistEditorComponent.initClass();
  return ImagelistEditorComponent;
})();
