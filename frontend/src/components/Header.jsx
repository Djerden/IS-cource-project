import { NavLink, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Avatar, Dropdown, Menu } from 'antd';
import { UserOutlined, SettingOutlined, LogoutOutlined } from '@ant-design/icons';
import {jwtDecode} from "jwt-decode";

export default function Header() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);

    const token = localStorage.getItem('jwt');
    const decodedToken = token ? jwtDecode(token) : null; // Декодируем токен
    const currentUserRole = decodedToken?.role; // Роль текущего пользователя

    // Функция для получения данных пользователя (включая баланс и аватар)
    const fetchUserData = async () => {
        const token = localStorage.getItem('jwt');
        if (token) {
            try {
                const response = await fetch('http://localhost:8080/user/get-user-header-info', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                if (response.ok) {
                    const data = await response.json();
                    setUser(data)
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        }
    };

    // Обновляем данные пользователя при монтировании компонента
    useEffect(() => {
        fetchUserData();
    }, []);

    // Обработчик выхода
    const handleLogout = () => {
        localStorage.removeItem('jwt');
        setUser(null);
        navigate('/sign-in');
    };

    // Меню для Dropdown баланса
    const balanceMenu = (
        <Menu>
            <Menu.Item key="deposit" onClick={() => navigate('/balance/deposit')}>
                Deposit
            </Menu.Item>
            <Menu.Item key="withdraw" onClick={() => navigate('/balance/withdraw')}>
                Withdraw
            </Menu.Item>
        </Menu>
    );

    // Меню для Dropdown профиля
    const profileMenu = (
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
                    {(currentUserRole === "ROLE_ADMIN" || currentUserRole === "ROLE_MAIN_ADMIN") &&
                        (<NavLink to="/admin-panel" className="text-white hover:text-indigo-500">
                            Admin Panel
                        </NavLink>
                    )}
                </nav>

                <div className="flex items-center space-x-4">
                    {user ? (
                        <>
                            {/* Блок с балансом */}
                            <Dropdown overlay={balanceMenu} trigger={['hover']} placement="bottomRight">
                                <div className="flex items-center space-x-2 cursor-pointer">
                                    <span className="text-white">Balance: {user.balance ?? 0}$</span>
                                </div>
                            </Dropdown>

                            {/* Блок с профилем и аватаром */}
                            <Dropdown overlay={profileMenu} trigger={['hover']} placement="bottomRight">
                                <div className="flex items-center space-x-2 cursor-pointer">
                                    <span className="text-white">{user.username}</span>
                                    <Avatar
                                        src={user.profilePicture ? `data:${user.pictureMimeType};base64,${user.profilePicture}` : null}
                                        icon={<UserOutlined />}
                                        alt="Profile"
                                        size={40}
                                        className="rounded-full object-cover"
                                    />
                                </div>
                            </Dropdown>
                        </>
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