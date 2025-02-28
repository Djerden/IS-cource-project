import { useParams } from 'react-router-dom';

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

export default function HelpCardPage() {
    const { id } = useParams();
    const card = testHelpCards.find((card) => card.id === parseInt(id));

    if (!card) {
        return <div className="p-8 text-center text-red-600">Card not found.</div>;
    }

    return (
        <div className="p-8">
            <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md">
                <h1 className="text-2xl font-bold text-gray-800 mb-4">{card.title}</h1>
                <p className="text-gray-600">{card.content}</p>
            </div>
        </div>
    );
}