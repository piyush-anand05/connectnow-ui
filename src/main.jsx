import ReactDOM from "react-dom/client";

import { BrowserRouter } from "react-router-dom";

import App from "./App";

import "./styles/theme.css";
import "./styles/base.css";
import "./styles/components.css";
import "./styles/forms.css";
import "./styles/layout.css";
import "./styles/connectnowww-living.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);