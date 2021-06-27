let ValidationCompiler;
import _ from 'lodash';

// Compiles validations
export default ValidationCompiler = class ValidationCompiler {
  constructor(locale) { 
    this.compileString = this.compileString.bind(this);
    this.compileValidationMessage = this.compileValidationMessage.bind(this);
    this.compileValidation = this.compileValidation.bind(this);
    this.compileValidations = this.compileValidations.bind(this);
    this.locale = locale;
  }

  compileString(str) {
    // If no base or null, return null
    if ((str == null) || !str._base) {
      return null;
    }

    // Return for locale if present
    if (str[this.locale || "en"]) {
      return str[this.locale || "en"];
    }

    // Return base if present
    return str[str._base] || "";
  }

  compileValidationMessage(val) {
    const str = this.compileString(val.message);
    if (str) {
      return str;
    }
    return true;
  }

  compileValidation(val) {
    switch (val.op) {
      case "lengthRange":
        return answer => {
          const value = (answer != null) && (answer.value != null) ? answer.value : "";
          const len = value.length;
          if ((val.rhs.literal.min != null) && (len < val.rhs.literal.min)) {
            return this.compileValidationMessage(val);
          }
          if ((val.rhs.literal.max != null) && (len > val.rhs.literal.max)) {
            return this.compileValidationMessage(val);
          }
          return null;
        };
      case "regex":
        return answer => {
          const value = (answer != null) && (answer.value != null) ? answer.value : "";
          if (value.match(val.rhs.literal)) {
            return null;
          }
          return this.compileValidationMessage(val);
        };
      case "range":
        return answer => {
          let value = (answer != null) && (answer.value != null) ? answer.value : 0;
          // For units question, get quantity
          if (value.quantity != null) {
            value = value.quantity;
          }

          if ((val.rhs.literal.min != null) && (value < val.rhs.literal.min)) {
            return this.compileValidationMessage(val);
          }
          if ((val.rhs.literal.max != null) && (value > val.rhs.literal.max)) {
            return this.compileValidationMessage(val);
          }
          return null;
        };
      default:
        throw new Error("Unknown validation op " + val.op);
    }
  }

  compileValidations(vals) {
    const compVals = _.map(vals, this.compileValidation);
    return answer => {
      for (let compVal of compVals) {
        const result = compVal(answer);
        if (result) {
          return result;
        }
      }

      return null;
    };
  }
};