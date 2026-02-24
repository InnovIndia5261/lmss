import React from "react";

const Table = ({ data = [], columns = [] }) => {
  const isEmpty = !data || data.length === 0;

  if (isEmpty) {
    return (
      <div className="w-full border border-gray-200 rounded-xl bg-white">
        <div className="empty-state py-16">
          <div className="empty-state-icon">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <p className="empty-state-message">No data to display</p>
          <p className="empty-state-hint">Records will appear here when available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-h-[500px] overflow-y-auto border border-gray-200 rounded-2xl overflow-hidden bg-white">
      <table className="table-enterprise">
        <thead className="sticky top-0 bg-gray-50 z-10">
          <tr>
            {columns.map((col, index) => (
              <th key={index}>{col.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {columns.map((col, colIndex) => (
                <td key={colIndex} className={col.class || ""}>
                  {col.renderDetail ? col.renderDetail(row) : row[col.key] ?? "-"}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
