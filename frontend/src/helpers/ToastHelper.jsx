// src/helpers/toastHelper.js
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const showSuccess = (msg) => {
  toast.success(msg, {
    position: "top-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
  });
};

export const showError = (msg) => {
  toast.error(msg, {
    position: "top-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
  });
};

export const showInfo = (msg) => {
  toast.info(msg);
};

export const showWarning = (msg) => {
  toast.warning(msg);
};
