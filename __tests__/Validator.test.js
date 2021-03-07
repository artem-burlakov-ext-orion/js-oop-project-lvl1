import Validator from '../index.js';

it('should be instanceOf Validator', () => {
  expect(new Validator()).toBeInstanceOf(Validator);
});

it('should return instanceOf Validator after .string()', () => {
  expect(new Validator().string()).toBeInstanceOf(Validator);
});

it('should return true because typeof \'\' === string', () => {
  expect(new Validator().string().isValid('')).toBe(true);
});

it('should return true because \'required\' does notexist', () => {
  expect(new Validator().string().isValid(null)).toBe(true);
});

it('should return instanceOf Validator after methods chaining', () => {
  expect(new Validator().string().required()).toBeInstanceOf(Validator);
});

it('should return true because typeof \'string\' === string and its length gt 0', () => {
  expect(new Validator().string().required().isValid('string')).toBe(true);
});

it('should return false because \'required\' need string.length gt 0', () => {
  expect(new Validator().string().required().isValid('')).toBe(false);
});

it('should return false because \'required\' exist', () => {
  expect(new Validator().string().required().isValid(null)).toBe(false);
});

it('should return false because 5 is not string', () => {
  expect(new Validator().string().isValid(5)).toBe(false);
});

it('should return true because value contain argument', () => {
  expect(new Validator().string().contains('what').isValid('what does the fox say')).toBe(true);
});

it('should return false because value not contain argument', () => {
  expect(new Validator().string().contains('whatthe').isValid('what does the fox say')).toBe(false);
});

it('should return instanceOf Validator because .number()', () => {
  expect(new Validator().number()).toBeInstanceOf(Validator);
});

it('should return true because required does not exist', () => {
  expect(new Validator().number().isValid(null)).toBe(true);
});

it('should return instanceOf Validator after .number().required()', () => {
  expect(new Validator().number().required()).toBeInstanceOf(Validator);
});

it('should return false because .required()', () => {
  expect(new Validator().number().required().isValid(null)).toBe(false);
});

it('should return true because typeof 5 === number and 5 > 0', () => {
  expect(new Validator().number().positive().isValid(5)).toBe(true);
});

it('should return false because -1 < 0', () => {
  expect(new Validator().number().positive().isValid(-1)).toBe(false);
});

it('should return true because typeof 5 === number and 5 in range 1, 10', () => {
  expect(new Validator().number().range(1, 10).isValid(5)).toBe(true);
});

it('should return false because 5 not in range 6, 10', () => {
  expect(new Validator().number().range(6, 10).isValid(5)).toBe(false);
});

it('should return true because \'[]\' is array', () => {
  expect(new Validator().array().required().isValid([])).toBe(true);
});

it('should return true because [\'a\', \'b\'].length === 2', () => {
  expect(new Validator().array().sizeOf(2).isValid(['a', 'b'])).toBe(true);
});

it('should return false because [\'a\', \'b\'].length !== 1', () => {
  expect(new Validator().array().sizeOf(1).isValid(['a', 'b'])).toBe(false);
});

it('should return false because \'required\' does not exist', () => {
  expect(new Validator().array().isValid(null)).toBe(false);
});

it('should return true1', () => {
  expect(new Validator().object().shape({
    name: new Validator().string().required(),
    age: new Validator().number().positive(),
  }).isValid({ name: 'kolya', age: 100 })).toBe(true);
});

it('should return true2', () => {
  expect(new Validator().object().shape({
    name: new Validator().string().required(),
    age: new Validator().number().positive(),
  }).isValid({ name: 'maya', age: null })).toBe(true);
});

it('should return false', () => {
  expect(new Validator().object().shape({
    name: new Validator().string().required(),
    age: new Validator().number().positive(),
  }).isValid({ name: '', age: null })).toBe(false);
});

it('should return false', () => {
  expect(new Validator().object().shape({
    name: new Validator().string().required(),
    age: new Validator().number().positive(),
  }).isValid({ name: 'ada', age: -5 })).toBe(false);
});