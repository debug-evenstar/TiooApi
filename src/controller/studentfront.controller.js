// import { Textbook } from "../database/connection";
const { Op } = require("sequelize");
const { Textbook, Account, Shelf } = require("../database/connection");
class StudentFront {
  static async getLibraryTextbooks(req, res) {
    const textbooks = await Textbook.findAll({});

    return res.send({
      error: false,
      data: textbooks,
    });
  }

  async getStudentTextbooks(){

  }

  static async getStudentShelf(req, res) {
    const { id } = req.userData;
    const shelfRecords = await Shelf.findAll({
      where: {
        account_id: id,
      },
      attributes: ['textbook_id']
    })

    const book_ids = shelfRecords.map((sr) => sr.textbook_id);


    const books = await Textbook.findAll({
      where: {
        id: book_ids
      }
    })

    return res.send({
      error: false,
      data: books,
    });
  }

  static async addTextbookToShelf(req, res) {
    const { id } = req.userData;
    const { textbook_id } = req.body;

    const account = await Account.findByPk(id);
    const textbook = await Textbook.findByPk(textbook_id);

    const count = await Shelf.count({
      where: { account_id: id, textbook_id: textbook_id },
    });

    if (count) {
      return res.send({
        error: true,
        message: "Already added book to shelf",
      });
    }

    await account.addTextbook(textbook);

    return res.send({
      error: false,
      message: "Added book to shelf",
    });
  }
}

module.exports = StudentFront;
