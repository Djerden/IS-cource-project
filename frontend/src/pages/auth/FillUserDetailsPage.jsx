import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BackgroundImage from "../../components/BackgroundImage.jsx";

export default function FillUserDetails() {
    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [middleName, setMiddleName] = useState('');
    const [description, setDescription] = useState('');
    const navigate = useNavigate();

    // Обработчик отправки формы
    const handleSubmit = async (e) => {
        e.preventDefault();

        const userDetails = {
            name,
            surname,
            middleName,
            description,
        };

        const token = localStorage.getItem('jwt'); // Получаем JWT токен из localStorage

        try {
            const response = await fetch('http://localhost:8080/user/update-user-details', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userDetails),
            });

            if (response.ok) {
                alert('Profile updated successfully!');
                navigate('/orders'); // Перенаправляем на страницу /orders
            } else {
                const data = await response.json();
                alert(data.message || 'Failed to update profile.');
            }
        } catch (error) {
            alert('An error occurred while updating the profile.');
        }
    };

    // Обработчик пропуска
    const handleSkip = () => {
        navigate('/orders'); // Перенаправляем на страницу /orders
    };

    return (
        <BackgroundImage>
            <div className="bg-white p-8 rounded-lg shadow-lg w-96">
                <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">Complete Your Profile</h1>

                {/* Форма для заполнения данных */}
                <form onSubmit={handleSubmit}>
                    {/* Поле для имени */}
                    <div className="mb-4">
                        <label htmlFor="name" className="block text-gray-700 text-sm font-medium mb-2">
                            Name
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            placeholder="Enter your name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
                            required
                        />
                    </div>

                    {/* Поле для фамилии */}
                    <div className="mb-4">
                        <label htmlFor="surname" className="block text-gray-700 text-sm font-medium mb-2">
                            Surname
                        </label>
                        <input
                            type="text"
                            id="surname"
                            name="surname"
                            placeholder="Enter your surname"
                            value={surname}
                            onChange={(e) => setSurname(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
                            required
                        />
                    </div>

                    {/* Поле для отчества (необязательное) */}
                    <div className="mb-4">
                        <label htmlFor="middleName" className="block text-gray-700 text-sm font-medium mb-2">
                            Middle Name (optional)
                        </label>
                        <input
                            type="text"
                            id="middleName"
                            name="middleName"
                            placeholder="Enter your middle name"
                            value={middleName}
                            onChange={(e) => setMiddleName(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
                        />
                    </div>

                    {/* Поле для описания */}
                    <div className="mb-6">
                        <label htmlFor="description" className="block text-gray-700 text-sm font-medium mb-2">
                            Description
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            placeholder="Tell us about yourself"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-y min-h-[100px]"
                            rows={4}
                        />
                    </div>

                    {/* Кнопки */}
                    <div className="flex justify-between">
                        <button
                            type="button"
                            onClick={handleSkip}
                            className="px-4 py-2 text-indigo-500 font-medium rounded hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                        >
                            Skip
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-indigo-500 text-white font-medium rounded hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                        >
                            Confirm
                        </button>
                    </div>
                </form>
            </div>
        </BackgroundImage>
    );
}