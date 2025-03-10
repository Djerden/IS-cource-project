import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import {Button, Pagination} from 'antd';
import BlogCard from './../components/blog/BlogCard.jsx';
import {jwtDecode} from 'jwt-decode';

export default function Blog() {
    const [articles, setArticles] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);

    const token = localStorage.getItem('jwt');
    const decodedToken = token ? jwtDecode(token) : null; // Декодируем токен
    const currentUserRole = decodedToken?.role;

    const fetchArticles = async (page = 1, size = 10) => {
        try {
            const response = await fetch(`http://localhost:8080/blog/articles?page=${page - 1}&size=${size}`);
            const data = await response.json();
            setArticles(data.content);
            setTotalPages(data.totalPages);
        } catch (error) {
            console.error('Ошибка при загрузке статей:', error);
        }
    };

    useEffect(() => {
        fetchArticles(currentPage);
    }, [currentPage]);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    return (
        <div className="p-8">
            <div className="max-w-6xl mx-auto">
                {/* Кнопка "Написать статью" */}
                {(currentUserRole === 'ROLE_ADMIN' ||  currentUserRole === 'ROLE_MAIN_ADMIN') && (
                    <NavLink
                        to="/blog/write-article"
                        className="inline-block mb-8 px-6 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors"
                    >
                        Написать статью
                    </NavLink>
                )}

                {/* Список статей */}
                <div className="space-y-8">
                    {articles.map((article) => (
                        <BlogCard key={article.id} article={article} />
                    ))}
                </div>

                {/* Пагинация */}
                <div className="mt-8 flex justify-center">
                    <Pagination
                        current={currentPage}
                        total={totalPages * 10}
                        pageSize={10}
                        onChange={handlePageChange}
                        showSizeChanger={false}
                    />
                </div>
            </div>
        </div>
    );
}