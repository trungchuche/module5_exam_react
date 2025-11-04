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
            .matches(/^SP\d{3}$/, "Mã sản phẩm phải có định dạng SP### (VD: SP001)"),
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
            .required("Ngày nhập là bắt buộc"),
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
            // Convert theLoaiId về number và các trường khác
            const formattedValues = {
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
        <div>
            <h1>Thêm sản phẩm mới</h1>

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
                        <div>
                            <label>Mã sản phẩm:</label>
                            <Field type="text" name="maSanPham" />
                            <ErrorMessage name="maSanPham" component="div" style={{ color: 'red' }} />
                        </div>

                        <div>
                            <label>Tên sản phẩm:</label>
                            <Field type="text" name="tenSanPham" />
                            <ErrorMessage name="tenSanPham" component="div" style={{ color: 'red' }} />
                        </div>

                        <div>
                            <label>Thể loại:</label>
                            <Field as="select" name="theLoaiId">
                                <option value="">-- Chọn thể loại --</option>
                                {categories.map(cat => (
                                    <option key={cat.id} value={cat.id}>
                                        {cat.tenTheLoai}
                                    </option>
                                ))}
                            </Field>
                            <ErrorMessage name="theLoaiId" component="div" style={{ color: 'red' }} />
                        </div>

                        <div>
                            <label>Giá (VNĐ):</label>
                            <Field type="number" name="gia" />
                            <ErrorMessage name="gia" component="div" style={{ color: 'red' }} />
                        </div>

                        <div>
                            <label>Số lượng:</label>
                            <Field type="number" name="soLuong" />
                            <ErrorMessage name="soLuong" component="div" style={{ color: 'red' }} />
                        </div>

                        <div>
                            <label>Ngày nhập:</label>
                            <Field
                                type="date"
                                name="ngayNhap"
                                max={new Date().toISOString().split('T')[0]}
                            />
                            <ErrorMessage name="ngayNhap" component="div" style={{ color: 'red' }} />
                        </div>

                        <div>
                            <label>Mô tả sản phẩm:</label>
                            <Field as="textarea" name="moTaSanPham" rows="4" />
                            <ErrorMessage name="moTaSanPham" component="div" style={{ color: 'red' }} />
                        </div>

                        <div>
                            <button type="submit" disabled={isSubmitting}>
                                {isSubmitting ? "Đang thêm..." : "Thêm sản phẩm"}
                            </button>
                            <button type="button" onClick={() => navigate("/")}>
                                Hủy
                            </button>
                        </div>
                    </Form>
                )}
            </Formik>
        </div>
    );
}