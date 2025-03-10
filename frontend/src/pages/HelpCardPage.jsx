import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

export default function HelpCardPage() {
    const { id } = useParams();
    const [article, setArticle] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch(`http://localhost:8080/help/articles/${id}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                console.log("Received data:", data);
                setArticle(data);
            })
            .catch(error => {
                console.error('Error fetching article:', error);
                setError(error.message);
            });
    }, [id]);

    // Функция для обработки текста
    const formatText = (text) => {
        if (!text) return null;

        try {
            // Заменяем \\n на \n
            const unescapedText = text.replace(/\\n/g, '\n');
            console.log("Unescaped text:", unescapedText);

            // Разделяем текст по ** и обрабатываем каждую часть
            const parts = unescapedText.split(/(\*\*.*?\*\*)/g);
            return parts.map((part, index) => {
                if (part.startsWith('**') && part.endsWith('**')) {
                    // Если часть текста заключена в **, выделяем жирным
                    const boldText = part.slice(2, -2);
                    return <strong key={index}>{boldText}</strong>;
                } else {
                    const lines = part.split('\n');
                    return lines.map((line, lineIndex) => (
                        <React.Fragment key={`${index}-${lineIndex}`}>
                            {line}
                            {lineIndex < lines.length - 1 && <br />}
                        </React.Fragment>
                    ));
                }
            });
        } catch (error) {
            console.error('Error formatting text:', error);
            return <span className="text-red-600">Error formatting text.</span>;
        }
    };

    if (error) {
        return <div className="p-8 text-center text-red-600">Error: {error}</div>;
    }

    if (!article) {
        return <div className="p-8 text-center text-red-600">Loading...</div>;
    }

    return (
        <div className="p-8">
            <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md">
                <h1 className="text-2xl font-bold text-gray-800 mb-4">{article.title}</h1>
                <p className="text-gray-600">{formatText(article.body)}</p>
            </div>
        </div>
    );
}