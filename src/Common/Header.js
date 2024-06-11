import React from "react";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import { Link } from 'react-router-dom';
import logo from "../Icon/logo.jpg";
import http from "../HTTP/http";

class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      categories: []
    };
    this.loadCategories = this.loadCategories.bind(this);
  }
  loadCategories() {
    http.get("/api/danhmucsp")
      .then(response => {
        this.setState({ categories: response.data });
      })
      .catch(error => {
        console.error("Error loading categories:", error);
      });
  }
  componentDidMount() {
    this.loadCategories();
  }
  render() {
    const cates = this.state.categories.map((value) => (
      <>
      <NavDropdown.Item key={value.id}>
        <Link
          onClick={()=>{window.location.href="/sanpham/danhmuc/" + value.id}}
          to={'/sanpham/danhmuc/' + value.id}
          className="text-black"
          style={{ textDecoration: "none" }}
        >
          {value.tenDanhMuc}
        </Link>
      </NavDropdown.Item>
      </>
    ));
    return (
      <>
        <Navbar expand="lg" className="bg-body-tertiary">
          <Container fluid>
            <Navbar.Brand href="#">
              <img
                src={logo}
                style={{ boxShadow: "5px 10px #C0C0C0" }}
                margin="10px"
                height={"50px"}
              />
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="navbarScroll" />
            <Navbar.Collapse id="navbarScroll">
              <Nav
                className="me-auto my-2 my-lg-0"
                style={{ maxHeight: "100px" }}
                navbarScroll
              >
                <Nav.Link href="/">Trang chủ</Nav.Link>

                <NavDropdown
                  title="Danh mục sản phẩm"
                  id="navbarScrollingDropdown"
                >
                  {cates}
                </NavDropdown>
                <Nav.Link href="#" disabled>
                  Link
                </Nav.Link>
              </Nav>
              <Form className="d-flex">
                <Form.Control
                  type="search"
                  placeholder="Search"
                  className="me-2"
                  aria-label="Search"
                />
                <Button variant="outline-success">Search</Button>
              </Form>
            </Navbar.Collapse>
          </Container>
        </Navbar>
      </>
    );
  }
}

export default Header;
