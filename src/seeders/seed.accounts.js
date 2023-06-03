const { Account, Validation } = require('../database/connection/index');

const schools_teachers_students = [
    { name: "Bez Pry School", email: "school1@gmail.com", phone: "08093652645", account_type: "school", password: "1234" },
    { name: "Winners Pry School", email: "school2@gmail.com", phone: "08093652645", account_type: "school", password: "1234" },
    { name: "Bella Academy", email: "school3@gmail.com", phone: "08093652645", account_type: "school", password: "1234" },
    { name: "Xena Pry School", email: "school4@gmail.com", phone: "08093652645", account_type: "school", password: "1234" },
    { name: "Bez Pry School", email: "school5@gmail.com", phone: "08093652645", account_type: "school", password: "1234" },

    { name: "Wills Franch", email: "teacher1@gmail.com", phone: "08093652645", account_type: "teacher", password: "1234" },
    { name: "David John", email: "teacher2@gmail.com", phone: "08093452645", account_type: "teacher", password: "1234" },
    { name: "Mark Samuel", email: "teacher3@gmail.com", phone: "08096652645", account_type: "teacher", password: "1234" },
    { name: "Grace Jerry", email: "teacher4@gmail.com", phone: "08092652645", account_type: "teacher", password: "1234" },
    { name: "Meyene Imo", email: "teacher5@gmail.com", phone: "08093752645", account_type: "teacher", password: "1234" },

    { name: "Wills Franch", email: "student1@gmail.com", phone: "08093652645", account_type: "student", password: "1234" },
    { name: "David John", email: "student2@gmail.com", phone: "08093452645", account_type: "student", password: "1234" },
    { name: "Mark Samuel", email: "student3@gmail.com", phone: "08096652645", account_type: "student", password: "1234" },
    { name: "Grace Jerry", email: "student4@gmail.com", phone: "08092652645", account_type: "student", password: "1234" },
    { name: "Meyene Imo", email: "student5@gmail.com", phone: "08093752645", account_type: "student", password: "1234" },

    { name: "Admin Account", email: "admin@gmail.com", phone: "08093752645", account_type: "admin", password: "1234" },

];

const seed = async () => {

    try {

        schools_teachers_students.forEach(async eachAccount => {
            const newOtp = Math.floor(Math.random() * 900000) + 100000;
            const [newAccount] = await Account.findOrCreate({ where: eachAccount });
            const newValidation = await Validation.create({ otp: newOtp });
            const setup = await newAccount.setValidation(newValidation);
        });



        console.log('Classes created for nursery, primary and secondary');

    } catch (error) {
        console.error('Error occurred:', error);
    }
};

seed();
