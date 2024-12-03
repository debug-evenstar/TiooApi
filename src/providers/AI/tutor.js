const FormData = require('form-data');
const fs = require('fs');
const BASE_URL = process.env.AI_MODULE_BASE_URL;
const axios = require('axios');

class AITutorProvider {

    constructor() {
        this.axios = axios.create({
            baseURL: BASE_URL,
            headers: { 
                'Content-Type': 'application/json'
            },
        });

    }

    requestBody(data) {
        return data.body
            ? data.body
            : data.params
                ? { params: data.params }
                : {};
    }

    async request(method, path, data) {
        method = method.toLowerCase();
        let errorResponse;
        const response = await this.axios[method](
            path,
            this.requestBody(data)
        ).catch((error) => {
            if (error.response) {
                errorResponse = error.response;
            }
        })

        return response?.data ?? errorResponse.data;
    }

    async queryAITutor(lesson, slide_id, conversation, student) {
        const body = {
            slide_id,
            lesson,
            conversation,
            student
        }
        const path = "lesson/asktutor";
        let errorResponse = {};
        const response = await this.request("POST", path, { body });
        return response ?? errorResponse;
    }


    async generateQuestionAnswer(lesson, slide_id, conversation, query) {
        const body = {
            slide_id,
            lesson,
            conversation,
            query
        }
        const path = "lesson/generate-answer";
        let errorResponse = {};
        const response = await this.request("POST", path, { body });
        return response ?? errorResponse;
    }


}

module.exports = (new AITutorProvider())