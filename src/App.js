import './App.css';
import Home from './Components/Home';
import Admin from './Components/admin';
import Products from "./Components/Products";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

function App() {

  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/sanpham/danhmuc/:idDanhMuc" element={<Products />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
