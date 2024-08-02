"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Disable foreign key checks
    await queryInterface.sequelize.query("SET FOREIGN_KEY_CHECKS = 0");

    // Insert data into the table
    await queryInterface.bulkInsert(
      "onboarding_questions",
      [
        {
          parent_id: null,
          parent_answer: null,
          question: "Which of the following best describes you?",
          type: "single-select",
          options: JSON.stringify(["Student", "Agent"]),
        },
        
        {
          parent_id: 1,
          parent_answer: "Student",
          question: "What are your primary goals for using the platform?",
          type: "single-select",
          options: JSON.stringify(["Coding", "Exam Preparation", "Learning"]),
        },
                {
          parent_id: 2,
          parent_answer: "Exam Preparation",
          question: "What exams are you preparing for?",
          type: "single-select",
          options: JSON.stringify([
            "UTME(JAMB)",
            "WAEC",
            "NECO",
            "GRE",
            "Aptitude test",
            "ICAN",
            "IELT",
          ]),
        },
        {
          parent_id: 3,
          parent_answer: "UTME(JAMB)",
          question: "Which subjects are you most interested in?",
          type: "multi-select",
          options: JSON.stringify([
            "English",
            "Mathematics",
            "Chemistry",
            "Biology",
            "Literature",
            "Economics",
          ]),
        },
        {
          parent_id: 3,
          parent_answer: "UTME(JAMB)",
          question: "How many hours per week can you dedicate to studying?",
          type: "single-select",
          options: JSON.stringify(["< 7 hours", "7 hours", "> 7 hours"]),
        },
        {
          parent_id: 3,
          parent_answer: "UTME(JAMB)",
          question: "Would you like an online coach?",
          type: "single-select",
          options: JSON.stringify(["Yes", "No"]),
        },
        // {
        //   parent_id: 3,
        //   parent_answer: "UTME(JAMB)",
        //   question: "How would you like to track your progress?",
        //   type: "single-select",
        //   options: JSON.stringify(["Quizes", "Assignment", "Self-assesment"]),
        // },

      ],
      {}
    );

    // Enable foreign key checks
    await queryInterface.sequelize.query("SET FOREIGN_KEY_CHECKS = 1");
  },

  down: async (queryInterface, Sequelize) => {
    // Delete data from the table
    await queryInterface.sequelize.query("SET FOREIGN_KEY_CHECKS = 0");

    await queryInterface.bulkDelete("onboarding_questions", null, {});

    await queryInterface.sequelize.query("SET FOREIGN_KEY_CHECKS = 1");
  },
};
