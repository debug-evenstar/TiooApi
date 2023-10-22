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
                // get() {
                //     const value = this.getDataValue('school_types');
                //     return value ? JSON.parse(value) : [];
                // },
            },
            school_name: {
                type: DataTypes.TEXT,
                allowNull: false
            },
            naming_types: {
                type: DataTypes.TEXT,
                defaultValue: "nurs-sec"
            },
            others: {
                type: DataTypes.JSON,
                allowNull: true
            },

            date_of_birth: {
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
                defaultValue: "Nigeria"
            },
            residential_address: {
                type: DataTypes.STRING,
                allowNull: true,
            },


            //=========== IDENTIFICATION DOCUMENT =========// 


            ssn: {
                type: DataTypes.STRING,
                allowNull: true,
            },

            schoo_owner: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            email: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            phone: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            website: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            nationality: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            grading_system: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            establishment_date: {
                type: DataTypes.DATE,
                allowNull: true,
            },
            ownership_type: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            business_registration_number: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            bank_name: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            account_name: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            account_number: {
                type: DataTypes.INTEGER,
                allowNull: true,
            },
            means_of_identification: {
                type: DataTypes.INTEGER,
                allowNull: true,
            },

            ids: {
                type: DataTypes.JSON,
                defaultValue: [],
            },

            proves: {
                type: DataTypes.JSON,
                defaultValue: [],
            },

        }, {
        timestamps: false,
    });

    return SchoolManagement;
};
