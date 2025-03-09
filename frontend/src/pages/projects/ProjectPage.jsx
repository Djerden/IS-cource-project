import { useEffect, useState } from "react";
import { NavLink, useParams } from "react-router-dom";
import { Card, Typography, Spin, Button, List, message, Modal, Form, InputNumber, DatePicker, Input } from "antd";
import ProjectApplicationCard from "./ProjectApplicationCard.jsx"; // Компонент для заявок

const { Title, Text } = Typography;
const { TextArea } = Input;

export default function ProjectPage() {
    const { projectId } = useParams();
    const [project, setProject] = useState(null);
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalVisible, setIsModalVisible] = useState(false); // Состояние для модального окна
    const [form] = Form.useForm(); // Форма для создания предложения

    const token = localStorage.getItem('jwt');

    // Загрузка данных о проекте
    useEffect(() => {
        const fetchProject = async () => {
            try {
                const response = await fetch(`http://localhost:8080/project/${projectId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`, // Добавляем токен в заголовок
                        'Content-Type': 'application/json',
                    },
                });
                if (!response.ok) {
                    throw new Error('Failed to fetch project');
                }
                const data = await response.json();
                setProject(data);
            } catch (error) {
                console.error('Error fetching project:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProject();
    }, [projectId, token]); // Добавляем token в зависимости

    // Загрузка заявок на проект
    const fetchApplications = async () => {
        try {
            const response = await fetch(`http://localhost:8080/project-application/project/${projectId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`, // Добавляем токен в заголовок
                    'Content-Type': 'application/json',
                },
            });
            if (!response.ok) {
                throw new Error('Failed to fetch applications');
            }
            const data = await response.json();
            setApplications(data);
            console.log(data)
        } catch (error) {
            console.error('Error fetching applications:', error);
        }
    };

    useEffect(() => {
        if (project?.status !== 'COMPLETED') {
            fetchApplications();
        }
    }, [projectId, token]); // Добавляем token в зависимости

    // Открытие модального окна
    const showModal = () => {
        setIsModalVisible(true);
    };

    // Закрытие модального окна
    const handleCancel = () => {
        setIsModalVisible(false);
        form.resetFields(); // Сброс формы
    };

    // Обработка отправки формы
    const handleSubmit = async (values) => {
        try {
            const response = await fetch(`http://localhost:8080/project-application`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    projectId: parseInt(projectId), // Преобразуем projectId в число
                    price: values.price,
                    deadline: values.deadline.format('YYYY-MM-DDTHH:mm:ss'), // Используем правильный формат
                    message: values.message,
                }),
            });

            if (!response.ok) {
                throw new Error('Ошибка при создании предложения');
            }

            message.success('Предложение успешно создано');
            setIsModalVisible(false);
            form.resetFields(); // Сброс формы
            // Обновляем список заявок
            fetchApplications();
        } catch (error) {
            console.error('Ошибка при создании предложения:', error);
            message.error('Не удалось создать предложение');
        }
    };

    if (loading) {
        return <Spin size="large" />;
    }

    if (!project) {
        return <Text>Проект не найден</Text>;
    }

    return (
        <div className="container mx-auto p-4">
            <Title level={2}>{project.title}</Title>

            {/* Информация о проекте */}
            <Card title="Информация о проекте" className="mb-6">
                <Text strong>Категория:</Text> {project.categoryName} <br />
                <Text strong>Описание:</Text> {project.description} <br />
                <Text strong>Бюджет:</Text> ${project.budget} <br />
                <Text strong>Дедлайн:</Text> {new Date(project.deadline).toLocaleDateString()} <br />
                <Text strong>Статус:</Text> {project.status} <br />
                <Text strong>Владелец:</Text> {project.ownerUsername} <br />
                {project.freelancerUsername && (
                    <>
                        <Text strong>Исполнитель:</Text> {project.freelancerUsername} <br />
                    </>
                )}
            </Card>

            {/* Кнопка создания предложения */}
            {project.status !== 'COMPLETED' && (
                <Button type="primary" onClick={showModal}>
                    Создать предложение
                </Button>
            )}

            {/* Кнопка открыть чат */}
            {project.freelancerUsername && (
                <NavLink to={`/chat/${projectId}`}>
                    <Button type="primary">Открыть чат</Button>
                </NavLink>
            )}

            {/* Заявки на проект */}
            {project.status !== 'COMPLETED' && (
                <Card title="Заявки на проект" className="mb-6">
                    <List
                        dataSource={applications}
                        renderItem={(application) => (
                            <List.Item>
                                <ProjectApplicationCard
                                    application={application}
                                    onAccept={() => handleAcceptApplication(application.id)}
                                />
                            </List.Item>
                        )}
                    />
                </Card>
            )}

            {/* Модальное окно для создания предложения */}
            <Modal
                title="Создать предложение"
                visible={isModalVisible}
                onCancel={handleCancel}
                footer={null} // Убираем стандартные кнопки
            >
                <Form form={form} onFinish={handleSubmit}>
                    <Form.Item
                        label="Цена ($)"
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
                        <DatePicker showTime format="YYYY-MM-DDTHH:mm:ss" style={{ width: '100%' }} />
                    </Form.Item>

                    <Form.Item
                        label="Сообщение"
                        name="message"
                        rules={[{ required: true, message: 'Введите сообщение' }]}
                    >
                        <TextArea rows={4} />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            Отправить
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
}