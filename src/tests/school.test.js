const axios = require('axios');
const { expect } = require('chai');
const SchoolPayload = require('./payloads/school.payloads');
const baseUrl = 'http://127.0.0.1:8085/api';

describe('School API Tests', () => {

    /*-----------------------------------| SETUP A SCHOOL |-----------------------------------*/

    it('should setup a standard school', async () => {

        const apiUrl = `${baseUrl}/school/setup`;

        try {
            const response = await axios.post(apiUrl, SchoolPayload.setup, {
                headers: {
                    Authorization: `Bearer ${SchoolPayload.token}`,
                },
            });

            /*-------/ Perform assertions on the response /----*/
            expect(response.status).to.equal(200);
            expect(response.data).to.have.property('message').that.includes('success');
        } catch (error) {
            throw new Error(error.message);
        }
    });

    /*-----------------------------------| SETUP A CUSTOM SCHOOL |-----------------------------------*/

    it('should setup a custome school', async () => {

        const apiUrl = `${baseUrl}/school/setup`;

        try {
            const response = await axios.post(apiUrl, SchoolPayload.customSetup, {
                headers: {
                    Authorization: `Bearer ${SchoolPayload.token}`,
                },
            });

            expect(response.status).to.equal(200);
            expect(response.data).to.have.property('message').that.includes('success');
        } catch (error) {
            throw new Error(error.message);
        }
    });


});


// run: npx mocha src/test/api.test.js