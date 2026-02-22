import React, { useState, useEffect } from 'react';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';
import { PublisherService } from '../services/api';
import { useToast } from '../components/Toast';

const Publishers = () => {
    const [publishers, setPublishers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPublisher, setEditingPublisher] = useState(null);
    const [formData, setFormData] = useState({ name: '', establishmentYear: '', address: '' });
    const { addToast } = useToast();

    const columns = [
        { key: 'name', label: 'Ad' },
        { key: 'establishmentYear', label: 'Kuruluş Yılı' },
        { key: 'address', label: 'Adres' }
    ];

    const fetchPublishers = async () => {
        try {
            setLoading(true);
            const response = await PublisherService.getAll();
            setPublishers(response.data);
        } catch (error) {
            addToast('Yayımcılar yüklenirken hata oluştu', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPublishers();
    }, []);

    const handleAdd = () => {
        setEditingPublisher(null);
        setFormData({ name: '', establishmentYear: '', address: '' });
        setIsModalOpen(true);
    };

    const handleEdit = (publisher) => {
        setEditingPublisher(publisher);
        setFormData({
            name: publisher.name,
            establishmentYear: publisher.establishmentYear,
            address: publisher.address
        });
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Bu yayımcıyı silmek istediğinize emin misiniz?')) {
            try {
                await PublisherService.delete(id);
                addToast('Yayımcı başarıyla silindi', 'success');
                fetchPublishers();
            } catch (error) {
                addToast('Silme işlemi başarısız', 'error');
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingPublisher) {
                await PublisherService.update(editingPublisher.id, formData);
                addToast('Yayımcı güncellendi', 'success');
            } else {
                await PublisherService.create(formData);
                addToast('Yeni yayımcı eklendi', 'success');
            }
            setIsModalOpen(false);
            fetchPublishers();
        } catch (error) {
            addToast('İşlem başarısız oldu', 'error');
        }
    };

    return (
        <div className="animate-fade">
            <DataTable
                title="Yayımcı Yönetimi"
                columns={columns}
                data={publishers}
                loading={loading}
                onAdd={handleAdd}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingPublisher ? 'Yayımcı Düzenle' : 'Yeni Yayımcı Ekle'}
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
                        <label>Kuruluş Yılı</label>
                        <input
                            type="number"
                            required
                            value={formData.establishmentYear}
                            onChange={(e) => setFormData({ ...formData, establishmentYear: e.target.value })}
                        />
                    </div>
                    <div className="form-group">
                        <label>Adres</label>
                        <textarea
                            required
                            value={formData.address}
                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
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

export default Publishers;
