# Form JSON

This documents the JSON used to describe forms, including questions, sections, conditions, validations etc.

## Form element

The top-level element is a Form element. It contains basic information about the form and a list of contents

Fields:
* **_id**: UUID of the form
* **_type**: "Form" 
* **_schema**: schema of the form (e.g. 1)
* **locales**: Array of locales
* **localizedStrings**: Form-level localizations for strings that are not user-defined
* **contents**: Array of sections or questions

## Locale

Represents a single locale of the form. Object:
* **code**: ISO language code (e.g. "es")
* **name**: Language name localized (e.g. "English")

## Localized string

TODO

## Sections
* **_id**: UUID of the section
* **_type**: "Section" 
* **text**: Localized string of the section name
* **conditions**: Array of conditions to make question visible


## Questions

Fields:
* **_id**: UUID of the question
* **_type**: "[specific-type]Question"
* **_basedOn**: UUID of the question that this question was duplicated from
* **text**: Localized string of the question prompt
* **hint**: Localized string of a hint to be displayed
* **help**: Localized string of longer help text in markdown
* **required**: true if question requires an answer
* **validations**: Array of validations to check answer to question
* **conditions**: Array of conditions to make question visible
* **commentsField**: true show a comments box with question
* **recordTimestamp**: true to record time when question was answered in timestamp field
* **recordLocation**: true to record location where question was answered in location field (latitude:..., longitude:..., etc.)
* **sticky**: true to re-use answer on next response by default

### Question Types
TODO 

format (date and text)

decimal

choices

units
unitsPosition
defaultUnit

### Conditions

Fields:

* **lhs**: { question: "*question id*" }
* **op**: "*operation*"
* **rhs**: { literal: <some literal value> }

TODO all conditions

#### Condition operations

* **present**:
* **!present**:
* **contains**:
* **!contains**:
* **=**:
* **>**:
* **<**:
* **!=**:
* **is**:
* **isnt**:
* **includes**:
* **!includes**:
* **before**:
* **after**:
* **true**:
* **false**:

TODO

### Validations

Fields:
* **op**: "*operation*"
* **rhs**: { literal: *some literal value* }

#### Validation Operations

**range**: Takes a literal `min` and `max`, each of which is optional
**lengthRange**: Takes a literal `min` and `max`, each of which is optional to constrain number of characters
**regex**: Takes a regular expression to validate

TODO

