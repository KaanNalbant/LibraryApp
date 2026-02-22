import React, { useState } from 'react';
import { Edit2, Trash2, Search, PlusCircle } from 'lucide-react';
import './DataTable.css';

const DataTable = ({ title, columns, data, onEdit, onDelete, onAdd, loading }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredData = data.filter(item =>
        Object.values(item).some(val =>
            String(val).toLowerCase().includes(searchTerm.toLowerCase())
        )
    );

    return (
        <div className="data-table-container">
            <div className="table-header">
                <div className="header-left">
                    <h2>{title}</h2>
                    <span className="count">{filteredData.length} Kayıt</span>
                </div>

                <div className="header-right">
                    <div className="search-bar">
                        <Search size={18} />
                        <input
                            type="text"
                            placeholder="Ara..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button className="add-btn" onClick={onAdd}>
                        <PlusCircle size={18} />
                        <span>Yeni Ekle</span>
                    </button>
                </div>
            </div>

            <div className="table-wrapper">
                <table>
                    <thead>
                        <tr>
                            {columns.map((col) => (
                                <th key={col.key}>{col.label}</th>
                            ))}
                            <th className="actions-th">İşlemler</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr className="empty-row"><td colSpan={columns.length + 1}>Yükleniyor...</td></tr>
                        ) : filteredData.length > 0 ? (
                            filteredData.map((item, idx) => (
                                <tr key={item.id || idx}>
                                    {columns.map((col) => (
                                        <td key={col.key}>
                                            {col.render ? col.render(item[col.key], item) : item[col.key]}
                                        </td>
                                    ))}
                                    <td className="actions-td">
                                        <button className="edit-icon-btn" onClick={() => onEdit(item)}>
                                            <Edit2 size={16} />
                                        </button>
                                        <button className="delete-icon-btn" onClick={() => onDelete(item.id)}>
                                            <Trash2 size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr className="empty-row"><td colSpan={columns.length + 1}>Kayıt bulunamadı.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default DataTable;
