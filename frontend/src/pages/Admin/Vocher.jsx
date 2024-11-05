import React, { useState, useEffect } from 'react';
import Navbar from "../../components/Admin/Navbar";
import Sidebar from '../../components/Admin/Sidebar';
import axios from 'axios';
import { SERVER_URL } from "../../Constants";
import { uploadImagesToCloudinary } from "../../Api/uploadImage";

// Modal Component for Add Voucher
const AddModal = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    voucher_name: '',
    details: '',
    product_name: '',
    price: '',
    image: null, // For storing image file
  });

  useEffect(() => {
    if (!isOpen) {
      setFormData({ voucher_name: '', details: '', product_name: '', price: '', image: null });
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
      <div className="bg-white p-6 rounded-md w-96">
        <h3 className="text-lg font-bold mb-4">Add Voucher</h3>
        <form onSubmit={handleSubmit}>
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
            <label className="block text-sm mb-1">Price</label>
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
            <label className="block text-sm mb-1">Image</label>
            <input type="file" name="image" onChange={handleFileChange} className="border border-gray-300 rounded-md w-full p-2" />
          </div>
          <button type="submit" className="bg-blue-500 text-white rounded-md px-4 py-2 hover:bg-blue-600">
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

// Modal Component for Edit Voucher
const EditModal = ({ isOpen, onClose, voucher, onSubmit }) => {
  const [formData, setFormData] = useState({
    voucher_name: '',
    details: '',
    product_name: '',
    price: ''
  });

  useEffect(() => {
    if (voucher) {
      setFormData({
        voucher_name: voucher.voucher_name,
        details: voucher.details,
        product_name: voucher.product_name,
        price: voucher.price
      });
    } else {
      setFormData({ voucher_name: '', details: '', product_name: '', price: '' });
    }
  }, [voucher]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
  };


  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData); // Submit the updated form data
    onClose(); // Close modal after submission
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-md w-96">
        <h3 className="text-lg font-bold mb-4">Edit Voucher</h3>
        <form onSubmit={handleSubmit}>
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
            <label className="block text-sm mb-1">Price</label>
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
            <label className="block text-sm mb-1">Image</label>
            <input type="file" name="image" onChange={handleFileChange} className="border border-gray-300 rounded-md w-full p-2" />
          </div>
          <button type="submit" className="bg-blue-500 text-white rounded-md px-4 py-2 hover:bg-blue-600">
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
      setVouchers(response.data);
    } catch (error) {
      console.error('Error fetching vouchers:', error);
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
      console.error('Error adding voucher:', error);
    }
  };

  const handleEditVoucher = async (voucherData) => {
    try {
      if (voucherData.image) {
        const imageUrl = await uploadImagesToCloudinary(voucherData.image);
        voucherData.imageUrl = imageUrl;
      }

      // Update voucher
      await axios.put(`${SERVER_URL}/admin/voucher/${currentVoucher._id}`, voucherData);
      fetchVouchers(); // Refresh vouchers list
    } catch (error) {
      console.error('Error editing voucher:', error);
    }
  };


  const handleDeleteVoucher = async () => {
    try {
      await axios.delete(`${SERVER_URL}/admin/voucher/${currentVoucher._id}`);
      fetchVouchers();
      setDeleteModalOpen(false);
    } catch (error) {
      console.error('Error deleting voucher:', error);
    }
  };

  console.log(vouchers,"uiuiuiuiuiuiu");

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
                  <th className="px-4 py-2 border-b">Price</th>
                  <th className="px-4 py-2 border-b">Image</th>
                  <th className="px-4 py-2 border-b">Actions</th>
                </tr>
              </thead>
              <tbody>
                {vouchers.map((voucher) => (
                  <tr key={voucher._id}>
                    <td className="px-4 py-2 border-b">{voucher.voucher_name}</td>
                    <td className="px-4 py-2 border-b">{voucher.details}</td>
                    <td className="px-4 py-2 border-b">{voucher.product_name}</td>
                    <td className="px-4 py-2 border-b">{voucher.price}</td>
                    <td> <img
                  src={voucher.imageUrl} // Display the image URL
                  alt={voucher.product_name}
                  className="w-20 h-14 rounded-md mt-2"
                /></td>

                    <td className="px-4 py-2 border-b">
                      <button
                        onClick={() => {
                          setCurrentVoucher(voucher);
                          setEditModalOpen(true);
                        }}
                        className="bg-blue-500 text-white rounded-md px-4 py-2 mr-2 hover:bg-blue-600"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => {
                          setCurrentVoucher(voucher);
                          setDeleteModalOpen(true);
                        }}
                        className="bg-red-500 text-white rounded-md px-4 py-2 hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <AddModal isOpen={addModalOpen} onClose={() => setAddModalOpen(false)} onSubmit={handleAddVoucher} />
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
