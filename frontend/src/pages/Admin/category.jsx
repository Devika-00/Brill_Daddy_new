import React, { useState, useEffect } from 'react';
import Navbar from "../../components/Admin/Navbar";
import Sidebar from '../../components/Admin/Sidebar';
import { FaTrash, FaEdit } from 'react-icons/fa';
import axios from 'axios'; 
import { SERVER_URL } from '../../Constants';

const Category = () => {
    const [categories, setCategories] = useState([]);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [parentCategory, setParentCategory] = useState(''); // Store the selected parent category ID
    const [error, setError] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [currentCategoryId, setCurrentCategoryId] = useState('');

    // Fetch all categories from the database
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get(`${SERVER_URL}/admin/categories`);
                setCategories(response.data); 
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };

        fetchCategories();
    }, []);

    // Validation function
    const validateForm = () => {
        if (!name || !description) {
            return "Name and description are required.";
        }
        if (name.length > 50) {
            return "Name cannot exceed 50 characters.";
        }
        if (description.length > 100) {
            return "Description cannot exceed 100 characters.";
        }
        return null;
    };

    // Add a new category
    const addCategory = async (e) => {
        e.preventDefault();
        setError('');

        const validationError = validateForm();
        if (validationError) {
            setError(validationError);
            return;
        }

        const newCategory = { name, description, parentCategory: parentCategory || null };
        try {
            const response = await axios.post(`${SERVER_URL}/admin/addCategory`, newCategory);
            const createdCategory = response.data;

            // Update state with the new category
            setCategories([...categories, createdCategory]);
            resetForm();
        } catch (error) {
            console.error('Error adding category:', error);
            setError('Failed to add category. Please try again later.');
        }
    };

    // Edit an existing category
    const editCategory = (categoryId) => {
        const category = categories.find(cat => cat._id === categoryId);
        if (category) {
            setName(category.name);
            setDescription(category.description);
            setParentCategory(category.parentCategory || '');
            setCurrentCategoryId(categoryId);
            setIsEditMode(true);
            setIsModalOpen(true);
        }
    };

    // Update an existing category
    const updateCategory = async (e) => {
        e.preventDefault();
        setError('');

        const validationError = validateForm();
        if (validationError) {
            setError(validationError);
            return;
        }

        try {
            const updatedCategory = { name, description, parentCategory: parentCategory || null };
            await axios.put(`${SERVER_URL}/admin/updateCategory/${currentCategoryId}`, updatedCategory);
            
            // Update categories in state
            setCategories(categories.map(cat => 
                cat._id === currentCategoryId ? { ...cat, name, description, parentCategory } : cat
            ));
            resetForm();
        } catch (error) {
            console.error('Error updating category:', error);
            setError('Failed to update category. Please try again later.');
        }
    };

    // Delete a category
    const deleteCategory = async (categoryId) => {
        try {
            await axios.delete(`${SERVER_URL}/admin/deleteCategory/${categoryId}`);
            setCategories(categories.filter(cat => cat._id !== categoryId));
        } catch (error) {
            console.error('Error deleting category:', error);
        }
    };

    const resetForm = () => {
        setName('');
        setDescription('');
        setParentCategory('');
        setError('');
        setIsModalOpen(false);
        setIsEditMode(false);
        setCurrentCategoryId('');
    };

    return (
        <div className="flex">
            <Sidebar />
            <div className="flex-1 flex flex-col">
                <Navbar />
                <div className="p-5 mt-5">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl font-bold">Categories</h2>
                        <button
                            className="px-4 py-2 bg-blue-500 text-white rounded"
                            onClick={() => setIsModalOpen(true)}
                        >
                            Add Category
                        </button>
                    </div>

                    {/* Category Table */}
                    <table className="min-w-full border border-gray-300">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="border px-4 py-2">Name</th>
                                <th className="border px-4 py-2">Description</th>
                                <th className="border px-4 py-2">Parent Category</th>
                                <th className="border px-4 py-2">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {categories.map(category => (
                                <tr key={category._id}>
                                    <td className="border px-4 py-2">{category.name}</td>
                                    <td className="border px-4 py-2">{category.description}</td>
                                    <td className="border px-4 py-2">
                                        {category.parentCategory 
                                            ? categories.find(cat => cat._id === category.parentCategory)?.name 
                                            : 'None'}
                                    </td>
                                    <td className="border px-4 py-2 flex space-x-2">
                                        <button onClick={() => editCategory(category._id)}>
                                            <FaEdit className="text-blue-500 hover:text-blue-700 mr-5" />
                                        </button>
                                        <button onClick={() => deleteCategory(category._id)}>
                                            <FaTrash className="text-red-500 hover:text-red-700" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Modal for Adding/Editing Category */}
                {isModalOpen && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                        <div className="bg-white rounded shadow-lg p-5 w-1/3">
                            <h2 className="text-xl font-bold mb-4">{isEditMode ? 'Edit Category' : 'Add Category'}</h2>
                            <form onSubmit={isEditMode ? updateCategory : addCategory}>
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
                                <div className="mb-4">
                                    <label className="block text-sm font-bold mb-2">Parent Category</label>
                                    <select
                                        value={parentCategory}
                                        onChange={(e) => setParentCategory(e.target.value)}
                                        className="border rounded w-full px-3 py-2"
                                    >
                                        <option value="">None</option>
                                        {categories.map(cat => (
                                            <option key={cat._id} value={cat._id}>
                                                {cat.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                {error && <p className="text-red-500 text-sm">{error}</p>}
                                <div className="flex justify-end">
                                    <button type="button" className="mr-2 px-4 py-2 bg-gray-300 rounded" onClick={resetForm}>
                                        Cancel
                                    </button>
                                    <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">
                                        {isEditMode ? 'Change' : 'Save'}
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

export default Category;
