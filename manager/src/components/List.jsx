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
        <div className="container mt-4">
            <div className="row justify-content-center">
                <div className="col-md-10">
                    <h1 className="text-center mb-4 text-primary">📱 Danh sách sản phẩm</h1>

                    {/* form tìm kiếm ở đây */}
                    <div className="card mb-4">
                        <div className="card-body">
                            <SearchForm
                                searchName={searchName}
                                setSearchName={setSearchName}
                                searchCategory={searchCategory}
                                setSearchCategory={setSearchCategory}
                                categories={categories}
                                handleResetSearch={handleReset}
                            />
                        </div>
                    </div>

                    {/* thêm mới sản phẩm ở đây */}
                    <div className="text-end mb-3">
                        <Link to="/create" className="btn btn-primary btn-lg">
                            <i className="bi bi-plus-circle me-2"></i>Thêm mới sản phẩm
                        </Link>
                    </div>

                    {filteredProducts.length === 0 ? (
                        <div className="alert alert-info text-center" role="alert">
                            <h4 className="alert-heading">Không có kết quả</h4>
                            <p className="mb-0">Không tìm thấy sản phẩm nào phù hợp với tiêu chí tìm kiếm.</p>
                        </div>
                    ) : (
                        <div className="table-responsive">
                            <table className="table table-striped table-hover">
                                <thead className="table-dark">
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
                                            <td><span className="badge bg-secondary">{index + 1}</span></td>
                                            <td><strong>{prod.maSanPham}</strong></td>
                                            <td>{prod.tenSanPham}</td>
                                            <td><span className="badge bg-info">{getTenLoai(prod.theLoaiId)}</span></td>
                                            <td><span className="badge bg-success">{prod.soLuong}</span></td>
                                            <td><strong className="text-danger">{prod.gia.toLocaleString()} ₫</strong></td>
                                            <td>{new Date(prod.ngayNhap).toLocaleDateString()}</td>
                                            <td><small className="text-muted">{prod.moTaSanPham}</small></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}


