import { useState, useRef, useEffect } from 'react';
import BackgroundImage from "../../components/BackgroundImage.jsx";


export default function ConfirmEmailPage() {
    const [code, setCode] = useState(['', '', '', '', '', '']); // Состояние для хранения кода
    const [error, setError] = useState(''); // Состояние для ошибки
    const inputs = useRef([]); // Рефы для инпутов

    // Обработчик изменения значения в инпуте
    const handleChange = (index, value) => {
        const newCode = [...code];
        newCode[index] = value;
        setCode(newCode);
        setError(''); // Сбрасываем ошибку при изменении кода

        // Автоматически переходим к следующему инпуту
        if (value && index < 5) {
            inputs.current[index + 1].focus();
        }
    };

    // Обработчик нажатия клавиш (для удаления и перехода между инпутами)
    const handleKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !code[index] && index > 0) {
            inputs.current[index - 1].focus();
        }
    };

    // Обработчик подтверждения кода
    const handleSubmit = () => {
        const fullCode = code.join('');
        if (fullCode.length !== 6) {
            setError('Please, enter the 6-digit code.');
            return;
        }

        // Здесь можно добавить логику для отправки кода на сервер
        // Например, имитируем проверку кода
        const isCodeValid = validateCodeOnServer(fullCode); // Заглушка для проверки кода

        if (isCodeValid) {
            alert('The email is confirmed!');
            setError('');
        } else {
            setError('Invalid code. Please, try again.');
        }
    };

    // Заглушка для проверки кода на сервере
    const validateCodeOnServer = (code) => {
        // В реальном приложении здесь будет запрос к серверу
        // Например, возвращаем true, если код равен "123456"
        return code === '123456';
    };

    // Автофокус на первый инпут при монтировании
    useEffect(() => {
        inputs.current[0].focus();
    }, []);

    return (
        <BackgroundImage>
            <div className="bg-white p-8 rounded-lg shadow-lg w-96">
                <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">Confirm Email</h1>

                {/* Поле для ввода 6-значного кода */}
                <div className="flex justify-between mb-4">
                    {code.map((digit, index) => (
                        <input
                            key={index}
                            type="text"
                            maxLength={1}
                            value={digit}
                            onChange={(e) => handleChange(index, e.target.value)}
                            onKeyDown={(e) => handleKeyDown(index, e)}
                            ref={(el) => (inputs.current[index] = el)}
                            className={`w-12 h-12 text-center border ${
                                error ? 'border-red-500' : 'border-gray-300'
                            } rounded focus:outline-none focus:ring-2 focus:ring-indigo-400`}
                        />
                    ))}
                </div>

                {/* Сообщение об ошибке */}
                {error && (
                    <p className="text-sm text-red-500 mb-4 text-center">{error}</p>
                )}

                {/* Кнопка подтверждения */}
                <button
                    onClick={handleSubmit}
                    className="w-full bg-indigo-500 text-white py-2 px-4 rounded hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                >
                    Confirm
                </button>
            </div>
        </BackgroundImage>
    );
}