import React, { useState, useEffect } from 'react';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';
import { BookService, AuthorService, PublisherService, CategoryService } from '../services/api';
import { useToast } from '../components/Toast';

const Books = () => {
    const [books, setBooks] = useState([]);
    const [authors, setAuthors] = useState([]);
    const [publishers, setPublishers] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingBook, setEditingBook] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        publicationYear: '',
        stock: '',
        author: { id: '' },
        publisher: { id: '' },
        categories: []
    });
    const { addToast } = useToast();

    const columns = [
        { key: 'name', label: 'Kitap Adı' },
        { key: 'author', label: 'Yazar', render: (val) => val?.name || '-' },
        { key: 'publisher', label: 'Yayımcı', render: (val) => val?.name || '-' },
        { key: 'publicationYear', label: 'Yıl' },
        { key: 'stock', label: 'Stok' },
        { key: 'categories', label: 'Kategoriler', render: (val) => val?.map(c => c.name).join(', ') || '-' }
    ];

    const fetchData = async () => {
        try {
            setLoading(true);
            const [booksRes, authorsRes, publishersRes, categoriesRes] = await Promise.all([
                BookService.getAll(),
                AuthorService.getAll(),
                PublisherService.getAll(),
                CategoryService.getAll()
            ]);
            setBooks(booksRes.data);
            setAuthors(authorsRes.data);
            setPublishers(publishersRes.data);
            setCategories(categoriesRes.data);
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
        setEditingBook(null);
        setFormData({
            name: '',
            publicationYear: '',
            stock: '',
            author: { id: '' },
            publisher: { id: '' },
            categories: []
        });
        setIsModalOpen(true);
    };

    const handleEdit = (book) => {
        setEditingBook(book);
        setFormData({
            name: book.name,
            publicationYear: book.publicationYear,
            stock: book.stock,
            author: { id: book.author?.id || '' },
            publisher: { id: book.publisher?.id || '' },
            categories: book.categories?.map(c => ({ id: c.id })) || []
        });
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Bu kitabı silmek istediğinize emin misiniz?')) {
            try {
                await BookService.delete(id);
                addToast('Kitap başarıyla silindi', 'success');
                fetchData();
            } catch (error) {
                addToast('Silme işlemi başarısız', 'error');
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.author.id || !formData.publisher.id) {
            addToast('Lütfen yazar ve yayımcı seçiniz', 'warning');
            return;
        }

        try {
            if (editingBook) {
                await BookService.update(editingBook.id, formData);
                addToast('Kitap güncellendi', 'success');
            } else {
                await BookService.create(formData);
                addToast('Yeni kitap eklendi', 'success');
            }
            setIsModalOpen(false);
            fetchData();
        } catch (error) {
            addToast('İşlem başarısız oldu', 'error');
        }
    };

    const handleCategoryChange = (catId) => {
        const isSelected = formData.categories.some(c => c.id === catId);
        if (isSelected) {
            setFormData({
                ...formData,
                categories: formData.categories.filter(c => c.id !== catId)
            });
        } else {
            setFormData({
                ...formData,
                categories: [...formData.categories, { id: catId }]
            });
        }
    };

    return (
        <div className="animate-fade">
            <DataTable
                title="Kitap Yönetimi"
                columns={columns}
                data={books}
                loading={loading}
                onAdd={handleAdd}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingBook ? 'Kitap Düzenle' : 'Yeni Kitap Ekle'}
            >
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Kitap Adı</label>
                        <input
                            type="text"
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>
                    <div className="form-group">
                        <label>Yıl</label>
                        <input
                            type="number"
                            required
                            value={formData.publicationYear}
                            onChange={(e) => setFormData({ ...formData, publicationYear: e.target.value })}
                        />
                    </div>
                    <div className="form-group">
                        <label>Stok</label>
                        <input
                            type="number"
                            required
                            value={formData.stock}
                            onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                        />
                    </div>
                    <div className="form-group">
                        <label>Yazar</label>
                        <select
                            required
                            value={formData.author.id}
                            onChange={(e) => setFormData({ ...formData, author: { id: e.target.value } })}
                        >
                            <option value="">Yazar Seçiniz</option>
                            {authors.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Yayımcı</label>
                        <select
                            required
                            value={formData.publisher.id}
                            onChange={(e) => setFormData({ ...formData, publisher: { id: e.target.value } })}
                        >
                            <option value="">Yayımcı Seçiniz</option>
                            {publishers.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Kategoriler</label>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', maxHeight: '120px', overflowY: 'auto', padding: '10px', background: 'rgba(0,0,0,0.1)', borderRadius: '8px' }}>
                            {categories.map(c => (
                                <label key={c.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', cursor: 'pointer', textTransform: 'none' }}>
                                    <input
                                        type="checkbox"
                                        style={{ width: 'auto' }}
                                        checked={formData.categories.some(cat => cat.id === c.id)}
                                        onChange={() => handleCategoryChange(c.id)}
                                    />
                                    {c.name}
                                </label>
                            ))}
                        </div>
                    </div>
                    <div className="form-actions">
                        <button type="button" className="cancel-btn" onClick={() => setIsModalOpen(false)}>İptal</button>
                        <button type="submit" className="save-btn">Kaydet</button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default Books;
