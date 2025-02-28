import { NavLink } from 'react-router-dom';

export default function BlogCard({ article }) {
    return (
        <NavLink to={`/blog/${article.id}`} className="block">
            <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
                {/* Изображение статьи */}
                <img
                    src={article.imageUrl}
                    alt={article.title}
                    className="w-full h-64 object-cover rounded-t-lg"
                />

                {/* Заголовок и описание */}
                <div className="p-6">
                    <h3 className="text-2xl font-semibold text-gray-800 mb-4">{article.title}</h3>
                    <p className="text-gray-600">{article.description}</p>
                </div>
            </div>
        </NavLink>
    );
}