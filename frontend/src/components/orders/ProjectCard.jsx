import { Card, Tag, Typography } from "antd";
import { useNavigate } from "react-router-dom";

const { Text, Title } = Typography;

const ProjectCard = ({ project }) => {
    const navigate = useNavigate();

    // Форматируем бюджет и дедлайн
    const formattedBudget = project.budget ? `$${project.budget.toLocaleString()}` : "Not specified";
    const formattedDeadline = project.deadline ? new Date(project.deadline).toLocaleDateString() : "No deadline";

    // Определяем цвет статуса
    const statusColor = {
        COMPLETED: "green",
        CANCELLED: "red",
        IN_PROGRESS: "gold",
        PENDING: "blue",
    }[project.status];

    return (
        <Card
            hoverable
            onClick={() => navigate(`/project/${project.id}`)} // Переход на страницу проекта
            style={{ width: "100%", marginBottom: 16 }}
        >
            <Title level={4} className="mb-2">
                {project.title}
            </Title>
            <Text type="secondary" className="block mb-4">
                {project.description}
            </Text>

            <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                    <Text strong>Category:</Text> {project.categoryName}
                </div>
                <div>
                    <Text strong>Budget:</Text> {formattedBudget}
                </div>
                <div>
                    <Text strong>Deadline:</Text> {formattedDeadline}
                </div>
                <div>
                    <Text strong>Status:</Text>{" "}
                    <Tag color={statusColor}>{project.status.toLowerCase()}</Tag>
                </div>
            </div>

            <div className="mb-2">
                <Text strong>Freelancer:</Text>{" "}
                {project.freelancerUsername || "Not assigned"}
            </div>
            <div>
                <Text strong>Owner:</Text> {project.ownerUsername}
            </div>
        </Card>
    );
};

export default ProjectCard;