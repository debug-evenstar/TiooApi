const bcrypt = require('bcrypt');

module.exports = (sequelize, DataTypes) => {
    const SchoolManagement = sequelize.define(
        'SchoolManagement',
        {

            //================= PERSONAL INFORMATION=========// 

            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            school_types: {
                type: DataTypes.TEXT,
                defaultValue: JSON.stringify(['primary', 'secondary']),
                get() {
                    const value = this.getDataValue('school_types');
                    return value ? JSON.parse(value) : [];
                },
            },
            school_name : {
                type : DataTypes.TEXT,
                allowNull : false
            },
            naming_types: {
                type: DataTypes.TEXT,
                defaultValue:"nurs-sec"
            },
            others: {
                type: DataTypes.JSON,
                allowNull: true
            },

            dateOfBirth: {
                type: DataTypes.DATE,
                allowNull: true,
            },
            gender: {
                type: DataTypes.STRING,
                allowNull: true,
                
            },
            nationality: {
                type: DataTypes.STRING,
                allowNull: true,
                defaultValue:"Nigeria"
            },
            residentialAddress: {
                type: DataTypes.STRING,
                allowNull: true,
            },
    

            //=========== IDENTIFICATION DOCUMENT =========// 

            passportNumber: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            nationalIdNumber: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            driverLicenseNumber: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            ssn: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            tin: {
                type: DataTypes.STRING,
                allowNull: true,
            },

            //=============== PROOF ADDRESS ================// 

            proofOfAddress: {
                type: DataTypes.STRING,
                allowNull: true,
            },

            //=============  FINANCIAL INFORMATION ===========// 

            occupation: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            employerDetails: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            incomeDetails: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            sourceOfFunds: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            taxReturns: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            businessRegistration: {
                type: DataTypes.STRING,
                allowNull: true,
            },

            //=============== ADDITIONAL INFORMATION ================// 

            beneficialOwnership: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            pepStatus: {
                type: DataTypes.BOOLEAN,
                allowNull: true,
                defaultValue: false,
            },
            riskAssessment: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            purposeOfAccount: {
                type: DataTypes.STRING,
                allowNull: true,
            },
        }, {
        timestamps: false,
    });

    return SchoolManagement;
};
