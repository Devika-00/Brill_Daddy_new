import React from 'react';
import Navbar from '../../components/Admin/Navbar';
import Sidebar from '../../components/Admin/Sidebar';

const User = () => {
  // Dummy user data
  const users = [
    {
      name: 'John Doe',
      email: 'johndoe@example.com',
      phoneNumber: '+1 234 567 890',
      profilePicture: 'https://www.pngall.com/wp-content/uploads/5/Profile-Transparent.png', 
    },
    {
      name: 'Jane Smith',
      email: 'janesmith@example.com',
      phoneNumber: '+1 987 654 321',
      profilePicture: 'https://www.pngall.com/wp-content/uploads/5/Profile-Transparent.png',
    },
    {
      name: 'Bob Johnson',
      email: 'bobjohnson@example.com',
      phoneNumber: '+1 555 444 333',
      profilePicture: 'https://www.pngall.com/wp-content/uploads/5/Profile-Transparent.png',
    },
  ];

  return (
    <div className="flex">
        {/* Sidebar */}
        <Sidebar />
  
        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          <Navbar />
    <div className="p-4 sm:p-6 bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-bold text-gray-700 mb-4">User List</h2>
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
            {users.map((user, index) => (
              <tr key={index} className="border-t">
                <td className="px-4 py-2">
                  <img
                    src={user.profilePicture}
                    alt={user.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                </td>
                <td className="px-4 py-2 text-sm text-gray-600">{user.name}</td>
                <td className="px-4 py-2 text-sm text-gray-600">{user.email}</td>
                <td className="px-4 py-2 text-sm text-gray-600">{user.phoneNumber}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
    </div>
    </div>
  );
};

export default User;
