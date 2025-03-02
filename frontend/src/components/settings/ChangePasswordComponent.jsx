import { useState } from "react";

export default function ChangePasswordComponent({ token }) {
    const [passwordForm, setPasswordForm] = useState({
        oldPassword: '',
        newPassword: '',
        confirmPassword: '',
    });

    const [message, setMessage] = useState(null); // Сообщение об успехе или ошибке
    const [isLoading, setIsLoading] = useState(false); // Состояние загрузки

    // Обработчик смены пароля
    const handlePasswordSubmit = async (e) => {
        e.preventDefault();

        // Проверка совпадения нового пароля и подтверждения
        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
            setMessage("New password and confirmation do not match.");
            return;
        }

        // Подготовка данных для отправки
        const changePasswordRequest = {
            oldPassword: passwordForm.oldPassword,
            newPassword: passwordForm.newPassword,
        };

        setIsLoading(true); // Начало загрузки
        setMessage(null); // Сброс сообщения

        try {
            const response = await fetch('http://localhost:8080/user/change-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(changePasswordRequest),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Failed to change password.");
            }

            const result = await response.json();
            setMessage(result.message || "Password changed successfully!"); // Успешное сообщение
            setPasswordForm({ oldPassword: '', newPassword: '', confirmPassword: '' }); // Сброс формы
        } catch (error) {
            setMessage(error.message || "An error occurred while changing the password."); // Ошибка
        } finally {
            setIsLoading(false); // Конец загрузки
        }
    };

    // Обработчик изменения полей формы
    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswordForm((prev) => ({ ...prev, [name]: value }));
    };

    return (
        <>
            {/* Форма для смены пароля */}
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Change Password</h2>
                <form onSubmit={handlePasswordSubmit}>
                    <div className="space-y-4">
                        {/* Старый пароль */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Old Password</label>
                            <input
                                type="password"
                                name="oldPassword"
                                value={passwordForm.oldPassword}
                                onChange={handlePasswordChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                required
                            />
                        </div>

                        {/* Новый пароль */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">New Password</label>
                            <input
                                type="password"
                                name="newPassword"
                                value={passwordForm.newPassword}
                                onChange={handlePasswordChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                required
                            />
                        </div>

                        {/* Подтверждение нового пароля */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Confirm New Password</label>
                            <input
                                type="password"
                                name="confirmPassword"
                                value={passwordForm.confirmPassword}
                                onChange={handlePasswordChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                required
                            />
                        </div>
                    </div>

                    {/* Сообщение об успехе или ошибке */}
                    {message && (
                        <div className="mt-4">
                            <p className={`text-sm ${message.includes("successfully") ? "text-green-600" : "text-red-600"}`}>
                                {message}
                            </p>
                        </div>
                    )}

                    {/* Кнопка */}
                    <div className="mt-6">
                        <button
                            type="submit"
                            className="px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600 disabled:opacity-50"
                            disabled={isLoading}
                        >
                            {isLoading ? "Changing Password..." : "Change Password"}
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
}