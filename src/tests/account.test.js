const axios = require('axios');
const { expect } = require('chai');
const AccountPayload = require('./payloads/account.payloads');
const SchoolPayload = require('./payloads/school.payloads'); // Assuming this import is needed
const baseUrl = 'http://127.0.0.1:8085/api';

describe('Create Account API Tests', () => {

    it('create accounts', async () => {
        const apiUrl = `${baseUrl}/account/signup`;

        for (const payload of AccountPayload.accounts) {
            try {
                const response = await axios.post(apiUrl, payload, {
                    headers: {
                        Authorization: `Bearer ${SchoolPayload.token}`,
                    },
                });

                expect(response.status).to.equal(200);
                expect(response.data).to.have.property('message').that.includes('success');
            } catch (error) {
                throw new Error(error.message);
            }
        }
    });
});
