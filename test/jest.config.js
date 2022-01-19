const { resolve } = require('path');
const root = resolve(__dirname, '..');
const rootConfig = require(`${root}/jest.config.js`);  //importa a config global do jest;


//sobreescreve algumas chaves //os "..." indicam o marge do objeto global com o objo local;
module.exports = {...rootConfig, ...{
  rootDir: root,
  displayName: "end2end-tests",
  setupFilesAfterEnv: ["<rootDir>/test/jest-setup.ts"], //é um arqv que vai rodar antes de rodar os tests, bom para fazer setup de db de server
  testMatch: ["<rootDir>/test/**/*.test.ts"], //especifica que é somente para esses arqvs para pasta test;
}};