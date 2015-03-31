# Property Links

These are connections between a form answer and a property of an entity. They allow loading and saving of these values, translating them appropriately.


## Format

A property link has the following properties:

property: property to link (includes code, type, etc.)

direction: `load`/`save`/`both`

question: id of question

type: 

* `direct` : direct map (deprecated: unless location which converts to geometry)
* `geometry:location` : maps a geometry property to a location question
* `enum:choice` : maps an enum property to a choice item. Needs `mappings` array of { from: <enum code>, to: <choice id> }
* `boolean:choices` : maps a boolean property to a choices item. Needs `choice`
* `boolean:choice` : maps a boolean property to a choice item. Needs `mappings` array of { from: "true"/"false", to: <choice id> }
* `boolean:alternate` : maps a boolean property to an alternate (e.g. Don't Know) answer. Needs `alternate` (e.g. "dontknow")
* `measurement:units` : maps an measurement property to a unit item. Needs `mappings` array of { from: <entity unit id>, to: <question units id> }
* `text:specify` : maps a text property to a specify (e.g. other) answer. Needs `choice`
* `decimal:location_accuracy`: maps decimal property to location accuracy
