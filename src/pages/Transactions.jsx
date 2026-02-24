import React, { useEffect, useState } from "react";
import { FiSearch } from "react-icons/fi";
import Table from "../components/common/Table";
import Card from "../components/common/Card";
import { makeApiRequest } from "../lib/api";

const getTransactionsColumn = ({ returnBook }) => {
  return [
    {
      label: "Book",
      key: "book",
      renderDetail: (row) => {
        return row?.book?.title;
      },
    },
    {
      label: "Issued To",
      key: "issuedTo",
      renderDetail: (row) => {
        return row?.issuedTo?.name;
      },
    },
    {
      label: "Issued By",
      key: "issuedBy",
      renderDetail: (row) => {
        return row?.issuedBy?.name;
      },
    },
    {
      label: "Returned To",
      key: "returnedTo",
      renderDetail: (row) => {
        return row?.returnedTo?.name || "-";
      },
    },
    {
      label: "Returned",
      key: "returned",

      renderDetail: (row) => {
        return Boolean(row.returned) ? (
          "Yes"
        ) : (
          <button
            className="px-3 py-2 bg-green-300 hover:bg-green-300/90 rounded-lg cursor-pointer"
            onClick={() => returnBook(row?._id)}
          >
            Return
          </button>
        );
      },
    },
    {
      label: "Issue Date",
      key: "issueDate",
      renderDetail: (row) => {
        const date = row.issueDate;
        return new Date(date).toDateString();
      },
    },
    {
      label: "Return Date",
      key: "returnDate",
      renderDetail: (row) => {
        const date = row.returnDate;
        return date ? new Date(date).toDateString() : "-";
      },
    },
  ];
};

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredTransactions = transactions.filter((transaction) => {
    return (
      transaction.book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.issuedTo.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const fetchTransactions = async () => {
    try {
      // Mock transactions
      setTransactions([
        { _id: "t1", book: { title: "1984" }, issuedTo: { name: "John Doe" }, issuedBy: { name: "Admin" }, issueDate: new Date().toISOString(), returned: false },
        { _id: "t2", book: { title: "The Great Gatsby" }, issuedTo: { name: "Jane Smith" }, issuedBy: { name: "Admin" }, issueDate: new Date(Date.now() - 86400000).toISOString(), returned: true, returnDate: new Date().toISOString() },
      ]);
    } catch (error) {
      console.error(error);
    }
  };

  const returnBook = async (transactionId) => {
    // Mock return
    const updatedTransactions = transactions.map((transaction) => {
      if (transaction?._id === transactionId) {
        return { ...transaction, returned: true, returnDate: new Date().toISOString() };
      }
      return transaction;
    });
    setTransactions(updatedTransactions);
  };

  const columns = getTransactionsColumn({ returnBook });

  useEffect(() => {
    fetchTransactions();
  }, []);

  return (
    <>
      <div className="p-4 px-8  mb-8 shadow">
        <h4 className="text-3xl font-semibold">Transactions</h4>
      </div>
      <div className="px-8">
        <Card customClass="bg-white border border-gray-300">
          <div className="flex justify-between items-center mb-4">
            <h5 className="text-2xl font-bold">Transaction History</h5>
            <div className="relative w-64">
              <FiSearch className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Search transactions..."
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <Table columns={columns} data={filteredTransactions} />
        </Card>
      </div>
    </>
  );
};

export default Transactions;
