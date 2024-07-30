// import { Textbook } from "../database/connection";
const { Op } = require("sequelize");
const { Textbook, Account, Shelf } = require("../database/connection");
class LibraryController {

  static async getLibraryTextbooks(req, res) {
    const { id } = req.userData;
    const textbooks = await Textbook.findAll({});

    const account = await Account.findByPk(id, {
      include: Shelf,
    });

    // return res.send({
    //   shelf: account.Shelf.shelf
    // });

    let response = textbooks;

    console.log(account.Shelf.shelf)

    response = textbooks.map((textbook) => {
      const inShelf = account.Shelf.shelf.includes(textbook.id);
      return {
        ...textbook.get({plain: true}),
        inShelf
      };
    })

    return res.send({
      error: false,
      data: response
    });
  }

  async getStudentTextbooks() {}

  static async getStudentShelf(req, res) {
    const { id } = req.userData;
    const account = await Account.findByPk(id, {
      include: Shelf,
    });


    if (account.Shelf) {
      const books = await Textbook.findAll({
        where: {
          id: account.Shelf?.shelf ?? [],
        },
      });

      return res.send({
        error: false,
        data: books,
      });
    }

    return res.send({
      error: false,
      data: [],
    });
  }

  static async removeTextbookFromShelf(req, res) {
    const { id } = req.userData;
    const { textbook_id } = req.body;
    const account = await Account.findByPk(id, {
      include: Shelf,
    });

    await account.Shelf.update({
      shelf: account.Shelf.shelf.filter((id) => id != textbook_id),
    });

    return res.send({
      error: false,
      message: "Removed textbook from shelf",
    });
  }

  static async addTextbookToShelf(req, res) {
    const { id } = req.userData;
    const { textbook_id } = req.body;

    const account = await Account.findByPk(id, {
      include: Shelf,
    });

    if (!account.Shelf) {
      // create a shelf for the user
      const shelf = await account.createShelf({
        account_id: id,
        shelf: [textbook_id],
      });
    } else {
      await account.Shelf.update({
        shelf: [...new Set([...account.Shelf.shelf, textbook_id])],
      });
    }

    // const textbook = await Textbook.findByPk(textbook_id);
    return res.send({
      error: false,
      message: "Added book to shelf",
    });
  }
}

module.exports = LibraryController;