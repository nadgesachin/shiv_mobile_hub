import { ToastContainer, toast as rtToast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// UI component that you mount once (e.g. in App.jsx)
const Toast = () => {
  return <ToastContainer />;
};

// Attach helper methods so you can call Toast.success(...), etc.
Toast.success = (message, options) => rtToast.success(message, options);
Toast.error  = (message, options) => rtToast.error(message, options);
Toast.info   = (message, options) => rtToast.info(message, options);
Toast.warn   = (message, options) => rtToast.warn(message, options);

export default Toast;