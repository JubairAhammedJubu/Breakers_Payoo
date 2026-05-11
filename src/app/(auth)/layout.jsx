import {ToastContainer} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function RootLayout({children}) {
  return (
    <div>
      {children}
      <ToastContainer position="top-right" theme="dark" autoClose={3000} />
    </div>
  );
}
