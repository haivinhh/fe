import React, { useState, useEffect } from "react";
import Footer from "../Common/Footer";
import Header from "../Common/Header";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import Carousel from "react-bootstrap/Carousel";
import { Link } from "react-router-dom";
import http from "../HTTP/http";
import banner1 from "../Icon/banner1.png";
import banner2 from "../Icon/banner2.png";
import "../CSS/home.css";

const Home = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    document.title = "MCase";
    http.get("/api/sanpham")
      .then((res) => setProducts(res.data.slice(-18)))
      .catch((err) => console.error("Error fetching products:", err));
  }, []);

  const formatPrice = (price) =>
    price.toLocaleString("vi-VN", { style: "currency", currency: "VND" });

  return (
    <>
      <Header />
      {/* Carousel - full width */}
      <Carousel fade>
        <Carousel.Item>
          <img className="d-block w-100" src={banner1} alt="Banner 1" />
        </Carousel.Item>
        <Carousel.Item>
          <img className="d-block w-100" src={banner2} alt="Banner 2" />
        </Carousel.Item>
      </Carousel>

      <div style={{ margin: "30px 0" }} />

      <Container fluid="lg">
        <Row className="mb-3">
          <Col>
            <p style={{ fontSize: "clamp(1.4rem, 4vw, 2.5rem)", marginBottom: 0 }}>
              <b>SẢN PHẨM NỔI BẬT</b>
            </p>
          </Col>
        </Row>

        {/* FIX: xs=12 sm=6 md=4 - responsive đúng mọi thiết bị */}
        <Row className="g-3">
          {products.map((product) => (
            <Col xs={12} sm={6} md={4} key={product.idSanPham} className="d-flex">
              <Card style={{ width: "100%" }} className="flex-fill">
                <Link to={`/sanpham/detail/${product.idSanPham}`} className="text-dark no-underline">
                  <Card.Img variant="top" src={product.hinhSP} className="product-image mb-3" />
                  <Card.Body className="d-flex flex-column">
                    <Card.Title style={{ textDecoration: "none" }}>{product.tenSanPham}</Card.Title>
                    <Card.Text style={{ color: "red" }}>{formatPrice(product.donGia)}</Card.Text>
                  </Card.Body>
                </Link>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>

      <div style={{ margin: "60px 0" }} />
      <Footer />
    </>
  );
};

export default Home;
