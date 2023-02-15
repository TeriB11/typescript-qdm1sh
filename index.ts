import './Lens';

/*
  Functional Programming
    "programming with functions"

  Concepts:
    Composition, pure functions, immutable structures,
    Map, reduce/fold, bind, join, pure,
    ADTs, pattern matching, views,
    Persistent data structures, lazy evaluation,
    Currying, lambda functions, point-free programming,
    Types, type constructors, kinds, type classes
    ...and more!

  Type classes:
    Monoid, Functor, Applicative, Monad,
    Foldable, Traversable, Serializable
    ...and more!

  Types:
    Tuple, Pair, Maybe, Either, List,
    Unit, Promise, Lazy, IO, Lens, Prism,
    Monad transformers
    ...and more!
*/

// Take an array and produce a new array
// where the elements, in order, are if the original
// ones are EVEN

// Example: [1, 3, 6, 8] -> [false, false, true, true]

/*
  How FP is this version of arrayEven?

  * IMMUTABLE - FAIL: Mutating result in the implementation
  * PURE - SUCCESS: no side effects
  * COMPOSITION - FAIL: the function doesn't
                        separate its concerns
*/
function arrayEven(list: number[]): boolean[] {
  const result: boolean[] = [];
  for (const num of list) {
    result.push(num % 2 === 0);
  }

  return result;
}

function arrayMap<T, S>(list: S[], f: (n: S) => T): T[] {
  const result: T[] = [];
  for (const n of list) {
    result.push(f(n));
  }

  return result;
}

declare function _mapArray<T, S>(list: Array<S>, f: (n: S) => T): Array<T>;

declare function _mapOptional<T, S>(
  list: Optional<S>,
  f: (n: S) => T
): Optional<T>;
declare function _mapPromise<T, S>(
  list: Promise<S>,
  f: (n: S) => T
): Promise<T>;

type Optional<T> = T | undefined | null;

function optionalMap<T, S>(opt: Optional<S>, f: (n: S) => T): Optional<T> {
  if (opt === undefined) {
    return undefined;
  } else {
    return f(opt);
  }
}

function optionalElse<T>(opt: Optional<T>, elseValue: T): T {
  return opt !== undefined && opt !== null ? opt : elseValue;
}

const x: Optional<number> = undefined;
const y = optionalElse(x, 5); // x ?? 5 -- "nullish coalescing operator"

function reduceArray<T, S>(
  list: T[],
  f: (a: S, b: T) => S,
  initialValue: S
): S {
  let result = initialValue;
  for (const element of list) {
    result = f(result, element);
  }

  return result;
}

const m = [1, 2, 3];
const n = reduceArray(
  m,
  (result: string, x: number) => result + x.toString(),
  ''
);
const n_ = m.reduce((result: string, x: number) => result + x.toString(), '');

// Reduce is a bad name!
// Functional people call it:
const foldRight = reduceArray;

const foldLeft = <T, S>(list: T[], f: (a: S, b: T) => S, initialValue: S) =>
  foldRight(list.reverse(), f, initialValue);

const arr = [2, 5, 6];

const sumOfArr = arr.reduce((accum, nextValue) => accum + nextValue, 0);

const strs = ['he', 'llo', ', ', 'wor', 'l', 'd!'];
const concatStrs = strs.reduce((accum, nextValue) => accum + nextValue, '');

interface Monoid<T> {
  empty: T;
  append: (a: T, b: T) => T;
}

const numberAddMonoid: Monoid<number> = {
  empty: 0,
  append: (a, b) => a + b,
};

const numberMulMonoid: Monoid<number> = {
  empty: 1,
  append: (a, b) => a * b,
};

const StringConcatMonoid: Monoid<string> = {
  empty: '',
  append: (a, b) => a + b,
};

const BooleanAndMonoid: Monoid<boolean> = {
  empty: true,
  append: (a, b) => a && b,
};

const BooleanOrMonoid: Monoid<boolean> = {
  empty: false,
  append: (a, b) => a || b,
};

function foldMonoidRight<T>(list: T[], monoid: Monoid<T>): T {
  return list.reduce(monoid.append, monoid.empty);
}

const productOfArr = arr.reduce((accum, nextValue) => accum * nextValue, 1);

const productOfArr_ = foldMonoidRight(arr, numberMulMonoid);
