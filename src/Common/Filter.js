import React, { useState, useEffect } from "react";
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
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
    <div className="filter-container d-flex justify-content-center mt-4">
      <DropdownButton id="dropdown-brand" title="Chọn dòng điện thoại" className="mx-2 custom-dropdown" variant="dark">
        {brands.map((brand) => (
          <Dropdown.Item key={brand.idDongDT} onSelect={() => onChange('brand', brand.idDongDT)}>
            {brand.tenDongDT}
          </Dropdown.Item>
        ))}
      </DropdownButton>

      <DropdownButton id="dropdown-phone-type" title="Chọn loại điện thoại" className="mx-2 custom-dropdown" variant="dark">
        {phoneTypes.map((type) => (
          <Dropdown.Item key={type.idLoaiDT} onSelect={() => onChange('type', type.idLoaiDT)}>
            {type.tenLoaiDienThoai}
          </Dropdown.Item>
        ))}
      </DropdownButton>

      <DropdownButton id="dropdown-product-line" title="Chọn dòng sản phẩm" className="mx-2 custom-dropdown" variant="dark">
        {productLines.map((line) => (
          <Dropdown.Item key={line.idDanhMuc} onSelect={() => onChange('line', line.idDanhMuc)}>
            {line.tenDanhMuc}
          </Dropdown.Item>
        ))}
      </DropdownButton>
    </div>
  );
};

export default Filter;
