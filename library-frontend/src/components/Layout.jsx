import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import {
    BarChart3,
    BookOpen,
    Library,
    Tags,
    Users,
    Contact2,
    Home,
    Menu,
    X
} from 'lucide-react';
import './Layout.css';

const Layout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);

    const navItems = [
        { path: '/', icon: <Home size={20} />, label: 'Ana Sayfa' },
        { path: '/books', icon: <BookOpen size={20} />, label: 'Kitaplar' },
        { path: '/authors', icon: <Users size={20} />, label: 'Yazarlar' },
        { path: '/categories', icon: <Tags size={20} />, label: 'Kategoriler' },
        { path: '/publishers', icon: <Library size={20} />, label: 'Yayımcılar' },
        { path: '/borrowing', icon: <BarChart3 size={20} />, label: 'Kitap Ödünç' },
    ];

    return (
        <div className="layout">
            <nav className={`sidebar ${!isSidebarOpen ? 'closed' : ''}`}>
                <div className="sidebar-header">
                    <div className="logo">
                        <Library className="logo-icon" size={32} />
                        <span className="logo-text">LibManager</span>
                    </div>
                    <button className="toggle-btn" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
                        {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                </div>

                <ul className="nav-links">
                    {navItems.map((item) => (
                        <li key={item.path}>
                            <NavLink to={item.path} className={({ isActive }) => isActive ? 'active' : ''}>
                                {item.icon}
                                <span>{item.label}</span>
                            </NavLink>
                        </li>
                    ))}
                </ul>

                <div className="sidebar-footer">
                    <div className="user-info">
                        <Contact2 size={24} />
                        <div>
                            <p className="user-name">Kaan Nalbant</p>
                            <p className="user-role">Administrator</p>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="content">
                <header className="top-header">
                    <h1>Library Management System</h1>
                </header>
                <div className="page-container">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default Layout;
