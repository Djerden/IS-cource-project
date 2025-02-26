import {useEffect, useState} from "react";
import OrderCard from "../components/orders/OrderCard.jsx";

export default function Orders() {
    const [categories, setCategories] = useState([]);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Запрос на получение категорий
        fetchCategories()
            .then(data => setCategories(data))
            .catch(err => console.error('Error fetching categories:', err));

        // Запрос на получение заказов
        fetchOrders()
            .then(data => setOrders(data))
            .catch(err => console.error('Error fetching orders:', err))
            .finally(() => setLoading(false));
    }, []);

    // api.js
    const fetchCategories = async () => {
        const response = await fetch('/api/categories');
        if (!response.ok) {
            throw new Error('Failed to fetch categories');
        }
        return response.json();
    };

    const fetchOrders = async () => {
        const response = await fetch('/api/orders');
        if (!response.ok) {
            throw new Error('Failed to fetch orders');
        }
        return response.json();
    };



    return (
        <div className="container mx-auto p-4 flex">
            <div className="w-3/4">
                <h1 className="text-3xl font-semibold mb-6">Все заказы</h1>

                {/* Блок с категориями */}
                <div className="mb-6">
                    <h2 className="text-2xl font-medium mb-3">Категории</h2>
                    <div className="flex space-x-4">
                        {categories.map((category) => (
                            <button key={category.id} className="text-white bg-[#8EE4AF] p-2 rounded hover:bg-[#6dbb86]">
                                {category.name}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Список заказов */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {loading ? (
                        <div>Загрузка...</div>
                    ) : (
                        orders.map((order) => (
                            <OrderCard key={order.id} order={order} />
                        ))
                    )}
                </div>
            </div>

            {/* Блок с сортировками и фильтрами (пока пустой) */}
            <div className="w-1/4 pl-8">
                <div className="bg-gray-800 text-white p-4 rounded">
                    <h3 className="text-xl font-semibold">Сортировка и фильтры</h3>
                    {/* Здесь позже будут фильтры и сортировки */}
                </div>
            </div>
        </div>
    );
}