# Forms support for Entities

Entities are database records that can be updated over time. They have a type (table name) and properties (columns).

Properties have the following structure:
_id - uuid of the property
type - text, decimal, integer, enum, boolean, image, imagelist, json, geometry, measurement, date, entity
code - human-readable unique name per entity type. Also column name
name - localized name of property (e.g. { _base: "en", en: "cat", fr: "chat" })
values - values of enum. e.g. [{ code: "yes", name: { _base: "en", en: "Yes", fr: "Oui"}}, { code: "no", name: { _base: "en", en: "No", fr: "Non"}}]
units - units of measurement e.g. [{ code: "cm", name: { _base: "en", en: "Centimeters" }}, ...]

Entities are manipulated using Entity Questions.

Entity questions can:
- load entity data into other questions when an entity is selected
- save question data to the entity when the response is finalized
- create entities if one is not selected

See FormView.coffee or EntityTests.coffee for more details.