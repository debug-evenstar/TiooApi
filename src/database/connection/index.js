const enviromentalConfig = require("../../config/db.config");
const Relationships = require("./relationships");

const dbConfig = enviromentalConfig.development;

const Sequelize = require("sequelize");
const { formatRelationshipAliases } = require("./util");
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  operatorsAliases: 0,
  define: {
    underscored: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
    deletedAt: "deleted_at",
  },
  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle,
  },
  logging: false, // Disable logging of SQL queries
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

const Account = (db.accounts = require("../account.model")(
  sequelize,
  Sequelize
));
const Validation = (db.validations = require("../validation.model")(
  sequelize,
  Sequelize
));
const Subject = (db.subjects = require("../subject.model")(
  sequelize,
  Sequelize
));
const Class = (db.classes = require("../class.model")(sequelize, Sequelize));
const SchoolManagement = (db.schools = require("../profile.model/school.model")(
  sequelize,
  Sequelize
));
const Student = (db.students = require("../profile.model/student.model")(
  sequelize,
  Sequelize
));
const Teacher = (db.teachers = require("../profile.model/teacher.model")(
  sequelize,
  Sequelize
));
const TempValidation = (db.tempvalidations = require("../temp.validation.model")(sequelize, Sequelize));

const ClassArm = (db.classarms = require("../classarms.model")(
  sequelize,
  Sequelize
));

const Invite = (db.invites = require("../invite.model")(sequelize, Sequelize));
const Lesson = (db.lessons = require("../lesson.model")(sequelize, Sequelize));
const Chapter = (db.chapters = require("../chapter.model")(
  sequelize,
  Sequelize
));
const Price = (db.prices = require("../pricing.model")(sequelize, Sequelize));

const Admin = (db.admins = require("../admin.model")(sequelize, Sequelize));
const Authorization = (db.roles = require("../authorization.model")(
  sequelize,
  Sequelize
));
const Permission = (db.permissions = require("../permission.model")(
  sequelize,
  Sequelize
));

const Library = (db.Libraries = require("../library.model")(
  sequelize,
  Sequelize
));

const Coupon = (db.coupons = require("../coupon.model")(sequelize, Sequelize));

const TotalLog = (db.totallogs = require("../totallog.model")(
  sequelize,
  Sequelize
));
const Group = (db.groups = require("../groups.model")(sequelize, Sequelize));
const LessonSlide = (db.lessonslides = require("../lesson.slides.model")(
  sequelize,
  Sequelize
));

const Preference = (db.preferences = require("../preference.model")(
  sequelize,
  Sequelize
));
const Billing = (db.billings = require("../billing.model")(
  sequelize,
  Sequelize
));
const Keypairs = (db.keypairs = require("../keypairs.model")(
  sequelize,
  Sequelize
));

const Notification = (db.preferences = require("../notification.model")(
  sequelize,
  Sequelize
));
const Subscription = (db.billings =
  require("../notification_subscribers.model")(sequelize, Sequelize));

const Textbook = (db.textbooks = require("../textbook.model")(
  sequelize,
  Sequelize
));
const CartItem = (db.cartItems = require("../cartItem.model")(
  sequelize,
  Sequelize
));

const Shelf = (db.shelf = require("../shelf.model")(sequelize,Sequelize));

const OnboardingQuestion = (db.onboarding = require("../onboardingQuestion.model")(
  sequelize,
  Sequelize
));

const Referral = (db.referral = require("../referral.model")(
  sequelize, Sequelize
))

const LessonProgress = (db.lessonProgress = require("../lessonprogress.model")(
  sequelize,
  Sequelize
));

const StudyPlan = (db.studyplan = require("../studyplan.model")(
  sequelize, Sequelize
));

const Topic = (db.topic = require("../topic.model"))(
  sequelize,Sequelize
);

const BookCategory = (db.bookcategory = require("../bookcategory.model"))(sequelize,Sequelize);

const Question = (db.question = require("../question.model"))(
  sequelize,Sequelize
);

const SubCategory = (db.subcategory = require("../subcategory.model"))(sequelize,Sequelize);


const ExamSet = (db.examset = require("../examset.model"))(sequelize,Sequelize);

const models = [
  Account,
  Validation,
  Subject,
  Class,
  SchoolManagement,
  Student,
  Teacher,
  TempValidation,
  ClassArm,
  Lesson,
  Chapter,
  Authorization,
  Admin,
  Coupon,
  Library,
  Group,
  LessonSlide,
  Preference,
  Shelf,
  Billing,
  Notification,
  Subscription,
  Keypairs,
  Textbook,
  CartItem,
  OnboardingQuestion,
  Topic,
  BookCategory,
  Question,
  LessonProgress,
  Referral,
  SubCategory,
  StudyPlan,
  ExamSet,
];

Relationships.group(...models);

formatRelationshipAliases(...models);

module.exports = {
  db,
  Account,
  Validation,
  Subject,
  Class,
  Shelf,
  SchoolManagement,
  Student,
  Teacher,
  TempValidation,
  ClassArm,
  Invite,
  Lesson,
  Chapter,
  Price,
  Authorization,
  Permission,
  Admin,
  Coupon,
  Library,
  TotalLog,
  Group,
  LessonSlide,
  Preference,
  Billing,
  Keypairs,
  Notification,
  Subscription,
  Textbook,
  CartItem,
  OnboardingQuestion,
  Topic,
  BookCategory,
  Question,
  LessonProgress,
  Referral,
  SubCategory,
  StudyPlan,
  ExamSet
};
