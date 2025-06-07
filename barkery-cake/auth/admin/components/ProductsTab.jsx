import React from "react";
import ManagementComponent from "./ManagementComponent";
import { useUser } from "../../../context/HookContext";



const ProductsTab = () => {
  const { products, setProducts, categories } = useUser();

  const columns = [
    { key: "product_id", label: "ID" },
    { key: "name", label: "Name" },
    { key: "description", label: "Description" },
    { key: "category_name", label: "Category" },
    {
      key: "total_price",
      label: "Price",
      render: (item) => `$${item.total_price.toFixed(2)}`,
    },
    {
      key: "image_url",
      label: "Image",
      render: (item) =>
        item.image_url ? (
          <img
            src={`http://localhost:8082${item.image_url}`}
            alt={item.name}
            className="w-16 h-16 object-cover"
          />
        ) : (
          "No Image"
        ),
    },
  ];

  const addFields = [
    { name: "name", label: "Product Name", type: "text" },
    { name: "description", label: "Description", type: "text" },
    {
      name: "category_id",
      label: "Category",
      type: "select",
      options: categories.map((cat) => ({
        value: cat.category_id,
        label: cat.name,
      })),
    },
    { name: "total_price", label: "Price", type: "number" },
    { name: "image", label: "Image", type: "file" },
  ];

  const updateFields = [
    { name: "name", label: "Product Name", type: "text" },
    { name: "description", label: "Description", type: "text" },
    {
      name: "category_id",
      label: "Category",
      type: "select",
      options: categories.map((cat) => ({
        value: cat.category_id,
        label: cat.name,
      })),
    },
    { name: "total_price", label: "Price", type: "number" },
    { name: "image", label: "Image", type: "file" },
  ];

  return (
    <ManagementComponent
      entity="Product"
      data={products}
      setData={setProducts}
      columns={columns}
      addFields={addFields}
      updateFields={updateFields}
      filterOptions={{
        key: "category_id",
        options: categories.map((cat) => ({
          value: cat.category_id,
          label: cat.name,
        })),
      }}
      apiEndpoints={{
        add: "/api/products",
        put: "/api/products",
        delete: "/api/products",
      }}
    />
  );
};

export default ProductsTab;
