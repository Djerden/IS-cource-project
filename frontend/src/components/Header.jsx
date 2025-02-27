import { NavLink, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Avatar, Dropdown, Menu } from 'antd';
import { UserOutlined, SettingOutlined, LogoutOutlined } from '@ant-design/icons';

export default function Header() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [avatarUrl, setAvatarUrl] = useState(null);

    // Функция для декодирования JWT токена
    const decodeJWT = (token) => {
        try {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const payload = JSON.parse(atob(base64));
            return payload;
        } catch (error) {
            console.error('Error decoding JWT:', error);
            return null;
        }
    };

    // Функция для обновления состояния пользователя
    const updateUserFromToken = () => {
        const token = localStorage.getItem('jwt');
        if (token) {
            const payload = decodeJWT(token);
            if (payload) {
                setUser({
                    id: payload.id,
                    username: payload.username,
                    email: payload.email,
                    role: payload.role,
                });
            }
        } else {
            setUser(null);
            setAvatarUrl(null);
        }
    };

    // Проверка токена и установка пользователя
    useEffect(() => {
        const token = localStorage.getItem('jwt');
        updateUserFromToken(token);

        // Интервал для проверки изменения токена
        const interval = setInterval(() => {
            const currentToken = localStorage.getItem('jwt');
            if (currentToken !== token) {
                updateUserFromToken(currentToken);
            }
        }, 500); // Проверяем каждые 500 мс

        // Очистка интервала при размонтировании компонента
        return () => clearInterval(interval);
    }, []);

    // Обработчик выхода
    const handleLogout = () => {
        localStorage.removeItem('jwt');
        setUser(null);
        setAvatarUrl(null);
        navigate('/sign-in');
    };

    // Меню для Dropdown
    const menu = (
        <Menu>
            <Menu.Item key="profile" onClick={() => navigate(`/profile/${user?.username}`)}>
                <UserOutlined /> Profile
            </Menu.Item>
            <Menu.Item key="settings" onClick={() => navigate('/settings')}>
                <SettingOutlined /> Settings
            </Menu.Item>
            <Menu.Item key="logout" onClick={handleLogout}>
                <LogoutOutlined /> Log out
            </Menu.Item>
        </Menu>
    );

    return (
        <header className="bg-black text-white p-4">
            <div className="container mx-auto flex justify-between items-center">
                <NavLink to="/orders" className="text-3xl font-semibold">
                    <span className="text-indigo-500">Pro</span>
                    <span>Talent</span>
                </NavLink>

                <nav className="space-x-6">
                    <NavLink to="/orders" className="text-white hover:text-indigo-500">
                        Orders
                    </NavLink>
                    <NavLink to="/freelancers" className="text-white hover:text-indigo-500">
                        Freelancers
                    </NavLink>
                    <NavLink to="/blog" className="text-white hover:text-indigo-500">
                        Blog
                    </NavLink>
                    <NavLink to="/help" className="text-white hover:text-indigo-500">
                        Help
                    </NavLink>
                    <NavLink to="/admin-panel" className="text-white hover:text-indigo-500">
                        Admin Panel
                    </NavLink>
                </nav>

                <div className="flex items-center space-x-4" >
                    {user ? (
                        <Dropdown overlay={menu} trigger={['hover']} placement="bottomRight">
                            <div className="flex items-center space-x-2 cursor-pointer">
                                <span className="text-white">{user.username}</span>
                                <Avatar src={avatarUrl} icon={<UserOutlined/>} />
                            </div>
                        </Dropdown>
                    ) : (
                        <>
                            <NavLink to="/sign-in" className="text-white hover:text-indigo-500">
                                Sign in
                            </NavLink>
                            <NavLink to="/sign-up" className="text-white hover:text-indigo-500">
                                Sign up
                            </NavLink>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
}