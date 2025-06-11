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
    { key: "phonenumber", label: "Phone" },
    { key: "role", label: "Title" },
  ];

  const updateFields = [
    { name: "first_name", label: "First Name", type: "text" },
    { name: "last_name", label: "Last Name", type: "text" },
    { name: "email", label: "Email", type: "email" },
    { name: "phonenumber", label: "Phone Number", type: "tel" },
    {
      name: "role",
      label: "Role",
      type: "select",
      options: [
        { value: "customer", label: "Customer" },
        { value: "delivery", label: "Delivery" },
        { value: "admin", label: "Admin", disabled: true },
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
          { value: "customer", label: "Customer" },
          { value: "delivery", label: "Delivery" },
          { value: "admin", label: "Admin" },
        ],
      }}
      apiEndpoints={{
        put: "http://localhost:8082/api/users/:user_id",
        delete: "http://localhost:8082/api/users/:user_id",
      }}
    />
  );
};

export default UsersTab;