export default class Validator {
  constructor(constraints = [], type = '') {
    this.constraints = constraints;
    this.type = type;
  }

  string() {
    this.type = 'string';
    return new Validator([...this.constraints, (arg) => typeof arg === 'string'], this.type);
  }

  number() {
    this.type = 'number';
    return new Validator([...this.constraints, (arg) => typeof arg === 'number'], this.type);
  }
  
  required() {
    switch (this.type) {
      case 'string':
        this.constraints = [...this.constraints, (arg) => (arg ? arg.length > 0 : false)];
        return new Validator(this.constraints, this.type);
      case 'number':
        this.constraints = [...this.constraints, (arg) => !!arg];
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

  isValid(arg) {
    return this.constraints.map((c) => c(arg)).every((el) => el === true);
  }
}
