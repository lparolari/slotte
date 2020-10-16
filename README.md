# Slotte

![GitHub code size in bytes](https://img.shields.io/github/languages/code-size/lparolari/slotte.svg)
![GitHub repo size](https://img.shields.io/github/repo-size/lparolari/slotte.svg)
![npm total downloads](https://img.shields.io/npm/dt/slotte.svg)
![License](https://img.shields.io/npm/l/slotte.svg)
![npm version](https://img.shields.io/npm/v/slotte.svg)
![GitHub last commit](https://img.shields.io/github/last-commit/lparolari/slotte.svg)
![npm collaborators](https://img.shields.io/npm/collaborators/slotte.svg)

> Recurrent event generator with constraints.

See [about](#about) section for further informations on project purposes and how it works.

## Table of Content

- [Installation](#installation)
- [Example](#example)
- [API](#api)
  - [generator](#generator)
  - [take](#take)
  - [takeUntil](#takeuntil)
  - [flatten](#flatten)
  - [changeTime](#changetime)
  - [\*Constraints](#constraints)
- [Test](#test)
- [About](#about)
  - [Features](#features)
- [Author](#author)
- [Credits](#credits)
- [License](#license)

## Installation

```bash
npm install slotte

# or, with yarn
yarn add slotte
```

## Example

In the following example we are creating recurrent events for a working week where we allow events to be created from 8am to 12am and from 2pm to 6pm. Events has length of 1 hour.

**Code**

```typescript
import { generator } from "../generator";
import { addInterval, Interval } from "../interval";
import { changeTime, flatten, ordMoment, takeUntil } from "../util";

// recurrent event size
const interval: Interval = { amount: 1, unit: "hour" };

// start and stop of generation
const start = moment("2020-10-11 00:00");
const stop = moment("2020-10-18 00:00");

// some util functions for constraints
const changeTimeTo08 = changeTime("8:00");
const changeTimeTo12 = changeTime("12:00");
const changeTimeTo14 = changeTime("14:00");
const changeTimeTo18 = changeTime("18:00");

// constraints
const notOnSathurday = (c: Moment) => c.isoWeekday() !== 6;
const notOnSunday = (c: Moment) => c.isoWeekday() !== 7;
const notBefore8am = (c: Moment) => ge(changeTimeTo08(c))(c);
const notAtLaunch = (c: Moment) =>
  !c.isBetween(changeTimeTo12(c), changeTimeTo14(c), undefined, "[)");
const notAfter18pm = (c: Moment) => lt(changeTimeTo18(c))(c);

const constraints = [
  notOnSathurday,
  notOnSunday,
  notBefore8am,
  notAfter18pm,
  notAtLaunch,
];

// generator
const gen = generator(interval)(constraints)(start);

// get values from generator and log them
// Note: values are returned in reverse order
console.log(flatten(takeUntil(stop)(gen)));
```

**Result**

Note: the `x` represents the event existence.

|             | Monday | Tuesday | Wednesday | Thursday | Friday | Sathurday | Sunday |
| ----------- | ------ | ------- | --------- | -------- | ------ | --------- | ------ |
| ...         |        |         |           |          |        |           |        |
| 07:00-08:00 |        |         |           |          |        |           |        |
| 08:00-09:00 | x      | x       | x         | x        | x      |           |        |
| 09:00-10:00 | x      | x       | x         | x        | x      |           |        |
| 10:00-11:00 | x      | x       | x         | x        | x      |           |        |
| 11:00-12:00 | x      | x       | x         | x        | x      |           |        |
| 12:00-13:00 |        |         |           |          |        |           |        |
| 13:00-13:00 |        |         |           |          |        |           |        |
| 14:00-15:00 | x      | x       | x         | x        | x      |           |        |
| 15:00-16:00 | x      | x       | x         | x        | x      |           |        |
| 16:00-17:00 | x      | x       | x         | x        | x      |           |        |
| 17:00-18:00 | x      | x       | x         | x        | x      |           |        |
| 18:00-19:00 |        |         |           |          |        |           |        |
| ...         |        |         |           |          |        |           |        |

## API

### generator

Module `generator`.

**Syntax**

```typescript
export const generator = (interval: Interval)
    => (constraints: Constraint[])
    => (start: Moment): Generator<Slot, Slot, Slot>`
```

**Semantic** Return a generator that creates recurrent events (`Slot`) with size `interval`, according to `constraints`, starting from `start`.

**Usage**

```typescript
// create the generator
const oneHourInterval = { amount: 1, unit: "hour" };
const constraints = [
  // your constraints
];
const start = moment();

const myGen = generator(oneHourInterval)(constraints)(start);

// use the generator

// with .next()
myGen.next().value;

// with for .. of
for (const event of myGen) {
  // use `event`
}
```

**Note** This function is curried, so you can use it also by fixing the interval parameter first, then constraints and then the start date.

```typescript
const oneHourGenerator = generator({ amount: 1, unit: "hour" });

const morningGenerator = oneHourGenerator([between8amAnd12am]);
const afternoonGenerator = oneHourGenerator([between14amAnd18am]);

const myGen1 = morningGenerator(moment());
const myGen2 = morningGenerator(moment("2020-10-10 17:00:00"));
const myGen3 = afternoonGenerator(moment());
const myGen4 = afternoonGenerator(moment("2020-10-10 17:00:00"));
```

### take

Module `util`.

**Syntax**

```typescript
type SlotGenerator = Generator<Slot, Slot, Slot>;

export const take = (n: number)
    => (iterable: SlotGenerator): Slot[]
```

### takeUntil

Module `util`.

**Syntax**

```typescript
type SlotGenerator = Generator<Slot, Slot, Slot>;

export const takeUntil = (stop: Moment)
    => (generator: SlotGenerator): Slot[]
```

### flatten

Module `util`.

**Syntax**

```typescript
export const flatten = (ss: Slot[]) => Info[]
```

### changeTime

Module `util`.

**Syntax**

```typescript
export const changeTime: (time: string) => (current: Moment) => Moment;
```

**Semantic**

Change `current` time to `time`.

### \*Constraints

There are many predefined constraints that you can use in combination with your own constraints. See file [constraint.ts](src/constraint.ts).

## Test

```bash
npm run test

# or, with yarn
yarn test
```

## About

_Slotte_ is a constrained time slot generator, or better, a recurrent event generator with constraints. This allows you to create fixed-size, recurrent events without saying explicitly when to repeat the event.

The main goal of _slotte_ is in fact to facilitate bulk creation of fixed-time recurrent events. As you can see from the [example](#example) above, we can use constraints for saying whether to allocate an event in a given time.

### Features

- entirely written in **typescript**, which ensures type safety
- heavily **tested**: less bugs, less problems
- boosted **performance** with lazy generator for recurrent event sequences
- adherent to **functional programming** style
- **date standardization** with momentjs

## Author

- [Luca Parolari](https://github.com/lparolari)

## Credits

- [All contributors](https://github.com/lparolari/slotte/contributors)
- [Moment.js](https://momentjs.com/)

## License

This project is MIT licensed. See [LICENSE](LICENSE) file.
