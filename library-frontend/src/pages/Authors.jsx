import React, { useState, useEffect } from 'react';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';
import { AuthorService } from '../services/api';
import { useToast } from '../components/Toast';

const Authors = () => {
    const [authors, setAuthors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingAuthor, setEditingAuthor] = useState(null);
    const [formData, setFormData] = useState({ name: '', birthDate: '', country: '' });
    const { addToast } = useToast();

    const columns = [
        { key: 'name', label: 'Ad Soyad' },
        { key: 'birthDate', label: 'Doğum Tarihi' },
        { key: 'country', label: 'Ülke' }
    ];

    const fetchAuthors = async () => {
        try {
            setLoading(true);
            const response = await AuthorService.getAll();
            setAuthors(response.data);
        } catch (error) {
            addToast('Yazarlar yüklenirken hata oluştu', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAuthors();
    }, []);

    const handleAdd = () => {
        setEditingAuthor(null);
        setFormData({ name: '', birthDate: '', country: '' });
        setIsModalOpen(true);
    };

    const handleEdit = (author) => {
        setEditingAuthor(author);
        setFormData({
            name: author.name,
            birthDate: author.birthDate,
            country: author.country
        });
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Bu yazarı silmek istediğinize emin misiniz?')) {
            try {
                await AuthorService.delete(id);
                addToast('Yazar başarıyla silindi', 'success');
                fetchAuthors();
            } catch (error) {
                addToast('Silme işlemi başarısız', 'error');
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingAuthor) {
                await AuthorService.update(editingAuthor.id, formData);
                addToast('Yazar güncellendi', 'success');
            } else {
                await AuthorService.create(formData);
                addToast('Yeni yazar eklendi', 'success');
            }
            setIsModalOpen(false);
            fetchAuthors();
        } catch (error) {
            addToast('İşlem başarısız oldu', 'error');
        }
    };

    return (
        <div className="animate-fade">
            <DataTable
                title="Yazar Yönetimi"
                columns={columns}
                data={authors}
                loading={loading}
                onAdd={handleAdd}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingAuthor ? 'Yazar Düzenle' : 'Yeni Yazar Ekle'}
            >
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Ad Soyad</label>
                        <input
                            type="text"
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>
                    <div className="form-group">
                        <label>Doğum Tarihi</label>
                        <input
                            type="date"
                            required
                            value={formData.birthDate}
                            onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                        />
                    </div>
                    <div className="form-group">
                        <label>Ülke</label>
                        <input
                            type="text"
                            required
                            value={formData.country}
                            onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                        />
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

export default Authors;
