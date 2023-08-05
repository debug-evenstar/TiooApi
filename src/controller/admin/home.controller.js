const ResponseStatus = require('../../config/message.config');
const { Account, Validation, Teacher, SchoolManagement } = require('../../database/connection');

class HomeController {

  /*-----------------------------------| SCHOOL RELATIONAL DATA |-----------------------------------*/



  static async dashboard(req, res) {

    try {

      /*---------------------------| CURRENT DATE AND A WEEK AGO |----------------------*/
      const currentDate = new Date();
      const twoWeeksAgo = new Date();
      twoWeeksAgo.setDate(currentDate.getDate() - 14);

      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(currentDate.getDate() - 7);

      const accounts = await Account.findAll();

      /*--------------------------------| ACCOUNT TYPE WEEKS RANGE FILTER |---------------------------*/

      let thisWeeksAccount = accounts.filter((item) => {
        const createdAtDate = new Date(item.createdAt);
        return ['school', 'freelancer', 'teacher', 'student'].includes(item.account_type) &&
          createdAtDate >= twoWeeksAgo && createdAtDate <= oneWeekAgo;
      });


      let lastWeeksAccount = accounts.filter((item) => {
        const createdAtDate = new Date(item.createdAt);
        return ['school', 'freelancer', 'teacher', 'student'].includes(item.account_type) &&
          createdAtDate >= twoWeeksAgo && createdAtDate <= currentDate;
      });


      let totalWeeksAccount = accounts.filter((item) => {
        const createdAtDate = new Date(item.createdAt);
        return ['school', 'freelancer', 'teacher', 'student'].includes(item.account_type)
      });


      /*--------------------------------| TWO WEEKS AGO COUNT |---------------------------*/

      const countTotalWeeks = {};
      ['school', 'freelancer', 'teacher', 'student'].forEach((accountType) => {
        const count = totalWeeksAccount.reduce((count, item) => {
          return count + (item.account_type === accountType ? 1 : 0);
        }, 0);
        countTotalWeeks[accountType] = count;
      });

      const countsTwoWeeksAgo = {};
      ['school', 'freelancer', 'teacher', 'student'].forEach((accountType) => {
        const count = thisWeeksAccount.reduce((count, item) => {
          return count + (item.account_type === accountType ? 1 : 0);
        }, 0);
        countsTwoWeeksAgo[accountType] = count;
      });


      thisWeeksAccount = lastWeeksAccount.filter((item) => {
        const createdAtDate = new Date(item.createdAt);
        return createdAtDate >= oneWeekAgo;
      });


      const countsOneWeekAgo = {};
      ['school', 'freelancer', 'teacher', 'student'].forEach((accountType) => {
        const count = thisWeeksAccount.reduce((count, item) => {
          return count + (item.account_type === accountType ? 1 : 0);
        }, 0);
        countsOneWeekAgo[accountType] = count;
      });


      const countDifference = {};
      const percentageChange = {};
      ['school', 'freelancer', 'teacher', 'student'].forEach((accountType) => {
        countDifference[accountType] = countsOneWeekAgo[accountType] - countsTwoWeeksAgo[accountType];

        console.log(countDifference[accountType]);

        if (countsOneWeekAgo[accountType] === 0 && countsTwoWeeksAgo[accountType] !== 0) {

          percentageChange[accountType] = (countDifference[accountType] / countsTwoWeeksAgo[accountType]) * 100;

        } else if (countsOneWeekAgo[accountType] !== 0 && countsTwoWeeksAgo[accountType] === 0) {

          percentageChange[accountType] = (countDifference[accountType] / countsOneWeekAgo[accountType]) * 100;

        } else {
          percentageChange[accountType] = 0;
        }

      });


      const weeklyReport = {
        school: countsOneWeekAgo.school,
        school_change: percentageChange.school,
        freelancer: countsOneWeekAgo.freelancer,
        freelancer_change: percentageChange.freelancer,
        teacher: countsOneWeekAgo.teacher,
        teacher_change: percentageChange.teacher,
        student: countsOneWeekAgo.student,
        student_change: percentageChange.student
      };

      const analytics = countTotalWeeks

      const payload = {};
      payload.weeklyReport = weeklyReport;
      payload.analytics = analytics;

      // console.log('All Weeks count:', countTotalWeeks);
      // console.log('Counts two weeks ago:', countsTwoWeeksAgo);
      // console.log('Counts one week ago:', countsOneWeekAgo);
      // console.log('Count difference:', countDifference);
      // console.log('Percentage change:', percentageChange);


      return res.status(ResponseStatus.code.success).json({ error: false, message: ResponseStatus.pass.read, data: payload });

    } catch (error) {
      console.log(error);
      res.status(500).json({ error: 'Server Error' });
    };

  };


  static async activeUser(req, res) {

    try {

      const currentDate = new Date();
      const firstDayThisMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
      const firstDayLastMonth = new Date(firstDayThisMonth);
      firstDayLastMonth.setMonth(firstDayLastMonth.getMonth() - 1);


      // // Extract the year and month from req.params as numbers
      // const year = parseInt(req.params.year);
      // const month = parseInt(req.params.month) - 1; // JavaScript months are zero-indexed (0 - 11)

      // // Calculate the first day of the specified month and year
      // const firstDayThisMonth = new Date(year, month, 1);

      // // Calculate the first day of the previous month
      // const firstDayLastMonth = new Date(firstDayThisMonth);
      // firstDayLastMonth.setMonth(firstDayLastMonth.getMonth() - 1);

      // // Calculate the last day of the specified month and year
      // const lastDayThisMonth = new Date(year, month + 1, 0); //

      
      const accounts = await Account.findAll({ where: { status: 'active' } });
      
      const accountsLastMonth = accounts.filter((account) => {
        const createdAtDate = new Date(account.createdAt);
        return createdAtDate >= firstDayLastMonth && createdAtDate < firstDayThisMonth;
      });
      
      const accountsThisMonth = accounts.filter((account) => {
        const createdAtDate = new Date(account.createdAt);
        return createdAtDate >= firstDayThisMonth && createdAtDate <= currentDate;
      });
      
      
      /*--------------------| COUNT OF EACH ACCOUNT TYPE FOR LAST MONTH |------------------------*/

      const countLastMonth = {};
      ['school', 'freelancer', 'teacher', 'student'].forEach((accountType) => {
        countLastMonth[accountType] = accountsLastMonth.reduce((count, account) => {
          return count + (account.account_type === accountType ? 1 : 0);
        }, 0);
      });
      
      
      /*--------------------| COUNT OF EACH ACCOUNT TYPE FOR THIS MONTH |------------------------*/

      const countThisMonth = {};
      ['school', 'freelancer', 'teacher', 'student'].forEach((accountType) => {
        countThisMonth[accountType] = accountsThisMonth.reduce((count, account) => {
          return count + (account.account_type === accountType ? 1 : 0);
        }, 0);
      });
      
      /*--------------------| CALCULATE DIFFERENCE |------------------------*/

      const progressDifference = {};
      const percentageProgress = {};
      ['school', 'freelancer', 'teacher', 'student'].forEach((accountType) => {
        progressDifference[accountType] = countThisMonth[accountType] - countLastMonth[accountType];
        
        if (countLastMonth[accountType] !== 0) {
          percentageProgress[accountType] = ((countThisMonth[accountType] - countLastMonth[accountType]) / countLastMonth[accountType]) * 100;

        } else {

          percentageProgress[accountType] = 0; 
        
        }
      });
      
      // console.log('Count last month:', countLastMonth);
      // console.log('Count this month:', countThisMonth);
      // console.log('Progress difference:', progressDifference);
      // console.log('Percentage progress:', percentageProgress);


      const payload = {
        total_active_user: countThisMonth.school + countThisMonth.freelancer + countThisMonth.teacher + countThisMonth.student,
        school: countThisMonth.school,
        freelancer: countThisMonth.freelancer,
        teacher: countThisMonth.teacher,
        student: countThisMonth.student,
        percentage_progress:  percentageProgress.school + percentageProgress.freelancer + percentageProgress.teacher + percentageProgress.student,
      }
      


      return res.status(ResponseStatus.code.success).json({ error: false, message: ResponseStatus.pass.read, data: payload });

    } catch (error) {
      console.log(error);
      res.status(500).json({ error: 'Server Error' });
    };

  };


}


module.exports = HomeController;
