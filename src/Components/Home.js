import React from 'react';
import Header from '../Common/Header';
import Footer from '../Common/Footer';
import http from '../HTTP/http';
import 'bootstrap/dist/css/bootstrap.min.css';

class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            banners: [],
            products: [], // Khởi tạo state để lưu trữ dữ liệu sản phẩm
        };
    }

    componentDidMount() {
        this.loadBanners();
        this.loadProducts(); // Gọi loadProducts khi component được mount
    }

    loadBanners() {
        http.get(`/banner`).then((response) => {
            console.log('asdsa',response);
            this.setState({ banners: response.data }); // Lưu dữ liệu banner vào state
        }).catch(error => {
            console.error("There was an error fetching the banners!", error);
        });
    }

    loadProducts() {
        http.get(`/sanpham`).then((response) => {
            console.log(response);
            this.setState({ products: response.data }); // Lưu dữ liệu sản phẩm vào state
        }).catch(error => {
            console.error("There was an error fetching the products!", error);
        });
    }

    render() {
        return (
            <>
                <Header />
                <div className="container mt-5">
                    <div id="bannerCarousel" className="carousel slide" data-bs-ride="carousel" data-bs-interval="3000">
                        <div className="carousel-inner">
                            {this.state.banners.map((banner, index) => (
                                <div key={index} className={`carousel-item ${index === 0 ? 'active' : ''}`}>
                                    <iframe src={banner.banner} className="d-block w-100" alt={`Banner ${index + 1}`} />
                                </div>
                            ))}
                        </div>
                        <button className="carousel-control-prev" type="button" data-bs-target="#bannerCarousel" data-bs-slide="prev">
                            <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                            <span className="visually-hidden">Previous</span>
                        </button>
                        <button className="carousel-control-next" type="button" data-bs-target="#bannerCarousel" data-bs-slide="next">
                            <span className="carousel-control-next-icon" aria-hidden="true"></span>
                            <span className="visually-hidden">Next</span>
                        </button>
                    </div>
                    <div className="mt-5">
                        <h2>Products</h2>
                        <div className="row">
                            {this.state.products.map((product) => (
                                <div key={product.idSanPham} className="col-md-4 mb-4">
                                    <div className="card">
                                        <div className="card-body">
                                            <h5 className="card-title">{product.tenSanPham}</h5>
                                            <p className="card-text">{product.thongTinSp}</p>
                                            <p className="card-text"><strong>Price:</strong> {product.donGia}</p>
                                            <p className="card-text"><strong>Quantity:</strong> {product.soLuong}</p>
                                            <p className="card-text"><strong>Category:</strong> {product.danhMucSP}</p>
                                            <p className="card-text"><strong>Brand:</strong> {product.dongDT}</p>
                                            <p className="card-text"><strong>Defective:</strong> {product.hangLoi}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <Footer />
            </>
        );
    }
}

export default Home;
