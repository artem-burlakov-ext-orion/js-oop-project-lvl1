export default class Validator {
  constructor(constraints = {
    nullValidation: (value) => true,
  }, type = '') {
    this.constraints = constraints;
    this.type = type;
  }

  string() {
    this.constraints['isString'] = (value) => typeof value === 'string';
    return new Validator(this.constraints, 'string');
  }

  number() {
    return new Validator(this.constraints, 'number');
  }

  required() {
    switch (this.type) {
      case 'string':
        this.constraints['required'] = (value) => value.length > 0;
        this.constraints.nullValidation = (value) => value !== null;
        return new Validator(this.constraints, this.type);
      case 'number':
        this.constraints['required'] = (value) => typeof value === 'number';
        this.constraints.nullValidation = (value) => value !== null;
        return new Validator(this.constraints, this.type);
      // case 'array':
      //   this.constraints = [...this.constraints, (arg) => Array.isArray(arg)];
      //   return new Validator(this.constraints, this.type);
      default:
        throw new Error('uknown type');
    }
  }

  contains(substr) {
    this.constraints['isContains'] = (value) => value.includes(substr);
    return new Validator(this.constraints, this.type);
  }

  positive() {
    this.constraints['isPositive'] =  (value) => value > 0;
    return new Validator(this.constraints, this.type);
  }

  range(min, max) {
    this.constraints['isInRange'] = (value) => value >= min && value <= max;
    return new Validator(this.constraints, this.type);
  }

  isValid(value) {
    return value === null
      ? this.constraints.nullValidation(value)
      : Object.values(this.constraints).reduce((acc, fn) => fn(value) ? acc : false, true);

  }
}


  // shape(schema) {
  //   if (this.type === 'object') {
  //     this.constraints = Object.entries(schema).map(([key, value]) => {
  //       const { constraints, type } = value;
  //       return {
  //         prop: key,
  //         constraints,
  //         type,
  //       }
  //     });
  //     return new Validator(this.constraints, this.type);
  //   }
  // }

  // object() {
  //   return new Validator(this.constraints, 'object');
  // }





  // array() {
  //   return new Validator([...this.constraints], 'array', false);
  // }



  



  // sizeOf(length) {
  //   this.constraints = [...this.constraints, (arg) => arg.length === length];
  //   return new Validator(this.constraints, this.type);
  // }


  // addValidator(type, methodName, fn) {
  //   this.constraints = ([...this.constraints, { method: methodName, f: fn }]);
  //   return new Validator(this.constraints, type);
  // }

  // test(methodName, arg) {
  //   const custom = this.constraints.find((c) => typeof c === 'object' && c.method === methodName);
  //   custom['fnArg'] = arg;
  //   return new Validator([...this.constraints, custom], this.type)
  // }

  // isValid(arg) {
  //   const custom = this.constraints.filter((c) => typeof c === 'object');

  //   if (custom.length > 0) {
  //     const res = custom.map((obj) => {
  //       const { f, fnArg } = obj;
  //       return f(arg, fnArg);
  //     });
  //     return res.every((el) => !!el);
  //   }
  //   if (this.type === 'object') {
  //     console.log('!!!!');
  //     const res = Object.entries(arg).map(([key, value]) => {
  //       const p = this.constraints.find((c) => c.prop === key);
  //       return p.constraints.map((c) => {
  //         if (value === null && this.isNullValid) {
  //           return true;
  //         }
  //         if (value === null && !this.isNullValid) {
  //           return false;
  //         }
  //         return c(value);
  //       }).every((el) => el === true);
  //     });
  //     return res.every((el) => !!el);
  //   }
  //   return this.constraints.map((c) => c(arg)).every((el) => el === true);
  // }

