import React, { useState } from "react";
import Card from "./common/Card";
import { FiEdit2, FiTrash, FiHeart } from "react-icons/fi";
import useAuth from "../hooks/useAuth";
import { useContext } from "react";
import { BooksContext } from "../context/BooksContext";

const BookCard = ({ book, handleBookClick, handleEditBookClick, handleDeleteBookClick }) => {
  const { user } = useAuth();
  const { favorites, toggleFavorite } = useContext(BooksContext) || {};
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const isFavorite = favorites?.some((fav) => fav._id === book._id);

  const confirmDelete = () => {
    handleDeleteBookClick(book);
    setShowDeleteModal(false);
  };

  return (
    <>
      {/* Book Card */}
      <Card
        onClick={() => handleBookClick(book)}
        customClass="w-auto !px-4 !py-4 bg-white border border-gray-200 !rounded-xl"
      >
        <div className="flex items-center gap-6 mb-4">
          <h4 className="text-md min-w-[120px] font-bold">{book?.title}</h4>
          <div className="flex gap-2 items-center">
            <div
              onClick={(e) => {
                e.stopPropagation();
                toggleFavorite(book);
              }}
              className={`p-2 rounded-full cursor-pointer ${isFavorite ? "text-red-500 bg-red-50" : "text-gray-400 hover:text-red-500 hover:bg-gray-100"}`}
            >
              <FiHeart size={20} fill={isFavorite ? "currentColor" : "none"} />
            </div>
            <div
              className={`px-2 py-1 ${book?.availability ? "badge-easy" : "badge-hard"}`}
            >
              <p className="text-xs font-medium">
                {book?.availability ? "Available" : "Borrowed"}
              </p>
            </div>
          </div>
        </div>

        <p className="mb-2 text-sm font-medium">{book?.author}</p>
        <p className="mb-2 text-sm text-gray-500 font-medium">
          ISBN: {book?.isbn}
        </p>

        <div className="flex items-center justify-between mt-4">
          <div className="px-2 py-1 border border-gray-200 rounded-md text-xs">
            <p className="text-sm">{book?.genre}</p>
          </div>

          <p className="text-xs m-0">
            {new Date(book?.publicationDate).getFullYear()}
          </p>

          {/* Admin-only icons */}
          {user?.role === "Admin" && (
            <div className="flex items-center gap-2">
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  handleEditBookClick(book);
                }}
                className="hover:bg-green-100 p-1 rounded-lg text-green-500"
                title="Edit Book"
              >
                <FiEdit2 size={14} />
              </div>

              <div
                onClick={(e) => {
                  e.stopPropagation();
                  setShowDeleteModal(true);
                }}
                className="hover:bg-red-100 p-1 rounded-lg text-red-500"
                title="Delete Book"
              >
                <FiTrash size={14} />
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg p-6 shadow-lg w-[90%] max-w-sm">
            <h2 className="text-lg font-semibold mb-4">Confirm Deletion</h2>
            <p className="text-sm text-gray-600 mb-6">
              Are you sure you want to delete <strong>{book?.title}</strong>?
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 text-sm rounded bg-gray-100 hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 text-sm rounded bg-red-500 text-white hover:bg-red-600"
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BookCard;
