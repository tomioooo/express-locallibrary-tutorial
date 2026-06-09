#! /usr/bin/env node

console.log(
  'This script populates some test mangas, mangaka authors, genres and bookinstances to your database. Specify the database as an argument - e.g.: node populatedb "mongodb+srv://cooluser:coolpassword@cluster0.cojoign.mongodb.net/local_library?retryWrites=true&w=majority&appName=Cluster0"'
);

// Get arguments passed on command line
const userArgs = process.argv.slice(2);

const Book = require("./models/book");
const Author = require("./models/author");
const Genre = require("./models/genre");
const BookInstance = require("./models/bookinstance");

const genres = [];
const authors = [];
const books = [];
const bookinstances = [];

const mongoose = require("mongoose");

const mongoDB = userArgs[0];

main().catch((err) => console.log(err));

async function main() {
  console.log("Debug: About to connect");
  await mongoose.connect(mongoDB);
  console.log("Debug: Should be connected?");
  await createGenres();
  await createAuthors();
  await createBooks();
  await createBookInstances();
  console.log("Debug: Closing mongoose");
  await mongoose.connection.close();
}

// We pass the index to the ...Create functions so that, for example,
// genre[0] will always be the Fantasy genre, regardless of the order
// in which the elements of promise.all's argument complete.
async function genreCreate(index, name) {
  const genre = new Genre({ name: name });
  await genre.save();
  genres[index] = genre;
  console.log(`Added genre: ${name}`);
}

async function authorCreate(index, first_name, family_name, d_birth, d_death) {
  const authordetail = { first_name: first_name, family_name: family_name };
  if (d_birth != false) authordetail.date_of_birth = d_birth;
  if (d_death != false) authordetail.date_of_death = d_death;

  const author = new Author(authordetail);

  await author.save();
  authors[index] = author;
  console.log(`Added author: ${first_name} ${family_name}`);
}

async function bookCreate(index, title, summary, isbn, author, genre) {
  const bookdetail = {
    title,
    summary,
    author,
    isbn,
  };
  if (genre != false) bookdetail.genre = genre;

  const book = new Book(bookdetail);
  await book.save();
  books[index] = book;
  console.log(`Added book: ${title}`);
}

async function bookInstanceCreate(index, book, imprint, due_back, status) {
  const bookinstancedetail = {
    book,
    imprint,
  };
  if (due_back != false) bookinstancedetail.due_back = due_back;
  if (status != false) bookinstancedetail.status = status;

  const bookinstance = new BookInstance(bookinstancedetail);
  await bookinstance.save();
  bookinstances[index] = bookinstance;
  console.log(`Added bookinstance: ${imprint}`);
}

async function createGenres() {
  console.log("Adding genres");
  await Promise.all([
    genreCreate(0, "Shonen"),
    genreCreate(1, "Seinen"),
    genreCreate(2, "Magia / Fantasia"),
    genreCreate(3, "Shoujo"),
    genreCreate(4, "Ação"),
  ]);
}

async function createAuthors() {
  console.log("Adding authors");
  await Promise.all([
    authorCreate(0, "Eiichiro", "Oda", "1975-01-01", false),
    authorCreate(1, "Hajime", "Isayama", "1986-08-29", false),
    authorCreate(2, "Kohei", "Horikoshi", "1986-11-20", false),
    authorCreate(3, "Naoko", "Takeuchi", "1967-03-15", false),
    authorCreate(4, "Tite", "Kubo", "1977-06-26", false),
  ]);
}

async function createBooks() {
  console.log("Adding Books");
  await Promise.all([
    bookCreate(
      0,
      "One Piece",
      "A young pirate named Monkey D. Luffy sails the Grand Line to become the Pirate King and find the legendary treasure One Piece.",
      "ISBNONEPIECE001",
      authors[0],
      [genres[0], genres[4]]
    ),
    bookCreate(
      1,
      "Attack on Titan",
      "Eren Jaeger joins the Scout Regiment to fight giant humanoid Titans that have overrun humanity's walled cities.",
      "ISBNAOT001",
      authors[1],
      [genres[1], genres[4]]
    ),
    bookCreate(
      2,
      "My Hero Academia",
      "In a world where nearly everyone has superpowers, a powerless boy named Izuku Midoriya dreams of becoming the greatest hero.",
      "ISBNMHA001",
      authors[2],
      [genres[0], genres[4]]
    ),
    bookCreate(
      3,
      "Sailor Moon",
      "Usagi Tsukino transforms into Sailor Moon to defend the world from dark forces with the power of love and friendship.",
      "ISBNSM001",
      authors[3],
      [genres[3], genres[2]]
    ),
    bookCreate(
      4,
      "Bleach",
      "Ichigo Kurosaki becomes a Soul Reaper and fights evil spirits while protecting the living world from supernatural threats.",
      "ISBNBLEACH001",
      authors[4],
      [genres[0], genres[4]]
    ),
    bookCreate(
      5,
      "Demon Slayer: Kimetsu no Yaiba",
      "Tanjiro Kamado becomes a demon slayer to avenge his family and cure his sister Nezuko, who was turned into a demon.",
      "ISBNDMS001",
      authors[1],
      [genres[1], genres[2]]
    ),
    bookCreate(
      6,
      "Tokyo Ghoul",
      "College student Ken Kaneki turns into a half-ghoul and must learn to survive in a world where ghouls prey on humans.",
      "ISBNTG001",
      authors[4],
      false
    ),
  ]);
}

async function createBookInstances() {
  console.log("Adding authors");
  await Promise.all([
    bookInstanceCreate(
      0,
      books[0],
      "London Gollancz, 2014.",
      false,
      "Available"
    ),
    bookInstanceCreate(1, books[1], " Gollancz, 2011.", false, "Loaned"),
    bookInstanceCreate(2, books[2], " Gollancz, 2015.", false, false),
    bookInstanceCreate(
      3,
      books[3],
      "New York Tom Doherty Associates, 2016.",
      false,
      "Available"
    ),
    bookInstanceCreate(
      4,
      books[3],
      "New York Tom Doherty Associates, 2016.",
      false,
      "Available"
    ),
    bookInstanceCreate(
      5,
      books[3],
      "New York Tom Doherty Associates, 2016.",
      false,
      "Available"
    ),
    bookInstanceCreate(
      6,
      books[4],
      "New York, NY Tom Doherty Associates, LLC, 2015.",
      false,
      "Available"
    ),
    bookInstanceCreate(
      7,
      books[4],
      "New York, NY Tom Doherty Associates, LLC, 2015.",
      false,
      "Maintenance"
    ),
    bookInstanceCreate(
      8,
      books[4],
      "New York, NY Tom Doherty Associates, LLC, 2015.",
      false,
      "Loaned"
    ),
    bookInstanceCreate(9, books[0], "Imprint XXX2", false, false),
    bookInstanceCreate(10, books[1], "Imprint XXX3", false, false),
  ]);
}
