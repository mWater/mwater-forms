# Form JSON

This documents the JSON used to describe forms, including questions, sections, conditions, validations etc.

## Form element

The top-level element is a Form element. It contains basic information about the form and a list of contents

Fields:
* **_id**: UUID of the form
* **_type**: "Form" 
* **locales**: Array of locales
* **localizedStrings**: Form-level localizations for strings that are not user-defined

## Locale

Represents a single locale of the form. Object:
* **code**: ISO language code (e.g. "es")
* **name**: Language name localized (e.g. "English")

## Questions

Fields:
* **_type**: "[specific-type]Question"
* **recordTimestamp**: true to record time when question was answered in timestamp field
* **recordLocation**: true to record location where question was answered in location field (latitude:..., longitude:..., etc.)
* **sticky**: true to re-use answer on next response by default
