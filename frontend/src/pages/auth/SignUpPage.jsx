import { useState } from 'react';
import {NavLink, useNavigate} from 'react-router-dom';
import BackgroundImage from '../../components/BackgroundImage.jsx';

export default function SignUpPage() {
    const navigate = useNavigate();

    // Состояния для полей формы
    const [profileType, setProfileType] = useState('ROLE_CUSTOMER'); // Тип профиля (Customer или Freelancer)
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordStrength, setPasswordStrength] = useState('');
    const [passwordsMatch, setPasswordsMatch] = useState(true);

    // Состояния для ошибок
    const [usernameError, setUsernameError] = useState('');
    const [emailError, setEmailError] = useState('');

    // Функция для проверки надёжности пароля
    const checkPasswordStrength = (password) => {
        const strength = {
            level: 0,
            message: '',
        };

        if (password.length >= 8) strength.level++;
        if (/[A-Z]/.test(password)) strength.level++;
        if (/[0-9]/.test(password)) strength.level++;
        if (/[^A-Za-z0-9]/.test(password)) strength.level++;

        switch (strength.level) {
            case 0:
                strength.message = 'Very Weak';
                break;
            case 1:
                strength.message = 'Weak';
                break;
            case 2:
                strength.message = 'Moderate';
                break;
            case 3:
                strength.message = 'Strong';
                break;
            case 4:
                strength.message = 'Very Strong';
                break;
            default:
                strength.message = '';
        }

        setPasswordStrength(strength.message);
    };

    // Обработчик изменения пароля
    const handlePasswordChange = (e) => {
        const newPassword = e.target.value;
        setPassword(newPassword);
        checkPasswordStrength(newPassword);
        setPasswordsMatch(newPassword === confirmPassword);
    };

    // Обработчик изменения подтверждения пароля
    const handleConfirmPasswordChange = (e) => {
        const newConfirmPassword = e.target.value;
        setConfirmPassword(newConfirmPassword);
        setPasswordsMatch(password === newConfirmPassword);
    };

    // Обработчик отправки формы
    const handleSubmit = async (e) => {
        e.preventDefault();

        setUsernameError('');
        setEmailError('');

        if (password !== confirmPassword) {
            alert('Passwords do not match!');
            return;
        }

        const signUpData = {
            role: profileType,
            username: username.trim(),
            email: email.trim(),
            password: password,
        };

        try {
            // Отправка данных на сервер
            const response = await fetch('http://localhost:8080/auth/sign-up', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(signUpData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.log(errorData);
                if (errorData.message.includes('username')) {
                    setUsernameError('Username is already taken.');
                } else if (errorData.message.includes('email')) {
                    setEmailError('Email is already registered.');
                } else {
                    alert('Registration failed. Please try again.');
                }
                return;
            }

            const result = await response.json();
            console.log('Registration successful:', result);

            const jwtToken = result.token
            if (jwtToken) {
                localStorage.setItem('jwt', jwtToken);
            }

            navigate('/confirm-email', { state: { from: window.location.pathname } });

        } catch (error) {
            console.error('Error during registration:', error);
            alert('An error occurred. Please try again.');
        }
    };

    return (
        <BackgroundImage>
            {/* Контейнер для формы */}
            <div className="bg-white p-8 rounded-lg shadow-lg w-96">
                <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">Sign Up</h1>

                {/* Форма для регистрации */}
                <form onSubmit={handleSubmit}>
                    {/* Выбор типа профиля */}
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-medium mb-2">
                            Profile Type
                        </label>
                        <div className="flex space-x-2">
                            <button
                                type="button"
                                onClick={() => setProfileType('ROLE_CUSTOMER')}
                                className={`flex-1 py-2 px-4 rounded focus:outline-none ${
                                    profileType === 'ROLE_CUSTOMER'
                                        ? 'bg-indigo-500 text-white'
                                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                }`}
                            >
                                Customer
                            </button>
                            <button
                                type="button"
                                onClick={() => setProfileType('ROLE_FREELANCER')}
                                className={`flex-1 py-2 px-4 rounded focus:outline-none ${
                                    profileType === 'ROLE_FREELANCER'
                                        ? 'bg-indigo-500 text-white'
                                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                }`}
                            >
                                Freelancer
                            </button>
                        </div>
                    </div>

                    {/* Поле для ввода email */}
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-gray-700 text-sm font-medium mb-2">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className={`w-full px-3 py-2 border ${
                                emailError ? 'border-red-500' : 'border-gray-300'
                            } rounded focus:outline-none focus:ring-2 focus:ring-indigo-400`}
                            required
                        />
                        {emailError && (
                            <p className="text-sm text-red-500 mt-1">{emailError}</p>
                        )}
                    </div>

                    {/* Поле для ввода username */}
                    <div className="mb-4">
                        <label htmlFor="username" className="block text-gray-700 text-sm font-medium mb-2">
                            Username
                        </label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            placeholder="Enter your username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className={`w-full px-3 py-2 border ${
                                usernameError ? 'border-red-500' : 'border-gray-300'
                            } rounded focus:outline-none focus:ring-2 focus:ring-indigo-400`}
                            required
                        />
                        {usernameError && (
                            <p className="text-sm text-red-500 mt-1">{usernameError}</p>
                        )}
                    </div>

                    {/* Поле для ввода пароля */}
                    <div className="mb-4">
                        <label htmlFor="password" className="block text-gray-700 text-sm font-medium mb-2">
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={handlePasswordChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
                            required
                        />
                        {passwordStrength && (
                            <p className="text-sm mt-1">
                                Password Strength: <span className="font-medium">{passwordStrength}</span>
                            </p>
                        )}
                    </div>

                    {/* Поле для подтверждения пароля */}
                    <div className="mb-6">
                        <label htmlFor="confirmPassword" className="block text-gray-700 text-sm font-medium mb-2">
                            Confirm Password
                        </label>
                        <input
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            placeholder="Confirm your password"
                            value={confirmPassword}
                            onChange={handleConfirmPasswordChange}
                            className={`w-full px-3 py-2 border ${
                                passwordsMatch ? 'border-gray-300' : 'border-red-500'
                            } rounded focus:outline-none focus:ring-2 focus:ring-indigo-400`}
                            required
                        />
                        {!passwordsMatch && (
                            <p className="text-sm text-red-500 mt-1">Passwords do not match!</p>
                        )}
                    </div>

                    {/* Кнопка для регистрации */}
                    <button
                        type="submit"
                        className="w-full bg-indigo-500 text-white py-2 px-4 rounded hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    >
                        Sign Up
                    </button>
                </form>

                {/* Ссылка на страницу входа */}
                <div className="mt-4 text-center">
                    <span className="text-gray-600">Already have an account? </span>
                    <NavLink
                        to="/sign-in"
                        className="text-indigo-500 hover:text-indigo-600 font-medium"
                    >
                        Sign In
                    </NavLink>
                </div>
            </div>
        </BackgroundImage>
    );
}