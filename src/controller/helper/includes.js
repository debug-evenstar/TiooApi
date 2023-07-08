const { Subject, Class, Teacher, Account, Lesson, Student } = require('../../database/connection/');

class IncludeManager {
    
    constructor(){

    }

    static queryMap(){
        return {
            with_teachers : Teacher,
            with_students : Student,
            with_subjects : Subject,
            with_classes : Class,
            with_lessons : Lesson
        }
    }


    static parseParamIncludes(params){
        const includes = [];
        Object.keys(params).forEach(param => {
            if(Object.keys(IncludeManager.queryMap()).includes(param)){
                includes.push(IncludeManager.queryMap()[param]);
            }
        });
        console.log(includes);
        return includes;
    }
}

module.exports = IncludeManager;