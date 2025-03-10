import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
    Card,
    Typography,
    Spin,
    Button,
    List,
    message,
    Modal,
    Form,
    InputNumber,
    DatePicker,
    Input,
    Space,
    Select
} from "antd";
import ProjectApplicationCard from "./ProjectApplicationCard.jsx";
import { jwtDecode } from "jwt-decode";
import DisputeCard from "./DisputeCard.jsx";
import {Option} from "antd/es/mentions/index.js"; // Компонент для заявок
import SockJS from 'sockjs-client';
import { over } from 'stompjs';


const { Title, Text } = Typography;
const { TextArea } = Input;

export default function ProjectPage() {
    const { projectId } = useParams();
    const [project, setProject] = useState(null);
    const [applications, setApplications] = useState([]);
    const [approvedApplication, setApprovedApplication] = useState(null);
    // Состояние для хранения списка споров
    const [disputes, setDisputes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalVisibleModal, setIsModalVisibleModal] = useState(false);
    const [isTopUpModalVisible, setIsTopUpModalVisible] = useState(false);
    const [isDisputeModalVisible, setIsDisputeModalVisible] = useState(false);
    const [isResolveModalVisible, setIsResolveModalVisible] = useState(false);
    const [files, setFiles] = useState([]);
    const [isFileUploadModalVisible, setIsFileUploadModalVisible] = useState(false);
    const [selectedDispute, setSelectedDispute] = useState(null);
    const [form] = Form.useForm();
    const [topUpForm] = Form.useForm();

    const [isChatModalVisible, setIsChatModalVisible] = useState(false);
    const [messages, setMessages] = useState([]);
    const [stompClient, setStompClient] = useState(null);


    const token = localStorage.getItem('jwt');
    const decodedToken = token ? jwtDecode(token) : null;
    const currentUserRole = decodedToken?.role;
    const currentUserUsername = decodedToken?.username;

    // Запрос на получение данных по проекту
    const fetchProject = async () => {
        try {
            const response = await fetch(`http://localhost:8080/project/${projectId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            if (!response.ok) {
                throw new Error('Failed to fetch project');
            }
            const data = await response.json();
            setProject(data);
            console.log(data);
        } catch (error) {
            console.error('Error fetching project:', error);
        } finally {
            setLoading(false);
        }
    };

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
            console.log(data);
        } catch (error) {
            console.error('Error fetching applications:', error);
        }
    };

    // Функция для получения принятой заявки
    const fetchApprovedApplication = async () => {
        try {
            const response = await fetch(`http://localhost:8080/project-application/project/${projectId}/approved`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Не удалось загрузить принятую заявку');
            }

            const data = await response.json();
            setApprovedApplication(data);
        } catch (error) {
            console.error('Ошибка при загрузке принятой заявки:', error);
            message.error('Не удалось загрузить принятую заявку');
        }
    };

    // Функция для загрузки споров
    const fetchDisputes = async () => {
        try {
            const response = await fetch(`http://localhost:8080/dispute/project/${projectId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Не удалось загрузить споры');
            }

            const data = await response.json();
            setDisputes(data);
        } catch (error) {
            console.error('Ошибка при загрузке споров:', error);
            message.error('Не удалось загрузить споры');
        }
    };

    // Функция для загрузки файлов по проекту
    const fetchFiles = async () => {
        try {
            const response = await fetch(`http://localhost:8080/project-files/project/${projectId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Не удалось загрузить файлы');
            }

            const data = await response.json();
            setFiles(data);
        } catch (error) {
            console.error('Ошибка при загрузке файлов:', error);
            message.error('Не удалось загрузить файлы');
        }
    };

    // Загрузка данных о проекте
    useEffect(() => {
        fetchProject();

        // Все отклики
        if (project?.status === 'PENDING') {
            fetchApplications();
        }
        if (project?.status === 'IN_PROGRESS' || project?.status === 'COMPLETED') {
            fetchApprovedApplication();
        }
        if (project?.status !== 'PENDING') {
            fetchDisputes();
        }
        if (project?.status !== 'PENDING') {
            fetchFiles();
        }

    }, [projectId, token, project?.status]); // Добавляем token в зависимости

    // Открытие модального окна создания заявки
    const showModal = () => {
        setIsModalVisibleModal(true);
    };

    // Закрытие модального окна создания заявки
    const handleCancel = () => {
        setIsModalVisibleModal(false);
        form.resetFields(); // Сброс формы
    };

    // Открытие модального окна пополнения баланса
    const showTopUpModal = () => {
        setIsTopUpModalVisible(true);
    };

    // Закрытие модального окна пополнения баланса
    const handleTopUpCancel = () => {
        setIsTopUpModalVisible(false);
        topUpForm.resetFields(); // Сброс формы
    };

    // Открытие модального окна создания спора
    const showDisputeModal = () => {
        setIsDisputeModalVisible(true);
    };

    // Открытие модального окна для разрешения спора
    const showResolveModal = (dispute) => {
        setSelectedDispute(dispute); // Сохраняем выбранный спор
        setIsResolveModalVisible(true); // Открываем модальное окно
    };

    const showChatModal = () => {
        setIsChatModalVisible(true);
        connectWebSocket();
    };

    const handleChatCancel = () => {
        setIsChatModalVisible(false);
        if (stompClient) {
            stompClient.disconnect();
        }
    };

    const connectWebSocket = () => {
        const socket = new SockJS('http://localhost:8080/ws');
        const client = over(socket);

        client.connect({}, () => {
            setStompClient(client);
            client.subscribe(`/topic/project/${projectId}`, (message) => {
                const newMessage = JSON.parse(message.body);
                setMessages((prevMessages) => [...prevMessages, newMessage]);
            });
        });
    };

    const sendMessage = (content) => {
        if (stompClient && content) {
            const messageDTO = {
                projectId: parseInt(projectId),
                sender: currentUserUsername,
                content: content,
                createdAt: new Date().toISOString()
            };
            stompClient.send("/app/chat.sendMessage", {}, JSON.stringify(messageDTO));
        }
    };

    // Обработка отправки формы для создания заявки (предложения по проекту)
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
            setIsModalVisibleModal(false);
            form.resetFields(); // Сброс формы
            // Обновляем список заявок
            fetchApplications();
        } catch (error) {
            console.error('Ошибка при создании предложения:', error);
            message.error('Не удалось создать предложение');
        }
    };

    // Обработка завершения проекта
    const handleCompleteProject = () => {
        Modal.confirm({
            title: 'Завершение проекта',
            content: 'Вы уверены, что хотите завершить проект?',
            okText: 'Да',
            cancelText: 'Нет',
            onOk: async () => {
                try {
                    const response = await fetch(`http://localhost:8080/project/${projectId}/complete`, {
                        method: 'POST',
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json',
                        },
                    });

                    if (!response.ok) {
                        throw new Error('Ошибка при завершении проекта');
                    }

                    message.success('Проект успешно завершен');
                    fetchProject(); // Обновляем данные проекта
                } catch (error) {
                    console.error('Ошибка при завершении проекта:', error);
                    message.error('Не удалось завершить проект');
                }
            },
        });
    };

    // Обработка отправки формы пополнения баланса
    const handleTopUpSubmit = async (values) => {
        try {
            const response = await fetch(`http://localhost:8080/project/top-up-balance`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    projectId: parseInt(projectId),
                    amount: values.amount,
                }),
            });

            if (!response.ok) {
                throw new Error('Ошибка при пополнении баланса проекта');
            }

            message.success('Баланс проекта успешно пополнен');
            setIsTopUpModalVisible(false);
            topUpForm.resetFields();
            fetchProject();
        } catch (error) {
            console.error('Ошибка при пополнении баланса проекта:', error);
            message.error('Не удалось пополнить баланс проекта');
        }
    };

    // Обработка отправки формы для создания спора
    const handleDisputeSubmit = async (values) => {
        try {
            const response = await fetch(`http://localhost:8080/dispute/create`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    projectId: project.id,
                    comment: values.comment,
                }),
            });

            if (!response.ok) {
                throw new Error('Ошибка при создании спора');
            }

            message.success('Спор успешно создан');
            setIsDisputeModalVisible(false);
        } catch (error) {
            console.error('Ошибка при создании спора:', error);
            message.error('Не удалось создать спор');
        }
    };

    // Обработка отправки формы для разрешения спора
    const handleResolveSubmit = async (values) => {
        try {
            const response = await fetch(`http://localhost:8080/dispute/resolve`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    disputeId: selectedDispute.id,
                    resolution: values.resolution,
                    message: values.message,
                }),
            });

            if (!response.ok) {
                throw new Error('Ошибка при разрешении спора');
            }

            message.success('Спор успешно разрешен');
            setIsResolveModalVisible(false);
            fetchDisputes();
        } catch (error) {
            console.error('Ошибка при разрешении спора:', error);
            message.error('Не удалось разрешить спор');
        }
    };

    // Функция для загрузки файла
    const handleFileUpload = async (file) => {
        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('projectId', projectId);

            const response = await fetch(`http://localhost:8080/project-files/upload`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Ошибка при загрузке файла');
            }

            const data = await response.json();
            setFiles([...files, data]); // Добавляем новый файл в список
            message.success('Файл успешно загружен');
        } catch (error) {
            console.error('Ошибка при загрузке файла:', error);
            message.error('Не удалось загрузить файл');
        }
    };

    // Функция для скачивания файла
    const handleFileDownload = async (fileId) => {
        try {
            const response = await fetch(`http://localhost:8080/project-files/download-url/${fileId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Не удалось получить ссылку для скачивания');
            }

            const { message } = await response.json();
            console.log('Download URL:', message);

            const a = document.createElement('a');
            a.href = message;
            a.download = message.split('/').pop();
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);

        } catch (error) {
            console.error('Ошибка при скачивании файла:', error);
            message.error('Не удалось скачать файл');
        }
    };

    // Функция для удаления файла
    const handleFileDelete = async (fileId) => {
        try {
            const response = await fetch(`http://localhost:8080/project-files/${fileId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Ошибка при удалении файла');
            }

            setFiles(files.filter(file => file.id !== fileId));
            message.success('Файл успешно удален');
        } catch (error) {
            console.error('Ошибка при удалении файла:', error);
            message.error('Не удалось удалить файл');
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
            {/* Заголовок и кнопки */}
            <div className="flex justify-between items-center mb-6">
                <Title level={2}>{project.title}</Title>
                <Space>
                    {/* Кнопка "Открыть чат" только для заказчика и фрилансера */}
                    {project.status !== 'PENDING' && (
                        (currentUserUsername === project.freelancerUsername) || (currentUserUsername === project.ownerUsername)
                    ) && (
                        <Button type="primary" onClick={showChatModal}>Открыть чат</Button>
                    )}

                    {/* Кнопка "Пополнить баланс проекта" доступна только заказчику на этапах PENDING и IN_PROGRESS */}
                    {project.status !== 'COMPLETED' && project.status !== 'CANCELLED' && currentUserUsername === project.ownerUsername && (
                        <Button type="primary" onClick={showTopUpModal}>
                            Пополнить баланс проекта
                        </Button>
                    )}

                    {/* Кнопка "Создать спор" доступна только заказчику и фрилансеру на этапе IN_PROGRESS */}
                    {project.status === 'IN_PROGRESS' && (
                        (currentUserUsername === project.freelancerUsername) || (currentUserUsername === project.ownerUsername)
                    ) && (
                        <Button type="primary" danger onClick={showDisputeModal}>
                            Создать спор
                        </Button>
                    )}

                    {/* Кнопка "Завершить проект" доступна только заказчику на этапе PENDING (если передумал) и IN_PROGRESS */}
                    {(project.status === 'PENDING' || project.status === 'IN_PROGRESS') && currentUserUsername === project.ownerUsername && (
                        <Button type="primary" danger onClick={handleCompleteProject}>
                            Завершить проект
                        </Button>
                    )}
                </Space>
            </div>

            {/* Информация о проекте */}
            <Card title="Информация о проекте" className="mb-6">
                <Text strong>Категория:</Text> {project.categoryName} <br />
                <Text strong>Дедлайн:</Text> {new Date(project.deadline).toLocaleDateString()} <br />
                <Text strong>Бюджет:</Text> ${project.budget} <br />
                <Text strong>Баланс:</Text> {''}
                <span
                    className={
                        project.balance < project.budget / 2
                            ? "text-red-500"
                            : project.balance < project.budget
                                ? "text-yellow-500"
                                : "text-green-500"
                    }
                >
                     ${project.balance}
                </span> <br />
                <Text strong>Статус:</Text> {project.status} <br />
                <Text strong>Владелец:</Text> {project.ownerUsername} <br />
                <Text strong>Исполнитель:</Text> {project.freelancerUsername ? project.freelancerUsername : "Not assigned"} <br />
                <Text strong>Описание:</Text> {project.description} <br />
            </Card>

            {/* Кнопка создания предложения */}
            {project.status === 'PENDING' && currentUserRole === "ROLE_FREELANCER" && (
                <Button type="primary" onClick={showModal}>
                    Создать предложение
                </Button>
            )}

            {/* Блок для работы с файлами */}
            {((currentUserUsername === project.freelancerUsername) || (currentUserUsername === project.ownerUsername)
            || (currentUserRole === 'ROLE_ADMIN') || (currentUserRole === 'ROLE_MAIN_ADMIN'))
            && (
            <Card title="Файлы проекта" className="mb-6">
                {((currentUserUsername === project.freelancerUsername) || (currentUserUsername === project.ownerUsername)) && (
                    <Button type="primary" onClick={() => setIsFileUploadModalVisible(true)}>
                        Загрузить файл
                    </Button>
                )}
                <List
                    dataSource={files}
                    renderItem={(file) => (
                        <List.Item>
                            <div className="flex justify-between items-center w-full">
                    <span onClick={() => handleFileDownload(file.id)} style={{ cursor: 'pointer' }}>
                        {file.fileName}
                    </span>
                                {((currentUserUsername === project.freelancerUsername) || (currentUserUsername === project.ownerUsername)) && (
                                    <Button type="link" danger onClick={() => handleFileDelete(file.id)}>
                                        Удалить
                                    </Button>
                                )}
                            </div>
                        </List.Item>
                    )}
                />
            </Card>
            )}
            {/* Заявки на проект */}
            {project.status === 'PENDING' && (
                <Card title="Заявки на проект" className="mb-6">
                    <List
                        dataSource={applications}
                        renderItem={(application) => (
                            <List.Item>
                                <ProjectApplicationCard
                                    application={application}
                                    project={project}
                                    refreshProject={fetchProject}
                                />
                            </List.Item>
                        )}
                    />
                </Card>
            )}

            {/* Принятая заявка */}
            {project.status !== 'PENDING' && approvedApplication && (
                <Card
                    title="Принятая заявка"
                    className="mb-6"
                    style={{ backgroundColor: 'rgba(144, 238, 144, 0.2)' }} // Прозрачно-зелёный фон
                >
                    <div>
                        <Text strong>Фрилансер:</Text> {approvedApplication.freelancerUsername} <br />
                        <Text strong>Цена:</Text> ${approvedApplication.price} <br />
                        <Text strong>Дедлайн:</Text> {new Date(approvedApplication.deadline).toLocaleDateString()} <br />
                        <Text strong>Сообщение:</Text> {approvedApplication.message} <br />
                    </div>
                </Card>
            )}

            {/* Споры по проекту */}
            {(project.status !== 'PENDING') && (
                <Card
                    title="Споры по проекту"
                    className="mb-6 bg-white p-0" // Фон белый, без отступов
                >
                    <List
                        dataSource={disputes}
                        renderItem={(dispute) => (
                            <List.Item className="p-0"> {/* Убираем отступы у списка */}
                                <DisputeCard
                                    dispute={dispute}
                                    role={currentUserRole}
                                    user={currentUserUsername}
                                    onResolve={showResolveModal} // Передаем функцию
                                />
                            </List.Item>
                        )}
                    />
                </Card>
            )}

            <Modal
                title="Чат"
                visible={isChatModalVisible}
                onCancel={handleChatCancel}
                footer={null}
            >
                <div style={{ height: '300px', overflowY: 'scroll', marginBottom: '16px' }}>
                    {messages.map((msg, index) => (
                        <div key={index} style={{ marginBottom: '8px' }}>
                            <Text strong>{msg.sender}: </Text>
                            <Text>{msg.content}</Text>
                        </div>
                    ))}
                </div>
                <Input
                    placeholder="Введите сообщение"
                    onPressEnter={(e) => {
                        sendMessage(e.target.value);
                        e.target.value = '';
                    }}
                />
            </Modal>

            {/* Модальное окно для загрузки файла */}
            <Modal
                title="Загрузить файл"
                visible={isFileUploadModalVisible}
                onCancel={() => setIsFileUploadModalVisible(false)}
                footer={null}
            >
                <input
                    type="file"
                    onChange={(e) => {
                        if (e.target.files[0]) {
                            handleFileUpload(e.target.files[0]);
                            setIsFileUploadModalVisible(false);
                        }
                    }}
                />
            </Modal>

            {/* Модальное окно для разрешения спора */}
            <Modal
                title="Разрешить спор"
                visible={isResolveModalVisible}
                onCancel={() => setIsResolveModalVisible(false)}
                footer={null} // Убираем стандартные кнопки
            >
                <Form onFinish={handleResolveSubmit}>
                    <Form.Item
                        label="Решение"
                        name="resolution"
                        rules={[{ required: true, message: 'Выберите решение' }]}
                    >
                        <Select placeholder="Выберите решение">
                            <Option value="RETURN_TO_CUSTOMER">Вернуть деньги заказчику</Option>
                            <Option value="PAY_TO_FREELANCER">Перевести деньги фрилансеру</Option>
                            <Option value="CONTINUE_PROJECT">Оставить проект на доработку</Option>
                        </Select>
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
                            Разрешить спор
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>

            {/* Модальное окно для создания спора */}
            <Modal
                title="Создать спор"
                visible={isDisputeModalVisible}
                onCancel={() => setIsDisputeModalVisible(false)}
                footer={null}
            >
                <Form onFinish={handleDisputeSubmit}>
                    <Form.Item
                        label="Комментарий"
                        name="comment"
                        rules={[{ required: true, message: 'Введите комментарий' }]}
                    >
                        <TextArea rows={4} />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            Создать спор
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>

            {/* Модальное окно для создания предложения */}
            <Modal
                title="Создать предложение"
                visible={isModalVisibleModal}
                onCancel={handleCancel}
                footer={null}
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

            {/* Модальное окно для пополнения баланса проекта */}
            <Modal
                title="Пополнить баланс проекта"
                visible={isTopUpModalVisible}
                onCancel={handleTopUpCancel}
                footer={null}
            >
                <Form form={topUpForm} onFinish={handleTopUpSubmit}>
                    <Form.Item
                        label="Сумма ($)"
                        name="amount"
                        rules={[{ required: true, message: 'Введите сумму' }]}
                    >
                        <InputNumber min={0} style={{ width: '100%' }} />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            Пополнить
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
}