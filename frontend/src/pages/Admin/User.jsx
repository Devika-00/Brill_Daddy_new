import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { SERVER_URL } from "../../Constants/index";
import Navbar from '../../components/Admin/Navbar';
import Sidebar from '../../components/Admin/Sidebar';

const User = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);

  // Fetch real user data on component mount
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${SERVER_URL}/admin/users`);
        console.log('Fetched users:', response.data);
        if (Array.isArray(response.data)) {
          setUsers(response.data);
        } else {
          setError('Error: Response data is not an array');
        }
      } catch (error) {
        console.error('Error fetching users:', error);
        
        // Enhanced error handling
        const errorMessage = error.response?.data?.message || 'Network error or server down';
        setError(`Error: ${errorMessage}`);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className="flex">
      {/* Sidebar */}
      <Sidebar />
  
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <Navbar />
        <div className="p-4 sm:p-6 bg-gray-100 min-h-screen">
          <h2 className="text-2xl font-bold text-gray-700 mb-4">User List</h2>
          {error && <p className="text-red-500">{error}</p>}
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Profile Picture</th>
                  <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Name</th>
                  <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Email</th>
                  <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Phone Number</th>
                </tr>
              </thead>
              <tbody>
                {users.length > 0 ? (
                  users.map((user, index) => (
                    <tr key={index} className="border-t">
                      <td className="px-4 py-2">
                        <img
                          src={user.profilePicture || 'https://www.pngall.com/wp-content/uploads/5/Profile-Transparent.png'}
                          alt={user.username}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-600">{user.username}</td>
                      <td className="px-4 py-2 text-sm text-gray-600">{user.email}</td>
                      <td className="px-4 py-2 text-sm text-gray-600">{user.phone}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="px-4 py-2 text-center text-sm text-gray-600">No users available</td>
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

export default User;
