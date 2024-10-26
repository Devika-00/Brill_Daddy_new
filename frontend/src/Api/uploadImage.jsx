import { CLOUDINARY_UPLOAD_API, cloudinaryUploadPreset } from "../Constants/index";
import showToast from "../utils/toaster";

export const uploadImagesToCloudinary = async (imageFile) => {
  try {
    if (!imageFile) {
      throw new Error("Image file not provided");
    }
    
    const formData = new FormData();
    formData.append("file", imageFile);
    formData.append("upload_preset", cloudinaryUploadPreset);

    const response = await fetch(CLOUDINARY_UPLOAD_API, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Failed to upload image to Cloudinary");
    }

    const data = await response.json();
    console.log("Cloudinary URL:", data.secure_url);  // Console the image URL
    return data.secure_url;
  } catch (error) {
    showToast("Error uploading image to Cloudinary: " + error, "error");
    return null;
  }
};
