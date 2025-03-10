import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';

export default function AdminPanelPage() {
    const [stats, setStats] = useState({
        customers: 0,
        freelancers: 0,
        bannedUsers: 0,
        totalUsers: 0,
        completedOrders: 0,
        unassignedOrders: 0,
        inProgressOrders: 0,
        totalOrders: 0,
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const token = localStorage.getItem('jwt');

    // Загрузка статистики
    useEffect(() => {
        const fetchStatistics = async () => {
            try {
                const response = await fetch('http://localhost:8080/admin/statistics', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch statistics');
                }

                const data = await response.json();
                setStats(data);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchStatistics();
    }, [token]);

    if (loading) {
        return <div>Загрузка...</div>;
    }

    if (error) {
        return <div>Ошибка: {error}</div>;
    }

    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-8">Admin Panel</h1>

            {/* Блок с краткой информацией */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                {/* Левая часть: Пользователи */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold text-gray-700 mb-4">Users Overview</h2>
                    <div className="space-y-3">
                        <div className="flex justify-between">
                            <span className="text-gray-600">Customers:</span>
                            <span className="font-medium">{stats.customers}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Freelancers:</span>
                            <span className="font-medium">{stats.freelancers}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Banned Users:</span>
                            <span className="font-medium">{stats.bannedUsers}</span>
                        </div>
                        <div className="flex justify-between border-t pt-3">
                            <span className="text-gray-600 font-semibold">Total Users:</span>
                            <span className="font-bold">{stats.totalUsers}</span>
                        </div>
                    </div>
                </div>

                {/* Правая часть: Заказы */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold text-gray-700 mb-4">Orders Overview</h2>
                    <div className="space-y-3">
                        <div className="flex justify-between">
                            <span className="text-gray-600">Unassigned Orders:</span>
                            <span className="font-medium">{stats.unassignedOrders}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">In Progress Orders:</span>
                            <span className="font-medium">{stats.inProgressOrders}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Completed Orders:</span>
                            <span className="font-medium">{stats.completedOrders}</span>
                        </div>
                        <div className="flex justify-between border-t pt-3">
                            <span className="text-gray-600 font-semibold">Total Orders:</span>
                            <span className="font-bold">{stats.totalOrders}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Блок с ссылками на другие админские интерфейсы */}
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold text-gray-700 mb-4">Admin Interfaces</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <NavLink
                        to="/admin-panel/admins"
                        className="p-4 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition duration-200"
                    >
                        <h3 className="text-lg font-medium">Admins List</h3>
                        <p className="text-sm text-gray-600">Manage administrators</p>
                    </NavLink>
                    <NavLink
                        to="/admin-panel/users"
                        className="p-4 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition duration-200"
                    >
                        <h3 className="text-lg font-medium">Users List</h3>
                        <p className="text-sm text-gray-600">Manage all users</p>
                    </NavLink>
                    <NavLink
                        to="/admin-panel/disputes"
                        className="p-4 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition duration-200"
                    >
                        <h3 className="text-lg font-medium">Disputes List</h3>
                        <p className="text-sm text-gray-600">Resolve disputes</p>
                    </NavLink>
                </div>
            </div>
        </div>
    );
}