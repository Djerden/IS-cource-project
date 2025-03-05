import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, Form, Input, Button, DatePicker, InputNumber, message } from "antd";
import dayjs from "dayjs";
import {jwtDecode} from "jwt-decode";

const { TextArea } = Input;

export default function CreateProjectApplicationPage() {
    const { projectId } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const onFinish = async (values) => {
        setLoading(true);
        try {
            const token = localStorage.getItem('jwt');
            const decodedToken = jwtDecode(token);
            const freelancerUsername = decodedToken.sub; // Имя пользователя из токена

            const response = await fetch(`http://localhost:8080/project-application`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    projectId: parseInt(projectId),
                    freelancerUsername,
                    message: values.message,
                    price: values.price,
                    deadline: values.deadline.format("YYYY-MM-DDTHH:mm:ss"), // Форматируем дату
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to create application');
            }

            message.success('Заявка успешно создана');
            navigate(`/project/${projectId}`); // Возвращаемся на страницу проекта
        } catch (error) {
            console.error('Error creating application:', error);
            message.error('Ошибка при создании заявки');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto p-4">
            <Card title="Создание заявки на проект">
                <Form onFinish={onFinish} layout="vertical">
                    <Form.Item
                        label="Сообщение"
                        name="message"
                        rules={[{ required: true, message: 'Введите сообщение' }]}
                    >
                        <TextArea rows={4} />
                    </Form.Item>

                    <Form.Item
                        label="Цена"
                        name="price"
                        rules={[{ required: true, message: 'Введите цену' }]}
                    >
                        <InputNumber min={0} style={{ width: '100%' }} />
                    </Form.Item>

                    <Form.Item
                        label="Дедлайн"
                        name="deadline"
                        rules={[{ required: true, message: 'Выберите дедлайн' }]}
                    >
                        <DatePicker
                            showTime
                            format="YYYY-MM-DD HH:mm:ss"
                            disabledDate={(current) => current && current < dayjs().startOf('day')}
                            style={{ width: '100%' }}
                        />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" loading={loading}>
                            Создать заявку
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    );
}