import React, { useState, useEffect, useRef } from "react";
import { NavLink } from "react-router-dom";
import { useUser } from "../../../context/HookContext";



const AdminMainBoard = () => {
  
  const { categories, products, orders, users, userDetails } = useUser();
  const [highlightedUserId, setHighlightedUserId] = useState(null);
  const tableRef = useRef(null);

  const dashboardCards = [
    {
      id: 1,
      title: "Total Categories",
      count: categories.length,
      icon: (
        <svg
          className="w-12 m-auto"
          fill="none"
          strokeWidth="1.5"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.045C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z"
          />
        </svg>
      ),
    },
    {
      id: 2,
      title: "Total Orders",
      count: orders.length,
      icon: (
        <svg
          className="w-12 m-auto"
          fill="none"
          strokeWidth="1.5"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
          />
        </svg>
      ),
    },
    {
      id: 3,
      title: "Total Users",
      count: users.length,
      icon: (
        <svg
          className="w-12 m-auto"
          fill="none"
          strokeWidth="1.5"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z"
          />
        </svg>
      ),
    },
  ];

  const handleHighlight = (userId) => {
    setHighlightedUserId(userId);
  };

  const handleClickOutside = (e) => {
    if (tableRef.current && !tableRef.current.contains(e.target)) {
      setHighlightedUserId(null);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const summary = users.map((user) => ({
    user_id: user.user_id,
    first_name: user.first_name,
    last_name: user.last_name,
    total_orders: orders.filter((order) => order.user_id === user.user_id)
      .length,
    first_order_date: orders
      .filter((order) => order.user_id === user.user_id)
      .sort((a, b) => new Date(a.created_at) - new Date(b.created_at))[0]
      ?.created_at,
  }));

  const orderDetails = orders.flatMap((order) =>
    order.order_items.map((item) => ({
      order_id: order.order_id,
      user_id: order.user_id,
      first_name: order.customer_name.split(" ")[0],
      last_name: order.customer_name.split(" ").slice(1).join(" "),
      email: order.customer_email,
      order_date: order.created_at,
      item_name: item.product_name,
      quantity: item.quantity,
      total_price: item.price_at_purchase,
      total_amount: order.total_amount,
    }))
  );

  return (
    <div className="card bg-white dark:bg-black text-black dark:text-white shadow-xl p-4 sm:p-6">
      <div className="flex justify-between items-center pb-3">
        <header>
          <h1 className="font-semibold text-2xl">Dashboard</h1>
        </header>
        <div className="flex items-center gap-2">
          <svg
            className="w-6 h-6"
            fill="none"
            strokeWidth="1.5"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
            />
          </svg>
          <span className="font-semibold">
            {userDetails?.firstName || "Admin"}
          </span>
        </div>
      </div>

      {/* Dashboard Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        {dashboardCards.map((card) => (
          <div
            key={card.id}
            className="bg-gradient-to-r from-yellow-700 via-orange-900 to-yellow-700 text-white rounded-lg p-4 text-center hover:shadow-lg transition-shadow"
          >
            <NavLink className="flex flex-col items-center">
              {card.icon}
              <p className="flex justify-between items-center w-full mt-2">
                <span className="text-lg font-medium">{card.count}</span>
                <span className="font-semibold">{card.title}</span>
              </p>
            </NavLink>
          </div>
        ))}
      </div>

      {/* Users Tables */}
      <div className="space-y-6">
        {/* Users General Table */}
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md p-4">
          <h2 className="text-lg font-semibold text-orange-500 mb-4">
            Recent Orders Summary
          </h2>
          <div className="block md:hidden space-y-4">
            {summary.length > 0 ? (
              summary.map((user) => (
                <div
                  key={user.user_id}
                  ref={tableRef}
                  onClick={() => handleHighlight(user.user_id)}
                  className={`p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 cursor-pointer ${
                    highlightedUserId === user.user_id
                      ? "bg-yellow-100 dark:bg-yellow-900"
                      : ""
                  }`}
                >
                  <div className="flex flex-col gap-2">
                    <div className="flex justify-between">
                      <span className="font-semibold text-gray-600 dark:text-gray-300">
                        User ID:
                      </span>
                      <span className="text-gray-600 dark:text-gray-300">
                        {user.user_id}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-semibold text-gray-600 dark:text-gray-300">
                        Name:
                      </span>
                      <span className="text-gray-600 dark:text-gray-300">
                        {user.first_name} {user.last_name}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-semibold text-gray-600 dark:text-gray-300">
                        Total Orders:
                      </span>
                      <span className="text-gray-600 dark:text-gray-300">
                        {user.total_orders}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-semibold text-gray-600 dark:text-gray-300">
                        Last Order Date:
                      </span>
                      <span className="text-gray-600 dark:text-gray-300">
                        {user.first_order_date
                          ? new Date(user.first_order_date).toLocaleString()
                          : "N/A"}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-6 text-gray-500 dark:text-gray-400">
                No users found.
              </div>
            )}
          </div>
          <div className="hidden md:block overflow-x-auto">
            <table className="table w-full border-separate border-spacing-y-2">
              <thead>
                <tr className="bg-gray-200 dark:bg-gray-700 text-black dark:text-white">
                  <th className="rounded-l-lg py-3 px-4 text-sm font-semibold">
                    User ID
                  </th>
                  <th className="py-3 px-4 text-sm font-semibold">Name</th>
                  <th className="py-3 px-4 text-sm font-semibold">
                    Total Orders
                  </th>
                  <th className="rounded-r-lg py-3 px-4 text-sm font-semibold">
                    Last Order Date
                  </th>
                </tr>
              </thead>
              <tbody>
                {summary.length > 0 ? (
                  summary.map((user) => (
                    <tr
                      key={user.user_id}
                      onClick={() => handleHighlight(user.user_id)}
                      className={`bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors rounded-md cursor-pointer ${
                        highlightedUserId === user.user_id
                          ? "bg-yellow-100 dark:bg-yellow-900"
                          : ""
                      }`}
                    >
                      <td className="rounded-l-lg py-3 px-4 text-sm text-gray-600 dark:text-gray-300 font-medium">
                        {user.user_id}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-300 font-medium">
                        {user.first_name} {user.last_name}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-300 font-medium">
                        {user.total_orders}
                      </td>
                      <td className="rounded-r-lg py-3 px-4 text-sm text-gray-600 dark:text-gray-300 font-medium">
                        {user.first_order_date
                          ? new Date(user.first_order_date).toLocaleString()
                          : "N/A"}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={4}
                      className="text-center py-6 text-gray-500 dark:text-gray-400"
                    >
                      No users found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Users Item Details Table */}
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md p-4">
          <h2 className="text-lg font-semibold text-orange-500 mb-4">
            Recent Orders Details
          </h2>
          <div className="block md:hidden space-y-4">
            {orderDetails.length > 0 ? (
              orderDetails.map((order) => (
                <div
                  key={order.order_id}
                  className={`p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 ${
                    highlightedUserId === order.user_id
                      ? "bg-yellow-100 dark:bg-yellow-900"
                      : ""
                  }`}
                >
                  <div className="flex flex-col gap-2">
                    <div className="flex justify-between">
                      <span className="font-semibold text-gray-600 dark:text-gray-300">
                        Order ID:
                      </span>
                      <span className="text-gray-600 dark:text-gray-300">
                        {order.order_id}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-semibold text-gray-600 dark:text-gray-300">
                        Name:
                      </span>
                      <span className="text-gray-600 dark:text-gray-300">
                        {order.first_name} {order.last_name}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-semibold text-gray-600 dark:text-gray-300">
                        Email:
                      </span>
                      <span className="text-gray-600 dark:text-gray-300">
                        {order.email}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-semibold text-gray-600 dark:text-gray-300">
                        Order Date:
                      </span>
                      <span className="text-gray-600 dark:text-gray-300">
                        {new Date(order.order_date).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-semibold text-gray-600 dark:text-gray-300">
                        Item Name:
                      </span>
                      <span className="text-gray-600 dark:text-gray-300">
                        {order.item_name}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-semibold text-gray-600 dark:text-gray-300">
                        Quantity:
                      </span>
                      <span className="text-gray-600 dark:text-gray-300">
                        {order.quantity}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-semibold text-gray-600 dark:text-gray-300">
                        Total Price:
                      </span>
                      <span className="text-gray-600 dark:text-gray-300">
                        ${order.total_price.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-semibold text-gray-600 dark:text-gray-300">
                        Total Amount:
                      </span>
                      <span className="text-gray-600 dark:text-gray-300">
                        ${order.total_amount.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-6 text-gray-500 dark:text-gray-400">
                No orders found.
              </div>
            )}
          </div>
          <div className="hidden md:block overflow-x-auto">
            <table className="table w-full border-separate border-spacing-y-2">
              <thead>
                <tr className="bg-gray-200 dark:bg-gray-700 text-black dark:text-white">
                  <th className="rounded-l-lg py-3 px-4 text-sm font-semibold">
                    ID
                  </th>
                  <th className="py-3 px-4 text-sm font-semibold">Name</th>
                  <th className="py-3 px-4 text-sm font-semibold">Email</th>
                  <th className="py-3 px-4 text-sm font-semibold">
                    Order Date
                  </th>
                  <th className="py-3 px-4 text-sm font-semibold">Item Name</th>
                  <th className="py-3 px-4 text-sm font-semibold">Quantity</th>
                  <th className="py-3 px-4 text-sm font-semibold">
                    Total Price
                  </th>
                  <th className="rounded-r-lg py-3 px-4 text-sm font-semibold">
                    Total Amount
                  </th>
                </tr>
              </thead>
              <tbody>
                {orderDetails.length > 0 ? (
                  orderDetails.map((order) => (
                    <tr
                      key={order.order_id}
                      className={`bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors rounded-md ${
                        highlightedUserId === order.user_id
                          ? "bg-yellow-100 dark:bg-yellow-900"
                          : ""
                      }`}
                    >
                      <td className="rounded-l-lg py-3 px-4 text-sm text-gray-600 dark:text-gray-300 font-medium">
                        {order.order_id}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-300 font-medium">
                        {order.first_name} {order.last_name}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-300 font-medium">
                        {order.email}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-300 font-medium">
                        {new Date(order.order_date).toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-300 font-medium">
                        {order.item_name}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-300 font-medium">
                        {order.quantity}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-300 font-medium">
                        ${order.total_price.toFixed(2)}
                      </td>
                      <td className="rounded-r-lg py-3 px-4 text-sm text-gray-600 dark:text-gray-300 font-medium">
                        ${order.total_amount.toFixed(2)}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={8}
                      className="text-center py-6 text-gray-500 dark:text-gray-400"
                    >
                      No orders found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminMainBoard;
