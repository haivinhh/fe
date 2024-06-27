import React, { useState, useEffect } from "react";
import Form from 'react-bootstrap/Form';
import http from "../HTTP/http";
import "../CSS/filter.css"; // Import CSS file for additional styling

const Filter = ({ onChange }) => {
  const [brands, setBrands] = useState([]);
  const [phoneTypes, setPhoneTypes] = useState([]);
  const [productLines, setProductLines] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const brandsResponse = await http.get("/api/dongdt");
        setBrands(brandsResponse.data);

        const phoneTypesResponse = await http.get("/api/loaiDT");
        setPhoneTypes(phoneTypesResponse.data);

        const productLinesResponse = await http.get("/api/danhmucsp");
        setProductLines(productLinesResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="filter-container d-flex flex-column mt-4">
      <div className="filter-section">
        <h5>Chọn dòng điện thoại</h5>
        {brands.map((brand) => (
          <Form.Check 
            key={brand.idDongDT} 
            type="checkbox" 
            id={`brand-${brand.idDongDT}`} 
            label={brand.tenDongDT} 
            onChange={() => onChange('brand', brand.idDongDT)} 
          />
        ))}
      </div>

      <div className="filter-section">
        <h5>Chọn loại điện thoại</h5>
        {phoneTypes.map((type) => (
          <Form.Check 
            key={type.idLoaiDT} 
            type="checkbox" 
            id={`type-${type.idLoaiDT}`} 
            label={type.tenLoaiDienThoai} 
            onChange={() => onChange('type', type.idLoaiDT)} 
          />
        ))}
      </div>

      <div className="filter-section">
        <h5>Chọn dòng sản phẩm</h5>
        {productLines.map((line) => (
          <Form.Check 
            key={line.idDanhMuc} 
            type="checkbox" 
            id={`line-${line.idDanhMuc}`} 
            label={line.tenDanhMuc} 
            onChange={() => onChange('line', line.idDanhMuc)} 
          />
        ))}
      </div>
    </div>
  );
};

export default Filter;
