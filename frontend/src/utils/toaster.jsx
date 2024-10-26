import toast from "react-hot-toast";

export const showToast = (message, type = "success") => {
    switch(type) {
        case "success":
            toast.success(message);
            break;
        case "error":
            toast.error(message);
            break;
        default:
            toast.success(message);
            break;
    }
};

export default showToast;
