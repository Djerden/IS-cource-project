import HelpCard from './../components/help/HelpCard.jsx';

// Тестовые данные для карточек
const testHelpCards = [
    {
        id: 1,
        title: 'How to Create an Account',
        description: 'Step-by-step guide to creating a new account on our platform.',
        content: 'To create an account, click on the "Sign Up" button and fill out the required fields.',
    },
    {
        id: 2,
        title: 'How to Reset Your Password',
        description: 'Instructions on how to reset your password if you forget it.',
        content: 'Go to the "Forgot Password" page and follow the instructions to reset your password.',
    },
    {
        id: 3,
        title: 'How to Contact Support',
        description: 'Learn how to get in touch with our support team.',
        content: 'You can contact our support team by emailing support@example.com.',
    },
    {
        id: 4,
        title: 'How to Update Your Profile',
        description: 'Guide on updating your profile information.',
        content: 'Navigate to the "Settings" page to update your profile information.',
    },
    {
        id: 5,
        title: 'How to Use the Dashboard',
        description: 'Learn how to navigate and use the dashboard effectively.',
        content: 'The dashboard provides an overview of your projects and tasks. Explore the different sections to get started.',
    },
    {
        id: 6,
        title: 'How to Report a Bug',
        description: 'Steps to report a bug or issue you encounter.',
        content: 'If you find a bug, please report it by emailing bugs@example.com with a detailed description.',
    },
];

export default function Help() {
    return (
        <div className="p-8">
            <div className="max-w-6xl mx-auto">
                {/* Почта для связи */}
                <div className="text-center mb-8">
                    <p className="text-gray-600">If you need further assistance, please contact us at:</p>
                    <a href="mailto:support@example.com" className="text-indigo-600 hover:text-indigo-500">
                        support@example.com
                    </a>
                </div>

                {/* Сетка карточек */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {testHelpCards.map((card) => (
                        <HelpCard key={card.id} id={card.id} title={card.title} description={card.description} />
                    ))}
                </div>
            </div>
        </div>
    );
}