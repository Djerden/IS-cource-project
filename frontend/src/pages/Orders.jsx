import { useEffect, useState } from "react";
import { NavLink, useParams, useNavigate } from "react-router-dom";
import { Row, Col, Card, Button, DatePicker, InputNumber, Select, Spin, Pagination } from "antd";
import ProjectCard from "../components/orders/ProjectCard.jsx";
import { jwtDecode } from "jwt-decode"; // Импортируем новый компонент

const { Option } = Select;
const { RangePicker } = DatePicker;

export default function Orders() {
    const token = localStorage.getItem('jwt');
    const decodedToken = jwtDecode(token); // Декодируем токен
    const userRole = decodedToken?.role; // Получаем роль пользователя
    // Проверяем, авторизован ли пользователь и не является ли он фрилансером
    const shouldShowCreateButton = token && userRole !== "ROLE_FREELANCER";

    const [categories, setCategories] = useState([]);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const { categoryId } = useParams(); // Получаем categoryId из URL
    const navigate = useNavigate(); // Хук для навигации

    // Состояния для фильтров и сортировки
    const [minBudget, setMinBudget] = useState(null);
    const [maxBudget, setMaxBudget] = useState(null);
    const [deadlineRange, setDeadlineRange] = useState([]);
    const [sortBy, setSortBy] = useState("createdAt");
    const [sortDirection, setSortDirection] = useState("desc");

    // Состояния для пагинации
    const [currentPage, setCurrentPage] = useState(1); // Текущая страница
    const [pageSize, setPageSize] = useState(10); // Количество элементов на странице
    const [totalProjects, setTotalProjects] = useState(0); // Общее количество проектов

    useEffect(() => {
        // Загружаем категории или подкатегории
        if (categoryId) {
            fetchSubCategories(categoryId);
        } else {
            fetchCategories();
        }

        // Загружаем заказы с фильтрами
        fetchOrders();
    }, [categoryId, minBudget, maxBudget, deadlineRange, sortBy, sortDirection, currentPage, pageSize]);

    const fetchCategories = async () => {
        const response = await fetch('http://localhost:8080/category');
        if (!response.ok) {
            throw new Error('Failed to fetch categories');
        }
        const data = await response.json();
        setCategories(data);
    };

    const fetchSubCategories = async (categoryId) => {
        const response = await fetch(`http://localhost:8080/category?parentId=${categoryId}`);
        if (!response.ok) {
            throw new Error('Failed to fetch subcategories');
        }
        const data = await response.json();
        setCategories(data); // Подкатегории заменяют категории
    };

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams({
                categoryId: categoryId || "",
                minBudget: minBudget || "",
                maxBudget: maxBudget || "",
                deadlineStart: deadlineRange[0] ? deadlineRange[0].toISOString() : "",
                deadlineEnd: deadlineRange[1] ? deadlineRange[1].toISOString() : "",
                sortBy,
                sortDirection,
                page: currentPage - 1, // Страницы на сервере начинаются с 0
                size: pageSize,
            });

            const response = await fetch(`http://localhost:8080/project/filter?${params.toString()}`);
            if (!response.ok) {
                throw new Error('Failed to fetch orders');
            }
            const data = await response.json();
            setOrders(data.content); // Устанавливаем заказы
            setTotalProjects(data.totalElements); // Устанавливаем общее количество проектов
        } catch (error) {
            console.error('Error fetching orders:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCategoryClick = (categoryId) => {
        navigate(`/orders/${categoryId}`);
    };

    // Обработчик изменения страницы
    const handlePageChange = (page, pageSize) => {
        setCurrentPage(page);
        setPageSize(pageSize);
    };

    return (
        <div className="container mx-auto p-4">
            <Row gutter={16}>
                <Col span={18}>
                    <h1 className="text-3xl font-semibold mb-6">{categoryId ? 'Заказы из категории' : 'Все заказы'}</h1>
                    {shouldShowCreateButton && (
                        <NavLink to="/project/create">
                            <Button type="primary">Создать заказ</Button>
                        </NavLink>
                    )}

                    {/* Блок с категориями или подкатегориями */}
                    <Card title={categoryId ? 'Подкатегории' : 'Категории'} className="mb-6">
                        <Row gutter={[16, 16]}>
                            {categories.map((category) => (
                                <Col span={4.8} key={category.id}> {/* 5 категорий в ряд */}
                                    <Button block onClick={() => handleCategoryClick(category.id)}>
                                        {category.name}
                                    </Button>
                                </Col>
                            ))}
                        </Row>
                    </Card>

                    {/* Список заказов */}
                    <Spin spinning={loading}>
                        <Row gutter={[16, 16]}>
                            {orders.map((order) => (
                                <Col span={24} key={order.id}>
                                    <ProjectCard project={order} /> {/* Используем новый компонент */}
                                </Col>
                            ))}
                        </Row>
                    </Spin>

                    {/* Пагинация */}
                    <div className="mt-6 flex justify-center">
                        <Pagination
                            current={currentPage}
                            pageSize={pageSize}
                            total={totalProjects}
                            onChange={handlePageChange}
                            showSizeChanger
                            onShowSizeChange={(current, size) => setPageSize(size)}
                        />
                    </div>
                </Col>

                {/* Блок с фильтрами и сортировкой */}
                <Col span={6}>
                    <Card title="Фильтры и сортировка">
                        <Select
                            placeholder="Сортировать по"
                            style={{ width: '100%' }}
                            className="mb-4"
                            value={sortBy}
                            onChange={(value) => setSortBy(value)}
                        >
                            <Option value="budget">Бюджет</Option>
                            <Option value="createdAt">Дата создания</Option>
                        </Select>

                        <Select
                            placeholder="Направление сортировки"
                            style={{ width: '100%' }}
                            className="mb-4"
                            value={sortDirection}
                            onChange={(value) => setSortDirection(value)}
                        >
                            <Option value="asc">По возрастанию</Option>
                            <Option value="desc">По убыванию</Option>
                        </Select>

                        <RangePicker
                            style={{ width: '100%' }}
                            className="mb-4"
                            onChange={(dates) => setDeadlineRange(dates)}
                        />

                        {/* Заменяем Slider на два InputNumber */}
                        <div className="flex gap-2 mb-4">
                            <InputNumber
                                placeholder="От"
                                style={{ width: '100%' }}
                                value={minBudget}
                                onChange={(value) => setMinBudget(value)}
                            />
                            <InputNumber
                                placeholder="До"
                                style={{ width: '100%' }}
                                value={maxBudget}
                                onChange={(value) => setMaxBudget(value)}
                            />
                        </div>

                        <Button type="primary" block onClick={fetchOrders}>
                            Применить фильтры
                        </Button>
                    </Card>
                </Col>
            </Row>
        </div>
    );
}