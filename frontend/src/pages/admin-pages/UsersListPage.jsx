import { useState, useEffect } from 'react';
import { Input, Select, Pagination, Spin } from 'antd';
import UserCard from './../../components/users/UserCard.jsx';

const { Option } = Select;

export default function UsersListPage() {
    const [users, setUsers] = useState([]); // Список пользователей
    const [loading, setLoading] = useState(false); // Состояние загрузки
    const [page, setPage] = useState(1); // Текущая страница
    const [size, setSize] = useState(10); // Размер страницы
    const [total, setTotal] = useState(0); // Общее количество пользователей
    const [username, setUsername] = useState(''); // Фильтр по username
    const [email, setEmail] = useState(''); // Фильтр по email
    const [sort, setSort] = useState(['createdAt,desc']); // Сортировка (массив строк)
    const [roleFilter, setRoleFilter] = useState('ROLE_CUSTOMER,ROLE_FREELANCER'); // Фильтр по ролям
    const [banFilter, setBanFilter] = useState('ALL'); // Фильтр по статусу бана

    // Загрузка данных пользователей
    const fetchUsers = async () => {
        setLoading(true);
        try {
            const url = new URL('http://localhost:8080/admin/regular-users');

            url.searchParams.set('username', username);
            url.searchParams.set('email', email);
            url.searchParams.set('page', page - 1);
            url.searchParams.set('size', size);

            sort.forEach((s) => url.searchParams.append('sort', s));

            if (roleFilter !== 'ALL') {
                url.searchParams.set('roles', roleFilter);
            }

            if (banFilter !== 'ALL') {
                url.searchParams.set('isBanned', banFilter === 'BANNED');
            }

            console.log('URL:', url.toString()); // Логируем URL для отладки

            // Выполняем запрос
            const response = await fetch(url.toString());
            const data = await response.json();
            setUsers(data.content);
            setTotal(data.totalElements);
        } catch (error) {
            console.error('Ошибка при загрузке пользователей:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, [page, size, username, email, sort, roleFilter, banFilter]);

    return (
        <div className="container mx-auto p-4">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Левая часть: Список пользователей */}
                <div className="lg:col-span-3">
                    <h1 className="text-3xl font-semibold mb-6">Все пользователи</h1>
                    <Spin spinning={loading}>
                        <div className="space-y-4">
                            {users.map((user) => (
                                <UserCard key={user.id} user={user} />
                            ))}
                        </div>
                    </Spin>
                    <div className="mt-6 flex justify-center">
                        <Pagination
                            current={page}
                            pageSize={size}
                            total={total}
                            onChange={(page, size) => {
                                setPage(page);
                                setSize(size);
                            }}
                        />
                    </div>
                </div>

                {/* Правая часть: Фильтры и сортировка */}
                <div className="lg:col-span-1">
                    <div className="bg-white shadow-md rounded-lg p-4">
                        <h2 className="text-xl font-semibold mb-4">Фильтры и сортировка</h2>
                        <div className="space-y-4">
                            {/* Фильтр по username */}
                            <Input
                                placeholder="Поиск по username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full"
                            />

                            {/* Фильтр по email */}
                            <Input
                                placeholder="Поиск по email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full"
                            />

                            {/* Фильтр по ролям */}
                            <Select
                                defaultValue="ROLE_CUSTOMER,ROLE_FREELANCER"
                                className="w-full"
                                onChange={(value) => setRoleFilter(value)}
                            >
                                <Option value="ROLE_CUSTOMER,ROLE_FREELANCER">Заказчики и фрилансеры</Option>
                                <Option value="ROLE_CUSTOMER">Только заказчики</Option>
                                <Option value="ROLE_FREELANCER">Только фрилансеры</Option>
                            </Select>

                            {/* Фильтр по статусу бана */}
                            <Select
                                defaultValue="ALL"
                                className="w-full"
                                onChange={(value) => setBanFilter(value)}
                            >
                                <Option value="ALL">Все пользователи</Option>
                                <Option value="NOT_BANNED">Только активные</Option>
                                <Option value="BANNED">Только забаненные</Option>
                            </Select>

                            {/* Сортировка */}
                            <Select
                                defaultValue="createdAt,desc"
                                className="w-full"
                                onChange={(value) => setSort([value])} // Передаем массив с одним элементом
                            >
                                <Option value="createdAt,desc">Сначала новые</Option>
                                <Option value="createdAt,asc">Сначала старые</Option>
                                <Option value="rating,desc">По рейтингу (убывание)</Option>
                                <Option value="rating,asc">По рейтингу (возрастание)</Option>
                            </Select>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}