import HelpCard from './../components/help/HelpCard.jsx';
import {useEffect, useState} from "react";

export default function Help() {
    const [articles, setArticles] = useState([]);

    useEffect(() => {
        fetch('http://localhost:8080/help/articles')
            .then(response => response.json())
            .then(data => setArticles(data))
            .catch(error => console.error('Error fetching articles:', error));
    }, []);
    console.log(articles);
    return (
        <div className="p-8">
            <div className="max-w-6xl mx-auto">
                {/* Почта для связи */}
                <div className="text-center mb-8">
                    <p className="text-gray-600">If you need further assistance, please contact us at:</p>
                    <a href="mailto:apelcin228@mail.ru" className="text-indigo-600 hover:text-indigo-500">
                        apelcin228@mail.ru
                    </a>
                </div>

                {/* Сетка карточек */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {articles.map((article) => (
                        <HelpCard key={article.id} id={article.id} title={article.title} description={article.shortDescription} />
                    ))}
                </div>
            </div>
        </div>
    );
}