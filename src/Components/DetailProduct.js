import React, { useState, useEffect } from "react";
import Header from "../Common/Header";
import Footer from "../Common/Footer";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import ListGroup from "react-bootstrap/ListGroup";
import InputGroup from "react-bootstrap/InputGroup";
import Form from "react-bootstrap/Form";
import { Link, useParams } from "react-router-dom";
import http from "../HTTP/http";

const DetailProduct = () => {
  const { idSanPham } = useParams();
  const [product, setProduct] = useState({});
  const [count, setCount] = useState(1);

  useEffect(() => {
    loadProduct();
  }, []);

  const loadProduct = () => {
    http.get(`/api/sanpham/detail/${idSanPham}`)
      .then((response) => {
        console.log(response.data);
        setProduct(response.data);
      })
      .catch((error) => {
        console.error("There was an error fetching the product!", error);
      });
  };

  const formatPrice = (price) => {
    if (price) {
      return price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
    } else {
      return ''; // or any default value you prefer
    }
  };
  
  const addToCart = () => {
    // Add logic to add the product to cart
    console.log("Add to cart:", product);
  };

  const decreaseCount = () => {
    if (count > 1) {
      setCount(count - 1);
    }
  };

  const increaseCount = () => {
    setCount(count + 1);
  };

  const changeCount = (e) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value > 0) {
      setCount(value);
    }
  };

  return (
    <>
      <Header />
      <Container
        style={{
          marginTop: "200px",
          marginBottom: "100px",
          borderRadius: "25px",
          border: "2px solid #cccccc",
          padding: "20px",
          boxShadow: "5px 10px #888888",
        }}
      >
        <h1 style={{marginLeft:"250px"}}>CHI TIẾT SẢN PHẨM</h1>
        <Row>
          <Col md={3}>
            <Card.Img
              style={{ borderRadius: "10% 10% 10% 10% / 11% 10% 10% 10% " , marginLeft:"50px"}}
              variant="top"
              src={product.hinhSP}
            />
          </Col>
          <Col md={9} style={{ width: "50rem", margin: "50px" }}>
            <Card.Title>{product.tenSanPham}</Card.Title>
            <Card.Text>{product.moTa}</Card.Text>
            <ListGroup variant="flush">
              <Card.Text>
                <b style={{color:"red"}}>{formatPrice(product.donGia)}</b>{" "}
              </Card.Text>
              <Row
                xs="auto"
                style={{
                  marginLeft: "300px",
                  width: "50%",
                  borderRadius: "0px",
                }}
              >
                <Row>
                  <InputGroup className="mb-3">
                    <Col md={3} style={{ marginLeft: "10px" }}>
                      <Button
                        onClick={decreaseCount}
                        variant="outline-dark"
                        style={{ width: "37px" }}
                      >
                        -
                      </Button>
                    </Col>
                    <Col md={3}>
                      <Form.Control
                        style={{
                          width: "45px",
                          textAlign: "center",
                          marginLeft: "3px",
                        }}
                        value={count}
                        aria-describedby="basic-addon1"
                        onChange={changeCount}
                      />
                    </Col>
                    <Col md={3} style={{ marginLeft: "13px" }}>
                      <Button onClick={increaseCount} variant="outline-dark">
                        +
                      </Button>
                    </Col>
                  </InputGroup>
                </Row>
              </Row>
              <ListGroup.Item>
                <Col md="auto" style={{ marginRight: "10px" }}>
                  
                  <Button
                    variant="light"
                    style={{boxShadow: "5px 5px #C0C0C0", height:"51px"}}
                    onClick={addToCart}
                  >
                    <b>Thêm vào giỏ hàng</b>
                  </Button>{" "}
                </Col>
              </ListGroup.Item>
            </ListGroup>
          </Col>
        </Row>
      </Container>
      <Footer />
    </>
  );
};

export default DetailProduct;
