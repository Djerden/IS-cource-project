import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Card, Typography, Spin, Button, List, message } from "antd";
import ProjectApplicationCard from "./ProjectApplicationCard.jsx"; // Компонент для заявок

const { Title, Text } = Typography;

export default function ProjectPage() {
    const { projectId } = useParams();
    const [project, setProject] = useState(null);
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);

    // Загрузка данных о проекте
    useEffect(() => {
        const fetchProject = async () => {
            try {
                const response = await fetch(`http://localhost:8080/project/${projectId}`);
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
    }, [projectId]);

    // Загрузка заявок на проект
    useEffect(() => {
        const fetchApplications = async () => {
            try {
                const response = await fetch(`http://localhost:8080/project/${projectId}/applications`);
                if (!response.ok) {
                    throw new Error('Failed to fetch applications');
                }
                const data = await response.json();
                setApplications(data);
            } catch (error) {
                console.error('Error fetching applications:', error);
            }
        };

        if (project?.status !== 'COMPLETED') {
            fetchApplications();
        }
    }, [project]);

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

            {/* Кнопка открыть чат */}
            {project.freelancerUsername && (
                <NavLink to={`/chat/${projectId}`}>
                    <Button type="primary">Открыть чат</Button>
                </NavLink>
            )}
        </div>
    );
}