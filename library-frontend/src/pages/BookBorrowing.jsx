import React, { useState, useEffect } from 'react';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';
import { BookBorrowingService, BookService } from '../services/api';
import { useToast } from '../components/Toast';

const BookBorrowing = () => {
    const [borrowings, setBorrowings] = useState([]);
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingBorrowing, setEditingBorrowing] = useState(null);
    const [formData, setFormData] = useState({
        borrowerName: '',
        borrowerMail: '',
        borrowingDate: '',
        returnDate: '',
        bookForBorrowingRequest: { id: '' }
    });
    const { addToast } = useToast();

    const columns = [
        { key: 'borrowerName', label: 'Ödünç Alan' },
        { key: 'borrowerMail', label: 'E-Posta' },
        { key: 'book', label: 'Kitap', render: (val) => val?.name || '-' },
        { key: 'borrowingDate', label: 'Ödünç Tarihi' },
        { key: 'returnDate', label: 'İade Tarihi', render: (val) => val || <span style={{ color: 'var(--warning)' }}>İade Edilmedi</span> }
    ];

    const fetchData = async () => {
        try {
            setLoading(true);
            const [borrowingsRes, booksRes] = await Promise.all([
                BookBorrowingService.getAll(),
                BookService.getAll()
            ]);
            setBorrowings(borrowingsRes.data);
            setBooks(booksRes.data);
        } catch (error) {
            addToast('Veriler yüklenirken hata oluştu', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleAdd = () => {
        setEditingBorrowing(null);
        setFormData({
            borrowerName: '',
            borrowerMail: '',
            borrowingDate: new Date().toISOString().split('T')[0],
            returnDate: '',
            bookForBorrowingRequest: { id: '' }
        });
        setIsModalOpen(true);
    };

    const handleEdit = (borrowing) => {
        setEditingBorrowing(borrowing);
        setFormData({
            borrowerName: borrowing.borrowerName,
            borrowerMail: borrowing.borrowerMail,
            borrowingDate: borrowing.borrowingDate,
            returnDate: borrowing.returnDate || '',
            bookForBorrowingRequest: { id: borrowing.book?.id || '' }
        });
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Bu ödünç kaydını silmek istediğinize emin misiniz?')) {
            try {
                await BookBorrowingService.delete(id);
                addToast('Ödünç kaydı başarıyla silindi', 'success');
                fetchData();
            } catch (error) {
                addToast('Silme işlemi başarısız', 'error');
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingBorrowing) {
                // Backend update expects BookBorrowingUpdateRequest
                const updateData = {
                    borrowerName: formData.borrowerName,
                    borrowerMail: formData.borrowerMail,
                    borrowingDate: formData.borrowingDate,
                    returnDate: formData.returnDate || null
                };
                await BookBorrowingService.update(editingBorrowing.id, updateData);
                addToast('Ödünç kaydı güncellendi', 'success');
            } else {
                await BookBorrowingService.create(formData);
                addToast('Kitap başarıyla ödünç verildi', 'success');
            }
            setIsModalOpen(false);
            fetchData();
        } catch (error) {
            const msg = error.response?.data?.message || 'İşlem başarısız oldu';
            addToast(msg, 'error');
        }
    };

    return (
        <div className="animate-fade">
            <DataTable
                title="Kitap Ödünç Yönetimi"
                columns={columns}
                data={borrowings}
                loading={loading}
                onAdd={handleAdd}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingBorrowing ? 'Ödünç Kaydı Düzenle' : 'Yeni Ödünç Ver'}
            >
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Ödünç Alan Adı</label>
                        <input
                            type="text"
                            required
                            value={formData.borrowerName}
                            onChange={(e) => setFormData({ ...formData, borrowerName: e.target.value })}
                        />
                    </div>
                    <div className="form-group">
                        <label>E-Posta</label>
                        <input
                            type="email"
                            required
                            value={formData.borrowerMail}
                            onChange={(e) => setFormData({ ...formData, borrowerMail: e.target.value })}
                        />
                    </div>
                    <div className="form-group">
                        <label>Ödünç Tarihi</label>
                        <input
                            type="date"
                            required
                            value={formData.borrowingDate}
                            onChange={(e) => setFormData({ ...formData, borrowingDate: e.target.value })}
                        />
                    </div>
                    {!editingBorrowing && (
                        <div className="form-group">
                            <label>Kitap</label>
                            <select
                                required
                                value={formData.bookForBorrowingRequest.id}
                                onChange={(e) => setFormData({ ...formData, bookForBorrowingRequest: { id: e.target.value } })}
                            >
                                <option value="">Kitap Seçiniz</option>
                                {books.filter(b => b.stock > 0).map(b => (
                                    <option key={b.id} value={b.id}>{b.name} (Stok: {b.stock})</option>
                                ))}
                            </select>
                        </div>
                    )}
                    {editingBorrowing && (
                        <div className="form-group">
                            <label>İade Tarihi</label>
                            <input
                                type="date"
                                value={formData.returnDate}
                                onChange={(e) => setFormData({ ...formData, returnDate: e.target.value })}
                            />
                            <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>* İade tarihi girildiğinde kitap stoğu 1 artacaktır.</p>
                        </div>
                    )}
                    <div className="form-actions">
                        <button type="button" className="cancel-btn" onClick={() => setIsModalOpen(false)}>İptal</button>
                        <button type="submit" className="save-btn">{editingBorrowing ? 'Güncelle' : 'Ödünç Ver'}</button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default BookBorrowing;
