const SchoolPayload = {
    token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyZGF0YSI6eyJpZCI6IjI4ZGVhNjMzLWU3MDAtNGMwOS05OTcxLTA4MDc0MmNhNzIzMiIsImVtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwiYWNjb3VudF90eXBlIjoiYWRtaW4ifSwiaWF0IjoxNjg1NzgwNjI3LCJleHAiOjE2ODYwMzk4Mjd9.QEoorJLam6AD-vLYh2l4Gl-Xqni90tm-GGiQeszxTkM",

    setup: {
        "email": "school1@gmail.com",
        "school_types": ["nursery", "primary", "secondary"],
        "naming_types": "NS"
    },

    customSetup: {
        "email": "school2@gmail.com",
        "school_types": ["Nursery", "Primary"],
        "naming_types": "C",
        "class_namings": [
            { "type": "custome", "naming": "Level 1" },
            { "type": "custome", "naming": "Level 2" },
            { "type": "custome", "naming": "Level 3" },
            { "type": "custome", "naming": "Level 4" }
        ]
    },

    primary_1_classArms: {
        "classId": 6,
        "arms": ["PRIMARY 1A", "PRIMARY 1B", "PRIMARY 1C"]
    },

    primary_2_classArms: {
        "classId": 7,
        "arms": ["PRIMARY 2A", "PRIMARY 2B", "PRIMARY 2C"]
    },

    customClassArms: {
        "classId": 18,
        "arms": ["LEVEL 1A", "LEVEL 1B", "LEVEL 1C"]
    },
    /*-------/ Primary 1&2 Arms A-C /----*/
    subject: {
        "naming": "Home Economics",
        "class": [6, 7],
        "classArm": [1, 2, 3, 7, 8, 9],
        "description": "desctipion can be empty",
        "SchoolManagementId": 1
    }

}

module.exports = SchoolPayload

/*-------------------NOTE
------------------------------------------------
based on this testing some id's will be fixed;
change class arms to 1, 2, 3, ...6
---*/
