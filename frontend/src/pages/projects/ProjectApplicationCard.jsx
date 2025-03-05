import { Card, Typography, Button, message } from "antd";

const { Text } = Typography;

export default function ProjectApplicationCard({ application, onAccept }) {
    const handleAccept = async () => {
        try {
            const response = await fetch(`http://localhost:8080/project/application/${application.id}/accept`, {
                method: "POST",
            });
            if (!response.ok) {
                throw new Error('Failed to accept application');
            }
            message.success('Заявка принята');
            onAccept(); // Обновляем состояние после принятия заявки
        } catch (error) {
            console.error('Error accepting application:', error);
            message.error('Ошибка при принятии заявки');
        }
    };

    return (
        <Card title={`Заявка от ${application.freelancer.username}`} className="mb-4">
            <Text strong>Сообщение:</Text> {application.message} <br />
            <Text strong>Цена:</Text> ${application.price} <br />
            <Text strong>Дедлайн:</Text> {new Date(application.deadline).toLocaleDateString()} <br />
            <Text strong>Статус:</Text> {application.status} <br />

            {application.status === 'PENDING' && (
                <Button type="primary" onClick={handleAccept}>
                    Принять заявку
                </Button>
            )}
        </Card>
    );
}