import React, { useState, useEffect } from "react";
import Footer from "../Common/Footer";
import Header from "../Common/Header";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import Pagination from "react-bootstrap/Pagination";
import Button from "react-bootstrap/Button";
import http from "../HTTP/http";
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import Select from "react-select";
import "../CSS/filter.css";
import "../CSS/checkbox.css";
import "../CSS/home.css";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [value] = useState(15);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const location = useLocation();
  const [brands, setBrands] = useState([]);
  const [phoneTypes, setPhoneTypes] = useState([]);
  const [productLines, setProductLines] = useState([]);
  const [filters, setFilters] = useState({ brand: [], type: [], line: [] });
  const [noProducts, setNoProducts] = useState(false);

  useEffect(() => {
    document.title = "MCase";
    fetchData();
    if (localStorage.getItem("selectedCategoryId")) {
      loadProductsFromCate();
    } else if (localStorage.getItem("searchTerm")) {
      searchProducts(localStorage.getItem("searchTerm"));
    } else {
      loadProducts();
    }
  }, [localStorage.getItem("searchTerm"), localStorage.getItem("selectedCategoryId"), page]);

  const fetchData = async () => {
    try {
      const [brandsRes, typesRes, linesRes] = await Promise.all([
        http.get("/api/dongdt"),
        http.get("/api/loaidt"),
        http.get("/api/danhmucsp"),
      ]);
      setBrands(brandsRes.data.map((i) => ({ value: i.idDongDT, label: i.tenDongDT })));
      setPhoneTypes(typesRes.data.map((i) => ({ value: i.idLoaiDT, label: i.tenLoaiDienThoai })));
      setProductLines(linesRes.data.map((i) => ({ value: i.idDanhMuc, label: i.tenDanhMuc })));
      setFilters({ brand: [], type: [], line: [] });
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const clickPage = (e) => setPage(parseInt(e.target.text));

  const loadProducts = () => {
    http.get("/api/sanpham").then((res) => {
      setProducts(res.data);
      setTotalPages(Math.ceil(res.data.length / value));
      setNoProducts(false);
      setFilters({ brand: [], type: [], line: [] });
    });
  };

  const loadProductsFromCate = () => {
    const id = localStorage.getItem("selectedCategoryId");
    http.get(`/api/sanpham/danhmuc/${id}`).then((res) => {
      setProducts(res.data);
      setTotalPages(Math.ceil(res.data.length / value));
      setNoProducts(false);
      setFilters({ brand: [], type: [], line: [] });
    });
  };

  const handleFilterChange = (filterType, selectedOptions) => {
    setFilters((prev) => ({ ...prev, [filterType]: selectedOptions.map((o) => o.value) }));
  };

  const handleApplyFilters = () => {
    localStorage.removeItem("searchTerm");
    localStorage.removeItem("selectedCategoryId");
    const { brand, type, line } = filters;
    let params = "";
    if (brand.length) params += `idDongDT=${brand.join(",")}&`;
    if (type.length)  params += `idLoaiDT=${type.join(",")}&`;
    if (line.length)  params += `idDanhMuc=${line.join(",")}`;
    if (params.endsWith("&")) params = params.slice(0, -1);
    http.get(`/api/sanpham/filter?${params}`).then((res) => {
      if (res.data === false) { setNoProducts(true); setProducts([]); setTotalPages(1); }
      else { setProducts(res.data); setTotalPages(Math.ceil(res.data.length / value)); setNoProducts(false); }
    });
  };

  const searchProducts = (term) => {
    http.get(`/api/sanpham/search/${encodeURIComponent(term)}`).then((res) => {
      setProducts(res.data);
      setTotalPages(Math.ceil(res.data.length / value));
      setNoProducts(false);
      setFilters({ brand: [], type: [], line: [] });
    });
  };

  const formatPrice = (price) =>
    price.toLocaleString("vi-VN", { style: "currency", currency: "VND" });

  const startIndex = (page - 1) * value;
  const currentProducts = products.slice(startIndex, startIndex + value);

  return (
    <>
      <Header />
      <Container fluid className="px-3 px-md-4">
        <Row className="mt-3">
          {/* Filter sidebar - full width on mobile, 2 cols on desktop */}
          <Col xs={12} lg={2} className="mb-3 mb-lg-0" style={{ marginTop: "20px" }}>
            <div className="filter-section">
              <h5>LOẠI ĐIỆN THOẠI</h5>
              <Select isMulti options={phoneTypes}
                value={phoneTypes.filter((o) => filters.type.includes(o.value))}
                onChange={(sel) => handleFilterChange("type", sel)}
                className="basic-multi-select" classNamePrefix="select"
                placeholder="Chọn loại điện thoại" />
            </div>
            <div className="filter-section">
              <h5>DÒNG ĐIỆN THOẠI</h5>
              <Select isMulti options={brands}
                value={brands.filter((o) => filters.brand.includes(o.value))}
                onChange={(sel) => handleFilterChange("brand", sel)}
                className="basic-multi-select" classNamePrefix="select"
                placeholder="Chọn dòng điện thoại" />
            </div>
            <div className="filter-section">
              <h5>DANH MỤC SẢN PHẨM</h5>
              <Select isMulti options={productLines}
                value={productLines.filter((o) => filters.line.includes(o.value))}
                onChange={(sel) => handleFilterChange("line", sel)}
                className="basic-multi-select" classNamePrefix="select"
                placeholder="Chọn danh mục sản phẩm" />
            </div>
            <Button variant="dark" className="apply-filters-btn" onClick={handleApplyFilters}>
              Áp dụng
            </Button>
          </Col>

          {/* Products grid - FIX: dùng xs/sm/md thay vì chỉ md */}
          <Col xs={12} lg={10}>
            <Row className="g-3 mt-1">
              {noProducts ? (
                <Col><p>Không có sản phẩm nào để hiển thị.</p></Col>
              ) : currentProducts.length > 0 ? (
                currentProducts.map((product) => (
                  <Col xs={12} sm={6} md={4} key={product.idSanPham} className="d-flex">
                    <Card style={{ width: "100%", marginTop: "10px" }} className="flex-fill">
                      <Link to={`/sanpham/detail/${product.idSanPham}`} className="text-dark no-underline">
                        <Card.Img variant="top" src={product.hinhSP} className="product-image mb-3" />
                        <Card.Body className="d-flex flex-column">
                          <Card.Title>{product.tenSanPham}</Card.Title>
                          <Card.Text style={{ color: "red" }}>{formatPrice(product.donGia)}</Card.Text>
                        </Card.Body>
                      </Link>
                    </Card>
                  </Col>
                ))
              ) : (
                <Col><p>Không tìm thấy sản phẩm nào với từ khóa "{localStorage.getItem("searchTerm")}".</p></Col>
              )}
            </Row>
            <div className="pagination-container">
              <Pagination>
                {Array.from({ length: totalPages }, (_, i) => (
                  <Pagination.Item key={i + 1} active={i + 1 === page} onClick={clickPage}>{i + 1}</Pagination.Item>
                ))}
              </Pagination>
            </div>
          </Col>
        </Row>
      </Container>
      <Footer />
    </>
  );
};

export default Products;
