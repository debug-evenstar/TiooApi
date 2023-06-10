const ClassSeeds = require('../../utils/class.utilities');
const {Class} = require('../../database/connection');

class SchoolUtils {

    static async processClassesForSchool(action, schoolChoice, schoolId, customClassNaming) {

        switch (action) {
            case 'NS':
                if (schoolChoice.includes('nursery') && schoolChoice.includes('primary') && schoolChoice.includes('secondary')) {
                    await SchoolUtils.setupSchoolClasses(schoolId, ClassSeeds.nurseryToSecondary);
                } else if (schoolChoice.includes('nursery') && schoolChoice.includes('primary')) {
                    await SchoolUtils.setupSchoolClasses(schoolId, ClassSeeds.nurseryToPrimary);
                } else if (schoolChoice.includes('nursery') && schoolChoice.includes('secondary')) {
                    await SchoolUtils.setupSchoolClasses(schoolId, ClassSeeds.nurseryAndSecondary);
                } else if (schoolChoice.includes('primary') && schoolChoice.includes('secondary')) {
                    await SchoolUtils.setupSchoolClasses(schoolId, ClassSeeds.primaryAndSecondary);
                } else if (schoolChoice.includes('nursery')) {
                    await SchoolUtils.setupSchoolClasses(schoolId, ClassSeeds.nursery);
                } else if (schoolChoice.includes('primary')) {
                    await SchoolUtils.setupSchoolClasses(schoolId, ClassSeeds.primary);
                } else if (schoolChoice.includes('secondary')) {
                    await SchoolUtils.setupSchoolClasses(schoolId, ClassSeeds.secondary);
                } else {
                    console.log('Invalid school choice.');
                }
                break;

            case 'G':
                if (schoolChoice.includes('primary') && schoolChoice.includes('secondary')) {
                    await SchoolUtils.setupSchoolClasses(schoolId, ClassSeeds.primaryToSecondaryGrade);
                } else if (schoolChoice.includes('primary')) {
                    await SchoolUtils.setupSchoolClasses(schoolId, ClassSeeds.primaryGrade);
                } else if (schoolChoice.includes('secondary')) {
                    await SchoolUtils.setupSchoolClasses(schoolId, ClassSeeds.secondaryGrade);
                } else {
                    console.log('Invalid school choice.');
                }
                break;

            case 'C':
                await SchoolUtils.setupSchoolClasses(schoolId, customClassNaming);
                break;

            default:
                console.log('Unknown action');
        }
    }

    static async setupSchoolClasses(schoolId, seedClass) {

        try {
            const classes = seedClass.map((classData) => ({
                ...classData,
                SchoolManagementId: schoolId,
            }));

            console.log(classes);
            await Class.bulkCreate(classes);
            return;
        } catch (error) {
            console.error('Error seeding classes:', error);
            return;
        }

    }
}

module.exports = SchoolUtils;
