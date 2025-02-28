import { NavLink } from 'react-router-dom';
import BlogCard from './../components/blog/BlogCard.jsx';

const articles = [
    {
        id: 1,
        title: 'Как начать программировать на React',
        description: 'Введение в основы React и создание первого приложения.',
        imageUrl: 'https://via.placeholder.com/1200x400', // Увеличил ширину изображения
        content: 'Полное руководство по React...'
    },
    {
        id: 2,
        title: 'Лучшие практики JavaScript',
        description: 'Советы и рекомендации по написанию чистого и эффективного кода на JavaScript.',
        imageUrl: 'https://via.placeholder.com/1200x400', // Увеличил ширину изображения
        content: 'Советы по JavaScript...'
    }
];

export default function Blog() {
    return (
        <div className="p-8">
            <div className="max-w-6xl mx-auto">
                {/* Кнопка "Написать статью" */}
                <NavLink
                    to="/blog/write-article"
                    className="inline-block mb-8 px-6 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors"
                >
                    Написать статью
                </NavLink>

                {/* Список статей (одна под другой) */}
                <div className="space-y-8">
                    {articles.map((article) => (
                        <BlogCard key={article.id} article={article} />
                    ))}
                </div>
            </div>
        </div>
    );
}