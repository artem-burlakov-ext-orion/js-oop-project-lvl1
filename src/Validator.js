export default class Validator {
  constructor(constraints = [], type = '') {
    this.constraints = constraints;
    this.type = type;
    this.isNullValid = true;
  }

  shape(schema) {
    if (this.type === 'object') {
      this.constraints = Object.entries(schema).map(([key, value]) => {
        const { constraints, type } = value;
        return {
          prop: key,
          constraints,
          type,
        }
      });
      return new Validator(this.constraints, this.type);
    }
  }

  object() {
    return new Validator(this.constraints, 'object');
  }

  string() {
    return new Validator([...this.constraints, (arg) => typeof arg === 'string'], 'string');
  }

  number() {
    return new Validator([...this.constraints, (arg) => typeof arg === 'number'], 'number');
  }

  array() {
    return new Validator([...this.constraints, 'array']);
  }

  required() {
    switch (this.type) {
      case 'string':
        this.isNullValid = false;
        this.constraints = [...this.constraints, (arg) => (arg ? arg.length > 0 : false)];
        return new Validator(this.constraints, this.type);
      case 'number':
        this.isNullValid = false;
        this.constraints = [...this.constraints, (arg) => !!arg];
        return new Validator(this.constraints, this.type);
      case 'array':
        this.isNullValid = false;
        this.constraints = [...this.constraints, (arg) => arg.isArray()];
        return new Validator(this.constraints, this.type);
      default:
        throw new Error('uknown type');
    }
  }

  contains(substr) {
    this.constraints = [...this.constraints, (arg) => arg.includes(substr)];
    return new Validator(this.constraints, this.type);
  }

  positive() {
    this.constraints = [...this.constraints, (arg) => arg > 0];
    return new Validator(this.constraints, this.type);
  }

  range(min, max) {
    this.constraints = [...this.constraints, (arg) => arg >= min && arg <= max];
    return new Validator(this.constraints, this.type);
  }

  sizeOf(length) {
    this.constraints = [...this.constraints, (arg) => arg.length === length];
    return new Validator(this.constraints, this.type);
  }


  addValidator(type, methodName, fn) {
    this.constraints = ([...this.constraints, { method: methodName, f: fn }]);
    return new Validator(this.constraints, type);
  }

  test(methodName, arg) {
    const custom = this.constraints.find((c) => typeof c === 'object' && c.method === methodName);
    custom['fnArg'] = arg;
    return new Validator([...this.constraints, custom], this.type)
  }

  isValid(arg) {
    const custom = this.constraints.filter((c) => typeof c === 'object');
    
    if (custom.length > 0) {
      const res = custom.map((obj) => {
        const { f, fnArg } = obj;
        return f(arg, fnArg);
      });
      return res.every((el) => !!el);
    }

    if (this.type = 'object') {
      const res = Object.entries(arg).map(([key, value]) => {
        const p = this.constraints.find((c) => c.prop === key);
        return p.constraints.map((c) => {
          if (value === null && this.isNullValid) {
            return true;
          }
          if (value === null && !this.isNullValid) {
            return false;
          }
          return c(value);
        }).every((el) => el === true);
      });
      return res.every((el) => !!el);
    }
    return this.constraints.map((c) => c(arg)).every((el) => el === true);
  }
}

const v = new Validator();

// let fn = (value, start) => value.startsWith(start);
// // Метод добавления новых валидаторов
// // addValidator(type, name, fn)
// v.addValidator('string', 'startWith', fn);

// // Новые валидаторы вызываются через метод test
// const schema = v.string().test('startWith', 'H');
// console.log(schema.isValid('exlet')); // false
// console.log(schema.isValid('Hexlet')); // true

const fn = (value, min) => value >= min;
v.addValidator('number', 'min', fn);

const schema = v.number().test('min', 5);
console.log(schema.isValid(4)); // false
console.log(schema.isValid(6)); // true
