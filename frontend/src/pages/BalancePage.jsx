import { useState, useEffect } from 'react';
import { Button, Input, Card, Tabs, message } from 'antd';
import {useParams} from "react-router-dom";

const BalancePage = () => {
    const choice = useParams();
    const [balance, setBalance] = useState(0); // Текущий баланс
    const [mode, setMode] = useState(choice.option ?? 'deposit');
    const [amount, setAmount] = useState(0); // Сумма для пополнения или вывода
    const [loading, setLoading] = useState(false); // Состояние загрузки

    // Загрузка баланса при монтировании компонента
    useEffect(() => {
        fetchBalance();
    }, []);

    // Получение текущего баланса
    const fetchBalance = async () => {
        const token = localStorage.getItem('jwt');
        if (!token) {
            message.error('Требуется авторизация');
            return;
        }

        try {
            const response = await fetch('http://localhost:8080/user/balance', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Ошибка при загрузке баланса');
            }

            const data = await response.json();
            setBalance(data.currency);
        } catch (error) {
            message.error(error.message);
        }
    };

    // Обработка транзакции (пополнение или вывод)
    const handleTransaction = async () => {
        if (amount <= 0) {
            message.error('Сумма должна быть больше 0');
            return;
        }

        const token = localStorage.getItem('jwt');
        if (!token) {
            message.error('Требуется авторизация');
            return;
        }

        setLoading(true);
        try {
            const url = mode === 'deposit'
                ? 'http://localhost:8080/user/balance/deposit'
                : 'http://localhost:8080/user/balance/withdraw';

            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ currency: amount }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Ошибка при выполнении операции');
            }

            const result = await response.json();
            setBalance(result.currency); // Обновляем баланс из ответа сервера
            message.success(mode === 'deposit' ? 'Баланс успешно пополнен' : 'Средства успешно выведены');
        } catch (error) {
            message.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <Card className="w-full max-w-md shadow-lg">
                <h1 className="text-2xl font-bold text-center mb-6">Ваш баланс: ${balance}</h1>

                {/* Вкладки для переключения между режимами */}
                <Tabs
                    activeKey={mode}
                    onChange={(key) => setMode(key)}
                    centered
                    items={[
                        {
                            key: 'deposit',
                            label: 'Пополнить',
                        },
                        {
                            key: 'withdraw',
                            label: 'Вывести',
                        },
                    ]}
                />

                {/* Поле для ввода суммы */}
                <Input
                    type="number"
                    placeholder="Введите сумму"
                    value={amount}
                    onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
                    className="my-4"
                />

                {/* Кнопка для выполнения операции */}
                <Button
                    type="primary"
                    onClick={handleTransaction}
                    loading={loading}
                    block
                >
                    {mode === 'deposit' ? 'Пополнить' : 'Вывести'}
                </Button>
            </Card>
        </div>
    );
};

export default BalancePage;