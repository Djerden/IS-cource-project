import { Card, Typography, Button, message } from "antd";
import {jwtDecode} from "jwt-decode";

const { Text } = Typography;

export default function ProjectApplicationCard({ application, project, refreshProject}) {
    const token = localStorage.getItem('jwt');
    const decodedToken = token ? jwtDecode(token) : null; // Декодируем токен
    const currentUserRole = decodedToken?.role; // Роль текущего пользователя
    const currentUserUsername = decodedToken?.username // Usename текущего пользователя

    const handleAccept = async () => {
        try {
            const response = await fetch(`http://localhost:8080/project-application/${application.id}/accept`, {
                method: "POST",
                headers: {
                    'Authorization': `Bearer ${token}`, // Добавляем токен в заголовок
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Failed to accept application');
            }

            message.success('Заявка принята');
            refreshProject();
        } catch (error) {
            console.error('Error accepting application:', error);
            message.error('Ошибка при принятии заявки');
        }
    };

    // Проверяем, что freelancer существует
    const freelancerName = application.freelancerUsername ? application.freelancerUsername : "Неизвестный фрилансер";

    return (
        <Card
            title={`Заявка от ${freelancerName}`}
            className="mb-4"
            style={{ width: '100%' }} // Устанавливаем ширину 100%
        >
            <Text strong>Цена:</Text> ${application.price} <br />
            <Text strong>Дедлайн:</Text> {new Date(application.deadline).toLocaleDateString()} <br />
            <Text strong>Сообщение:</Text> {application.message} <br />

            {application.status === 'PENDING' && project.ownerUsername === currentUserUsername && (
                <Button type="primary" onClick={handleAccept}>
                    Принять заявку
                </Button>
            )}
        </Card>
    );
}