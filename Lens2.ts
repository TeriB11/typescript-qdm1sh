/*
  Lens in TypeScript are limited or require really tricky
  type gynmastics BECAUSE TypeScript lacks higher-kinded types
*/

interface ArrayDef<T, X extends Array<T>> {
  ...
}

interface Foo<T, X extends T | undefined> {
  ...
}

type F = HKT<ArrayDef, T> // Array<T>

class OldLens<Container, Data> {
  constructor(
    public readonly get: (c: Container) => Data,
    public readonly set: (c: Container, d: Data) => Container
  ) {}
}

// But no the getter is inaccessibe without Functors :()
type FnLens<Container, Data> = (
  f: (d: Data) => Data
) => (c: Container) => Container;

function lensCompose<A, B, C>(
  ab: FnLens<A, B>,
  bc: FnLens<B, C>
): FnLens<A, C> {
  return (cFn: (c: C) => C) => {
    return ab(bc(cFn));
  };
}

type Address2 = {
  houseNumber: number;
  street: string;
};

type Person2 = {
  name: string;
  age: number;
  address: Address2;
};

const personAddressLens2: FnLens<Person2, Address2> = (
  f: (a: Address2) => Address2
) => {
  return (p: Person2) => {
    return {
      ...p,
      adress: f(p.address),
    };
  };
};
