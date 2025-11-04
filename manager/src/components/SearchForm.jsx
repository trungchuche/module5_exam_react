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
            <input type="text"
                placeholder="Nhập tên sản phẩm"
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)} />
            <select
                value={searchCategory}
                onChange={(e) => setSearchCategory(e.target.value)}
            >
                <option value="">-- Chọn thể loại --</option>
                {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>
                        {cat.tenTheLoai}
                    </option>
                ))}
            </select>
            <button onClick={handleResetSearch}>Reset</button>
        </div>
    );
}
