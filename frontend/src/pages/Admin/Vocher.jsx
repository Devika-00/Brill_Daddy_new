import React, { useState, useEffect } from "react";
import Navbar from "../../components/Admin/Navbar";
import Sidebar from "../../components/Admin/Sidebar";
import axios from "axios";
import { SERVER_URL } from "../../Constants";
import { uploadImagesToCloudinary } from "../../Api/uploadImage";
import { FaTrash, FaEdit } from 'react-icons/fa';

// Modal Component for Add Voucher
const AddModal = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    voucher_name: "",
    details: "",
    product_name: "",
    price: "",
    productPrice: "",  
    date: "", 
    time: "", 
    endDate: "",  
    endTime: "",  
    image: null,
  });

  useEffect(() => {
    if (!isOpen) {
      setFormData({
        voucher_name: "",
        details: "",
        product_name: "",
        price: "",
        productPrice: "",
        date: "",
        time: "",
        endDate: "",
        endTime: "",
        image: null,
      });
    }
  }, [isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData); // Submit the form data
    onClose(); // Close modal after submission
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-4 rounded-md w-full max-w-lg h-auto max-h-[90vh] overflow-y-auto">
        <h3 className="text-lg font-bold mb-4">Add Voucher</h3>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4" >
          <div className="mb-4">
            <label className="block text-sm mb-1">Name</label>
            <input
              type="text"
              name="voucher_name"
              value={formData.voucher_name}
              onChange={handleChange}
              className="border border-gray-300 rounded-md w-full p-2"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm mb-1">Details</label>
            <input
              type="text"
              name="details"
              value={formData.details}
              onChange={handleChange}
              className="border border-gray-300 rounded-md w-full p-2"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm mb-1">Product Name</label>
            <input
              type="text"
              name="product_name"
              value={formData.product_name}
              onChange={handleChange}
              className="border border-gray-300 rounded-md w-full p-2"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm mb-1">Voucher Price</label>
            <input
              type="text"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className="border border-gray-300 rounded-md w-full p-2"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm mb-1">Product Price</label>
            <input
              type="text"
              name="productPrice"
              value={formData.productPrice}
              onChange={handleChange}
              className="border border-gray-300 rounded-md w-full p-2"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm mb-1">Image</label>
            <input
              type="file"
              name="image"
              onChange={handleFileChange}
              className="border border-gray-300 rounded-md w-full p-2"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm mb-1"> Start Date</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="border border-gray-300 rounded-md w-full p-2"
              min={new Date().toISOString().split("T")[0]}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm mb-1">Start Time</label>
            <input
              type="time"
              name="time"
              value={formData.time}
              onChange={handleChange}
              className="border border-gray-300 rounded-md w-full p-2"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm mb-1">End Date</label>
            <input
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              className="border border-gray-300 rounded-md w-full p-2"
              min={formData.date}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm mb-1">End Time</label>
            <input
              type="time"
              name="endTime"
              value={formData.endTime}
              onChange={handleChange}
              className="border border-gray-300 rounded-md w-full p-2"
              required
            />
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white rounded-md px-4 py-2 hover:bg-blue-600"
          >
            Add Voucher
          </button>
          <button
            type="button"
            onClick={onClose}
            className="ml-2 bg-gray-300 text-black rounded-md px-4 py-2 hover:bg-gray-400"
          >
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
};

const convertUTCToIST = (utcTime) => {
  const utcDate = new Date(utcTime);
  const offset = 5.5 * 60 * 60 * 1000; // IST is UTC + 5:30
  const istDate = new Date(utcDate.getTime() + offset);
  return istDate.toISOString().split("T")[1].slice(0, 5); // Return time in HH:mm format
};

// Modal Component for Edit Voucher
const EditModal = ({ isOpen, onClose, voucher, onSubmit }) => {
  const [formData, setFormData] = useState({
    voucher_name: "",
    details: "",
    product_name: "",
    price: "",
    productPrice: "",
    date: "",
    time: "",
    endDate: "",
    endTime: "",
    image:null,
  });

  useEffect(() => {
    if (isOpen && voucher) {
      setFormData({
        voucher_name: voucher.voucher_name,
        details: voucher.details,
        product_name: voucher.product_name,
        price: voucher.price,
        productPrice: voucher.productPrice,
        date: voucher.start_time ? voucher.start_time.split("T")[0] : "",
        time: voucher.start_time ? convertUTCToIST(voucher.start_time) : "",
        endDate: voucher.end_time ? voucher.end_time.split("T")[0] : "",
        endTime: voucher.end_time ? convertUTCToIST(voucher.end_time) : "",
        image:voucher.imageUrl || null,
      });
    } else {
      setFormData({
        voucher_name: "",
        details: "",
        product_name: "",
        price: "",
        productPrice:"",
        date: "",
        time: "",
        endDate: "",
        endTime: "",
        image:null,
      });
    }
  }, [isOpen, voucher]);

  console.log(voucher,"lllllllllllllllllllllll");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData); 
    onClose(); 
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-4 rounded-md w-full max-w-lg h-auto max-h-[90vh] overflow-y-auto">
        <h3 className="text-lg font-bold mb-4">Edit Voucher</h3>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="mb-4">
            <label className="block text-sm mb-1">Name</label>
            <input
              type="text"
              name="voucher_name"
              value={formData.voucher_name}
              onChange={handleChange}
              className="border border-gray-300 rounded-md w-full p-2"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm mb-1">Details</label>
            <input
              type="text"
              name="details"
              value={formData.details}
              onChange={handleChange}
              className="border border-gray-300 rounded-md w-full p-2"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm mb-1">Product Name</label>
            <input
              type="text"
              name="product_name"
              value={formData.product_name}
              onChange={handleChange}
              className="border border-gray-300 rounded-md w-full p-2"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm mb-1">Voucher Price</label>
            <input
              type="text"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className="border border-gray-300 rounded-md w-full p-2"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm mb-1">Product Price</label>
            <input
              type="text"
              name="productPrice"
              value={formData.productPrice}
              onChange={handleChange}
              className="border border-gray-300 rounded-md w-full p-2"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm mb-1">Image</label>
            <input
              type="file"
              name="image"
              onChange={handleFileChange}
              className="border border-gray-300 rounded-md w-full p-2"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm mb-1"> StartDate</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="border border-gray-300 rounded-md w-full p-2"
              min={new Date().toISOString().split("T")[0]}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm mb-1"> Start Time</label>
            <input
              type="time"
              name="time"
              value={formData.time}
              onChange={handleChange}
              className="border border-gray-300 rounded-md w-full p-2"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm mb-1">End Date</label>
            <input
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              className="border border-gray-300 rounded-md w-full p-2"
              min={formData.date}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm mb-1">End Time</label>
            <input
              type="time"
              name="endTime"
              value={formData.endTime}
              onChange={handleChange}
              className="border border-gray-300 rounded-md w-full p-2"
              required
            />
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white rounded-md px-4 py-2 hover:bg-blue-600"
          >
            Edit Voucher
          </button>
          <button
            type="button"
            onClick={onClose}
            className="ml-2 bg-gray-300 text-black rounded-md px-4 py-2 hover:bg-gray-400"
          >
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
};

// Delete Confirmation Modal Component
const DeleteModal = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-md w-96">
        <h3 className="text-lg font-bold mb-4">Confirm Delete</h3>
        <p>Are you sure you want to delete this voucher?</p>
        <div className="mt-4">
          <button
            onClick={onConfirm}
            className="bg-red-500 text-white rounded-md px-4 py-2 hover:bg-red-600"
          >
            Delete
          </button>
          <button
            onClick={onClose}
            className="ml-2 bg-gray-300 text-black rounded-md px-4 py-2 hover:bg-gray-400"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

// Main Voucher Component
const Voucher = () => {
  const [vouchers, setVouchers] = useState([]);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [currentVoucher, setCurrentVoucher] = useState(null);

  useEffect(() => {
    fetchVouchers();
  }, []);

  const fetchVouchers = async () => {
    try {
      const response = await axios.get(`${SERVER_URL}/admin/voucher`);
      const sortedVouchers = response.data.sort(
        (a, b) => new Date(b.start_time) - new Date(a.start_time)
      );
      setVouchers(sortedVouchers);
    } catch (error) {
      console.error("Error fetching vouchers:", error);
    }
  };

  const handleAddVoucher = async (voucherData) => {
    try {
      // Upload to Cloudinary if image file is present
      if (voucherData.image) {
        const imageUrl = await uploadImagesToCloudinary(voucherData.image);
        voucherData.imageUrl = imageUrl; // Add Cloudinary URL to voucher data
      }

      // Send voucher data to backend
      await axios.post(`${SERVER_URL}/admin/addvoucher`, voucherData);
      fetchVouchers(); // Refresh vouchers list
    } catch (error) {
      console.error("Error adding voucher:", error);
    }
  };

  const handleEditVoucher = async (voucherData) => {
    try {
      if (voucherData.image) {
        const imageUrl = await uploadImagesToCloudinary(voucherData.image);
        voucherData.imageUrl = imageUrl;
      }

      // Update voucher
      await axios.put(
        `${SERVER_URL}/admin/voucher/${currentVoucher._id}`,
        voucherData
      );
      fetchVouchers(); // Refresh vouchers list
    } catch (error) {
      console.error("Error editing voucher:", error);
    }
  };

  const handleDeleteVoucher = async () => {
    try {
      await axios.delete(`${SERVER_URL}/admin/voucher/${currentVoucher._id}`);
      fetchVouchers();
      setDeleteModalOpen(false);
    } catch (error) {
      console.error("Error deleting voucher:", error);
    }
  };


  return (
    <div className="flex">
      <Sidebar />
      <div className="flex flex-col flex-grow">
        <Navbar />
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-4">Voucher</h1>
          <button
            onClick={() => setAddModalOpen(true)}
            className="bg-green-500 text-white rounded-md px-4 py-2 mb-4 hover:bg-green-600"
          >
            Add Voucher
          </button>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-300">
              <thead>
                <tr>
                  <th className="px-4 py-2 border-b">Name</th>
                  <th className="px-4 py-2 border-b">Details</th>
                  <th className="px-4 py-2 border-b">Product Name</th>
                  <th className="px-4 py-2 border-b">Voucher Price</th>
                  <th className="px-4 py-2 border-b">Product Price</th>
                  <th className="px-4 py-2 border-b">Image</th>
                  <th className="border px-4 py-2">Start Date</th>
                  <th className="border px-4 py-2">End Date</th>
                  <th className="px-4 py-2 border-b">Actions</th>
                </tr>
              </thead>
              <tbody>
                {vouchers.map((voucher) => (
                  <tr key={voucher._id}>
                    <td className="px-4 py-2 border-b">
                      {voucher.voucher_name}
                    </td>
                    <td className="px-4 py-2 border-b">{voucher.details}</td>
                    <td className="px-4 py-2 border-b">
                      {voucher.product_name}
                    </td>
                    <td className="px-4 py-2 border-b">{voucher.price}</td>
                    <td className="px-4 py-2 border-b">{voucher.productPrice}</td>
                    <td>
                      {" "}
                      <img
                        src={voucher.imageUrl} // Display the image URL
                        alt={voucher.product_name}
                        className="w-20 h-14 rounded-md mt-2"
                      />
                    </td>
                    <td className="border px-4 py-2">
                      {new Date(voucher.start_time).toISOString().split("T")[0]}
                    </td>
                    <td className="border px-4 py-2">
                      {new Date(voucher.end_time).toISOString().split("T")[0]}
                    </td>

                    <td className="px-4 py-2 flex space-x-2 mt-3">
                      <button
                        onClick={() => {
                          setCurrentVoucher(voucher);
                          setEditModalOpen(true);
                        }}
                        
                      >
                        <FaEdit className="text-blue-500 hover:text-blue-700 mr-5 text-xl" />
                      </button>
                      <button
                        onClick={() => {
                          setCurrentVoucher(voucher);
                          setDeleteModalOpen(true);
                        }}
                        
                      >
                        <FaTrash className="text-red-500 hover:text-red-700 text-lg" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <AddModal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        onSubmit={handleAddVoucher}
      />
      <EditModal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        voucher={currentVoucher}
        onSubmit={handleEditVoucher}
      />
      <DeleteModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDeleteVoucher}
      />
    </div>
  );
};

export default Voucher;
