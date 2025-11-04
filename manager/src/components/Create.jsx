import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

export default function Create() {
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);

    // validate schema với yup
    const validationSchema = Yup.object({
        maSanPham: Yup.string()
            .required("Mã sản phẩm là bắt buộc")
            .matches(/^PROD-\d{4}$/, "Mã sản phẩm phải có định dạng PROD-XXXX (VD: PROD-0001)"),
        tenSanPham: Yup.string()
            .required("Tên sản phẩm là bắt buộc")
            .min(2, "Tên sản phẩm phải có ít nhất 2 ký tự"),
        theLoaiId: Yup.string()
            .required("Thể loại là bắt buộc"),
        gia: Yup.number()
            .required("Giá là bắt buộc")
            .min(1000, "Giá phải lớn hơn 1,000 VNĐ")
            .max(1000000000, "Giá không được vượt quá 1 tỷ VNĐ"),
        soLuong: Yup.number()
            .required("Số lượng là bắt buộc")
            .integer("Số lượng phải là số nguyên")
            .min(0, "Số lượng không được âm"),
        ngayNhap: Yup.date()
            .required("Ngày nhập là bắt buộc")
            .max(new Date(), "Ngày nhập không được lớn hơn ngày hiện tại"),
        moTaSanPham: Yup.string()
            .required("Mô tả sản phẩm là bắt buộc")
            .min(10, "Mô tả phải có ít nhất 10 ký tự")
    });

    useEffect(() => {
        // Load danh sách categories
        axios.get("http://localhost:3000/categories")
            .then(res => setCategories(res.data))
            .catch(err => console.error(err));
    }, []);

    // Xử lý submit form
    const handleSubmit = async (values, { setSubmitting }) => {
        try {
            // Lấy danh sách sản phẩm hiện tại để tìm ID lớn nhất
            const productsResponse = await axios.get("http://localhost:3000/products");
            const products = productsResponse.data;

            // Tìm ID lớn nhất và tạo ID mới (chỉ lấy các ID là số)
            const numericIds = products
                .map(p => p.id)
                .filter(id => id !== null && !isNaN(id) && Number.isInteger(Number(id)))
                .map(id => Number(id));

            const maxId = numericIds.length > 0 ? Math.max(...numericIds) : 0;
            const newId = maxId + 1;

            // Convert theLoaiId về number và các trường khác, thêm ID mới
            const formattedValues = {
                id: newId,
                ...values,
                theLoaiId: parseInt(values.theLoaiId),
                gia: parseFloat(values.gia),
                soLuong: parseInt(values.soLuong)
            };

            await axios.post("http://localhost:3000/products", formattedValues);
            alert("Thêm sản phẩm thành công!");
            navigate("/");
        } catch (error) {
            console.error("Lỗi khi thêm sản phẩm:", error);
            alert("Có lỗi xảy ra khi thêm sản phẩm!");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="container mt-4">
            <div className="row justify-content-center">
                <div className="col-md-8">
                    <div className="card shadow">
                        <div className="card-header bg-primary text-white">
                            <h1 className="card-title mb-0 fs-4">➕ Thêm sản phẩm mới</h1>
                        </div>
                        <div className="card-body">
                            <Formik
                                initialValues={{
                                    maSanPham: "",
                                    tenSanPham: "",
                                    theLoaiId: "",
                                    gia: "",
                                    soLuong: "",
                                    ngayNhap: "",
                                    moTaSanPham: ""
                                }}
                                validationSchema={validationSchema}
                                onSubmit={handleSubmit}
                            >
                                {({ isSubmitting }) => (
                                    <Form>
                                        <div className="row">
                                            <div className="col-md-6">
                                                <div className="mb-3">
                                                    <label className="form-label fw-bold">Mã sản phẩm:</label>
                                                    <Field
                                                        type="text"
                                                        name="maSanPham"
                                                        className="form-control"
                                                        placeholder="VD: PROD-0001"
                                                    />
                                                    <ErrorMessage name="maSanPham" component="div" className="text-danger mt-1 small" />
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="mb-3">
                                                    <label className="form-label fw-bold">Thể loại:</label>
                                                    <Field as="select" name="theLoaiId" className="form-select">
                                                        <option value="">-- Chọn thể loại --</option>
                                                        {categories.map(cat => (
                                                            <option key={cat.id} value={cat.id}>
                                                                {cat.tenTheLoai}
                                                            </option>
                                                        ))}
                                                    </Field>
                                                    <ErrorMessage name="theLoaiId" component="div" className="text-danger mt-1 small" />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="mb-3">
                                            <label className="form-label fw-bold">Tên sản phẩm:</label>
                                            <Field
                                                type="text"
                                                name="tenSanPham"
                                                className="form-control"
                                                placeholder="Nhập tên sản phẩm..."
                                            />
                                            <ErrorMessage name="tenSanPham" component="div" className="text-danger mt-1 small" />
                                        </div>

                                        <div className="row">
                                            <div className="col-md-6">
                                                <div className="mb-3">
                                                    <label className="form-label fw-bold">Giá (VNĐ):</label>
                                                    <Field
                                                        type="number"
                                                        name="gia"
                                                        className="form-control"
                                                        placeholder="0"
                                                    />
                                                    <ErrorMessage name="gia" component="div" className="text-danger mt-1 small" />
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="mb-3">
                                                    <label className="form-label fw-bold">Số lượng:</label>
                                                    <Field
                                                        type="number"
                                                        name="soLuong"
                                                        className="form-control"
                                                        placeholder="0"
                                                    />
                                                    <ErrorMessage name="soLuong" component="div" className="text-danger mt-1 small" />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="mb-3">
                                            <label className="form-label fw-bold">Ngày nhập:</label>
                                            <Field
                                                type="date"
                                                name="ngayNhap"
                                                className="form-control"
                                                max={new Date().toISOString().split('T')[0]}
                                            />
                                            <ErrorMessage name="ngayNhap" component="div" className="text-danger mt-1 small" />
                                        </div>

                                        <div className="mb-4">
                                            <label className="form-label fw-bold">Mô tả sản phẩm:</label>
                                            <Field
                                                as="textarea"
                                                name="moTaSanPham"
                                                rows="4"
                                                className="form-control"
                                                placeholder="Nhập mô tả chi tiết về sản phẩm..."
                                            />
                                            <ErrorMessage name="moTaSanPham" component="div" className="text-danger mt-1 small" />
                                        </div>

                                        <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                                            <button
                                                type="button"
                                                className="btn btn-secondary me-md-2"
                                                onClick={() => navigate("/")}
                                            >
                                                🔙 Quay lại
                                            </button>
                                            <button
                                                type="submit"
                                                className="btn btn-primary"
                                                disabled={isSubmitting}
                                            >
                                                {isSubmitting ? "⏳ Đang thêm..." : "➕ Thêm sản phẩm"}
                                            </button>
                                        </div>
                                    </Form>
                                )}
                            </Formik>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
