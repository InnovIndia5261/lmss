import React, { useContext } from "react";
import BookCard from "../components/BookCard";
import { BooksContext } from "../context/BooksContext";

const Favorites = () => {
    const { favorites, toggleFavorite } = useContext(BooksContext);

    return (
        <div>
            <div className="p-4 px-8 mb-8 shadow">
                <h4 className="text-3xl font-semibold">Favorites ({favorites.length})</h4>
            </div>
            <div className="px-8">
                {favorites.length === 0 ? (
                    <p className="text-gray-500">No favorite books yet.</p>
                ) : (
                    <div className="flex gap-4 flex-wrap">
                        {favorites.map((book) => (
                            <BookCard
                                key={book._id}
                                book={book}
                                handleBookClick={() => { }} // No detail view needed or could open same modal
                                handleEditBookClick={() => { }}
                                handleDeleteBookClick={() => { }}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Favorites;
