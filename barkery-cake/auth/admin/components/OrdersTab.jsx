import React from "react";
import ManagementComponent from "./ManagementComponent";
import { useUser } from "../../context/HookContext";

const OrdersTab = () => {
  const { orders, setOrders } = useUser();

  const columns = [
    { key: "order_id", label: "Order ID" },
    { key: "customer_name", label: "Customer Name" },
    { key: "customer_email", label: "Customer Email" },
    { key: "total_amount", label: "Total Amount" },
    { key: "status", label: "Status" },
    { key: "delivery_address", label: "Delivery Address" },
    { key: "created_at", label: "Created At" },
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
        put: "/api/orders",
        delete: "/api/orders",
      }}
      expandableRows={{
        key: "order_items",
        columns: [
          { key: "product_id", label: "Product ID" },
          { key: "product_name", label: "Product Name" },
          { key: "quantity", label: "Quantity" },
          { key: "price_at_purchase", label: "Price" },
        ],
      }}
    />
  );
};

export default OrdersTab;
