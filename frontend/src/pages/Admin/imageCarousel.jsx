import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { SERVER_URL } from '../../Constants';
import Navbar from '../../components/Admin/Navbar';
import Sidebar from '../../components/Admin/Sidebar';
import { uploadImagesToCloudinary } from "../../Api/uploadImage";

const ImageCarousels = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchUploadedImages();
  }, []);

  const fetchUploadedImages = async () => {
    try {
      const response = await axios.get(`${SERVER_URL}/admin/carouselImages`);
      setUploadedImages(response.data);
    } catch (error) {
      console.error('Error fetching uploaded images:', error);
    }
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert('Please select an image to upload.');
      return;
    }


    try {
      setIsUploading(true);

      const mainImageUrl = await uploadImagesToCloudinary(selectedFile);
      const payload = { imageUrl: mainImageUrl }; 

      const response = await axios.post(`${SERVER_URL}/admin/uploadImage`, payload);

      if (response.status === 200) {
        alert('Image uploaded successfully!');
        setSelectedFile(null);
        fetchUploadedImages();
        setIsModalOpen(false);
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteImage = async (imageId) => {
    try {
      await axios.delete(`${SERVER_URL}/admin/deleteImage/${imageId}`);
      fetchUploadedImages();
      alert('Image deleted successfully!');
    } catch (error) {
      console.error('Error deleting image:', error);
      alert('Failed to delete image.');
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />
        
        <div className="p-6 flex-grow overflow-y-auto">
          <div className="max-w-6xl mx-auto">
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
              <div className="p-6 bg-gray-100 flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-800">Image Carousel</h2>
                <button 
                  onClick={() => setIsModalOpen(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                  Add Image
                </button>
              </div>

              {/* Image Grid */}
              <div className="p-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-1 gap-6">
                {uploadedImages.map((image) => (
                  <div 
                    key={image.id} 
                    className="relative group"
                  >
                    <div className="bg-white rounded-lg shadow-md overflow-hidden">
                      <img 
                        src={image.imageUrl} 
                        alt={`Uploaded ${image.id}`} 
                        className="w-full h-32 object-cover"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
                        <button 
                          onClick={() => handleDeleteImage(image._id)}
                          className="bg-red-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
            
          {/* Modal */}
          {isModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
              <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
                <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                  <h3 className="text-xl font-semibold text-gray-800">Upload New Image</h3>
                  <button 
                    onClick={() => setIsModalOpen(false)}
                    className="text-gray-600 hover:text-gray-900"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <div className="p-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Upload Image
                    </label>
                    <input 
                      type="file" 
                      onChange={handleFileChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="flex justify-end space-x-3">
                    <button 
                      onClick={() => setIsModalOpen(false)}
                      className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={handleUpload} 
                      disabled={isUploading}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
                    >
                      {isUploading ? 'Uploading...' : 'Upload'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageCarousels;