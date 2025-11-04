import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import SearchForm from "./SearchForm";


export default function List() {
    const [product, setProduct] = useState([])
    const [categories, setCategories] = useState([])

    // state tìm kiếm
    const [searchName, setSearchName] = useState("");
    const [searchCategory, setSearchCategory] = useState("");
    const [filteredProducts, setFilteredProducts] = useState([]);

    useEffect(() => {
        // fetch product và categories
        Promise.all([
            axios.get("http://localhost:3000/products"),
            axios.get("http://localhost:3000/categories")
        ]).then(([productRes, categoryRes]) => {
            setProduct(productRes.data);
            setCategories(categoryRes.data);
        });
    }, []);

    // lọc sản phẩm khi search thay đổi
    useEffect(() => {
        let filtered = product;


        // tìm kiếm theo tên sản phẩm gần đúng
        if (searchName.trim() !== "") {
            filtered = filtered.filter(p =>
                p.tenSanPham.toLowerCase().includes(searchName.toLowerCase().trim())
            );
        }

        // tim kiếm theo thể loại
        if (searchCategory !== "") {
            filtered = filtered.filter(p => p.theLoaiId === parseInt(searchCategory));
        }

        setFilteredProducts(filtered);
    }, [searchName, searchCategory, product]);

    // hàm lấy tên loại sp theo id
    const getTenLoai = (theLoaiId) => {
        const category = categories.find(c => parseInt(c.id) === theLoaiId);
        return category ? category.tenTheLoai : "Chưa xác định";
    };

    // hàm reset tìm kiếm
    const handleReset = () => {
        setSearchName("");
        setSearchCategory("");
    };

    return (
        <div>
            <h1>Danh sách sản phẩm</h1>

            {/* form tìm kiếm ở đây */}
            <SearchForm
                searchName={searchName}
                setSearchName={setSearchName}
                searchCategory={searchCategory}
                setSearchCategory={setSearchCategory}
                categories={categories}
                handleResetSearch={handleReset}
            />

            {/* thêm mới sản phẩm ở đây */}
            <Link to="/create"><button>Thêm mới</button></Link>

            {filteredProducts.length === 0 ? (
                <p style={{ textAlign: 'center', color: '#666', fontSize: '18px', marginTop: '20px' }}>
                    Không có kết quả tìm kiếm phù hợp
                </p>
            ) : (
                <table>
                    <thead>
                        <tr>
                            <th>STT</th>
                            <th>Mã sản phẩm</th>
                            <th>Tên sản phẩm</th>
                            <th>Thể loại</th>
                            <th>Số lượng</th>
                            <th>Giá</th>
                            <th>Ngày Nhập</th>
                            <th>Mô tả</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredProducts.map((prod, index) => (
                            <tr key={prod.id}>
                                <td>{index + 1}</td>
                                <td>{prod.maSanPham}</td>
                                <td>{prod.tenSanPham}</td>
                                <td>{getTenLoai(prod.theLoaiId)}</td>
                                <td>{prod.soLuong}</td>
                                <td>{prod.gia.toLocaleString()}</td>
                                <td>{new Date(prod.ngayNhap).toLocaleDateString()}</td>
                                <td>{prod.moTaSanPham}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}


