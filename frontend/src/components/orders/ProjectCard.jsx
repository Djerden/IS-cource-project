const ProjectCard = ({ project }) => {
    // Форматируем бюджет и дедлайн
    const formattedBudget = project.budget ? `$${project.budget.toLocaleString()}` : 'Not specified';
    const formattedDeadline = project.deadline ? new Date(project.deadline).toLocaleDateString() : 'No deadline';

    return (
        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">{project.title}</h3>
            <p className="text-gray-600 mb-4">{project.description}</p>

            <div className="grid grid-cols-2 gap-4 text-sm text-gray-700">
                <div>
                    <span className="font-medium">Category:</span> {project.category.name}
                </div>
                <div>
                    <span className="font-medium">Budget:</span> {formattedBudget}
                </div>
                <div>
                    <span className="font-medium">Deadline:</span> {formattedDeadline}
                </div>
                <div>
                    <span className="font-medium">Status:</span>{" "}
                    <span
                        className={`capitalize ${
                            project.status === 'COMPLETED'
                                ? 'text-green-600'
                                : project.status === 'CANCELLED'
                                    ? 'text-red-600'
                                    : 'text-yellow-600'
                        }`}
                    >
                        {project.status.toLowerCase()}
                    </span>
                </div>
            </div>

            <div className="mt-4 text-sm text-gray-600">
                <span className="font-medium">Freelancer:</span>{" "}
                {project.freelancer ? project.freelancer.username : 'Not assigned'}
            </div>
            <div className="text-sm text-gray-600">
                <span className="font-medium">Owner:</span> {project.owner.username}
            </div>
        </div>
    );
};

export default ProjectCard;