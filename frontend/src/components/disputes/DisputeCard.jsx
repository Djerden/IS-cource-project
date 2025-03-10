import { Card, Button } from 'antd';
import { useNavigate } from 'react-router-dom';

const DisputeCard = ({ dispute }) => {
    const navigate = useNavigate();

    // Функция для назначения админа на спор
    const handleAssignAdmin = async (disputeId) => {
        const token = localStorage.getItem('jwt');
        try {
            const response = await fetch(`http://localhost:8080/dispute/${disputeId}/assign-admin`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error('Не удалось назначить администратора');
            }

            const data = await response.json();
            // Перенаправление на страницу проекта
            navigate(`/project/${data.projectId}`);
        } catch (error) {
            alert(error.message);
        }
    };

    return (
        <Card className="mb-6" style={{ backgroundColor: 'rgba(255, 99, 71, 0.1)' }}>
            <h3 className="font-semibold text-lg">{dispute.initiatorUsername}</h3>
            <p><strong>Статус:</strong> {dispute.status}</p>
            <p><strong>Комментарий:</strong> {dispute.comment}</p>
            <p><strong>Дата создания:</strong> {new Date(dispute.createdAt).toLocaleDateString()}</p>
            <p><strong>Админ:</strong> {dispute.adminUsername ? dispute.adminUsername : 'Not assigned'}</p>

            {/* Кнопка для начала разрешения спора */}
            {!dispute.adminUsername && (
                <Button type="primary" onClick={() => handleAssignAdmin(dispute.id)}>
                    Начать разрешение спора
                </Button>
            )}
        </Card>
    );
};

export default DisputeCard;
