import React from "react";
import ManagementComponent from "./ManagementComponent";
import { useUser } from "../../../context/HookContext";


const UsersTab = () => {
  const { users, setUsers } = useUser();

  const columns = [
    { key: "user_id", label: "ID" },
    { key: "first_name", label: "First Name" },
    { key: "last_name", label: "Last Name" },
    { key: "email", label: "Email" },
    { key: "phone", label: "Phone" },
    { key: "role", label: "Role" },
  ];

  const updateFields = [
    { name: "first_name", label: "First Name", type: "text" },
    { name: "last_name", label: "Last Name", type: "text" },
    { name: "email", label: "Email", type: "email" },
    { name: "phone", label: "Phone", type: "tel" },
    {
      name: "role",
      label: "Role",
      type: "select",
      options: [
        { value: "user", label: "User" },
        { value: "admin", label: "Admin" },
      ],
    },
  ];

  return (
    <ManagementComponent
      entity="User"
      data={users}
      setData={setUsers}
      columns={columns}
      updateFields={updateFields}
      filterOptions={{
        key: "role",
        options: [
          { value: "user", label: "User" },
          { value: "admin", label: "Admin" },
        ],
      }}
      apiEndpoints={{
        put: "/api/users",
        delete: "/api/users",
      }}
    />
  );
};

export default UsersTab;
