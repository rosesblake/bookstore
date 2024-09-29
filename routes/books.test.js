process.env.NODE_ENV = "test";
const request = require("supertest");

const app = require("../app");
const db = require("../db");
const Book = require("../models/book");
const validate = require("../middleware/validation");
const ExpressError = require("../expressError");

describe("Books Routes Test", function () {
  let book1 = null;

  beforeEach(async function () {
    await db.query("DELETE FROM books");

    book1 = await Book.create({
      isbn: "0691161518",
      amazon_url: "http://a.co/eobPtX2",
      author: "Matthew Lane",
      language: "english",
      pages: 264,
      publisher: "Princeton University Press",
      title: "Power-Up: Unlocking Hidden Math in Video Games",
      year: 2017,
    });
  });

  test("can create book", async function () {
    let b = await Book.create({
      isbn: "9780134857498",
      amazon_url: "https://www.amazon.com/dp/0134857497",
      author: "John Doe",
      language: "spanish",
      pages: 350,
      publisher: "Tech Press",
      title: "Learning Programming with Python",
      year: 2020,
    });
    expect(b.isbn).toBe("9780134857498");
  });

  test("should throw error for invalid book", async () => {
    try {
      await Book.create({
        isbn: 1,
        amazon_url: "https://www.amazon.com/dp/0134857497",
        author: "John Doe",
        language: "spanish",
        pages: 350,
        publisher: "Tech Press",
        title: "Learning Programming with Python",
        year: 2020,
      });
      throw new Error("Expected error was not thrown");
    } catch (e) {
      expect(e.message).toContain("instance.isbn is not of a type(s) string");
    }
  });

  test("should get all books", async () => {
    let b = await Book.findAll();
    expect(b).toEqual(expect.arrayContaining([book1]));
  });

  test("can get specific book", async () => {
    let b = await Book.findOne(book1.isbn);
    expect(b).toEqual(book1);
  });

  test("can update a book", async () => {
    let b = await Book.update(book1.isbn, {
      amazon_url: "https://www.amazon.com/dp/0134857497",
      author: "chicken",
      language: "portuguese",
      pages: 30,
      publisher: "prazer",
      title: "aprendendo portugues",
      year: 2019,
    });
    expect(b.author).toBe("chicken");
  });

  test("can delete a book", async () => {
    await Book.remove(book1.isbn);
    let book = await db.query(`SELECT isbn FROM books WHERE isbn = $1`, [
      book1.isbn,
    ]);
    expect(book.rows.length).toBe(0);
  });
});

afterAll(async function () {
  await db.end();
});
