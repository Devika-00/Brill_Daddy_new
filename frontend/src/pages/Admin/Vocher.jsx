import React, { useState, useEffect } from 'react';
import Navbar from "../../components/Admin/Navbar";
import Sidebar from '../../components/Admin/Sidebar';

// Modal Component
const Modal = ({ isOpen, onClose, voucher, onSubmit }) => {
  const [formData, setFormData] = useState({ name: '', details: '', image: null, amount: '' });
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    if (voucher) {
      // Pre-fill form when editing
      setFormData({
        name: voucher.name,
        details: voucher.details,
        image: voucher.image,
        amount: voucher.amount,
      });
      setImagePreview(voucher.image);
    } else {
      // Reset form when adding a new voucher
      setFormData({ name: '', details: '', image: null, amount: '' });
      setImagePreview(null);
    }
  }, [voucher]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
      setFormData({ ...formData, image: file });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData); // Submit the updated form data

    // Close modal after submission
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-md w-96">
        <h3 className="text-lg font-bold mb-4">{voucher ? 'Edit Voucher' : 'Add Voucher'}</h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm mb-1">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
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
            <label className="block text-sm mb-1">Choose Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="border border-gray-300 rounded-md w-full p-2"
            />
            {imagePreview && (
              <img src={imagePreview} alt="Preview" className="mt-2 w-16 h-16 object-cover rounded-md" />
            )}
          </div>
          <div className="mb-4">
            <label className="block text-sm mb-1">Amount</label>
            <input
              type="text"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              className="border border-gray-300 rounded-md w-full p-2"
              required
            />
          </div>
          <button type="submit" className="bg-blue-500 text-white rounded-md px-4 py-2 hover:bg-blue-600">
            {voucher ? 'Edit' : 'Add'} Voucher
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
        <p className="mb-4">Are you sure you want to delete this voucher?</p>
        <div className="flex justify-end">
          <button
            onClick={onConfirm}
            className="bg-red-500 text-white rounded-md px-4 py-2 hover:bg-red-600 mr-2"
          >
            Delete
          </button>
          <button
            onClick={onClose}
            className="bg-gray-300 text-black rounded-md px-4 py-2 hover:bg-gray-400"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

const Voucher = () => {
  const initialVouchers = [
    {
      id: 1,
      name: 'Voucher 1',
      details: 'Details of Voucher 1',
      image: 'https://via.placeholder.com/100',
      amount: '$100.00',
    },
    {
      id: 2,
      name: 'Voucher 2',
      details: 'Details of Voucher 2',
      image: 'https://via.placeholder.com/100',
      amount: '$50.00',
    },
    {
      id: 3,
      name: 'Voucher 3',
      details: 'Details of Voucher 3',
      image: 'https://via.placeholder.com/100',
      amount: '$75.00',
    },
  ];

  const [vouchers, setVouchers] = useState(initialVouchers);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentVoucher, setCurrentVoucher] = useState(null);

  // Function to handle editing a voucher
  const handleEdit = (id) => {
    const voucherToEdit = vouchers.find((voucher) => voucher.id === id);
    setCurrentVoucher(voucherToEdit);
    setIsModalOpen(true);
  };

  // Function to handle adding a new voucher
  const handleAdd = () => {
    setCurrentVoucher(null); // Reset currentVoucher for a blank form
    setIsModalOpen(true);
  };

  // Function to handle form submission for editing or adding a voucher
  const handleSubmit = (formData) => {
    const formDataWithImageUrl = { ...formData };

    if (formData.image && typeof formData.image === 'object') {
      formDataWithImageUrl.image = URL.createObjectURL(formData.image); // Create a preview URL for display
    }

    if (currentVoucher) {
      // Edit logic
      setVouchers(vouchers.map((voucher) =>
        voucher.id === currentVoucher.id ? { ...voucher, ...formDataWithImageUrl } : voucher
      ));
    } else {
      // Add logic
      const newVoucher = { id: vouchers.length + 1, ...formDataWithImageUrl };
      setVouchers([...vouchers, newVoucher]);
    }
    setIsModalOpen(false); // Close modal after submission
  };

  // Function to handle opening delete confirmation modal
  const handleDelete = (id) => {
    setCurrentVoucher(vouchers.find((voucher) => voucher.id === id));
    setIsDeleteModalOpen(true);
  };

  // Function to confirm deletion of a voucher
  const confirmDelete = () => {
    if (currentVoucher) {
      setVouchers(vouchers.filter((voucher) => voucher.id !== currentVoucher.id));
    }
    setIsDeleteModalOpen(false);
  };

  return (
      <div className="flex">
        {/* Sidebar */}
        <Sidebar />
  
        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          <Navbar />
  
          <div className="flex justify-between mt-10 p-4">
            <h2 className="text-2xl font-bold text-gray-700">Voucher List</h2>
            <button
              onClick={handleAdd}
              className="bg-blue-500 text-white rounded-md px-4 py-2 hover:bg-blue-600"
            >
              Add Voucher
            </button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200 table-auto p-4">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Name</th>
                  <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Details</th>
                  <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Image</th>
                  <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Amount</th>
                  <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {vouchers.map((voucher) => (
                  <tr key={voucher.id} className="border-b border-gray-200">
                    <td className="px-4 py-2">{voucher.name}</td>
                    <td className="px-4 py-2">{voucher.details}</td>
                    <td className="px-4 py-2">
                      <img src={voucher.image} alt={voucher.name} className="w-16 h-16 object-cover" />
                    </td>
                    <td className="px-4 py-2">{voucher.amount}</td>
                    <td className="px-4 py-2">
                      <button
                        onClick={() => handleEdit(voucher.id)}
                        className="bg-yellow-500 text-white px-2 py-1 rounded-md hover:bg-yellow-600 mr-2"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(voucher.id)}
                        className="bg-red-500 text-white px-2 py-1 rounded-md hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
  
          {/* Add/Edit Modal */}
          <Modal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            voucher={currentVoucher}
            onSubmit={handleSubmit}
          />
  
          {/* Delete Confirmation Modal */}
          <DeleteModal
            isOpen={isDeleteModalOpen}
            onClose={() => setIsDeleteModalOpen(false)}
            onConfirm={confirmDelete}
          />
        </div>
      </div>
    );
};

export default Voucher;
