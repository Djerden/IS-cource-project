import { Card, Typography, Button, Modal, Form, Select, Input } from 'antd';

const { Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

const DisputeCard = ({ dispute, role, username, onResolve }) => {
    return (
        <Card
            className="bg-red-100 mb-4" // Прозрачно красно-розовый фон
            style={{ backgroundColor: 'rgba(255, 99, 71, 0.1)' }} // Прозрачно красно-розовый фон
        >
            <Text strong>Инициатор:</Text> {dispute.initiatorUsername} <br />
            <Text strong>Статус:</Text> {dispute.status} <br />
            <Text strong>Комментарий:</Text> {dispute.comment} <br />
            <Text strong>Дата создания:</Text> {new Date(dispute.createdAt).toLocaleDateString()} <br />
            <Text strong>Админ:</Text> {dispute.adminUsername ? dispute.adminUsername : 'Not assigned'} <br />
            {dispute.resolution && (
                <>
                    <Text strong>Решение:</Text> {dispute.resolution} <br />
                </>
            )}
            {dispute.resolvedAt && (
                <>
                    <Text strong>Дата решения:</Text> {new Date(dispute.resolvedAt).toLocaleDateString()} <br />
                </>
            )}

            {/* Кнопка для разрешения спора (только для админа) */}
            {dispute.status === 'OPEN' && dispute.admin === username && (role === 'ROLE_ADMIN' || role === 'ROLE_MAIN_ADMIN') && (
                <Button type="primary" onClick={() => onResolve(dispute)}>
                    Разрешить спор
                </Button>
            )}
        </Card>
    );
};

export default DisputeCard;