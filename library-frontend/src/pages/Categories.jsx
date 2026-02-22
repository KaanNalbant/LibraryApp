import React, { useState, useEffect } from 'react';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';
import { CategoryService } from '../services/api';
import { useToast } from '../components/Toast';

const Categories = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [formData, setFormData] = useState({ name: '', description: '' });
    const { addToast } = useToast();

    const columns = [
        { key: 'name', label: 'Ad' },
        { key: 'description', label: 'Açıklama' }
    ];

    const fetchCategories = async () => {
        try {
            setLoading(true);
            const response = await CategoryService.getAll();
            setCategories(response.data);
        } catch (error) {
            addToast('Kategoriler yüklenirken hata oluştu', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleAdd = () => {
        setEditingCategory(null);
        setFormData({ name: '', description: '' });
        setIsModalOpen(true);
    };

    const handleEdit = (category) => {
        setEditingCategory(category);
        setFormData({
            name: category.name,
            description: category.description
        });
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Bu kategoriyi silmek istediğinize emin misiniz?')) {
            try {
                await CategoryService.delete(id);
                addToast('Kategori başarıyla silindi', 'success');
                fetchCategories();
            } catch (error) {
                addToast('Silme işlemi başarısız', 'error');
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingCategory) {
                await CategoryService.update(editingCategory.id, formData);
                addToast('Kategori güncellendi', 'success');
            } else {
                await CategoryService.create(formData);
                addToast('Yeni kategori eklendi', 'success');
            }
            setIsModalOpen(false);
            fetchCategories();
        } catch (error) {
            addToast('İşlem başarısız oldu', 'error');
        }
    };

    return (
        <div className="animate-fade">
            <DataTable
                title="Kategori Yönetimi"
                columns={columns}
                data={categories}
                loading={loading}
                onAdd={handleAdd}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingCategory ? 'Kategori Düzenle' : 'Yeni Kategori Ekle'}
            >
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Ad</label>
                        <input
                            type="text"
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>
                    <div className="form-group">
                        <label>Açıklama</label>
                        <textarea
                            required
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
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

export default Categories;
