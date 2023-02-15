// Optics - is the portion of FP related to sub-elements of things
// Lens: "has a"
// Prism: "is a"

type Address = {
  houseNumber: number;
  street: string;
};

type Person = {
  name: string;
  age: number;
  address: Address;
};

function mapAddressHouseNumber(a: Address, fn: (n: number) => number): Address {
  return {
    ...a,
    houseNumber: fn(a.houseNumber),
  };
}

function mapPersonAge(p: Person, fn: (n: number) => number): Person {
  return {
    ...p,
    age: fn(p.age),
  };
}

function mapPersonHouseNumber(p: Person, fn: (n: number) => number): Person {
  return {
    ...p,
    address: mapAddressHouseNumber(p.address, fn),
  };
}

//const newAdmin = mapPersonAge(rootAdmin, (a) => a + 1);

class Lens<Container, Data> {
  constructor(
    public readonly get: (c: Container) => Data,
    public readonly set: (c: Container, d: Data) => Container
  ) {}

  compose<SubData>(subLens: Lens<Data, SubData>): Lens<Container, SubData> {
    return new Lens<Container, SubData>(
      (c: Container) => subLens.get(this.get(c)),
      (c: Container, subData: SubData): Container => {
        const newData = subLens.set(this.get(c), subData);
        return this.set(c, newData);
      }
    );
  }

  // Homework: does this class have some kind of "map"?

  // ...?
}

const personNameLens = new Lens<Person, string>(
  (p: Person) => p.name,
  (p: Person, name: string) => ({
    ...p,
    name,
  })
);

const personAddressLens = new Lens<Person, Address>(
  (p: Person) => p.address,
  (p: Person, address: Address) => ({
    ...p,
    address,
  })
);

const addressHouseNumberLens = new Lens<Address, number>(
  (a: Address) => a.houseNumber,
  (a: Address, houseNumber: number) => ({
    ...a,
    houseNumber,
  })
);

const santa: Person = {
  name: 'Santa Claus',
  age: 1753,
  address: {
    houseNumber: 1,
    street: 'Northpole Way',
  },
};

//console.log(personNameLens.get(santa));

const newSanta = personNameLens.set(santa, 'St. Nick');
//console.log(newSanta.name);

const personHouseNumberLens = personAddressLens.compose(addressHouseNumberLens);

console.log(personHouseNumberLens.get(santa));

const newNewSanta = personHouseNumberLens.set(santa, 2);

console.log(JSON.stringify(newNewSanta));

// Is a
class Prism<Supertype, Subtype> {
  constructor(
    public readonly upcast: (sub: Subtype) => Supertype,
    public readonly downcast: (sup: Supertype) => Subtype | undefined
  ) {}

  // Homework: implement compose
  // ... can you think of any other useful functions?

  // Homework: does this class have some kind of "map"?
}

type Rectangle = { tag: 'rectangle'; width: number; length: number };
type Square = { tag: 'square'; size: number };

const rectangleSquarePrism = new Prism<Rectangle, Square>(
  (square) => ({ tag: 'rectangle', width: square.size, length: square.size }),
  (rectangle) =>
    rectangle.length === rectangle.width
      ? { tag: 'square', size: rectangle.length }
      : undefined
);
