export default class Validator {
  constructor(constraints = []) {
    this.constraints = constraints;
  }

  string() {
    return new Validator([...this.constraints, (arg) => typeof arg === 'string']);
  }

  required() {
    this.constraints = [...this.constraints, (arg) => arg ? arg.length > 0 : false];
    return new Validator(this.constraints);
  }

  contains(substr) {
    this.constraints = [...this.constraints, (arg) => arg.includes(substr)];
    return new Validator(this.constraints);
  }
  
  isValid(arg) {
    return this.constraints.map((c) => c(arg)).every((el) => el === true);
    }
}
