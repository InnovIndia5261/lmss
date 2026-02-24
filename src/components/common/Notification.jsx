import React, { createContext, useState } from "react";

export const NotificationContext = createContext();

const NotificationContainer = ({ children }) => {
  const [message, setMessage] = useState(null);

  const toast = (message) => {
    setMessage(message);
    setTimeout(() => {
      setMessage(null);
    }, 2000);
  };

  return (
    <NotificationContext.Provider
      value={{
        toast,
      }}
    >
      {message && (
        <div className="toast-animate w-[350px] absolute top-8 right-8 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl px-4 py-3 shadow-lg">
          {message}
        </div>
      )}
      {children}
    </NotificationContext.Provider>
  );
};

export default NotificationContainer;
