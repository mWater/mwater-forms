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
    - {value: "number"}
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
    - {value: {accuracy:"int", altitude:"decimal", altitudeAccuracy:"int", longitude:"decimal", latitude:"decimal"}}
* **"image"**
    - {value: {id:"image_ID"}}
* **"images"**
    - {value: [{id:"imageA_ID"}, {id:"imageB_ID"}, ...]}
* **"texts"**
    - {value: ["textA", "textB"]}
* **"site"**
    -  {value: {code: "siteCode"}}
    - Legacy: {value: "siteCode"}

##Alternates:
* {alternate = "na" or "dontknow"}
* **Note:** the alternated field can also be null or omitted.
