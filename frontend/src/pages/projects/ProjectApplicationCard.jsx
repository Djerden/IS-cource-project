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

            {application.status === 'PENDING' && (
                <Button type="primary" onClick={handleAccept}>
                    Принять заявку
                </Button>
            )}
        </Card>
    );
}