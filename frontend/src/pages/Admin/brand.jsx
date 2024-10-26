import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from "../../components/Admin/Navbar";
import Sidebar from '../../components/Admin/Sidebar';
import { FaTrash, FaEdit } from 'react-icons/fa'; 
import { SERVER_URL } from '../../Constants';

const Brand = () => {
    const [brands, setBrands] = useState([]);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editBrandId, setEditBrandId] = useState('');

    // Fetch all brands when component mounts
    useEffect(() => {
        fetchBrands();
    }, []);

    const fetchBrands = async () => {
        try {
            const response = await axios.get(`${SERVER_URL}/admin/brands`);
            setBrands(response.data);
        } catch (error) {
            console.error('Error fetching brands:', error);
        }
    };

    // Add a new brand
    const addBrand = async (e) => {
        e.preventDefault();
        try {
            const newBrand = { name, description };
            const response = await axios.post(`${SERVER_URL}/admin/addBrand`, newBrand);
            setBrands([...brands, response.data]); // Update the UI with the new brand
            clearFormFields();
            setIsModalOpen(false);
        } catch (error) {
            console.error('Error adding brand:', error);
        }
    };

    // Update the brand
    const updateBrand = async (e) => {
        e.preventDefault();
        try {
            const updatedBrand = { name, description };
            const response = await axios.put(`${SERVER_URL}/admin/updateBrand/${editBrandId}`, updatedBrand);
            setBrands(brands.map(brand => (brand._id === editBrandId ? response.data : brand)));
            clearFormFields();
            setIsEditModalOpen(false);
        } catch (error) {
            console.error('Error updating brand:', error);
        }
    };

    // Delete a brand
    const deleteBrand = async (id) => {
        try {
            await axios.delete(`${SERVER_URL}/admin/deleteBrand/${id}`);
            setBrands(brands.filter(brand => brand._id !== id));
        } catch (error) {
            console.error('Error deleting brand:', error);
        }
    };

    // Open the edit modal
    const openEditModal = (brand) => {
        setEditBrandId(brand._id);
        setName(brand.name);
        setDescription(brand.description);
        setIsEditModalOpen(true);
    };

    // Clear form fields
    const clearFormFields = () => {
        setName('');
        setDescription('');
    };

    return (
        <div className="flex">
            <Sidebar />
            <div className="flex-1 flex flex-col">
                <Navbar />
                <div className="p-5 mt-5">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl font-bold">Brands</h2>
                        <button
                            className="px-4 py-2 bg-blue-500 text-white rounded"
                            onClick={() => {
                                clearFormFields();
                                setIsModalOpen(true);
                            }}
                        >
                            Add Brand
                        </button>
                    </div>

                    {/* Brand Table */}
                    <table className="min-w-full border border-gray-300">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="border px-4 py-2">Name</th>
                                <th className="border px-4 py-2">Description</th>
                                <th className="border px-4 py-2">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {brands.map(brand => (
                                <tr key={brand._id}>
                                    <td className="border px-4 py-2">{brand.name}</td>
                                    <td className="border px-4 py-2">{brand.description}</td>
                                    <td className="border px-4 py-2 flex space-x-2">
                                        <button onClick={() => openEditModal(brand)}>
                                            <FaEdit className="text-blue-500 hover:text-blue-700 mr-5" />
                                        </button>
                                        <button onClick={() => deleteBrand(brand._id)}>
                                            <FaTrash className="text-red-500 hover:text-red-700" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Modal for Adding Brand */}
                {isModalOpen && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                        <div className="bg-white rounded shadow-lg p-5 w-1/3">
                            <h2 className="text-xl font-bold mb-4">Add Brand</h2>
                            <form onSubmit={addBrand}>
                                <div className="mb-4">
                                    <label className="block text-sm font-bold mb-2">Name</label>
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="border rounded w-full px-3 py-2"
                                        required
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-sm font-bold mb-2">Description</label>
                                    <textarea
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        className="border rounded w-full px-3 py-2"
                                        required
                                    />
                                </div>
                                <div className="flex justify-end">
                                    <button type="button" className="mr-2 px-4 py-2 bg-gray-300 rounded" onClick={() => setIsModalOpen(false)}>
                                        Cancel
                                    </button>
                                    <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">
                                        Save
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Modal for Editing Brand */}
                {isEditModalOpen && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                        <div className="bg-white rounded shadow-lg p-5 w-1/3">
                            <h2 className="text-xl font-bold mb-4">Edit Brand</h2>
                            <form onSubmit={updateBrand}>
                                <div className="mb-4">
                                    <label className="block text-sm font-bold mb-2">Name</label>
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="border rounded w-full px-3 py-2"
                                        required
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-sm font-bold mb-2">Description</label>
                                    <textarea
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        className="border rounded w-full px-3 py-2"
                                        required
                                    />
                                </div>
                                <div className="flex justify-end">
                                    <button type="button" className="mr-2 px-4 py-2 bg-gray-300 rounded" onClick={() => setIsEditModalOpen(false)}>
                                        Cancel
                                    </button>
                                    <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">
                                        Save
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Brand;
