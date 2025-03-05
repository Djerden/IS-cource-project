import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { DatePicker, Input, InputNumber, Button, notification, Select, Spin } from "antd";
import dayjs from "dayjs"; // Для работы с датами
import { useNavigate } from "react-router-dom";

const { TextArea } = Input;
const { Option } = Select;

export default function CreateProjectPage() {
    const { control, handleSubmit, formState: { errors } } = useForm();
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState([]); // Состояние для хранения категорий
    const [fetchingCategories, setFetchingCategories] = useState(false); // Состояние загрузки категорий
    const navigate = useNavigate();

    // Функция для загрузки категорий
    const fetchCategories = async () => {
        setFetchingCategories(true);
        try {
            const response = await fetch("http://localhost:8080/category/all");
            if (!response.ok) {
                throw new Error("Ошибка при загрузке категорий");
            }
            const data = await response.json();
            setCategories(data);
        } catch (error) {
            notification.error({
                message: "Ошибка",
                description: error.message || "Не удалось загрузить категории",
            });
        } finally {
            setFetchingCategories(false);
        }
    };

    // Загружаем категории при открытии страницы
    useEffect(() => {
        fetchCategories();
    }, []);

    // Функция для отправки данных на сервер
    const onSubmit = async (data) => {
        setLoading(true);

        try {
            const token = localStorage.getItem("jwt");
            if (!token) {
                throw new Error("Токен не найден");
            }

            // Преобразуем дату в формат, который ожидает сервер
            const formattedData = {
                ...data,
                deadline: data.deadline ? data.deadline.toISOString() : null,
            };

            const response = await fetch("http://localhost:8080/project/create", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(formattedData),
            });

            if (!response.ok) {
                throw new Error("Ошибка при создании проекта");
            }

            const result = await response.json();
            notification.success({
                message: "Успех",
                description: result.message || "Проект успешно создан",
            });

            // Перенаправляем пользователя на страницу проектов
            navigate("/orders");
        } catch (error) {
            notification.error({
                message: "Ошибка",
                description: error.message || "Не удалось создать проект",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-semibold mb-6">Создание проекта</h1>

            <form onSubmit={handleSubmit(onSubmit)} className="max-w-2xl mx-auto">
                {/* Поле для выбора категории */}
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Категория</label>
                    <Controller
                        name="categoryId"
                        control={control}
                        rules={{ required: "Выберите категорию" }}
                        render={({ field }) => (
                            <Select
                                {...field}
                                placeholder="Выберите категорию"
                                className="w-full"
                                loading={fetchingCategories} // Показываем индикатор загрузки
                                showSearch
                                optionFilterProp="children"
                                filterOption={(input, option) =>
                                    option.children.toLowerCase().includes(input.toLowerCase())
                                }
                            >
                                {categories.map((category) => (
                                    <Option key={category.id} value={category.id}>
                                        {category.name}
                                    </Option>
                                ))}
                            </Select>
                        )}
                    />
                    {errors.categoryId && (
                        <p className="text-red-500 text-sm mt-1">{errors.categoryId.message}</p>
                    )}
                </div>

                {/* Поле для названия проекта */}
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Название проекта</label>
                    <Controller
                        name="title"
                        control={control}
                        rules={{ required: "Введите название проекта" }}
                        render={({ field }) => (
                            <Input
                                {...field}
                                placeholder="Введите название проекта"
                                className="w-full"
                            />
                        )}
                    />
                    {errors.title && (
                        <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
                    )}
                </div>

                {/* Поле для описания проекта */}
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Описание проекта</label>
                    <Controller
                        name="description"
                        control={control}
                        rules={{ required: "Введите описание проекта" }}
                        render={({ field }) => (
                            <TextArea
                                {...field}
                                placeholder="Введите описание проекта"
                                className="w-full"
                                rows={4}
                            />
                        )}
                    />
                    {errors.description && (
                        <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
                    )}
                </div>

                {/* Поле для бюджета */}
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Бюджет</label>
                    <Controller
                        name="budget"
                        control={control}
                        rules={{ required: "Введите бюджет" }}
                        render={({ field }) => (
                            <InputNumber
                                {...field}
                                placeholder="Введите бюджет"
                                className="w-full"
                                min={0}
                                formatter={(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                            />
                        )}
                    />
                    {errors.budget && (
                        <p className="text-red-500 text-sm mt-1">{errors.budget.message}</p>
                    )}
                </div>

                {/* Поле для дедлайна */}
                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Дедлайн</label>
                    <Controller
                        name="deadline"
                        control={control}
                        render={({ field }) => (
                            <DatePicker
                                {...field}
                                className="w-full"
                                showTime
                                format="YYYY-MM-DD HH:mm:ss"
                                disabledDate={(current) => current && current < dayjs().startOf("day")}
                            />
                        )}
                    />
                </div>

                {/* Кнопка отправки формы */}
                <Button
                    type="primary"
                    htmlType="submit"
                    loading={loading}
                    className="w-full bg-blue-500 hover:bg-blue-600"
                >
                    Создать проект
                </Button>
            </form>
        </div>
    );
}