const ResponseStatus = require("../config/message.config");
const { Account, Chapter } = require("../database/connection");

class ChapterController {

    static async read(req, res) {

        const { id } = req.userData;

        try {

            const studentAccount = await Account.findByPk(id);

            const studentProfile = await studentAccount.getStudent();

            const studentClass = await studentProfile.getClass();

            const classSubject = await studentClass.getSubjects({ where: { id: req.params.id } });

            // const subjectChapters = await classSubject.getChapters();

            const chapters = await Chapter.findAll({
                where: { SubjectId: 1 },
            });

            return res.status(ResponseStatus.code.success).json({ error: false, message: ResponseStatus.pass.read, data: classSubject });

        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'server error' ,  extra: error.message });
        };
    }

}

module.exports = ChapterController;