# mWater Forms

Mobile-friendly survey/form components, compiled from a XForms-inspired JSON schema.

## Features

* 12+ Question types
* Conditions & validations
* Full localization of surveys

### Schema versioning

The schema is stored in _schema field of the form and is an integer. 

The package exports `schemaVersion` which is the current (and maximum) version that it compiles.
It also exports `minSchemaVersion` which is the earliest version supported