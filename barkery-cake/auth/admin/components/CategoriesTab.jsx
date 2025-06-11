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
      render: (item) => {
        if (!item.created_at) return "N/A";
        try {
          const date = new Date(item.created_at);
          return date.toLocaleString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          });
        } catch (error) {
          console.error("Error formatting date:", error);
          return "Invalid date";
        }
      },
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
        add: "http://localhost:8082/api/categories",
        put: "http://localhost:8082/api/categories/:category_id",
        delete: "http://localhost:8082/api/categories/:category_id",
      }}
    />
  );
};

export default CategoriesTab;
