declare global {
  var testRequest: import('supertest').SuperTest<import('supertest').Test>; //eslint-disable-line
}

export {};
