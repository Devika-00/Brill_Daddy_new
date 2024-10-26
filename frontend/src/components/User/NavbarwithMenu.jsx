import React, { useState,useEffect } from 'react';
import { FaBars, FaTimes } from 'react-icons/fa';
import { SERVER_URL } from "../../Constants";
import axios from "axios";

const NavbarWithMenu = () => {
    const [showCategories, setShowCategories] = useState(false);
    const [categories, setCategories] = useState([]);

    const toggleCategories = () => {
        setShowCategories(!showCategories);
    };

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios(`${SERVER_URL}/user/category`);
                console.log(response.data)
                setCategories(response.data);
            } catch (error) {
                console.error("Error fetching categories:", error);
            }
        };
        fetchCategories();
    }, []);

    return (
        <>
            {/* Dark Blue Bar */}
            <div className="bg-blue-900 text-white font-bold flex justify-between items-center p-2">
                <div className="flex items-center">
                    <button
                        onClick={toggleCategories}
                        className="flex items-center focus:outline-none ml-5"
                    >
                        <FaBars className="text-white mr-2" />
                        <span>All</span>
                    </button>

                    <div className="hidden md:flex space-x-6 ml-10">
                        <span className="cursor-pointer hover:text-gray-300 ">Today's Deals</span>
                        <span className="cursor-pointer hover:text-gray-300 ">Events</span>
                    </div>
                </div>
            </div>

            {/* Dropdown menu for categories (slide in from left) */}
            {showCategories && (
                <div className="absolute top-24 left-0 bg-white w-64 h-full shadow-lg z-50">
                    <div className="p-4">
                        <button
                            onClick={toggleCategories}
                            className="text-gray-600 text-xl absolute top-2 right-2 focus:outline-none"
                        >
                            <FaTimes />
                        </button>

                        <h2 className="text-xl font-bold mb-4">Categories</h2>
                        <ul>
                            {categories.map((category, index) => (
                                <li key={index} className="p-2 hover:bg-gray-100 cursor-pointer">
                                    {category.name}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}
        </>
    );
};

export default NavbarWithMenu;
