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
        return new Validator(
          {
            ...this.constraints,
            required: (value) => value.length > 0,
            nullValidation: (value) => value !== null,
          }, this.type);
      case 'number':
        return new Validator(
          {
            ...this.constraints,
            required: (value) => typeof value === 'number',
            nullValidation: (value) => value !== null,
          }, this.type);
      case 'array':
        return new Validator(
          {
            ...this.constraints,
            required: (value) => Array.isArray(value)
          }, this.type);
      default:
        throw new Error('uknown type');
    }
  }

  contains(substr) {
    return new Validator(
      {
        ...this.constraints,
        isContains: (value) => value.includes(substr),
      }, this.type);
  }

  positive() {
    return new Validator(
      {
        ...this.constraints,
        isPositive: (value) => value > 0,
      }, this.type);
  }

  range(min, max) {
    return new Validator(
      {
        ...this.constraints,
        isInRange: (value) => value >= min && value <= max,
      }, this.type);
  }

  sizeOf(length) {
    return new Validator({
      ...this.constraints,
     lengthValidate: (value) => value.length === length,
    }, this.type);
  }

  shape(schema) {
    this.constraints.schema = schema;
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
    console.log(value);
    console.log(this.constraints);
    console.log(this.constraints.nullValidation);
    
    if (value === null) {
      return this.constraints.nullValidation(value);
    }
    if (this.type === 'object') {
      console.log('!!');
      console.log('V: ', value);
      console.log('THIS CONSTRAINTS: ', this.constraints);
      const res = Object.entries(value).map(([prop, val]) => {
        if (val === null) {
          return this.constraints.schema[prop].constraints.nullValidation(val)
        }
        // console.log('PROP AND VAL: ', prop, val);
        // console.log(this.constraints.schema[prop]);
        const res1 = Object.values(this.constraints.schema[prop].constraints)
          .map((c) => c(val));
        // console.log('RES1: ', res1);
        return res1.every((el) => el);
      })
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
