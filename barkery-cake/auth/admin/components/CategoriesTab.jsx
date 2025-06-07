import React from "react";
import ManagementComponent from "./ManagementComponent";
import { useUser } from "../../../context/HookContext";


const CategoriesTab = () => {
  const { categories, setCategories } = useUser();

  const columns = [
    { key: "category_id", label: "ID" },
    { key: "name", label: "Name" },
    {
      key: "created_at",
      label: "Created At",
      render: (item) => new Date(item.created_at).toLocaleString(),
    },
  ];

  const addFields = [{ name: "name", label: "Category Name", type: "text" }];

  const updateFields = [{ name: "name", label: "Category Name", type: "text" }];

  return (
    <ManagementComponent
      entity="Category"
      data={categories}
      setData={setCategories}
      columns={columns}
      addFields={addFields}
      updateFields={updateFields}
      apiEndpoints={{
        add: "/api/categories",
        put: "/api/categories",
        delete: "/api/categories",
      }}
    />
  );
};

export default CategoriesTab;
