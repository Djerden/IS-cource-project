import { useEffect, useState } from 'react';
import { Pagination, Spin } from 'antd';
import DisputeCard from './../../components/disputes/DisputeCard.jsx'; // Импортируем компонент для карточки спора

export default function DisputesListPage() {
    const [disputes, setDisputes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [total, setTotal] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 10;

    useEffect(() => {
        const fetchDisputes = async () => {
            const token = localStorage.getItem('jwt');
            try {
                const response = await fetch(`http://localhost:8080/dispute/without-admin?page=${currentPage - 1}&size=${pageSize}`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    throw new Error('Не удалось загрузить споры');
                }

                const data = await response.json();
                setDisputes(data.content);
                setTotal(data.totalElements);
            } catch (error) {
                alert(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchDisputes();
    }, [currentPage]);

    if (loading) {
        return <Spin size="large" className="flex justify-center items-center h-screen" />;
    }

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Споры по проектам</h1>

            <div className="space-y-6">
                {disputes.map((dispute) => (
                    <DisputeCard key={dispute.id} dispute={dispute} />
                ))}
            </div>

            {/* Пагинация */}
            <div className="flex justify-center mt-6">
                <Pagination
                    current={currentPage}
                    total={total}
                    pageSize={pageSize}
                    onChange={(page) => setCurrentPage(page)}
                />
            </div>
        </div>
    );
}
