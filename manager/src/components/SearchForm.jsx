import React from "react";

export default function SearchForm({
    searchName,
    setSearchName,
    searchCategory,
    setSearchCategory,
    categories,
    handleResetSearch
}) {
    return (
        <div>
            <h5 className="card-title mb-3">🔍 Tìm kiếm sản phẩm</h5>
            <div className="row g-3">
                <div className="col-md-5">
                    <label htmlFor="searchName" className="form-label">Tên sản phẩm</label>
                    <input
                        type="text"
                        id="searchName"
                        className="form-control"
                        placeholder="Nhập tên sản phẩm..."
                        value={searchName}
                        onChange={(e) => setSearchName(e.target.value)}
                    />
                </div>
                <div className="col-md-4">
                    <label htmlFor="searchCategory" className="form-label">Thể loại</label>
                    <select
                        id="searchCategory"
                        className="form-select"
                        value={searchCategory}
                        onChange={(e) => setSearchCategory(e.target.value)}
                    >
                        <option value="">-- Tất cả thể loại --</option>
                        {categories.map(cat => (
                            <option key={cat.id} value={cat.id}>
                                {cat.tenTheLoai}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="col-md-3">
                    <label className="form-label">&nbsp;</label>
                    <div className="d-grid">
                        <button
                            className="btn btn-outline-secondary"
                            onClick={handleResetSearch}
                        >
                            🔄 Reset
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
