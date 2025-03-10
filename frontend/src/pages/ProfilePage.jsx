import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Avatar, Pagination, Rate, Modal, Input, Button } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import ProjectCard from "../components/orders/ProjectCard.jsx";
import {jwtDecode} from 'jwt-decode'; // Импортируем библиотеку для декодирования JWT

export default function ProfilePage() {
    const { username } = useParams();
    const [user, setUser] = useState(null);
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalProjects, setTotalProjects] = useState(0);
    const [isBanModalVisible, setIsBanModalVisible] = useState(false); // Состояние для модального окна бана
    const [banReason, setBanReason] = useState(''); // Состояние для причины бана
    const pageSize = 5; // Количество проектов на странице

    const token = localStorage.getItem('jwt');
    const decodedToken = token ? jwtDecode(token) : null; // Декодируем токен
    const currentUserRole = decodedToken?.role; // Роль текущего пользователя

    // Функция для преобразования роли в читаемый формат
    function getRoleString(role) {
        switch (role) {
            case 'ROLE_FREELANCER':
                return 'Freelancer';
            case 'ROLE_CUSTOMER':
                return 'Customer';
            case 'ROLE_ADMIN':
                return 'Admin';
            case 'ROLE_MAIN_ADMIN':
                return 'Main Admin';
            default:
                return 'Unknown';
        }
    }

    const fetchUserProfile = async () => {
        try {
            if (!token) {
                throw new Error('Токен не найден');
            }

            const response = await fetch(`http://localhost:8080/info/user/${username}`, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Пользователь не найден');
            }

            const data = await response.json();
            setUser(data);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUserProfile();
    }, [username, token]);

    useEffect(() => {
        const fetchUserProjects = async () => {
            try {
                if (!token) {
                    throw new Error('Токен не найден');
                }

                const response = await fetch(
                    `http://localhost:8080/project/user/${username}?page=${currentPage - 1}&size=${pageSize}`,
                    {
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    }
                );

                if (!response.ok) {
                    throw new Error('Не удалось загрузить проекты');
                }

                const data = await response.json();
                setProjects(data.content);
                setTotalProjects(data.totalElements);
            } catch (error) {
                setError(error.message);
            }
        };

        fetchUserProjects();
    }, [username, token, currentPage]);

    // Функция для бана пользователя
    const handleBan = async () => {
        try {
            const response = await fetch('http://localhost:8080/admin/ban', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    userId: user.id,
                    banReason: banReason,
                }),
            });

            if (!response.ok) {
                throw new Error('Ошибка при бане пользователя');
            }

            const data = await response.json();
            alert(data.message);
            setIsBanModalVisible(false);
            setBanReason('');
            // Обновляем данные пользователя
            fetchUserProfile();
        } catch (error) {
            alert(error.message);
        }
    };

    // Функция для разбана пользователя
    const handleUnban = async () => {
        try {
            const response = await fetch(`http://localhost:8080/admin/unban/${user.id}`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error('Ошибка при разбане пользователя');
            }

            const data = await response.json();
            alert(data.message);
            // Обновляем данные пользователя
            fetchUserProfile();
        } catch (error) {
            alert(error.message);
        }
    };

    // Функция для назначения администратора
    const handleGrantAdmin = async () => {
        try {
            const response = await fetch(`http://localhost:8080/admin/grant-admin/${user.id}`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error('Ошибка при назначении администратора');
            }

            const data = await response.json();
            alert(data.message);
            // Обновляем данные пользователя
            fetchUserProfile();
        } catch (error) {
            alert(error.message);
        }
    };

    // Функция для назначения администратора
    const handleGrantMainAdmin = async () => {
        try {
            const response = await fetch(`http://localhost:8080/admin/grant-main-admin/${user.id}`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error('Ошибка при назначении администратора');
            }

            const data = await response.json();
            alert(data.message);
            // Обновляем данные пользователя
            fetchUserProfile();
        } catch (error) {
            alert(error.message);
        }
    };

    // Функция для снятия прав администратора
    const handleRevokeAdmin = async () => {
        try {
            const response = await fetch(`http://localhost:8080/admin/revoke-admin/${user.id}`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error('Ошибка при снятии прав администратора');
            }

            const data = await response.json();
            alert(data.message);
            // Обновляем данные пользователя
            fetchUserProfile();
        } catch (error) {
            alert(error.message);
        }
    };

    if (loading) {
        return <div>Загрузка...</div>;
    }

    if (error) {
        return <div>Ошибка: {error}</div>;
    }

    if (!user) {
        return <div>Пользователь не найден</div>;
    }

    return (
        <div className="p-8">
            <div className="max-w-4xl mx-auto">
                {user.isBanned ? (
                    <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md mb-8">
                        <h1 className="text-2xl font-bold text-red-600 mb-4">This account is banned</h1>
                        <p className="text-gray-700">{user.banReason}</p>
                    </div>
                ) : null}
                {/* Блок с основной информацией о пользователе */}
                <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                    <h1 className="text-2xl font-bold text-gray-800 mb-6">Profile</h1>
                    <div className="flex flex-col md:flex-row items-start space-y-6 md:space-y-0 md:space-x-6">

                        {/* Аватар */}
                        <div className="flex-shrink-0">
                            <Avatar
                                src={user.profilePicture ? `data:${user.pictureMimeType};base64,${user.profilePicture}` : null}
                                icon={<UserOutlined />}
                                alt="Profile"
                                size={150}
                                className="rounded-full object-cover"
                            />
                        </div>

                        {/* Информация о пользователе */}
                        <div className="flex-grow">
                            <h2 className="text-xl font-semibold text-gray-800">
                                {user.name} {user.middleName} {user.surname}
                            </h2>
                            <p className="text-gray-600">Username: {user.username}</p>
                            <p className="text-gray-600">Email: {user.email}</p>
                            <p className="text-gray-600 capitalize">Role: {getRoleString(user.role)}</p>

                            {/* Описание */}
                            {user.description && (
                                <p className="mt-4 text-gray-700">{user.description}</p>
                            )}

                            {/* Рейтинг пользователя */}
                            <div className="mt-2">
                                <Rate disabled defaultValue={user.rating || 0} />
                                <span className="ml-2 text-gray-600">({user.rating || 0})</span>
                            </div>

                            {/* Кнопки управления пользователем */}
                            <div className="mt-4 space-x-2">
                                {(currentUserRole === 'ROLE_ADMIN' || currentUserRole === 'ROLE_MAIN_ADMIN') && (
                                    <Button
                                        onClick={user.isBanned ? handleUnban : () => setIsBanModalVisible(true)}
                                        type="primary"
                                        danger={!user.isBanned}
                                    >
                                        {user.isBanned ? 'Разбанить' : 'Забанить'}
                                    </Button>
                                )}

                                {currentUserRole === 'ROLE_MAIN_ADMIN' && (user.role === 'ROLE_CUSTOMER' || user.role === 'ROLE_FREELANCER') && (
                                    <Button onClick={handleGrantAdmin} type="primary">
                                        Сделать администратором
                                    </Button>
                                )}

                                {currentUserRole === 'ROLE_MAIN_ADMIN' && user.role === 'ROLE_ADMIN' && (
                                    <Button onClick={handleRevokeAdmin} type="primary" danger>
                                        Снять права администратора
                                    </Button>
                                )}

                                {currentUserRole === 'ROLE_MAIN_ADMIN' && user.role === 'ROLE_ADMIN' && (
                                    <Button onClick={handleGrantMainAdmin} type="primary">
                                        Сделать главным администратором
                                    </Button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Навыки (только для фрилансера) */}
                {user.role === 'ROLE_FREELANCER' && user.skills && user.skills.length > 0 && (
                    <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                        <h2 className="text-2xl font-bold text-gray-800 mb-6">Skills</h2>
                        <div className="flex flex-wrap gap-2 mt-2">
                            {user.skills.map((skill, index) => {
                                // Генерация случайного цвета для каждого блока
                                const colors = [
                                    'bg-indigo-100 text-indigo-800',
                                    'bg-green-100 text-green-800',
                                    'bg-yellow-100 text-yellow-800',
                                    'bg-red-100 text-red-800',
                                    'bg-blue-100 text-blue-800',
                                    'bg-purple-100 text-purple-800',
                                ];
                                const colorClass = colors[index % colors.length]; // Циклическое использование цветов

                                return (
                                    <span
                                        key={skill.id} // Используем skill.id как ключ
                                        className={`${colorClass} px-3 py-1 rounded-full text-sm`}
                                    >
                        {skill.name} {/* Отображаем skill.name */}
                    </span>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Блок с историей проектов */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">Project History</h2>
                    <div className="space-y-6">
                        {projects.map((project) => (
                            <ProjectCard key={project.id} project={project} />
                        ))}
                    </div>

                    {/* Пагинация */}
                    <div className="mt-6 flex justify-center">
                        <Pagination
                            current={currentPage}
                            total={totalProjects}
                            pageSize={pageSize}
                            onChange={(page) => setCurrentPage(page)}
                        />
                    </div>
                </div>
            </div>

            {/* Модальное окно для бана */}
            <Modal
                title="Укажите причину бана"
                visible={isBanModalVisible}
                onOk={handleBan}
                onCancel={() => setIsBanModalVisible(false)}
                okText="Забанить"
                cancelText="Отмена"
            >
                <Input
                    placeholder="Причина бана"
                    value={banReason}
                    onChange={(e) => setBanReason(e.target.value)}
                />
            </Modal>
        </div>
    );
}