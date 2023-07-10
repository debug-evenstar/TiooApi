class ClassSeeds {
    static nursery = [
        { type: "nursery", naming: "Lower kindergarten" },
        { type: "nursery", naming: "Upper kindergarten" },
        { type: "nursery", naming: "Transition" },
        { type: "nursery", naming: "Nursery 1" },
        { type: "nursery", naming: "Nursery 2" },
    ]

    static primary = [
        { type: "primary", naming: "Primary 6" },
        { type: "primary", naming: "Primary 5" },
        { type: "primary", naming: "Primary 4" },
        { type: "primary", naming: "Primary 3" },
        { type: "primary", naming: "Primary 2" },
        { type: "primary", naming: "Primary 1" },
    ];

    static secondary = [
        { type: "secondary", naming: "JSS 1" },
        { type: "secondary", naming: "JSS 2" },
        { type: "secondary", naming: "JSS 3" },
        { type: "secondary", naming: "SS 1" },
        { type: "secondary", naming: "SS 2" },
        { type: "secondary", naming: "SS 3" },
    ];

    static nurseryToPrimary = [
        ...ClassSeeds.nursery,
        ...ClassSeeds.primary
    ];

    static nurseryToSecondary = [
        ...ClassSeeds.nursery,
        ...ClassSeeds.primary,
        ...ClassSeeds.secondary
    ];

    static nurseryAndSecondary = [
        ...ClassSeeds.nursery,
        ...ClassSeeds.secondary
    ];

    static primaryAndSecondary = [
        ...ClassSeeds.primary,
        ...ClassSeeds.secondary
    ];

    static primaryGrade = [
        { type: "pry-grade", naming: "Grade 1" },
        { type: "pry-grade", naming: "Grade 2" },
        { type: "pry-grade", naming: "Grade 3" },
        { type: "pry-grade", naming: "Grade 4" },
        { type: "pry-grade", naming: "Grade 5" },
        { type: "pry-grade", naming: "Grade 6" },
    ];



    static secondaryGrade = [
        { type: "sec-grade", naming: "Grade 7" },
        { type: "sec-grade", naming: "Grade 8" },
        { type: "sec-grade", naming: "Grade 9" },
        { type: "sec-grade", naming: "Grade 10" },
        { type: "sec-grade", naming: "Grade 11" },
        { type: "sec-grade", naming: "Grade 12" },
    ];

    static primaryToSecondaryGrade = [
        ...ClassSeeds.primaryGrade,
        ...ClassSeeds.secondaryGrade,
    ];


}


module.exports = ClassSeeds;
