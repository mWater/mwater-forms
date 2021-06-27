// TODO: This file was created by bulk-decaffeinate.
// Sanity-check the conversion and remove this comment.
let ImageDisplayComponent;
import PropTypes from 'prop-types';
import React from 'react';
const R = React.createElement;
import ImagePopupComponent from './ImagePopupComponent';
import RotationAwareImageComponent from './RotationAwareImageComponent';

// Displays an image
export default ImageDisplayComponent = (function() {
  ImageDisplayComponent = class ImageDisplayComponent extends React.Component {
    static initClass() {
      this.propTypes = {
        image: PropTypes.object.isRequired,  // Image object to display
        imageManager: PropTypes.object.isRequired,
        T: PropTypes.func.isRequired
      };
    }

    constructor(props) {
      super(props);
      this.state = { error: false, url: null, popup: false };
    }

    componentDidMount() { return this.update(this.props); }
    componentWillReceiveProps(newProps) { return this.update(newProps); }

    update(props) {
      // Get URL of thumbnail
      return props.imageManager.getImageThumbnailUrl(props.image.id, url => {
        return this.setState({url, error: false});
      }
      , () => this.setState({error: true}));
    }

    handleImgError = () => { return this.setState({error: true}); };
    handleImgClick = () => { return this.setState({popup: true}); };

    render() {
      let src;
      if (this.state.error) {
        src = "img/no-image-icon.jpg";
      } else if (this.state.url) {
        src = this.state.url;
      } else {
        src = "img/image-loading.png";
      }

      return R('span', null,
        React.createElement(RotationAwareImageComponent, {image: this.props.image, imageManager: this.props.imageManager, onClick: this.handleImgClick, height: 100, thumbnail: true}),
        this.state.popup ?
          React.createElement(ImagePopupComponent, {
            imageManager: this.props.imageManager,
            image: this.props.image,
            onClose: () => this.setState({popup: false}),
            T: this.props.T
          }) : undefined
      );
    }
  };
  ImageDisplayComponent.initClass();
  return ImageDisplayComponent;
})();


