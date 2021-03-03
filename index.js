export default class Validator {
  constructor(constraints = []) {
    this.constraints = constraints;
  }

  string() {
    return new Validator([...this.constraints, (arg) => typeof arg === 'string'])
  }

  // required() {
  //   return new Validator(
  //     {
  //       ...this.constraints,
  //       required: (arg) => arg.length > 0,
  //     }
  //   )
  // }
  
  isValid(arg) {
    return this.constraints.map((c) => c(arg)).every((el) => el === true);
    }
}

// schema.isValid('hexlet'); // true
// schema.isValid(null); // false
// schema.isValid(''); // false

// schema.contains('what').isValid('what does the fox say'); // true
// schema.contains('whatthe').isValid('what does the fox say'); // false
