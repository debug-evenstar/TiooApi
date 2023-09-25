const FormData = require('form-data');
const fs = require('fs');
const BASE_URL = process.env.AI_MODULE_BASE_URL;
const BASE_UPDATE = process.env.AI_MODULE_BASE_URL_II;
const axios = require('axios');

class LessonTemplateProvider {

    constructor() {
        this.axios = axios.create({
            baseURL: BASE_URL,
            // headers: {
            //     'Authorization': `Bearer ${TOKEN}` No headers for now
            // }
        });

        console.log(BASE_URL);
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

        console.log(`this is response and base_ur ${response} ${BASE_URL}/${path}`);

        return response?.data ?? errorResponse.data;
    }

    async loadLessonSlidesFromTemplate(file, grade, subject) {

        const body = new FormData();

        body.append('template', fs.createReadStream(file));
        body.append('subject', subject);
        body.append('grade', grade);

        const path = "lesson/template/read";
        let errorResponse = {};
        const response = await this.request("POST", path, { body });
        return response ?? errorResponse;
    }


    async getenerateLesson(body) {
        const path = "lesson/v1/generate";
        let errorResponse = {};
        const response = await this.request("POST", path, { body });
        return response ?? errorResponse;
    }


    async getenerateLessonWithExtra(body) {
        const path = "lesson/v1/query";
        let errorResponse = {};
        const response = await this.request("POST", path, { body });
        return response ?? errorResponse;
    }


}

module.exports = (new LessonTemplateProvider())