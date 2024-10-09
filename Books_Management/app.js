class Book {
    constructor(title, author, isbn) {
        this.title = title;
        this.author = author;
        this.isbn = isbn;
    }
}

class UI {
    addBookToList(book) {
        const list = document.querySelector("#book-list");
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${book.title}</td>
            <td>${book.author}</td>
            <td>${book.isbn}</td>
            <td class="delete">
                <a href="#" class="btn btn-danger">X</a>
            </td>
        `;

        list.appendChild(row);
    }

    deleteBook(target) {
        if (confirm("Are you sure?")) {
            target.parentElement.parentElement.remove();
        }
    }

    clearField() {
        document.querySelector("#book-form").reset();
    }
}

class Store {
    static getBooks() {
        let books;
        if (localStorage.getItem("books") === null) {
            books = [];
        } else {
            books = JSON.parse(localStorage.getItem("books"));
        }
        return books;
    }

    static addBook(book) {
        const books = Store.getBooks();
        books.push(book);
        localStorage.setItem("books", JSON.stringify(books));
    }

    static displayBooks() {
        const books = Store.getBooks();
        books.forEach(function(book) {
            const ui = new UI();
            ui.addBookToList(book);
        });
    }

    static removeBook(isbn) {
        const books = Store.getBooks();
        books.forEach(function(book, index) {
            if (book.isbn === isbn) {
                books.splice(index, 1);
            }
        });
        localStorage.setItem("books", JSON.stringify(books));
    }
}

document.addEventListener("DOMContentLoaded", Store.displayBooks);

document.querySelector("#book-form").addEventListener("submit", function(e) {
    e.preventDefault();

    const title = document.getElementById("title").value;
    const author = document.getElementById("author").value;
    const isbn = document.getElementById("isbn").value;

    const book = new Book(title, author, isbn);
    const ui = new UI();

    if (title === "" || author === "" || isbn === "") {
        alert("Please fill all the fields");
    } else {
        ui.addBookToList(book);
        Store.addBook(book);
        ui.clearField();
    }
});

document.querySelector("#book-list").addEventListener("click", function(e) {
    e.preventDefault();

    if (e.target.classList.contains("btn-danger")) {
        const ui = new UI();
        const isbn = e.target.parentElement.previousElementSibling.textContent;

        ui.deleteBook(e.target);
        Store.removeBook(isbn);
    }
});

document.querySelector(".clear-btn").addEventListener("click", function(e) {
    e.preventDefault();
    document.querySelector("#book-list").innerHTML = "";
    localStorage.removeItem("books");
});
