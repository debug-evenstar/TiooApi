const Mocha = require('mocha');
const fs = require('fs');
const path = require('path');
const mocha = new Mocha();

// Add the test files to be executed
mocha.addFile(path.join(__dirname, 'subject.test.js'));

// Run the tests
mocha.run((failures) => {
  if (failures > 0) {
    console.error(`${failures} test(s) failed.`);
  } else {
    console.log('All tests passed.');
  }
});


// npx mocha src/tests/testRunner.js