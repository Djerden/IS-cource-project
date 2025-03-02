import { NavLink } from 'react-router-dom';

export default function BlogCard({ article }) {
    return (
        <NavLink to={`/blog/${article.id}`} className="block">
            <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
                {/* Изображение статьи */}
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

                {/* Заголовок и описание */}
                <div className="p-6">
                    <h3 className="text-2xl font-semibold text-gray-800 mb-4">{article.title}</h3>
                    <p className="text-gray-600">{article.description}</p>
                </div>
            </div>
        </NavLink>
    );
}