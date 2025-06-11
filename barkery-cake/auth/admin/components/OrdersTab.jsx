import React from "react";
import ManagementComponent from "./ManagementComponent";
import { useUser } from "../../../context/HookContext";

const OrdersTab = () => {
  const { orders, setOrders } = useUser();

  const columns = [
    { key: "order_id", label: "Order ID" },
    { key: "customer_name", label: "Customer Name" },
    { key: "customer_email", label: "Customer Email" },
    {
      key: "total_amount",
      label: "Total Amount",
      render: (item) =>
        `$${item.total_amount ? Number(item.total_amount).toFixed(2) : "0.00"}`,
    },
    { key: "status", label: "Status" },
    { key: "delivery_address", label: "Delivery Address" },
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

  const updateFields = [
    {
      name: "status",
      label: "Status",
      type: "select",
      options: [
        { value: "pending", label: "Pending" },
        { value: "processing", label: "Processing" },
        { value: "shipped", label: "Shipped" },
        { value: "delivered", label: "Delivered" },
        { value: "cancelled", label: "Cancelled" },
      ],
    },
  ];

  return (
    <ManagementComponent
      entity="Order"
      data={orders}
      setData={setOrders}
      columns={columns}
      updateFields={updateFields}
      apiEndpoints={{
        put: "http://localhost:8082/api/orders/:order_id",
        delete: "http://localhost:8082/api/orders/:order_id",
      }}
      expandableRows={{
        key: "order_items",
        columns: [
          { key: "product_id", label: "Product ID" },
          { key: "product_name", label: "Product Name" },
          { key: "quantity", label: "Quantity" },
          {
            key: "price_at_purchase",
            label: "Price",
            render: (item) =>
              `$${
                item.price_at_purchase
                  ? Number(item.price_at_purchase).toFixed(2)
                  : "0.00"
              }`,
          },
          {
            key: "product_image_url",
            label: "Image",
            render: (item) =>
              item.product_image_url ? (
                <img
                  src={`http://localhost:8082${item.product_image_url}`}
                  alt={item.product_name}
                  className="w-16 h-16 object-cover"
                />
              ) : (
                "No Image"
              ),
          },
        ],
      }}
    />
  );
};

export default OrdersTab;
