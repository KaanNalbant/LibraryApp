import React, { useState, useEffect } from 'react';
import { BookOpen, Users, Library, BarChart3, ArrowRight } from 'lucide-react';
import { BookService, AuthorService, PublisherService, BookBorrowingService } from '../services/api';
import './Home.css';
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const navigate = useNavigate();
    const [stats, setStats] = useState([
        { label: 'Toplam Kitap', value: '0', icon: <BookOpen />, color: '#6366f1', path: '/books' },
        { label: 'Aktif Yazarlar', value: '0', icon: <Users />, color: '#ec4899', path: '/authors' },
        { label: 'Yayımcılar', value: '0', icon: <Library />, color: '#10b981', path: '/publishers' },
        { label: 'Ödünç Verilen', value: '0', icon: <BarChart3 />, color: '#f59e0b', path: '/borrowing' },
    ]);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const [books, authors, publishers, borrowings] = await Promise.all([
                    BookService.getAll(),
                    AuthorService.getAll(),
                    PublisherService.getAll(),
                    BookBorrowingService.getAll()
                ]);

                setStats([
                    { label: 'Toplam Kitap', value: books.data.length.toString(), icon: <BookOpen />, color: '#6366f1', path: '/books' },
                    { label: 'Aktif Yazarlar', value: authors.data.length.toString(), icon: <Users />, color: '#ec4899', path: '/authors' },
                    { label: 'Yayımcılar', value: publishers.data.length.toString(), icon: <Library />, color: '#10b981', path: '/publishers' },
                    { label: 'Ödünç Verilen', value: borrowings.data.filter(b => !b.returnDate).length.toString(), icon: <BarChart3 />, color: '#f59e0b', path: '/borrowing' },
                ]);
            } catch (error) {
                console.error('Stats fetch error:', error);
            }
        };
        fetchStats();
    }, []);

    return (
        <div className="home-page animate-fade">
            <div className="welcome-banner">
                <h1>Hoş Geldiniz!</h1>
                <p>LibManager Kütüphane Yönetim Paneli üzerinden tüm kayıtları merkezi olarak yönetebilirsiniz.</p>
            </div>

            <div className="stats-grid">
                {stats.map((stat, index) => (
                    <div key={index}
                        className="stat-card"
                        style={{ '--accent': stat.color, cursor: 'pointer' }}
                        onClick={() => navigate(stat.path)}
                    >
                        <div className="stat-icon">{stat.icon}</div>
                        <div className="stat-info">
                            <h3>{stat.value}</h3>
                            <p>{stat.label}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="quick-actions">
                <h2>Hızlı Erişim Menüsü</h2>
                <div className="actions-grid">
                    <div className="action-card" onClick={() => navigate('/books')}>
                        <div className="action-header">
                            <h3>Kitap Yönetimi</h3>
                            <ArrowRight size={18} />
                        </div>
                        <p>Yeni bir kitabı koleksiyona dahil edin, stok ve kategori güncellemeleri yapın.</p>
                    </div>
                    <div className="action-card" onClick={() => navigate('/borrowing')}>
                        <div className="action-header">
                            <h3>Ödünç İşlemleri</h3>
                            <ArrowRight size={18} />
                        </div>
                        <p>Bir üyeye kitap ödünç verin veya iade edilen kitapların kaydını sisteme girin.</p>
                    </div>
                    <div className="action-card" onClick={() => navigate('/authors')}>
                        <div className="action-header">
                            <h3>Yazar Portfolyosu</h3>
                            <ArrowRight size={18} />
                        </div>
                        <p>Kütüphanede eserleri bulunan yazarların biyografik bilgilerini düzenleyin.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
