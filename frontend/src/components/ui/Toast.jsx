import { ToastContainer, toast as rtToast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// UI component that you mount once (e.g. in App.jsx)
const Toast = () => {
  return (
    <ToastContainer
      position="top-right"
      autoClose={4000}
      hideProgressBar={false}
      newestOnTop={true}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="light"
      style={{
        zIndex: 9999,
      }}
      toastClassName={() => 
        "relative flex p-4 min-h-10 rounded-xl shadow-strong bg-white border border-gray-100 text-foreground mb-3 overflow-hidden"
      }
      bodyClassName={() => "text-sm font-medium flex items-center"}
      progressClassName="bg-primary h-1"
    />
  );
};

// Attach helper methods so you can call Toast.success(...), etc.
Toast.success = (message, options) => rtToast.success(message, {
  ...options,
  className: 'bg-white border border-emerald-100 shadow-strong',
  progressClassName: 'bg-emerald-500',
});

Toast.error = (message, options) => rtToast.error(message, {
  ...options,
  className: 'bg-white border border-red-100 shadow-strong',
  progressClassName: 'bg-red-500',
});

Toast.info = (message, options) => rtToast.info(message, {
  ...options,
  className: 'bg-white border border-blue-100 shadow-strong',
  progressClassName: 'bg-blue-500',
});

Toast.warn = (message, options) => rtToast.warn(message, {
  ...options,
  className: 'bg-white border border-amber-100 shadow-strong',
  progressClassName: 'bg-amber-500',
});

export default Toast;