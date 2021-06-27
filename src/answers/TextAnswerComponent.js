let TextAnswerComponent;
import PropTypes from 'prop-types';
import React from 'react';
const R = React.createElement;

export default TextAnswerComponent = (function() {
  TextAnswerComponent = class TextAnswerComponent extends React.Component {
    static initClass() {
      this.propTypes = {
        value: PropTypes.string,
        format: PropTypes.string.isRequired,
        readOnly: PropTypes.bool,
        onValueChange: PropTypes.func.isRequired,
        onNextOrComments: PropTypes.func
      };
  
      this.defaultProps =
        {readOnly: false};
    }

    constructor(props) {
      this.handleKeyDown = this.handleKeyDown.bind(this);
      this.handleBlur = this.handleBlur.bind(this);
      super(props);
    
      this.state = {text: props.value};
    }

    componentWillReceiveProps(nextProps) {
      // If different, override text
      if (nextProps.value !== this.props.value) {
        return this.setState({text: (nextProps.value != null) ? nextProps.value : ""});
      }
    }

    focus() {
      return this.input.focus();
    }

    handleKeyDown(ev) {
      if (this.props.onNextOrComments != null) {
        // When pressing ENTER or TAB
        if ((ev.keyCode === 13) || (ev.keyCode === 9)) {
          this.props.onNextOrComments(ev);
          // It's important to prevent the default behavior when handling tabs (or else the tab is applied after the focus change)
          return ev.preventDefault();
        }
      }
    }

    handleBlur(ev) {
      return this.props.onValueChange(ev.target.value ? ev.target.value : null);
    }

    render() {
      if (this.props.format === "multiline") {
        return R('textarea', {
          className: "form-control",
          id: 'input',
          ref: c => { return this.input = c; },
          value: this.state.text || "",
          rows: "5",
          readOnly: this.props.readOnly,
          onBlur: this.handleBlur,
          onChange: ev => this.setState({text: ev.target.value})
        });
      } else {
        return R('input', {
          className: "form-control",
          id: 'input',
          ref: c => { return this.input = c; },
          type: "text",
          value: this.state.text || "",
          readOnly: this.props.readOnly,
          onKeyDown: this.handleKeyDown,
          onBlur: this.handleBlur,
          onChange: ev => this.setState({text: ev.target.value})
        });
      }
    }
  };
  TextAnswerComponent.initClass();
  return TextAnswerComponent;
})();