import _ from 'lodash';
import { assert } from "chai";
import formUtils from '../src/formUtils';
import simpleForm from './simpleForm';
import sectionedForm from './sectionedForm';
import propertyLinksFormDesign from './propertyLinksFormDesign';
import canonical from 'canonical-json';

const compare = (actual, expected) => assert.equal(canonical(actual), canonical(expected), "\n" + canonical(actual) + "\n" + canonical(expected) + "\n");

describe("FormUtils", function() {
  describe("priorQuestions", () => context('two prior questions, one following', function() {
    it('returns prior questions', function() {
      const priors = formUtils.priorQuestions(simpleForm, simpleForm.contents[2]);
      return assert.deepEqual(_.pluck(priors, "_id"), ['0001', '0002']);
  });

    it("correctly handles sections", function() {
      const priors = formUtils.priorQuestions(sectionedForm, sectionedForm.contents[0].contents[2]);
      return assert.deepEqual(_.pluck(priors, "_id"), ['0001', '0002']);
  });

    it("correctly handles sections as item", function() {
      const priors = formUtils.priorQuestions(sectionedForm, sectionedForm.contents[1]);
      return assert.deepEqual(_.pluck(priors, "_id"), ['0001', '0002', '0003', '0004', 'N0005']);
  });

    it('includes group contents', function() {
      const form = {
        _type: "Form",
        contents: [
          { _id: "groupid", _type: "Group", contents: simpleForm.contents }
        ]
      };
      const priors = formUtils.priorQuestions(form);
      return assert.deepEqual(_.pluck(priors, "_id"), ['0001', '0002', '0003', '0004']);
  });

    it("doesn't include roster contents by default", function() {
      const form = {
        _type: "Form",
        contents: [
          { _id: "groupid", _type: "RosterGroup", contents: simpleForm.contents }
        ]
      };
      const priors = formUtils.priorQuestions(form);
      return assert.deepEqual(_.pluck(priors, "_id"), []);
  });

    return it("includes roster contents only if rosterId specified", function() {
      const form = {
        _type: "Form",
        contents: [
          { _id: "groupid", _type: "RosterGroup", contents: simpleForm.contents }
        ]
      };
      const priors = formUtils.priorQuestions(form, null, "groupid");
      return assert.deepEqual(_.pluck(priors, "_id"), ['0001', '0002', '0003', '0004']);
  });
}));

  describe("getRosterIds", () => it('gets unique roster ids', function() {
    const form = _.cloneDeep(sectionedForm);
    form.contents[0].contents.push(
      { _id: "groupid", _type: "RosterGroup", contents: [] }
    );

    return assert.deepEqual(formUtils.getRosterIds(form), ["groupid"]);
}));

  describe("findItem", function() {
    it('finds question', () => assert.equal(formUtils.findItem(simpleForm, "0002")._id, "0002"));

    it("finds section", () => assert.equal(formUtils.findItem(sectionedForm, "2")._id, "2"));
 
    return it("correctly handles sections", () => assert.equal(formUtils.findItem(sectionedForm, "0002")._id, "0002"));
  });

  describe("prepareQuestion", function() {
    context("blank TextQuestion that is prepared", function() {
      beforeEach(function() { 
        this.question = { _type: "TextQuestion" };
        return formUtils.prepareQuestion(this.question);
      });

      it("adds _id", function() {
        return assert.equal(this.question._id.length, 32);
      });

      it("adds text", function() {
        return assert.deepEqual(this.question.text, {});
    });

      it("adds required:false", function() {
        return assert.equal(this.question.required, false);
      });

      it("adds empty conditions", function() {
        return assert.deepEqual(this.question.conditions, []);
    });
        
      return it("adds empty validations", function() {
        return assert.deepEqual(this.question.validations, []);
    });
  });

    it("adds decimal:true to NumberQuestion and NumberColumnQuestion", function() {
      let question = formUtils.prepareQuestion({ _type: "NumberQuestion" });
      assert.equal(question.decimal, true);

      question = formUtils.prepareQuestion({ _type: "NumberColumnQuestion" });
      return assert.equal(question.decimal, true);
    });
        
    it("removes choices for NumberQuestion", function() {
      const question = formUtils.prepareQuestion({ _type: "NumberQuestion", choices: [] });
      return assert.isUndefined(question.choices);
    });

    it("removes decimal for TextQuestion", function() {
      const question = formUtils.prepareQuestion({ _type: "TextQuestion", decimal: true });
      return assert.isUndefined(question.decimal);
    });

    it("adds choices to RadioQuestion and DropdownColumnQuestion", function() {
      let question = formUtils.prepareQuestion({ _type: "RadioQuestion" });
      assert.deepEqual(question.choices, []);

      question = formUtils.prepareQuestion({ _type: "DropdownColumnQuestion" });
      return assert.deepEqual(question.choices, []);
  });
        
    // it "adds items? to MultipleTextQuestion"
    // it "adds items? to MultipleNumberQuestion"
    it("adds format to DateQuestion", function() {
      const question = formUtils.prepareQuestion({ _type: "DateQuestion" });
      return assert.equal(question.format, "YYYY-MM-DD");
    });

    return it("adds format to TextQuestion", function() {
      const question = formUtils.prepareQuestion({ _type: "TextQuestion" });
      return assert.equal(question.format, "singleline");
    });
  });

    //it "adds format to DateTimeQuestion"

  describe("changeQuestionType", function() {
    beforeEach(function() { 
      this.question = { 
        _type: "TextQuestion",
        validations: [
          {
            op: "lengthRange",
            rhs: { literal: { min: 6, max: 8 } },
            message: { _base: "es", es: "message" }
          }
        ]
      }; 
      return formUtils.prepareQuestion(this.question);
    });

    it("removed validations", function() {
      formUtils.changeQuestionType(this.question, "DateQuestion");
      return assert.equal(this.question.validations.length, 0);
    });

    return it("removes format", function() {
      formUtils.changeQuestionType(this.question, "DateQuestion");
      return assert.equal(this.question.format, "YYYY-MM-DD");
    });
  }); 
      
  describe("duplicateItem", function() {
    describe("duplicate question", function() {
      before(function() {
        return this.duplicate = formUtils.duplicateItem(simpleForm.contents[0]);
      });

      it("sets new id", function() {
        return assert.notEqual(this.duplicate._id, simpleForm.contents[0]._id);
      });

      return it("sets _basedOn", function() {
        return assert.equal(this.duplicate._basedOn, simpleForm.contents[0]._id);
      });
    });

    describe("duplicate section", function() {
      before(function() {
        return this.duplicate = formUtils.duplicateItem(sectionedForm.contents[0]);
      });

      it("sets new id", function() {
        return assert.notEqual(this.duplicate._id, sectionedForm.contents[0]._id);
      });

      it("sets _basedOn", function() {
        return assert.equal(this.duplicate._basedOn, sectionedForm.contents[0]._id);
      });

      it("duplicates questions", function() {
        return assert.equal(this.duplicate.contents[0]._basedOn, sectionedForm.contents[0].contents[0]._id);
      });

      it("maps references in conditions", function() {
        return assert.equal(this.duplicate.contents[2].conditions[0].lhs.question, this.duplicate.contents[1]._id);
      });

      it("handles OR conditions");  
      return it("handles AND conditions");
    });  

    it("removes conditions which reference non-present questions", function() {
      this.duplicate = formUtils.duplicateItem(sectionedForm.contents[1]);
      return assert.equal(this.duplicate.contents[0].conditions.length, 0);
    });

    describe("duplicates form calculations", function() {
      before(function() {
        sectionedForm['calculations'] = [
          {
            _id: "calc1",
            name: { en: "Calculation 1", _base: "en" },
            expr: {
              type: "op",
              op: "/",
              table: "responses:f1",
              exprs: [
                {
                  column: "data:N0005:value",
                  table: "responses:f1",
                  type: "field"
                },
                {
                    value: 10,
                    type: "literal"
                }
              ],
            }
          },
          {
            _id: "calc2",
            name: { en: "Calculation 2", _base: "en" },
            expr: {
              type: "op",
              op: "/",
              table: "responses:f1",
              exprs: [
                {
                  column: "calculation:calc1",
                  table: "responses:f1",
                  type: "field"
                },
                {
                    value: 10,
                    type: "literal"
                }
              ],
            }
          }
        ];
        return this.duplicate = formUtils.duplicateItem(sectionedForm);
      });
      
      it("regenerates calculation IDs", function() {
        return assert.notEqual(this.duplicate.calculations[0]._id, sectionedForm.calculations[0]._id);
      });
      
      it("properly updates calculations references within calculations", function() {
        return assert.equal(this.duplicate.calculations[1].expr.exprs[0].column.split(":")[1], this.duplicate.calculations[0]._id);
      });

      return it("calculation column references new IDs", function() {
        return assert.equal(this.duplicate.calculations[0].expr.exprs[0].column.split(":")[1], this.duplicate.contents[0].contents[4]._id);
      });
    });

    return describe("duplicate form", function() {
      before(function() {
        return this.duplicate = formUtils.duplicateItem(sectionedForm);
      });

      it("sets _basedOn", function() {
        return assert.equal(this.duplicate.contents[0]._basedOn, sectionedForm.contents[0]._id);
      });

      it("duplicates questions", function() {
        return assert.equal(this.duplicate.contents[0].contents[0]._basedOn, sectionedForm.contents[0].contents[0]._id);
      });

      it("maps references across sections", function() {
        return assert.equal(this.duplicate.contents[1].contents[0].conditions[0].lhs.question, this.duplicate.contents[0].contents[2]._id);
      });

      return it("duplicates locales", function() {
        return assert.equal(this.duplicate.locales[0].code, "en");
      });
    });
  });

  describe("update localizations", () => it("adds form-level localizations", function() {
    const form = _.cloneDeep(simpleForm);

    formUtils.updateLocalizations(form);
    return assert(form.localizedStrings.length > 5);
  }));

  describe("hasLocalizations", function() {
    it("true if has one translation", function() {
      const obj = [
        { _base: "en", en: "x", fr: "y" }
      ];
      assert.isTrue(formUtils.hasLocalizations(obj, "fr"));
      return assert.isFalse(formUtils.hasLocalizations(obj, "de"));
    });

    return it("false if blank/non-existent", function() {
      const obj = [
        { _base: "en", en: "x", fr: "" }
      ];
      return assert.isFalse(formUtils.hasLocalizations(obj, "fr"));
    });
  });

  describe("extractLocalizedStrings", function() {
    it("gets all strings", function() {
      const obj = {
        a: [
          { 
            b: { _base: "en", en: "hello" }
          },
          { 
            c: { _base: "es", en: "hello2" }
          }
        ],
        d: "test",
        e: null
      };
      const strs = formUtils.extractLocalizedStrings(obj);

      return assert.deepEqual(strs, [{ _base: "en", en: "hello" }, { _base: "es", en: "hello2" }]);
  });

    return it("gets localizedStrings strings", function() {
      const obj = {
        localizedStrings: [
          { 
            b: { _base: "en", en: "hello" }
          },
          { 
            c: { _base: "es", en: "hello2" }
          }
        ],
        d: "test",
        e: null
      };
      const strs = formUtils.extractLocalizedStrings(obj);

      return assert.deepEqual(strs, [{ _base: "en", en: "hello" }, { _base: "es", en: "hello2" }]);
  });
});

  describe("findEntityQuestion", () => it("can find entity questions from inside rosters", function() {
    const formDesign = {"name":{"en":"Roster matrix site survey","_base":"en"},"_type":"Form","_schema":21,"locales":[{"code":"en","name":"English"}],"contents":[{"_id":"52a494e3623a43f4ab17d777512f9ab4","name":{"en":"Untitled Section","_base":"en"},"_type":"Section","contents":[{"_id":"fde9c0d3a1834845884dcf3add4e3142","name":{"en":"site details","_base":"en"},"_type":"RosterMatrix","allowAdd":true,"contents":[{"_id":"8f2f5a526296469b8ea6daec6bfdce70","text":{"en":"What site","_base":"en"},"_type":"SiteColumnQuestion","required":false,"siteType":"water_point","validations":[]},{"_id":"15287c8b0c03427fa36052e432dcd10f","text":{"en":"How long?","_base":"en"},"_type":"NumberColumnQuestion","decimal":true,"required":false,"validations":[]}],"conditions":[],"allowRemove":true}],"conditions":[]}]};
    // formDesign = JSON.parse(formDesign)
    const siteQuestion = formUtils.findEntityQuestion(formDesign, "water_point");
    return assert.isDefined(siteQuestion);
  }));


  describe("extractEntityReferences", function() {
    it("extracts entity questions", function() {
      const formDesign = {
        _type: "Form",
        contents: [
          {
            _id: "0001",
            _type: "EntityQuestion",
            entityType: "community"
          }
        ]
      };

      const responseData = {
        "0001": {
          value: "123456"
        }
      };

      return compare(formUtils.extractEntityReferences(formDesign, responseData), [
        {
          question: "0001",
          entityType: "community",
          property: "_id",
          value: "123456"
        }
      ]);
  });

    it("extracts site questions", function() {
      const formDesign = {
        _type: "Form",
        contents: [
          {
            _id: "0001",
            _type: "SiteQuestion",
            siteTypes: ["Health facility"]
          }
        ]
      };

      const responseData = {
        "0001": {
          value: { code: "10007" }
        }
      };

      return compare(formUtils.extractEntityReferences(formDesign, responseData), [
        {
          question: "0001",
          entityType: "health_facility",
          property: "code",
          value: "10007"
        }
      ]);
  });

    return it("extracts site questions in roster", function() {
      const formDesign = {
        _type: "Form",
        contents: [
          { 
            _id: "rosterid",
            _type: "RosterGroup",
            contents: [
              {
                _id: "0001",
                _type: "SiteQuestion",
                siteTypes: ["Health facility"]
              }
            ]
          }
        ]
      };

      const responseData = {
        "rosterid": [
          {
            _id: "firstrid",
            data: {
              "0001": {
                value: { code: "10007" }
              }
            }
          },
          {
            _id: "secondrid",
            data: {
              "0001": {
                value: { code: "10014" }
              }
            }
          }
        ]
      };

      return compare(formUtils.extractEntityReferences(formDesign, responseData), [
        {
          question: "0001",
          roster: "firstrid",
          entityType: "health_facility",
          property: "code",
          value: "10007"
        },
        {
          question: "0001",
          roster: "secondrid",
          entityType: "health_facility",
          property: "code",
          value: "10014"
        }
      ]);
  });
});

  return it("gets custom table refs", function() {
    const tableIds = formUtils.getCustomTablesReferenced({
      name: { en: "Cascading Ref Form", _base: "en"},
      _type: "Form",
      _schema: 21,
      locales: [{"code":"en","name":"English"}],
      contents:[
        { 
          _type: "CascadingRefQuestion",
          _id: "aa331b86fb5d40ffbf6600e8357e2b0a",
          text: {"en":"Cascade", "_base":"en"},
          tableId: "custom.ts.cities",
          dropdowns: [
            {
              columnId: "c0",
              name: { en: "Province" },
            },
            {
              columnId: "c1",
              name: { en: "City" },
            }
          ]
        }
      ]
    });

    return assert.deepEqual(tableIds, ["custom.ts.cities"]);
  });
});