import { useState, useEffect } from 'react';
import { Input, Select, Pagination, Spin } from 'antd';
import UserCard from './../components/users/UserCard.jsx';

const { Option } = Select;

export default function Freelancers() {
    const [freelancers, setFreelancers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [size, setSize] = useState(10);
    const [total, setTotal] = useState(0);
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [sort, setSort] = useState('createdAt,desc');

    // Загрузка данных фрилансеров
    const fetchFreelancers = async () => {
        setLoading(true);
        try {
            const response = await fetch(
                `http://localhost:8080/user/freelancers?username=${username}&email=${email}&page=${page - 1}&size=${size}&sort=${sort}`
            );
            const data = await response.json();
            setFreelancers(data.content);
            setTotal(data.totalElements);
        } catch (error) {
            console.error('Ошибка при загрузке фрилансеров:', error);
        } finally {
            setLoading(false);
        }
    };

    // Загрузка данных при изменении параметров
    useEffect(() => {
        fetchFreelancers();
    }, [page, size, username, email, sort]);

    return (
        <div className="container mx-auto p-4">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Левая часть: Список фрилансеров */}
                <div className="lg:col-span-3">
                    <h1 className="text-3xl font-semibold mb-6">Фрилансеры</h1>
                    <Spin spinning={loading}>
                        <div className="space-y-4">
                            {freelancers.map((user) => (
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
                            <Input
                                placeholder="Поиск по username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full"
                            />
                            <Input
                                placeholder="Поиск по email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full"
                            />
                            <Select
                                defaultValue="createdAt,desc"
                                className="w-full"
                                onChange={(value) => setSort(value)}
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