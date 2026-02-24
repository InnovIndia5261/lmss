import React, { createContext, useEffect, useState } from "react";
import useAuth from "../hooks/useAuth";
import Loader from "../components/common/Loader";

export const MembersContext = createContext();

const MembersProvider = ({ children }) => {
  const { user } = useAuth();
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMembers = async () => {
    try {
      const token = localStorage.getItem("token");
      // Mock members data
      setMembers([
        { _id: "1", name: "John Doe", email: "john@example.com", phoneNumber: "1234567890", role: "Member" },
        { _id: "2", name: "Jane Smith", email: "jane@example.com", phoneNumber: "0987654321", role: "Member" },
        { _id: "3", name: "Admin User", email: "admin@example.com", phoneNumber: "1122334455", role: "Admin" },
      ]);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.role == "Member") {
      setMembers([]);
    } else if (user) {
      fetchMembers();
    } else {
      setLoading(false);
    }
  }, [user]);

  if (loading) {
    return <Loader />;
  }

  return (
    <MembersContext.Provider
      value={{
        members,
        setMembers,
      }}
    >
      {children}
    </MembersContext.Provider>
  );
};

export default MembersProvider;
