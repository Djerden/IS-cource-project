import { Avatar, Rate, Tag } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';

export default function UserCard({ user }) {

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
                return 'Unknown'; // или можно выбросить ошибку, если роль не найдена
        }
    }

    return (
        <Link to={`/profile/${user.username}`} className="block hover:shadow-lg transition-shadow">
            <div className="bg-white shadow-md rounded-lg p-4 mb-4">
                <div className="flex flex-row items-center">
                    {/* Аватар */}
                    <Avatar
                        src={user.profilePicture ? `data:${user.pictureMimeType};base64,${user.profilePicture}` : null}
                        icon={<UserOutlined />}
                        alt="Profile"
                        size={96}
                        className="rounded-full object-cover flex-shrink-0" // flex-shrink-0 чтобы аватар не сжимался
                    />

                    {/* Информация о пользователе */}
                    <div className="flex-1 ml-4">
                        <h3 className="text-lg font-semibold">
                            {user.name} {user.surname} {user.middleName}
                        </h3>
                        <p className="text-gray-500">Username: {user.username}</p>

                        {/* Проверка, забанен ли пользователь */}
                        {user.isBanned ? (
                            <div className="mt-2">
                                <Tag color="red">Заблокирован</Tag>
                                <p className="text-gray-700 mt-1">Причина: {user.banReason}</p>
                            </div>
                        ) : (
                            <div>
                                <p className="text-gray-500">Email: {user.email}</p>
                                <p className="text-gray-500">Role: {getRoleString(user.role)}</p>
                                <div className="mt-2">
                                    <Rate
                                        disabled
                                        allowHalf
                                        defaultValue={user.rating ? user.rating : 0} // Рейтинг из данных пользователя
                                        className="text-sm" // Уменьшаем размер звезд
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Link>
    );
}