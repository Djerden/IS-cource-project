import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

export default function BlogCardPage() {
    const { id } = useParams();
    const [article, setArticle] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editedTitle, setEditedTitle] = useState('');
    const [editedDescription, setEditedDescription] = useState('');
    const [editedContent, setEditedContent] = useState('');

    useEffect(() => {
        const fetchArticle = async () => {
            try {
                const response = await fetch(`http://localhost:8080/blog/articles/${id}`);
                const data = await response.json();
                console.log("Полученные данные:", data); // Логирование данных
                setArticle(data);
                setEditedTitle(data.title);
                setEditedDescription(data.description);
                setEditedContent(data.body);
            } catch (error) {
                console.error('Ошибка при загрузке статьи:', error);
            }
        };

        fetchArticle();
    }, [id]);

    // Обработчик сохранения изменений
    const handleSave = async () => {
        try {
            const response = await fetch(`http://localhost:8080/blog/articles/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title: editedTitle,
                    description: editedDescription,
                    body: editedContent,
                }),
            });

            if (!response.ok) {
                throw new Error('Ошибка при сохранении статьи');
            }

            // Обновляем статью после успешного сохранения
            const updatedArticle = await response.json();
            setArticle(updatedArticle);
            setIsEditing(false);
        } catch (error) {
            console.error('Ошибка при сохранении статьи:', error);
        }
    };

    if (!article) return <div>Загрузка...</div>;

    return (
        <div className="p-8">
            <div className="max-w-6xl mx-auto">
                {/* Изображение статьи */}
                {article.picture && article.pictureMimeType && (
                    <img
                        src={`data:${article.pictureMimeType};base64,${article.picture}`}
                        alt={article.title}
                        className="w-full h-64 object-cover rounded-lg"
                        onError={(e) => {
                            console.error('Ошибка загрузки изображения:', e);
                            e.target.style.display = 'none'; // Скрыть изображение при ошибке
                        }}
                    />
                )}

                {/* Редактирование заголовка, описания и содержимого */}
                {isEditing ? (
                    <>
                        <input
                            type="text"
                            value={editedTitle}
                            onChange={(e) => setEditedTitle(e.target.value)}
                            placeholder="Заголовок"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-4"
                        />
                        <textarea
                            value={editedDescription}
                            onChange={(e) => setEditedDescription(e.target.value)}
                            placeholder="Краткое описание"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-4"
                        />
                        <textarea
                            value={editedContent}
                            onChange={(e) => setEditedContent(e.target.value)}
                            placeholder="Содержание статьи"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </>
                ) : (
                    <>
                        <h1 className="text-3xl font-semibold text-gray-800 mt-6 mb-4">{article.title}</h1>
                        <p className="text-gray-600 mb-6 whitespace-pre-wrap">{article.description}</p>
                        <p className="text-gray-700 whitespace-pre-wrap">{article.body}</p>
                    </>
                )}

                {/* Кнопка редактирования/сохранения */}
                <button
                    onClick={isEditing ? handleSave : () => setIsEditing(true)}
                    className="mt-6 px-6 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors"
                >
                    {isEditing ? 'Сохранить' : 'Редактировать'}
                </button>
            </div>
        </div>
    );
}