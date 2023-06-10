const Mocha = require('mocha');
const fs = require('fs');
const path = require('path');
const mocha = new Mocha();


mocha.addFile(path.join(__dirname, 'account.test.js'));
mocha.addFile(path.join(__dirname, 'school.test.js'));
mocha.addFile(path.join(__dirname, 'arms.test.js'));
mocha.addFile(path.join(__dirname, 'subject.test.js'));

mocha.run((failures) => {
  if (failures > 0) {
    console.error(`${failures} test(s) failed.`);
  } else {
    console.log('All tests passed.');
  }
});


// npx mocha src/tests/testRunner.js