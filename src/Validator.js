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

  isValid(arg) {
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

const schema = v.object();

// Позволяет описывать валидацию для свойств объекта
schema.shape({
  name: v.string().required(),
  age: v.number().positive(),
});

console.log(schema.isValid({ name: 'kolya', age: 100 }))
console.log(schema.isValid({ name: 'maya', age: null })); // true
console.log(schema.isValid({ name: '', age: null })); // false
console.log(schema.isValid({ name: 'ada', age: -5 })); // false