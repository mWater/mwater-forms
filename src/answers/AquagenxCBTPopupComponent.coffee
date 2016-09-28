React = require 'react'
H = React.DOM

aquagenxCBTSVGString = require './AquagenxCBTSVG'

ModalPopupComponent = require('react-library/lib/ModalPopupComponent')

possibleCombinations = {
  "false,false,false,false,false": {mpn: 0.0, confidence: 2.87, healthRisk: 'safe'}
  "false,false,false,true,false": {mpn: 1.0, confidence: 5.14, healthRisk: 'probably_safe'}
  "false,false,false,false,true": {mpn: 1.0, confidence: 4.74, healthRisk: 'probably_safe'}
  "true,false,false,false,false": {mpn: 1.1, confidence: 5.16, healthRisk: 'probably_safe'}

  "false,true,false,false,false": {mpn: 1.2, confidence: 5.64, healthRisk: 'probably_safe'}
  "false,false,true,false,false": {mpn: 1.5, confidence: 7.81, healthRisk: 'probably_safe'}
  "false,false,false,true,true": {mpn: 2.0, confidence: 6.32, healthRisk: 'probably_safe'}
  "true,false,false,true,false": {mpn: 2.1, confidence: 6.85, healthRisk: 'probably_safe'}

  "true,false,false,false,true": {mpn: 2.1, confidence: 6.64, healthRisk: 'probably_safe'}
  "false,true,false,true,false": {mpn: 2.4, confidence: 7.81, healthRisk: 'probably_safe'}
  "false,true,false,false,true": {mpn: 2.4, confidence: 8.12, healthRisk: 'probably_safe'}
  "true,true,false,false,false": {mpn: 2.6, confidence: 8.51, healthRisk: 'probably_safe'}

  "true,false,false,true,true": {mpn: 3.2, confidence: 8.38, healthRisk: 'probably_safe'}
  "false,true,false,true,true": {mpn: 3.7, confidence: 9.70, healthRisk: 'probably_safe'}
  "false,false,true,false,true": {mpn: 3.1, confidence: 11.36, healthRisk: 'possibly_safe'}
  "false,false,true,true,false": {mpn: 3.2, confidence: 11.82, healthRisk: 'possibly_safe'}

  "true,false,true,false,false": {mpn: 3.4, confidence: 12.53, healthRisk: 'possibly_safe'}
  "true,true,false,false,true": {mpn: 3.9, confidence: 10.43, healthRisk: 'possibly_safe'}
  "true,true,false,true,false": {mpn: 4.0, confidence: 10.94, healthRisk: 'possibly_safe'}
  "false,true,true,false,false": {mpn: 4.7, confidence: 22.75, healthRisk: 'possibly_safe'}

  "false,false,true,true,true": {mpn: 5.2, confidence: 14.73, healthRisk: 'possibly_safe'}
  "true,true,false,true,true": {mpn: 5.4, confidence: 12.93, healthRisk: 'possibly_safe'}
  "true,false,true,false,true": {mpn: 5.6, confidence: 17.14, healthRisk: 'possibly_safe'}
  "true,false,true,true,false": {mpn: 5.8, confidence: 16.87, healthRisk: 'possibly_safe'}

  "true,false,true,true,true": {mpn: 8.4, confidence: 21.19, healthRisk: 'possibly_safe'}
  "false,true,true,false,true": {mpn: 9.1, confidence: 37.04, healthRisk: 'possibly_safe'}
  "false,true,true,true,false": {mpn: 9.6, confidence: 37.68, healthRisk: 'possibly_safe'}
  "true,true,true,false,false": {mpn: 13.6, confidence: 83.06, healthRisk: 'possibly_unsafe'}

  "false,true,true,true,true": {mpn: 17.1, confidence: 56.35, healthRisk: 'possibly_unsafe'}
  "true,true,true,false,true": {mpn: 32.6, confidence: 145.55, healthRisk: 'probably_unsafe'}
  "true,true,true,true,false": {mpn: 48.3, confidence: 351.91, healthRisk: 'probably_unsafe'}
  "true,true,true,true,true": {mpn: 100, confidence: 9435.10, healthRisk: 'unsafe'}
}

module.exports = class AquagenxCBTPopupComponent extends React.Component
  @contextTypes:
    T: React.PropTypes.func.isRequired  # Localizer to use

  @propTypes:
    value: React.PropTypes.object
    questionId: React.PropTypes.string.isRequired
    onSave: React.PropTypes.func.isRequired
    onClose: React.PropTypes.func.isRequired

  constructor: (props) ->
    super

    value = _.clone(props.value)
    if not props.value.cbt?
      cbt = _.clone possibleCombinations["false,false,false,false,false"]
      cbt.c1 = cbt.c2 = cbt.c3 = cbt.c4 = cbt.c5 = false
      value.cbt = cbt

    @state = { value: value }

  componentDidMount: ->
    main = @refs.main
    $( main ).find( "#compartment1" ).click((ev) =>
      @handleCompartmentClick('c1')
    )
    $( main ).find( "#compartment2" ).click((ev) =>
      @handleCompartmentClick('c2')
    )
    $( main ).find( "#compartment3" ).click((ev) =>
      @handleCompartmentClick('c3')
    )
    $( main ).find( "#compartment4" ).click((ev) =>
      @handleCompartmentClick('c4')
    )
    $( main ).find( "#compartment5" ).click((ev) =>
      @handleCompartmentClick('c5')
    )

  handleCompartmentClick: (compartmentField) ->
    value = _.clone(@state.value)
    value.cbt = _.clone value.cbt
    cbtValues = value.cbt
    cbtValues[compartmentField] = !cbtValues[compartmentField]

    compartmentValues = [cbtValues.c1, cbtValues.c2, cbtValues.c3, cbtValues.c4, cbtValues.c5]
    computedValues = _.clone possibleCombinations["#{compartmentValues}"]

    cbtValues.mpn = computedValues.mpn
    cbtValues.confidence = computedValues.confidence
    cbtValues.healthRisk = computedValues.healthRisk

    @setState(value: value)

  handleSaveClick: () =>
    @props.onSave(@state.value)

  renderStyle: ->
    mainId = "#cbtPopup#{@props.questionId}"
    cbtValues = @state.value.cbt
    compartmentValues = [cbtValues.c1, cbtValues.c2, cbtValues.c3, cbtValues.c4, cbtValues.c5]
    compartmentColors = _.map compartmentValues, (c) -> if c then '#32a89b' else '#ebe7c2'
    hoverColors = _.map compartmentValues, (c) -> if c then '#62c5bb' else '#fcf8d6'
    return H.style null,
      "
        #{mainId} #compartment1 rect {
          fill: #{compartmentColors[0]};
        }
        #{mainId} #compartment2 rect {
          fill: #{compartmentColors[1]};
        }
        #{mainId} #compartment3 rect {
          fill: #{compartmentColors[2]};
        }
        #{mainId} #compartment4 rect {
          fill: #{compartmentColors[3]};
        }
        #{mainId} #compartment5 rect {
          fill: #{compartmentColors[4]};
        }

        #{mainId} #compartment1:hover > rect {
          fill: #{hoverColors[0]};
        }
        #{mainId} #compartment2:hover > rect{
          fill: #{hoverColors[1]};
        }
        #{mainId} #compartment3:hover > rect{
          fill: #{hoverColors[2]};
        }
        #{mainId} #compartment4:hover > rect {
          fill: #{hoverColors[3]};
        }
        #{mainId} #compartment5:hover > rect {
          fill: #{hoverColors[4]};
        }
      "

  renderInfo: ->
    cbtValues = @state.value.cbt
    mpn = cbtValues.mpn
    if mpn == 100
      mpn = '>100'
    return H.div null,
      H.div null,
        'MPN/100ml: '
        H.b(null, mpn)
      H.div null,
        'Upper 95% Confidence Interval/100ml: '
        H.b(null, cbtValues.confidence)
      H.div null,
        'Health Risk Category Based on MPN and Confidence Interval: '
        H.b(null, cbtValues.healthRisk)

  render: ->
    return React.createElement ModalPopupComponent,
      footer: H.div id: 'footer',
        H.button className: 'btn btn-default', id: 'save', onClick: @handleSaveClick, @context.T('Save')
        H.button type: "button", className: "btn btn-default", id: 'close', onClick: @props.onClose, @context.T('Close')
      H.div {ref: 'main', id: "cbtPopup#{@props.questionId}"},
        @renderStyle()
        H.div dangerouslySetInnerHTML: {__html: aquagenxCBTSVGString}
        @renderInfo()
