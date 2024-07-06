// src/Common/Header.js
import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import { Link, useLocation, useNavigate } from 'react-router-dom';
import logo from "../Icon/logo.jpg";
import http from "../HTTP/http";
import '../CSS/header.css';
import { ShoppingCartOutlined } from '@ant-design/icons';

const Header = ({ onSearch }) => {
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const response = await http.get("/api/danhmucsp");
        setCategories(response.data);
      } catch (error) {
        console.error("Error loading categories:", error);
      }
    };
    loadCategories();
  }, []);

  const handleCategoryClick = (idDanhMuc) => {
    localStorage.setItem('selectedCategoryId', idDanhMuc);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleCartClick = () => {
    navigate('/cart'); // Điều hướng đến trang giỏ hàng
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    if (searchTerm.trim()) {
      localStorage.removeItem('selectedCategoryId'); // Clear selectedCategoryId on search
      localStorage.setItem('searchTerm', searchTerm);
      navigate(`/sanpham/search=${encodeURIComponent(searchTerm)}`); // Use navigate for routing
    }
  };

  const handleSanPhamClick = () => {
    localStorage.removeItem('selectedCategoryId');
    localStorage.removeItem('searchTerm');
  };

  const cates = categories.map((value) => (
    <NavDropdown.Item
      key={value.idDanhMuc}
      as={Link}
      to={'/sanpham/danhmuc/' + value.idDanhMuc}
      onClick={() => handleCategoryClick(value.idDanhMuc)}
      className="text-black"
      style={{ textDecoration: "none" }}
    >
      {value.tenDanhMuc}
    </NavDropdown.Item>
  ));

  return (
    <>
      <Navbar expand="lg">
        <Container fluid>
          <Navbar.Brand href="#">
            <img
              src={logo}
              style={{ boxShadow: "5px 10px #C0C0C0", margin: "10px", height: "50px" }}
              alt="Logo thương hiệu"
            />
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="navbarScroll" />
          <Navbar.Collapse id="navbarScroll">
            <Nav className="me-auto my-2 my-lg-0" style={{ maxHeight: "100px" }} navbarScroll>
              <Nav.Link href="/">Trang chủ</Nav.Link>
              <NavDropdown title="Danh mục sản phẩm" id="navbarScrollingDropdown">
                {cates}
              </NavDropdown>
              <Nav.Link as={Link} to="/sanpham" onClick={handleSanPhamClick}>
                Sản Phẩm
              </Nav.Link>
            </Nav>
            <Form className="custom-search-container" onSubmit={handleSearchSubmit}>
              <Form.Control
                type="search"
                placeholder="Tìm kiếm"
                className="me-2 custom-search-input"
                aria-label="Tìm kiếm"
                value={searchTerm}
                onChange={handleSearchChange}
                
              />
              <Button variant="dark" type="submit" className="custom-search-button">
                Tìm kiếm
              </Button>
            </Form>
            <Button variant="dark" onClick={handleCartClick} style={{ marginLeft: '10px' }}>
              <ShoppingCartOutlined style={{ fontSize: '24px', color: 'white' }} />
            </Button>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
};

export default Header;
