import Validator from '../index.js';

it('should be instanceOf Validator', () => {
  expect(new Validator()).toBeInstanceOf(Validator);
});

// it('should have string method', () => {
//   expect(new Validator()).toBeInstanceOf(Validator);
// })

// it('should have required method', () => {
//   expect(new Validator()).toBeInstanceOf(Validator);
// })

// it('should have contains method', () => {
//   expect(new Validator()).toBeInstanceOf(Validator);
// })
// const schema = v.string();

// schema.isValid(''); // true

// schema.required();

// schema.isValid('what does the fox say'); // true
// schema.isValid('hexlet'); // true
// schema.isValid(null); // false
// schema.isValid(''); // false

// schema.contains('what').isValid('what does the fox say'); // true
// schema.contains('whatthe').isValid('what does the fox say'); // false
