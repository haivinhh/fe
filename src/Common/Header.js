import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import { Link, useNavigate } from 'react-router-dom';
import logo from "../Icon/logo.jpg";
import http from "../HTTP/http";
import '../CSS/header.css';

const Header = ({ onSearch }) => {
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

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

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    if (searchTerm.trim()) {
      localStorage.setItem('searchTerm', searchTerm);
      window.location.href = `/sanpham?search=${encodeURIComponent(searchTerm)}`; // Cập nhật URL và reload trang
    }
  };

  const cates = categories.map((value) => (
    <NavDropdown.Item key={value.idDanhMuc}>
      <Link
        onClick={() => handleCategoryClick(value.idDanhMuc)}
        to={'/sanpham/danhmuc/' + value.idDanhMuc}
        className="text-black"
        style={{ textDecoration: "none" }}
      >
        {value.tenDanhMuc}
      </Link>
    </NavDropdown.Item>
  ));

  return (
    <>
      <Navbar expand="lg" className="bg-body-tertiary">
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
              <Nav.Link as={Link} to="/sanpham">
                Sản Phẩm
              </Nav.Link>
            </Nav>
            <Form className="d-flex" onSubmit={handleSearchSubmit}>
              <Form.Control
                type="search"
                placeholder="Tìm kiếm"
                className="me-2"
                aria-label="Tìm kiếm"
                value={searchTerm}
                onChange={handleSearchChange}
              />
              <Button variant="outline-success" type="submit">Tìm kiếm</Button>
            </Form>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
};

export default Header;
