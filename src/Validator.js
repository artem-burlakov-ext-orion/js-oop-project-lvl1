export default class Validator {
  constructor(constraints = { nullValidation: () => true }, type = '') {
    this.constraints = constraints;
    this.type = type;
    // console.log('-----------------------------------');
    // console.log('THIS_CONSTRAINTS: ', this.constraints);
    // console.log('THIS_TYPE: ', this.type);
  }

  string() {
    return new Validator(
      {
        ...this.constraints,
        isString: (value) => typeof value === 'string',
      }, 'string');
  }

  number() {
    return new Validator(this.constraints, 'number');
  }

  array() {
    return new Validator(
      {
        ...this.constraints,
        nullValidation: (value) => value !== null,
      }, 'array');
  }

  object() {
    return new Validator(this.constraints, 'object');
  }

  required() {
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
    this.schema = schema;
  }

  addValidator(type, methodName, fn) {
    this.constraints[methodName] = fn;
    this.type = type;
  }

  test(methodName, arg) {
    // this.constraints[methodName].arg = arg;
    return new Validator({
      ...this.constraints,
      [methodName]: {
        ...this.constraints[methodName],
        arg,
      }
    }, this.type);
  }

  isValid(value) {
    // console.log(value);
    // console.log(this.constraints);
    // console.log(this.constraints.nullValidation);
    
    if (value === null) {
      return this.constraints.nullValidation(value);
    }
    if (this.type === 'object') {
      console.log('!!');
      console.log('V: ', value);
      console.log('THIS CONSTRAINTS: ', this);

      const res = Object.entries(value).map(([prop, val]) => {
        if (val === null) {
          return this.schema[prop].constraints.nullValidation(val)
        }
        console.log('PROP AND VAL: ', prop, val);
        console.log(this.schema[prop]);
        return Object.values(this.schema[prop].constraints).map((c) => c(val)).every((el) => el);
      });
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
