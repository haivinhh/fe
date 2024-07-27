import './App.css';
import Home from './Components/Home';
import Products from "./Components/Products";
import DetailProduct from './Components/DetailProduct';
import Cart from './Components/Cart';
import Login from './Components/Login';
import Register from './Components/Register';
import ProfileCustomer from './Components/ProfileCus';
import DetailCart from './Components/DetailCart';
import Template from './Components/Admin/Template';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LoginAdmin from './Components/Admin/LoginAdmin';
import PrivateRoute from './Components/PrivateRoute';

function App() {

  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/sanpham" element={<Products />} />
          <Route path="/sanpham/:searchterm" element={<Products />} />
          
          <Route path="/sanpham/danhmuc/:idDanhMuc" element={<Products/>} />
          <Route path="/sanpham/detail/:idSanPham" element={<DetailProduct />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profilecustomer" element={<ProfileCustomer />} />
          <Route path="/getdetailcart/:idDonHang" element={<DetailCart />} />

          {/* admin */}
          <Route path="/admin" element={<LoginAdmin/>}/>
          <Route path="/qlsp" element={<PrivateRoute element={Template} />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
