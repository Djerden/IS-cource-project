import { useState, useRef } from 'react';
import BackgroundImage from "../../components/BackgroundImage.jsx";
import {useLocation, useNavigate} from 'react-router-dom';
import {message} from "antd";

export default function ConfirmEmailPage() {
    const [code, setCode] = useState(['', '', '', '', '', '']);
    const [error, setError] = useState('');
    const [messageInfo, setMessageInfo] = useState('');
    const [isResendDisabled, setIsResendDisabled] = useState(false); // Флаг для блокировки кнопки
    const [countdown, setCountdown] = useState(30); // Таймер на 30 секунд
    const [isFirstSend, setIsFirstSend] = useState(true); // Флаг для первого нажатия

    const inputs = useRef([]);
    const navigate = useNavigate();

    const location = useLocation(); // Хук для получения информации о текущем пути
    const fromPath = location?.state?.from || 'Unknown'; // Если state передан, берем его, иначе 'Unknown'

    console.log(fromPath);
    // Функция для запуска таймера
    const startCountdown = () => {
        setIsResendDisabled(true);
        setCountdown(30);

        const interval = setInterval(() => {
            setCountdown((prev) => {
                if (prev === 1) {
                    clearInterval(interval);
                    setIsResendDisabled(false);
                }
                return prev - 1;
            });
        }, 1000);
    };

    const sendVerificationCode = async () => {
        const token = localStorage.getItem('jwt');
        try {
            const response = await fetch('http://localhost:8080/auth/send-email-verification-code', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            if (response.ok) {
                setMessageInfo('A verification code has been sent to your email');
            } else {
                setError('Failed to send verification code.');
            }
        } catch (error) {
            setError('An error occurred while sending the verification code.');
        }
    };

    // Обработчик нажатия на кнопку отправки/повторной отправки
    const handleSendCode = () => {
        if (isFirstSend) {
            setIsFirstSend(false);
        }
        sendVerificationCode();
        startCountdown();
    };

    // Обработчик изменения значения в инпуте
    const handleChange = (index, value) => {
        const newCode = [...code];
        newCode[index] = value;
        setCode(newCode);
        setError('');

        if (value && index < 5) {
            inputs.current[index + 1].focus();
        }
    };

    // Обработчик нажатия клавиш
    const handleKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !code[index] && index > 0) {
            inputs.current[index - 1].focus();
        }
    };

    // Обработчик подтверждения кода
    const handleSubmit = async () => {
        const fullCode = code.join('');
        if (fullCode.length !== 6) {
            setError('Please, enter the 6-digit code.');
            return;
        }

        const token = localStorage.getItem('jwt');
        try {
            const response = await fetch('http://localhost:8080/auth/verify-email', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ code: fullCode })
            });
            const data = await response.json();
            if (response.ok) {
                message.success('The email is confirmed!');
                if (fromPath === '/settings') {
                    navigate('/settings');
                } else if (fromPath === '/sign-up')
                navigate('/fill-user-details');
            } else {
                setError(data.message || 'Invalid code. Please, try again.');
            }
        } catch (error) {
            setError('An error occurred while verifying the code.');
        }
    };

    return (
        <BackgroundImage>
            <div className="bg-white p-8 rounded-lg shadow-lg w-96">
                <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">Confirm Email</h1>
                {messageInfo && <p className="text-sm text-green-500 mb-4 text-center">{messageInfo}</p>}

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

                {error && <p className="text-sm text-red-500 mb-4 text-center">{error}</p>}

                <button
                    onClick={handleSubmit}
                    className="w-full bg-indigo-500 text-white py-2 px-4 rounded hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-400 mb-4"
                >
                    Confirm
                </button>

                <button
                    onClick={handleSendCode}
                    disabled={isResendDisabled} // Блокируем кнопку, если таймер активен
                    className={`w-full text-indigo-500 py-2 px-4 rounded focus:outline-none ${
                        isResendDisabled ? 'opacity-50 cursor-not-allowed' : 'hover:text-indigo-600'
                    }`}
                >
                    {isFirstSend ? 'Send Code' : (isResendDisabled ? `Resend in ${countdown}s` : 'Resend Verification Code')}
                </button>
            </div>
        </BackgroundImage>
    );
}