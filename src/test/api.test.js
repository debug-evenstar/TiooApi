const axios = require('axios');
const { expect } = require('chai');

const baseUrl = 'http://127.0.0.1:8085/api';

describe('API Tests', () => {

    /*-----------------------------------| SETUP A SCHOOL |-----------------------------------*/

    it('should setup a school', async () => {

        const apiUrl = `${baseUrl}/school/setup`;

        const payload = {
            email: 'school1@gmail.com',
            school_types: ['nursery', 'primary'],
            naming_types: 'NS',
        };

        const token = "xyz";
        try {
            const response = await axios.post(apiUrl, payload, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            // Perform assertions on the response
            expect(response.status).to.equal(200);
            expect(response.data).to.have.property('message').that.includes('success');
        } catch (error) {
            throw new Error(error.message);
        }
    });

});


// run: npx mocha src/test/api.test.js