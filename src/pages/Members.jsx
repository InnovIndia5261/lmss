import { useContext, useMemo, useState } from "react";
import Table from "../components/common/Table";
import Card from "../components/common/Card";
import Modal from "../components/common/modal";
import Input from "../components/common/Input";
import { MembersContext } from "../context/MembersContext";
import useAuth from "../hooks/useAuth";
import { FiAlertTriangle, FiSearch, FiDownload } from "react-icons/fi";
import { toast } from "react-toastify";

const getMemberColumns = ({ updateRole, user }) => {
  return [
    {
      label: "Name",
      key: "name",
    },
    {
      label: "Email",
      key: "email",
    },
    {
      label: "Phone",
      key: "phoneNumber",
    },
    {
      label: "Role",
      key: "role",
      renderDetail: (row) => {
        return (
          <>
            {user.role === "Admin" ? (
              <div className="px-4">
                {row?.role === "Member" ? (
                  <button
                    onClick={() => updateRole(row?._id)}
                    className="w-full p-2 px-4 rounded-lg cursor-pointer bg-green-500 text-white hover:bg-green-400"
                  >
                    Make Staff
                  </button>
                ) : row.role === "Admin" ? (
                  row.role
                ) : (
                  <button
                    onClick={() => updateRole(row?._id)}
                    className="w-full p-2 px-4 rounded-lg cursor-pointer bg-red-500 text-white hover:bg-red-400"
                  >
                    Make Member
                  </button>
                )}
              </div>
            ) : (
              row.role
            )}
          </>
        );
      },
    },
  ];
};

const Members = () => {
  const { members, setMembers } = useContext(MembersContext);
  const { user } = useAuth();
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [newMember, setNewMember] = useState({ name: "", email: "", phoneNumber: "", role: "Member" });
  const [searchTerm, setSearchTerm] = useState("");

  const filteredMembers = members.filter((member) =>
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddMember = async () => {
    // Validation
    if (!newMember.name || !newMember.email || !newMember.phoneNumber) {
      toast.error("Please fill in all fields");
      return;
    }

    // Mock add member
    const memberToAdd = { ...newMember, _id: Math.random().toString(36).substr(2, 9) };
    setMembers([...members, memberToAdd]);
    setShowAddMemberModal(false);
    setNewMember({ name: "", email: "", phoneNumber: "", role: "Member" });
    toast.success("Member added successfully");
  };

  const handleExportCSV = () => {
    const headers = ["Name,Email,Phone,Role"];
    const rows = members.map(m => `${m.name},${m.email},${m.phoneNumber},${m.role}`);
    const csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "members_list.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleUpdateMemberRole = async (userId) => {
    try {
      // Mock update
      const updatedMembers = members.map((member) => {
        if (member?._id === userId) {
          const newRole = member.role === "Member" ? "Staff" : "Member";
          return { ...member, role: newRole };
        }
        return member;
      });

      setMembers(updatedMembers);
    } catch (error) {
      console.log(error);
    }
  };

  const columns = useMemo(
    () =>
      getMemberColumns({
        updateRole: handleUpdateMemberRole,
        user,
      }),
    [user]
  );

  if (user?.role === "Member") {
    return (
      <div className="h-screen bg-red-50 flex flex-col gap-8 items-center justify-center  text-red-600">
        <FiAlertTriangle size={50} />
        <h3 className="text-xl">You are not authorized to access this page!</h3>
      </div>
    );
  }

  return (
    <>
      <div className="p-4 px-8 mb-8 shadow flex flex-col md:flex-row justify-between items-center gap-4">
        <h4 className="text-3xl font-semibold">Members</h4>

        <div className="flex gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <FiSearch className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search members..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 p-2 px-4 rounded-lg cursor-pointer text-white whitespace-nowrap"
            title="Export to CSV"
          >
            <FiDownload /> Export
          </button>

          <button
            onClick={() => setShowAddMemberModal(true)}
            className="bg-green-500 hover:bg-green-500/90 p-2 px-4 rounded-lg cursor-pointer text-white whitespace-nowrap"
          >
            Add Member
          </button>
        </div>
      </div>
      <div className="px-8">
        <Card customClass="bg-white border border-gray-300">
          <h5 className="text-2xl mb-4 font-bold">Library Users ({filteredMembers.length})</h5>
          <Table columns={columns} data={filteredMembers} />
        </Card>
      </div>

      <Modal
        open={showAddMemberModal}
        onClose={() => setShowAddMemberModal(false)}
        title="Add New Member"
      >
        <div className="flex flex-col gap-4">
          <Input
            label="Name"
            value={newMember.name}
            onChange={(val) => setNewMember({ ...newMember, name: val })}
          />
          <Input
            label="Email"
            value={newMember.email}
            onChange={(val) => setNewMember({ ...newMember, email: val })}
          />
          <Input
            label="Phone Number"
            value={newMember.phoneNumber}
            onChange={(val) => setNewMember({ ...newMember, phoneNumber: val })}
          />
          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-gray-600">Role</label>
            <select
              value={newMember.role}
              onChange={(e) => setNewMember({ ...newMember, role: e.target.value })}
              className="w-full p-2 border rounded-lg focus:outline-none focus:border-blue-500 bg-white"
            >
              <option value="Member">Member</option>
              <option value="Staff">Staff</option>
              <option value="Admin">Admin</option>
            </select>
          </div>

          <div className="flex justify-end mt-4">
            <button
              onClick={handleAddMember}
              className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
            >
              Confirm Add Member
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default Members;
