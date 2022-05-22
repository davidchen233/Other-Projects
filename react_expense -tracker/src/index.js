// React Library = React + React DOM
import ReactDOM from "react-dom/client";

// importing CSS (React syntax)
import "./index.css"; // Global Styles
import App from "./App";

// 告知你建立的 React App 應該被插入的 element (public/index.html)
const root = ReactDOM.createRoot(document.getElementById("root"));

// Custom component element (React syntax)
root.render(<App />);
