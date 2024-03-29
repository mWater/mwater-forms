// @ts-nocheck
let MockTContextWrapper
import React from "react"
import PropTypes from "prop-types"

// Add context "T" which is required by question component
export default MockTContextWrapper = (function () {
  MockTContextWrapper = class MockTContextWrapper extends React.Component {
    static initClass() {
      this.childContextTypes = { T: PropTypes.func.isRequired }
      // Localizer to use
    }

    getChildContext() {
      return {
        T(str: any) {
          return str
        }
      }
    }

    render() {
      return this.props.children
    }
  }
  MockTContextWrapper.initClass()
  return MockTContextWrapper
})()
