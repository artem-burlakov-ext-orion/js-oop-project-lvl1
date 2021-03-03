import Validator from '../index.js';

it('should be instanceOf Validator', () => {
  expect(new Validator()).toBeInstanceOf(Validator);
});

it('should return instanceOf Validator after .string()', () => {
  expect(new Validator().string()).toBeInstanceOf(Validator)
})

it('should return instanceOf Validator after methods chaining', () => {
  expect(new Validator().string().required()).toBeInstanceOf(Validator)
})

it(`should return true because typeof 'string' === string`, () => {
  expect(new Validator().string().isValid('string')).toBe(true);
})

it(`should return true because typeof 'string' === string and its length gt 0`, () => {
  expect(new Validator().string().required().isValid('string')).toBe(true);
})

it(`should return false because 'required' need string.length gt 0`, () => {
  expect(new Validator().string().required().isValid('')).toBe(false);
})

it(`should return false because 5 is not string`, () => {
  expect(new Validator().string().isValid(5)).toBe(false);
})

it('should return instanceOf Validator after .number()', () => {
  expect(new Validator().number()).toBeInstanceOf(Validator)
})

it('should return instanceOf Validator after methods chaining', () => {
  expect(new Validator().number().required()).toBeInstanceOf(Validator)
})

it(`should return true because typeof 5 === number`, () => {
  expect(new Validator().number().isValid(5)).toBe(true);
})

it(`should return true because typeof 5 === number and 5 > 0`, () => {
  expect(new Validator().number().positive().isValid(5)).toBe(true);
})

it(`should return false because typeof 5 === number and -1 < 0`, () => {
  expect(new Validator().number().positive().isValid(5)).toBe(false);
})

it(`should return true because typeof 5 === number and 5 in range 1, 10`, () => {
  expect(new Validator().number().range(1, 10).isValid(5)).toBe(true);
})

it(`should return false because 5 not in range 6, 10`, () => {
  expect(new Validator().number().range(6, 10).isValid(5)).toBe(false);
})


// it('should have contains method', () => {
//   expect(new Validator()).toBeInstanceOf(Validator);
// })

// schema.required();

// schema.isValid('what does the fox say'); // true
// schema.isValid('hexlet'); // true
// schema.isValid(null); // false
// schema.isValid(''); // false

// schema.contains('what').isValid('what does the fox say'); // true
// schema.contains('whatthe').isValid('what does the fox say'); // false


// required – любое число включая ноль
// positive – положительное число
// range – диапазон в который должны попадать числа включая границы
