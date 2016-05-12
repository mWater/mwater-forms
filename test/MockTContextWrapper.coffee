React = require 'react'

# Add context "T" which is required by question component
module.exports = class MockTContextWrapper extends React.Component
  @childContextTypes: 
    T: React.PropTypes.func.isRequired  # Localizer to use

  getChildContext: -> { T: (str) -> str }

  render: -> React.cloneElement(React.Children.only(@props.children), ref: "main")
