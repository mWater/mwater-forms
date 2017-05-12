# Answer Formats

## Responses:
* responses = {
    questionA_ID: {...}
    questionB_ID: {...}
    ...
}

## Answer types:
* **"text"**
    - {value: "text"}
* **"number"**
    - {value: "float"}
* **"choice"**
    - {value: "choice_ID"}
* **"choices"**
    - {value: ["choiceA_ID", "choiceB_ID", ...]}
* **"boolean"**
    - {value: "true"}
* **"date"**
    - {value: "YYYY-MM-DD"}
* **"units"**
    - {value: {quantity:"12", units:"cm"}}
    - Legacy: {value: "12", units:"cm"}
* **"location"**
    - {value: {accuracy:"float", altitude:"float", altitudeAccuracy:"float", longitude:"float", latitude:"float"}}
* **"image"**
    - {value: {id:"image_ID"}}
* **"images"**
    - {value: [{id:"imageA_ID"}, {id:"imageB_ID"}, ...]}
* **"texts"**
    - {value: ["textA", "textB"]}
* **"site"**
    -  {value: {code: "siteCode"}}
    - Legacy: {value: "siteCode"}
* **"entity"** 
    - {value: "entity _id"}
* **"items_choices"**
    - object of key = item id, value: choice id
* **"matrix"**
    - { value: { ITEM1ID: { QUESTION1ID: { value: somevalue }, QUESTION2ID: { ...}}, ITEM2ID: ... }
* **"admin_region"**
    - {value: "id_of_admin_region"}
* **"aquagenx_cbt"**
    - {value:{cbt: {c1,c2,c3,c4,c5 (All booleans), healthRisk(String), mpn (Number), confidence (Number)}, image: {id:"image_ID"}}

## Alternates:
* {alternate = "na" or "dontknow"}
* **Note:** the alternated field can also be null or omitted.

## Timestamp (for recordTimestamp option)
`{ value: ..., timestamp: <ISO 8601 timestamp> }`

## Location-stamp (for recordLocation option)
`{ value: ..., location: {accuracy:"float", altitude:"float", altitudeAccuracy:"float", longitude:"float", latitude:"float"} }`

## Specify choices

`{ specify: { thechoiceid: "some value" } }`

## Comments
`{ comments: "some comment" }`

## Randomly asked questions

Stores value in `randomAsked` as boolean. This is a special value that is computed when the item is shown for the first time
based on the probability and is not deleted when cleaning the response when the question becomes invisible so it remains stable.

This also prevents a loop of hiding the question because it was randomly invisible and then making it visible again and recomputing
the randomness.