import { useParams } from 'react-router-dom';
import ProjectCard from "../components/orders/ProjectCard.jsx";

// Тестовые данные для профиля пользователя
const testUserData = {
    username: 'john_doe',
    avatarUrl: 'https://via.placeholder.com/150',
    email: 'john.doe@example.com',
    role: 'ROLE_FREELANCER',
    name: 'John',
    middleName: 'Michael',
    surname: 'Doe',
    description: 'Experienced software developer with a passion for building scalable web applications.',
    skills: ['JavaScript', 'React', 'Node.js', 'TypeScript', 'Python'],
};

// Тестовые данные для проектов
const testProjects = [
    {
        id: 1,
        title: 'E-commerce Website Development',
        description: 'Develop a full-stack e-commerce website with React and Node.js.',
        budget: 5000,
        deadline: '2023-12-31T23:59:59',
        status: 'COMPLETED',
        category: { id: 1, name: 'Web Development' },
        freelancer: { id: 2, username: 'jane_smith' },
        owner: { id: 1, username: 'john_doe' },
    },
    {
        id: 2,
        title: 'Mobile App for Fitness Tracking',
        description: 'Create a cross-platform mobile app for tracking fitness activities.',
        budget: 3000,
        deadline: '2024-02-28T23:59:59',
        status: 'IN_PROGRESS',
        category: { id: 2, name: 'Mobile Development' },
        freelancer: { id: 3, username: 'alex_jones' },
        owner: { id: 1, username: 'john_doe' },
    },
    {
        id: 3,
        title: 'AI Chatbot Integration',
        description: 'Integrate an AI-powered chatbot into an existing website.',
        budget: 2000,
        deadline: null,
        status: 'PENDING',
        category: { id: 3, name: 'Artificial Intelligence' },
        freelancer: null,
        owner: { id: 1, username: 'john_doe' },
    },
];

export default function ProfilePage() {
    const { username } = useParams();

    // Используем тестовые данные (в реальном приложении замените на запрос к серверу)
    const user = testUserData;
    const projects = testProjects;

    return (
        <div className="p-8">
            <div className="max-w-4xl mx-auto">
                {/* Блок с основной информацией о пользователе */}
                <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                    <h1 className="text-3xl font-bold text-gray-800 mb-4">{user.username}</h1>

                    <div className="flex flex-col md:flex-row items-start space-y-6 md:space-y-0 md:space-x-6">
                        {/* Аватар */}
                        <div className="flex-shrink-0">
                            <img
                                src={user.avatarUrl}
                                alt={`${user.username}'s avatar`}
                                className="w-32 h-32 rounded-full object-cover"
                            />
                        </div>

                        {/* Информация о пользователе */}
                        <div className="flex-grow">
                            <h2 className="text-xl font-semibold text-gray-800">
                                {user.name} {user.middleName} {user.surname}
                            </h2>
                            <p className="text-gray-600">{user.email}</p>
                            <p className="text-gray-600 capitalize">{user.role.toLowerCase().replace('_', ' ')}</p>

                            {/* Описание */}
                            {user.description && (
                                <p className="mt-4 text-gray-700">{user.description}</p>
                            )}

                            {/* Навыки (только для фрилансера) */}
                            {user.role === 'ROLE_FREELANCER' && user.skills && (
                                <div className="mt-4">
                                    <h3 className="text-lg font-semibold text-gray-800">Skills</h3>
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        {user.skills.map((skill, index) => (
                                            <span
                                                key={index}
                                                className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm"
                                            >
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Блок с историей проектов */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">Project History</h2>
                    <div className="space-y-6">
                        {projects.map((project) => (
                            <ProjectCard key={project.id} project={project} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}