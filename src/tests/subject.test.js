const axios = require('axios');
const { expect } = require('chai');
const SchoolPayload = require('./payloads/school.payloads');
const baseUrl = 'http://127.0.0.1:8085/api';

describe('API Subject Tests', () => {

    /*----------------| SETUP SUBJECT AND ASSIGN TO CLASSES |----------------*/

    it('should create subject and assign to classes', async () => {

        const apiUrl = `${baseUrl}/subjects/create`;

        try {
            const response = await axios.post(apiUrl, SchoolPayload.subject, {
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

});


