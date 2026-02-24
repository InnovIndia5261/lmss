import React, { createContext, useState, useEffect } from "react";

export const BooksContext = createContext();

export const BooksProvider = ({ children }) => {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [favorites, setFavorites] = useState([]);

    useEffect(() => {
        // Mock Data Initialization
        const mockBooks = [
            { _id: "b1", title: "The Great Gatsby", author: "F. Scott Fitzgerald", genre: "Classic", status: "Available", availability: true, description: "A classic novel set in the Roaring Twenties.", isbn: "9780743273565", publicationDate: "1925-04-10", reviews: [] },
            { _id: "b2", title: "1984", author: "George Orwell", genre: "Dystopian", status: "Available", availability: true, description: "A dystopian social science fiction novel.", isbn: "9780451524935", publicationDate: "1949-06-08", reviews: [] },
            { _id: "b3", title: "To Kill a Mockingbird", author: "Harper Lee", genre: "Fiction", status: "Available", availability: true, description: "A novel about the serious issues of rape and racial inequality.", isbn: "9780061120084", publicationDate: "1960-07-11", reviews: [] },
            { _id: "b4", title: "The Catcher in the Rye", author: "J.D. Salinger", genre: "Fiction", status: "Issued", availability: false, description: "A story about adolescent alienation.", isbn: "9780316769488", publicationDate: "1951-07-16", reviews: [] },
            { _id: "b5", title: "Pride and Prejudice", author: "Jane Austen", genre: "Romance", status: "Available", availability: true, description: "A romantic novel of manners.", isbn: "9780141439518", publicationDate: "1813-01-28", reviews: [] },
        ];
        setBooks(mockBooks);
        setLoading(false);
    }, []);

    const addBook = (newBook) => {
        setBooks((prev) => [newBook, ...prev]);
    };

    const updateBook = (updatedBook) => {
        setBooks((prev) => prev.map((book) => (book._id === updatedBook._id ? updatedBook : book)));
    };

    const deleteBook = (bookId) => {
        setBooks((prev) => prev.filter((book) => book._id !== bookId));
    };

    const toggleFavorite = (book) => {
        if (favorites.some((fav) => fav._id === book._id)) {
            setFavorites((prev) => prev.filter((fav) => fav._id !== book._id));
        } else {
            setFavorites((prev) => [...prev, book]);
        }
    };

    const addReview = (bookId, review) => {
        setBooks((prev) => prev.map((book) => {
            if (book._id === bookId) {
                return { ...book, reviews: [...(book.reviews || []), review] };
            }
            return book;
        }));
    };

    return (
        <BooksContext.Provider value={{ books, loading, addBook, updateBook, deleteBook, favorites, toggleFavorite, addReview }}>
            {children}
        </BooksContext.Provider>
    );
};
