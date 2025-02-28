import { useParams } from 'react-router-dom';
import {useState} from "react";

const articles = [
    {
        id: 1,
        title: 'Как начать программировать на React',
        description: 'Введение в основы React и создание первого приложения.',
        imageUrl: 'https://via.placeholder.com/600x400',
        content: 'Полное руководство по React...'
    },
    {
        id: 2,
        title: 'Лучшие практики JavaScript',
        description: 'Советы и рекомендации по написанию чистого и эффективного кода на JavaScript.',
        imageUrl: 'https://via.placeholder.com/600x400',
        content: 'Советы по JavaScript...'
    }
];

export default function BlogCardPage() {
    const { id } = useParams();
    const article = articles.find((article) => article.id === parseInt(id));
    const [isEditing, setIsEditing] = useState(false);
    const [editedContent, setEditedContent] = useState(article.content);

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleSave = () => {
        // Логика для сохранения изменений
        setIsEditing(false);
        console.log('Сохранено:', editedContent);
    };

    return (
        <div className="p-8">
            <div className="max-w-6xl mx-auto">
                <img
                    src={article.imageUrl}
                    alt={article.title}
                    className="w-full h-64 object-cover rounded-lg"
                />
                <h1 className="text-3xl font-semibold text-gray-800 mt-6 mb-4">{article.title}</h1>
                <p className="text-gray-600 mb-6">{article.description}</p>
                {isEditing ? (
                    <textarea
                        value={editedContent}
                        onChange={(e) => setEditedContent(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                ) : (
                    <p className="text-gray-700">{article.content}</p>
                )}
                <button
                    onClick={isEditing ? handleSave : handleEdit}
                    className="mt-6 px-6 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors"
                >
                    {isEditing ? 'Сохранить' : 'Редактировать'}
                </button>
            </div>
        </div>
    );
}