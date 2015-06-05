# mWater Forms

Mobile-friendly survey/form components, compiled from a XForms-inspired JSON schema.

## Features

* 12+ Question types
* Conditions & validations
* Full localization of surveys
* Entity references

## Response Lifecycle

See [Response Lifecycle](docs/Response Lifecycle.md)

### Schema versioning

The schema is stored in _schema field of the form and is an integer. 

The package exports `schemaVersion` which is the current (and maximum) version that it compiles.
It also exports `minSchemaVersion` which is the earliest version supported

### Schema versioning checklist

* Change schema 
* Increment schema version in index.coffee
* Add new version to acceptable _schema enum in schema
* Publish with new major number
* Increment version in mwater-form-designer
* npm install new version of mwater-forms in mwater-form-designer
* Publish mwater-form-designer
* npm install new version of mwater-forms in mwater-server
* Push new server
* npm install new version of mwater-forms in mwater-app
* Deploy new app
* npm install new version of mwater-forms in mwater-portal
* npm install new version of mwater-form-designer in mwater-portal
* Deploy new portal
 
## Entity support

Questions can be linked to entities to support a variety of scenarios:

* Form creates an entity of a certain type with properties mapped to questions
* Form creates an entity of a certain type with properties mapped to questions
* Selecting an entity in an entity question pre-fills answers
* Selecting an entity in an entity question causes other answers to be used to update the entity selected