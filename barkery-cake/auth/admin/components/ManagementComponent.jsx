import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ManagementComponent = ({
  entity,
  data,
  setData,
  columns,
  addFields,
  updateFields,
  filterOptions,
  apiEndpoints,
  expandableRows,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterValue, setFilterValue] = useState("");
  const [addForm, setAddForm] = useState({});
  const [updateForm, setUpdateForm] = useState({});
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [expandedRows, setExpandedRows] = useState({});

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleFilter = (e) => {
    setFilterValue(e.target.value);
  };

  const handleAddInputChange = (e) => {
    const { name, value } = e.target;
    setAddForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdateInputChange = (e) => {
    const { name, value } = e.target;
    setUpdateForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleAdd = async (e) => {
    e.preventDefault();

    try {
      let response;

      if (imageFile) {
        const formData = new FormData();
        Object.entries(addForm).forEach(([key, value]) => {
          formData.append(key, value);
        });
        formData.append("image", imageFile);

        response = await axios.post(apiEndpoints.add, formData, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        });
      } else {
        response = await axios.post(apiEndpoints.add, addForm, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            "Content-Type": "application/json",
          },
          withCredentials: true,
        });
      }

      setData([...data, response.data.data]);
      setAddForm({});
      setImageFile(null);
      setIsAddModalOpen(false);
      toast.success(`${entity} added successfully`);
    } catch (error) {
      console.error(`Error adding ${entity}:`, error);
      toast.error(error.response?.data?.error || `Failed to add ${entity}`);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      let response;
      const isFileUpload = imageFile || selectedItem?.image_url;
      const formData = new FormData();

      if (isFileUpload) {
        Object.entries(updateForm).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            formData.append(key, value);
          }
        });
        if (imageFile) {
          formData.append("image", imageFile);
        }
      }

      const requestData = isFileUpload ? formData : updateForm;
      const config = {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          ...(isFileUpload
            ? { "Content-Type": "multipart/form-data" }
            : { "Content-Type": "application/json" }),
        },
        withCredentials: true,
      };

      const idField =
        entity === "Category"
          ? "category_id"
          : entity === "User"
          ? "user_id"
          : entity === "Order"
          ? "order_id"
          : "product_id";

      const idValue = selectedItem?.[idField];

      if (!idValue) {
        throw new Error(`Cannot update ${entity}: Missing ID`);
      }

      const updateUrl = apiEndpoints.put.replace(`:${idField}`, idValue);

      response = await axios.put(updateUrl, requestData, config);

      setData(
        data.map((item) =>
          item[idField] === idValue ? { ...item, ...response.data.data } : item
        )
      );

      setIsUpdateModalOpen(false);
      setSelectedItem(null);
      setUpdateForm({});
      setImageFile(null);
      toast.success(`${entity} updated successfully`);
    } catch (error) {
      console.error(`Error updating ${entity}:`, error);
      toast.error(error.response?.data?.error || `Failed to update ${entity}`);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm(`Are you sure you want to delete this ${entity}?`)) {
      try {
        const idField =
          entity === "Category"
            ? "category_id"
            : entity === "User"
            ? "user_id"
            : entity === "Order"
            ? "order_id"
            : "product_id";

        const deleteUrl = apiEndpoints.delete.replace(`:${idField}`, id);

        await axios.delete(deleteUrl, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
          withCredentials: true,
        });

        setData(data.filter((item) => item[idField] !== id));
        toast.success(`${entity} deleted successfully`);
      } catch (error) {
        console.error(`Error deleting ${entity}:`, error);
        toast.error(
          error.response?.data?.error || `Failed to delete ${entity}`
        );
      }
    }
  };

  const openUpdateModal = (item) => {
    setSelectedItem(item);
    setUpdateForm(
      entity === "Order"
        ? { status: item.status }
        : entity === "Category"
        ? { name: item.name }
        : entity === "User"
        ? {
            first_name: item.first_name,
            last_name: item.last_name,
            email: item.email,
            phonenumber: item.phonenumber,
            role: item.role,
          }
        : {
            name: item.name,
            description: item.description,
            category_id: item.category_id,
            total_price: item.total_price,
          }
    );
    setIsUpdateModalOpen(true);
  };

  const toggleRowExpansion = (id) => {
    setExpandedRows((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const filteredData = data.filter((item) => {
    const searchMatch = Object.values(item).some((value) =>
      value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
    );
    const filterMatch = filterValue
      ? item[filterOptions?.key] === filterValue
      : true;
    return searchMatch && filterMatch;
  });

  const highlightSearchTerm = (text) => {
    if (!searchTerm) return text;
    const parts = String(text).split(new RegExp(`(${searchTerm})`, "gi"));
    return parts.map((part, i) =>
      part.toLowerCase() === searchTerm.toLowerCase() ? (
        <span key={i} className="bg-yellow-800 text-white px-1 rounded">
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  return (
    <div className="p-4 bg-white dark:bg-gray-900 rounded-lg shadow-md">
      <ToastContainer
        position="top-left"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />

      {/* Search and Filter Bar */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-4">
        <div className="flex items-center mb-2 md:mb-0">
          <input
            type="text"
            placeholder={`Search ${entity}...`}
            value={searchTerm}
            onChange={handleSearch}
            className="w-full md:w-64 p-2 border border-gray-200 focus:border-[#933C24] rounded-lg"
          />
          {filterOptions && (
            <select
              value={filterValue}
              onChange={handleFilter}
              className="ml-2 p-2 border border-gray-200 focus:border-[#933C24] rounded-sm cursor-pointer"
            >
              <option value="">All</option>
              {filterOptions.options.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          )}
        </div>
        {addFields && (
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="bg-[#933C24] text-white py-2 px-4 rounded-lg hover:bg-[#7a3120] cursor-pointer"
          >
            Add {entity}
          </button>
        )}
      </div>

      {/* Data Table */}
      <div className="overflow-x-auto">
        <table className="table w-full border-separate border-spacing-y-2">
          <thead>
            <tr className="bg-gray-200 dark:bg-gray-700 text-black dark:text-white">
              {columns.map((col) => (
                <th key={col.key} className="py-3 px-4 text-sm font-semibold">
                  {col.label}
                </th>
              ))}
              <th className="py-3 px-4 text-sm font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.length > 0 ? (
              filteredData.map((item) => (
                <React.Fragment
                  key={
                    item.order_id ||
                    item.category_id ||
                    item.user_id ||
                    item.product_id
                  }
                >
                  <tr className="bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md">
                    {columns.map((col) => (
                      <td
                        key={col.key}
                        className="py-3 px-4 text-sm border-b border-gray-200 dark:border-gray-700"
                      >
                        {col.render
                          ? col.render(item)
                          : highlightSearchTerm(item[col.key] || "")}
                      </td>
                    ))}
                    <td className="py-3 px-4 text-sm">
                      {updateFields && (
                        <button
                          onClick={() => openUpdateModal(item)}
                          className="text-blue-500 hover:text-blue-700 mr-2 cursor-pointer"
                          disabled={item.role === "admin"}
                        >
                        {item.role == "admin" ? "Denied" : "Edit"}
                        </button>
                      )}
                      <button
                        onClick={() =>
                          handleDelete(
                            item[
                              entity === "Category"
                                ? "category_id"
                                : entity === "User"
                                ? "user_id"
                                : entity === "Order"
                                ? "order_id"
                                : "product_id"
                            ]
                          )
                        }
                        className="text-red-500 hover:text-red-700 cursor-pointer"
                        disabled={item.role === "admin"}
                      >
                       {item.role == "admin" ? "Denied" : "Delete"}
                      </button>
                      {expandableRows &&
                        item[expandableRows.key]?.length > 0 && (
                          <button
                            onClick={() =>
                              toggleRowExpansion(
                                item[
                                  entity === "Category"
                                    ? "category_id"
                                    : entity === "User"
                                    ? "user_id"
                                    : entity === "Order"
                                    ? "order_id"
                                    : "product_id"
                                ]
                              )
                            }
                            className="ml-2 text-gray-500 hover:text-gray-700 cursor-pointer"
                          >
                            {expandedRows[
                              item[
                                entity === "Category"
                                  ? "category_id"
                                  : entity === "User"
                                  ? "user_id"
                                  : entity === "Order"
                                  ? "order_id"
                                  : "product_id"
                              ]
                            ]
                              ? "Collapse"
                              : "Expand"}
                          </button>
                        )}
                    </td>
                  </tr>
                  {expandableRows &&
                    expandedRows[
                      item.order_id ||
                        item.category_id ||
                        item.user_id ||
                        item.product_id
                    ] && (
                      <tr>
                        <td
                          colSpan={columns.length + 1}
                          className="bg-gray-100 dark:bg-gray-700 p-4"
                        >
                          <table className="table w-full border-separate border-spacing-y-1">
                            <thead>
                              <tr className="bg-gray-200 dark:bg-gray-600 text-black dark:text-white">
                                {expandableRows.columns.map((col) => (
                                  <th
                                    key={col.key}
                                    className="py-2 px-3 text-sm font-semibold"
                                  >
                                    {col.label}
                                  </th>
                                ))}
                              </tr>
                            </thead>
                            <tbody>
                              {item[expandableRows.key].map(
                                (subItem, index) => (
                                  <tr
                                    key={index}
                                    className="bg-gray-50 dark:bg-gray-800"
                                  >
                                    {expandableRows.columns.map((col) => (
                                      <td
                                        key={col.key}
                                        className="py-2 px-3 text-sm"
                                      >
                                        {col.render
                                          ? col.render(subItem)
                                          : highlightSearchTerm(
                                              subItem[col.key] || ""
                                            )}
                                      </td>
                                    ))}
                                  </tr>
                                )
                              )}
                            </tbody>
                          </table>
                        </td>
                      </tr>
                    )}
                </React.Fragment>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length + 1}
                  className="text-center py-6 text-gray-500 dark:text-gray-400"
                >
                  No {entity.toLowerCase()} found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add Modal */}
      {isAddModalOpen && addFields && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Add {entity}</h2>
            <form onSubmit={handleAdd}>
              {addFields.map((field) => (
                <div key={field.name} className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    {field.label}
                  </label>
                  {field.type === "select" ? (
                    <select
                      name={field.name}
                      value={addForm[field.name] || ""}
                      onChange={handleAddInputChange}
                      className="w-full p-2 border border-gray-200 focus:border-[#933C24] rounded-sm"
                    >
                      <option value="">Select {field.label}</option>
                      {field.options.map((opt) => (
                        <option
                          key={opt.value}
                          value={opt.value}
                          disabled={opt.disabled}
                        >
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  ) : field.type === "file" ? (
                    <input
                      type="file"
                      name={field.name}
                      onChange={handleImageChange}
                      className="w-full p-2 border border-gray-200 rounded-sm"
                    />
                  ) : (
                    <input
                      type={field.type}
                      name={field.name}
                      value={addForm[field.name] || ""}
                      onChange={handleAddInputChange}
                      className="w-full p-2 border border-gray-200 focus:border-[#933C24] rounded-sm"
                    />
                  )}
                </div>
              ))}
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="bg-gray-300 text-gray-700 py-2 px-4 rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#933C24] text-white py-2 px-4 rounded-lg cursor-pointer"
                >
                  Add
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Update Modal */}
      {isUpdateModalOpen && updateFields && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Update {entity}</h2>
            <form onSubmit={handleUpdate}>
              {updateFields.map((field) => (
                <div key={field.name} className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    {field.label}
                  </label>
                  {field.type === "select" ? (
                    <select
                      name={field.name}
                      value={updateForm[field.name] || ""}
                      onChange={handleUpdateInputChange}
                      className="w-full p-2 border border-gray-200 focus:border-[#933C24] rounded-sm"
                    >
                      <option value="">Select {field.label}</option>
                      {field.options.map((opt) => (
                        <option
                          key={opt.value}
                          value={opt.value}
                          disabled={opt.disabled}
                        >
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  ) : field.type === "file" ? (
                    <input
                      type="file"
                      name={field.name}
                      onChange={handleImageChange}
                      className="w-full p-2 border border-gray-200 rounded-sm"
                    />
                  ) : (
                    <input
                      type={field.type}
                      name={field.name}
                      value={updateForm[field.name] || ""}
                      onChange={handleUpdateInputChange}
                      className="w-full p-2 border border-gray-200 focus:border-[#933C24] rounded-sm"
                    />
                  )}
                </div>
              ))}
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsUpdateModalOpen(false)}
                  className="bg-gray-300 text-gray-700 py-2 px-4 rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#933C24] text-white py-2 px-4 rounded-lg cursor-pointer"
                >
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManagementComponent;
