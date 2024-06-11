import React, { Component } from "react";
import Footer from "../Common/Footer";
import Header from "../Common/Header";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/esm/Container";
import Pagination from "react-bootstrap/Pagination";
import http from "../HTTP/http";

class Products extends Component {
  constructor(props) {
    super(props);
    this.state = {
      products: [],
      value: 9,
      page: 1,
      totalPages: 1,
    };
    this.loadProducts = this.loadProducts.bind(this);
    this.loadProductsFromCate = this.loadProductsFromCate.bind(this);
    this.componentDidMount = this.componentDidMount.bind(this);
    this.clickPage = this.clickPage.bind(this);
  }

  clickPage(e) {
    this.setState({ page: parseInt(e.target.text) }, this.loadProducts);
  }

  loadProducts() {
    
    http.get(`/api/sanpham`).then((response) => {
      const totalPages = Math.ceil(response.data.length / this.state.value);
      this.setState({ products: response.data, totalPages });
    }).catch(error => {
      console.error("There was an error fetching the products!", error);
    });
  }

  loadProductsFromCate() {
      http.get(`/api/sanpham/danhmuc` + window.location.href.split("/")[1])
      .then((response) => {
        console.log(Math.ceil(response.data.length / this.state.value));
        this.setState({ products: response.data });
        this.setState({
          totalPages: Math.ceil(response.data.length / this.state.value),
        });
      });
    }

  componentDidMount() {
    document.title = "MCase";
    if (this.props.idDanhMuc) {
      this.loadProductsFromCate();
    } else {
      this.loadProducts();
    }
  }

  render() {
    const { products, value, page, totalPages } = this.state;
    const startIndex = (page - 1) * value;
    const currentProducts = products.slice(startIndex, startIndex + value);

    const listProducts = currentProducts.map((product) => (
      <Col sm={4} key={product.idSanPham} className="d-flex">
        <Card style={{ width: "18rem", marginTop: "50px" }} className="flex-fill">
          <Card.Img
            variant="top"
            src={product.hinhSP}
            className="product-image mb-3"
          />
          <Card.Body className="d-flex flex-column">
            <Card.Title>{product.tenSanPham}</Card.Title>
            <Card.Text style={{ color: "red" }}>
              {product.donGia}đ
            </Card.Text>
          </Card.Body>
        </Card>
      </Col>
    ));

    let listPage = [];
    for (let index = 0; index < totalPages; index++) {
      const value2 = index + 1;
      listPage.push(
        <Pagination.Item
          key={value2}
          active={value2 === page}
          onClick={this.clickPage}
        >
          {value2}
        </Pagination.Item>
      );
    }

    return (
      <>
        <Header />
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
  }
}

export default Products;
