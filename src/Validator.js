export default class Validator {
  constructor(constraints = {
    nullValidation: () => true,
  }, type = '') {
    this.constraints = constraints;
    this.type = type;
  }

  string() {
    this.constraints.isString = (value) => typeof value === 'string';
    return new Validator(this.constraints, 'string');
  }

  number() {
    return new Validator(this.constraints, 'number');
  }

  array() {
    this.constraints.nullValidation = (value) => value !== null;
    return new Validator(this.constraints, 'array');
  }

  object() {
    return new Validator(this.constraints, 'object');
  }

  required() {
    console.log(this.type);
    switch (this.type) {
      case 'string':
        this.constraints.required = (value) => value.length > 0;
        this.constraints.nullValidation = (value) => value !== null;
        return new Validator(this.constraints, this.type);
      case 'number':
        this.constraints.required = (value) => typeof value === 'number';
        this.constraints.nullValidation = (value) => value !== null;
        return new Validator(this.constraints, this.type);
      case 'array':
        this.constraints.required = (value) => Array.isArray(value);
        return new Validator(this.constraints, this.type);
      default:
        throw new Error('uknown type');
    }
  }

  contains(substr) {
    this.constraints.isContains = (value) => value.includes(substr);
    return new Validator(this.constraints, this.type);
  }

  positive() {
    this.constraints.isPositive = (value) => value > 0;
    return new Validator(this.constraints, this.type);
  }

  range(min, max) {
    this.constraints.isInRange = (value) => value >= min && value <= max;
    return new Validator(this.constraints, this.type);
  }

  sizeOf(length) {
    this.constraints.lengthValidate = (value) => value.length === length;
    return new Validator(this.constraints, this.type);
  }

  shape(schema) {
    this.constraints = schema;
    return new Validator(this.constraints, this.type);
  }

  addValidator(type, methodName, fn) {
    this.constraints[methodName] = { fn };
    return new Validator(this.constraints, type);
  }

  test(methodName, arg) {
    this.constraints[methodName].arg = arg;
    return new Validator(this.constraints, this.type);
  }

  isValid(value) {
    if (value === null) {
      return this.constraints.nullValidation(value);
    }
    if (this.type === 'object') {
      console.log('!!');
      const res = Object.entries(value).map(([prop, val]) => (val === null
        ? this.constraints[prop].constraints.nullValidation(val)
        : Object.values(this.constraints[prop].constraints)
          .map((c) => c(val))
          .every((el) => el)))
      console.log(res);
      return res.every((el) => el);
    }
    return Object.values(this.constraints).reduce((acc, c) => {
      if (typeof c === 'object') {
        return c.fn(value, c.arg) ? acc : false;
      }
      return c(value) ? acc : false;
    }, true);
  }
}
