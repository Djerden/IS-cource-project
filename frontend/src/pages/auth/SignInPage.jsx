import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom'; // Добавляем useNavigate
import BackgroundImage from '../../components/BackgroundImage.jsx';

export default function SignInPage() {
    const navigate = useNavigate(); // Хук для навигации

    // Состояния для полей формы
    const [usernameOrEmail, setUsernameOrEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(''); // Состояние для ошибки

    // Обработчик отправки формы
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Сброс ошибки
        setError('');

        // Подготовка данных для отправки
        const signInData = {
            usernameOrEmail: usernameOrEmail.trim(),
            password: password,
        };

        try {
            // Отправка данных на сервер
            const response = await fetch('http://localhost:8080/auth/sign-in', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(signInData),
            });

            // Обработка ответа
            if (!response.ok) {
                const errorData = await response.json();
                setError(errorData.message || 'Invalid username/email or password.');
                return;
            }

            // Успешная авторизация
            const result = await response.json();
            console.log('Sign-in successful:', result);

            // Сохраняем JWT токен в localStorage
            localStorage.setItem('jwt', result.token);

            // Перенаправляем на главную страницу (или другую страницу)
            navigate('/');
        } catch (error) {
            console.error('Error during sign-in:', error);
            setError('An error occurred. Please try again.');
        }
    };

    return (
        <BackgroundImage>
            {/* Контейнер для формы */}
            <div className="bg-white p-8 rounded-lg shadow-lg w-96">
                <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">Sign In</h1>

                {/* Форма для входа */}
                <form onSubmit={handleSubmit}>
                    {/* Поле для ввода username или email */}
                    <div className="mb-4">
                        <label htmlFor="usernameOrEmail" className="block text-gray-700 text-sm font-medium mb-2">
                            Username or Email
                        </label>
                        <input
                            type="text"
                            id="usernameOrEmail"
                            name="usernameOrEmail"
                            placeholder="Enter your username or email"
                            value={usernameOrEmail}
                            onChange={(e) => setUsernameOrEmail(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
                            required
                        />
                    </div>

                    {/* Поле для ввода пароля */}
                    <div className="mb-6">
                        <label htmlFor="password" className="block text-gray-700 text-sm font-medium mb-2">
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
                            required
                        />
                    </div>

                    {/* Сообщение об ошибке */}
                    {error && (
                        <p className="text-sm text-red-500 mb-4 text-center">{error}</p>
                    )}

                    {/* Кнопка для входа */}
                    <button
                        type="submit"
                        className="w-full bg-indigo-500 text-white py-2 px-4 rounded hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    >
                        Sign In
                    </button>
                </form>

                {/* Ссылка на страницу регистрации */}
                <div className="mt-4 text-center">
                    <span className="text-gray-600">Don't have an account? </span>
                    <NavLink
                        to="/sign-up"
                        className="text-indigo-500 hover:text-indigo-600 font-medium"
                    >
                        Sign Up
                    </NavLink>
                </div>
            </div>
        </BackgroundImage>
    );
}