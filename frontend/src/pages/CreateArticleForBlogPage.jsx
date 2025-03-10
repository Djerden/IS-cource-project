import { useState } from 'react';

export default function CreateArticleForBlogPage() {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [content, setContent] = useState('');
    const [image, setImage] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const token = localStorage.getItem('jwt');
        if (!token) {
            alert('Вы не авторизованы. Пожалуйста, войдите в систему.');
            return;
        }

        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);
        formData.append('body', content);
        if (image) {
            formData.append('pictureFile', image);
        }

        try {
            const response = await fetch('http://localhost:8080/blog/article', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Ошибка при создании статьи');
            }

            const data = await response.json();
            console.log('Статья создана:', data);
            alert('Статья успешно создана!');

            setTitle('');
            setDescription('');
            setContent('');
            setImage(null);
        } catch (error) {
            console.error('Ошибка при создании статьи:', error);
            alert('Ошибка при создании статьи. Проверьте консоль для подробностей.');
        }
    };

    return (
        <div className="p-8">
            <div className="max-w-6xl mx-auto">
                <h2 className="text-2xl font-semibold text-gray-800 mb-6">Написать статью</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Поле для заголовка */}
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Заголовок"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        required
                    />

                    {/* Поле для краткого описания */}
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Краткое описание"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        required
                    />

                    {/* Поле для содержания статьи */}
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="Содержание статьи"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        required
                    />

                    {/* Поле для загрузки картинки */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Изображение статьи</label>
                        <input
                            type="file"
                            onChange={(e) => setImage(e.target.files[0])}
                            accept="image/*"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>

                    {/* Кнопка отправки формы */}
                    <button
                        type="submit"
                        className="px-6 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors"
                    >
                        Опубликовать
                    </button>
                </form>
            </div>
        </div>
    );
}