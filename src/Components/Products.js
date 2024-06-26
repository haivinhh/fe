import React, { useState, useEffect } from "react";
import Footer from "../Common/Footer";
import Header from "../Common/Header";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import Pagination from "react-bootstrap/Pagination";
import http from "../HTTP/http";
import { useLocation } from 'react-router-dom';
import { Link } from "react-router-dom";
import Filter from "../Common/Filter";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [value, setValue] = useState(15);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const location = useLocation();
  const [filters, setFilters] = useState({
    selectedCategory: '',
    selectedPhoneModel: '',
    selectedPhoneType: '',
  });

  const searchParams = new URLSearchParams(location.search);
  const searchTerm = searchParams.get('search');

  useEffect(() => {
    document.title = "MCase";
    if (localStorage.getItem("selectedCategoryId")) {
      loadProductsFromCate();
    } else if (localStorage.getItem("searchTerm")) {
      searchProducts(localStorage.getItem("searchTerm"));
    } else {
      loadProducts();
    }
  }, [localStorage.getItem("searchTerm"), page, localStorage.getItem("selectedCategoryId")]);

  const clickPage = (e) => {
    setPage(parseInt(e.target.text));
    
  };

  const loadProducts = () => {
    http.get(`/api/sanpham`)
      .then((response) => {
        const totalPages = Math.ceil(response.data.length / value);
        setProducts(response.data);
        setTotalPages(totalPages);
      })
      .catch((error) => {
        console.error("There was an error fetching the products!", error);
      });
  };

  const loadProductsFromCate = () => {
    const selectedCategoryId = localStorage.getItem("selectedCategoryId");
    http.get(`/api/sanpham/danhmuc/${selectedCategoryId}`)
      .then((response) => {
        setProducts(response.data);
        setTotalPages(Math.ceil(response.data.length / value));
      })
      .catch((error) => {
        console.error("There was an error fetching the products from the category!", error);
      });
  };
  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    // Add logic to handle the filter changes, e.g., fetch filtered data
  };

  const searchProducts = (term) => {
    http.get(`/api/sanpham/search/${encodeURIComponent(term)}`)
      .then((response) => {
        setProducts(response.data);
        setTotalPages(Math.ceil(response.data.length / value));
      })
      .catch((error) => {
        console.error("There was an error searching the products!", error);
      });
  };

  const startIndex = (page - 1) * value;
  const currentProducts = products.slice(startIndex, startIndex + value);

  const formatPrice = (price) => {
    return price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
  };

  const listProducts = currentProducts.length > 0 ? (
    currentProducts.map((product) => (
      <Col sm={4} key={product.idSanPham} className="d-flex">
        <Card style={{ width: "18rem", marginTop: "50px" }} className="flex-fill">
          <Link to={`/sanpham/detail/${product.idSanPham}`} className="text-dark no-underline">
            <Card.Img variant="top" src={product.hinhSP} className="product-image mb-3" />
            <Card.Body className="d-flex flex-column">
              <Card.Title style={{ textDecoration: "none" }}>{product.tenSanPham}</Card.Title>
              <Card.Text style={{ color: "red", textDecoration: "none" }}>{formatPrice(product.donGia)}</Card.Text>
            </Card.Body>
          </Link>
        </Card>
      </Col>
    ))
  ) : (
    <Col>
      <p>Không tìm thấy sản phẩm nào với từ khóa "{localStorage.getItem("searchTerm")}".</p>
    </Col>
  );

  let listPage = [];
  for (let index = 0; index < totalPages; index++) {
    const value2 = index + 1;
    listPage.push(
      <Pagination.Item key={value2} active={value2 === page} onClick={clickPage}>
        {value2}
      </Pagination.Item>
    );
  }

  return (
    <>
      <Header />
      <Filter onFilterChange={handleFilterChange} />
      <Container>
        <Row style={{ marginTop: "20px" }}>{listProducts}</Row>
        <Row>
          <Col className="d-flex justify-content-center py-3">
            <Pagination>{listPage}</Pagination>
          </Col>
        </Row>
      </Container>
      <Footer />
    </>
  );
};

export default Products;
