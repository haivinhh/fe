import React, { Component } from "react";
import Footer from "../Common/Footer";
import Header from "../Common/Header";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/esm/Container";
import Carousel from "react-bootstrap/Carousel";
import http from "../HTTP/http";
import banner1 from '../Icon/banner1.png';
import banner2 from '../Icon/banner2.png';
import '../CSS/home.css'; // Import the custom CSS file

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      products: [],
    };
    this.loadProducts = this.loadProducts.bind(this);
    this.componentDidMount = this.componentDidMount.bind(this);
  }

  loadProducts() {
    http.get(`/api/sanpham`).then((response) => {
      console.log(response);
      this.setState({ products: response.data });
    }).catch(error => {
      console.error("There was an error fetching the products!", error);
    });
  }

  componentDidMount() {
    document.title = "MCase";
    this.loadProducts();
  }

  render() {
    const listProducts = this.state.products.map((product) => (
      <Col sm={4} key={product.idSanPham} className="d-flex">
        <Card style={{ width: "18rem", marginTop: "50px" }} className="flex-fill">
          <Card.Img 
            variant="top" 
            src={product.hinhSP} 
            className="product-image mb-3"
          />
          <Card.Body className="d-flex flex-column">
            <Card.Title>{product.tenSanPham}</Card.Title>
            <Card.Text style={{color: "red"}}>
               {product.donGia}đ
            </Card.Text>
          </Card.Body>
        </Card>
      </Col>
    ));

    return (
      <>
        <Header />
        <Carousel fade>
          <Carousel.Item>
            <img
              className="d-block w-100"
              src={banner1}
              alt="First slide"
            />
          </Carousel.Item>
          <Carousel.Item>
            <img
              className="d-block w-100"
              src={banner2}
              alt="Second slide"
            />
          </Carousel.Item>
        </Carousel>
        <div style={{ margin: "70px" }}></div>
        <Container>
          <Row>
            <p style={{ fontSize: "3rem" }}>
              <b>SẢN PHẨM NỔI BẬT</b>
            </p>
          </Row>
          <Row style={{marginLeft: "50px"}}>{listProducts}</Row>
        </Container>
        <div style={{ margin: "150px" }}></div>
        <Footer />
      </>
    );
  }
}

export default Home;
