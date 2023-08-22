const FormData = require('form-data');
const fs = require('fs');
const BASE_URL = process.env.AI_MODULE_BASE_URL;
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

    requestBody (data) {
        return data.body 
            ? data.body
            : data.params
                ? { params : data.params}
                : {};
    }

    async request( method , path, data ) {
        method = method.toLowerCase();
        let errorResponse;
        const response = await this.axios[method](
            path,
            this.requestBody(data)
        ).catch((error) => {
            if ( error.response ) {
                errorResponse = error.response;
            }
        })
        return response?.data ?? errorResponse.data;
    }

    async loadLessonSlidesFromTemplate(file) {

        const body = new FormData();

        body.append('template', fs.createReadStream(file));
        body.append('subject', "Subject here");
        body.append('grade', "Grade here");
        
        const path = "lesson/template/read";
        let errorResponse = {};
        const response = await this.request( "POST", path, { body });
        return response ?? errorResponse;
    }


}

module.exports = (new LessonTemplateProvider())