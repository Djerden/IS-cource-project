import React, { useState } from 'react';

// Тестовые данные пользователя
const testUserData = {
    id: 1,
    username: 'john_doe',
    email: 'john.doe@example.com',
    name: 'John',
    surname: 'Doe',
    middleName: 'Michael',
    role: 'ROLE_FREELANCER',
    description: 'Experienced software developer with a passion for building scalable web applications.',
    profilePictureUrl: 'https://via.placeholder.com/150',
    isEmailVerified: false,
    isBanned: false,
    banReason: null,
    skills: ['JavaScript', 'React', 'Node.js'], // Навыки пользователя
};

// Тестовые доступные навыки
const testAvailableSkills = [
    'TypeScript',
    'Python',
    'Java',
    'HTML',
    'CSS',
    'Docker',
    'Kubernetes',
    'SQL',
    'MongoDB',
];

export default function SettingsPage() {
    const [user, setUser] = useState(testUserData);
    const [availableSkills, setAvailableSkills] = useState(testAvailableSkills);
    const [isEditingSkills, setIsEditingSkills] = useState(false); // Режим редактирования навыков
    const [isEditing, setIsEditing] = useState(false); // Режим редактирования профиля
    const [newProfilePicture, setNewProfilePicture] = useState(null); // Новая картинка профиля
    const [passwordForm, setPasswordForm] = useState({
        oldPassword: '',
        newPassword: '',
        confirmPassword: '',
    });

    // Обработчик изменения данных пользователя
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUser((prev) => ({ ...prev, [name]: value }));
    };

    // Обработчик изменения пароля
    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswordForm((prev) => ({ ...prev, [name]: value }));
    };

    // Обработчик загрузки картинки профиля
    const handleProfilePictureChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setNewProfilePicture(file);
            setUser((prev) => ({ ...prev, profilePictureUrl: URL.createObjectURL(file) }));
        }
    };

    // Обработчик отправки формы
    const handleSubmit = (e) => {
        e.preventDefault();
        // Здесь можно добавить логику для отправки данных на сервер
        console.log('Updated User Data:', user);
        setIsEditing(false); // Выходим из режима редактирования
    };

    // Обработчик смены пароля
    const handlePasswordSubmit = (e) => {
        e.preventDefault();
        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
            alert('New password and confirmation do not match.');
            return;
        }
        // Здесь можно добавить логику для смены пароля
        console.log('Password Change Data:', passwordForm);
        setPasswordForm({ oldPassword: '', newPassword: '', confirmPassword: '' });
    };

    // Обработчик подтверждения email
    const handleVerifyEmail = () => {
        // Здесь можно добавить логику для отправки кода подтверждения
        alert('A verification code has been sent to your email.');
    };

    // Обработчик добавления навыка
    const handleAddSkill = (skill) => {
        setUser((prev) => ({ ...prev, skills: [...prev.skills, skill] }));
        setAvailableSkills((prev) => prev.filter((s) => s !== skill));
    };

    // Обработчик удаления навыка
    const handleRemoveSkill = (skill) => {
        setUser((prev) => ({ ...prev, skills: prev.skills.filter((s) => s !== skill) }));
        setAvailableSkills((prev) => [...prev, skill]);
    };

    // Если пользователь забанен, показываем только причину блокировки
    if (user.isBanned) {
        return (
            <div className="p-8">
                <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md">
                    <h1 className="text-2xl font-bold text-red-600 mb-4">Your account is banned</h1>
                    <p className="text-gray-700">{user.banReason}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-8">
            <div className="max-w-4xl mx-auto">
                {/* Заголовок */}
                <h1 className="text-3xl font-bold text-gray-800 mb-6">Settings</h1>

                {/* Форма для редактирования данных */}
                <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">Profile Information</h2>

                    {/* Картинка профиля */}
                    <div className="flex items-center space-x-4 mb-6">
                        <img
                            src={user.profilePictureUrl}
                            alt="Profile"
                            className="w-20 h-20 rounded-full object-cover"
                        />
                        <div>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleProfilePictureChange}
                                className="text-sm text-gray-600"
                            />
                        </div>
                    </div>

                    {/* Форма */}
                    <form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Имя */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={user.name}
                                    onChange={handleInputChange}
                                    disabled={!isEditing}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                />
                            </div>

                            {/* Фамилия */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Surname</label>
                                <input
                                    type="text"
                                    name="surname"
                                    value={user.surname}
                                    onChange={handleInputChange}
                                    disabled={!isEditing}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                />
                            </div>

                            {/* Отчество */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Middle Name</label>
                                <input
                                    type="text"
                                    name="middleName"
                                    value={user.middleName}
                                    onChange={handleInputChange}
                                    disabled={!isEditing}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                />
                            </div>

                            {/* Email */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={user.email}
                                    onChange={handleInputChange}
                                    disabled={!isEditing}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                />
                                {!user.isEmailVerified && (
                                    <button
                                        type="button"
                                        onClick={handleVerifyEmail}
                                        className="mt-2 text-sm text-indigo-600 hover:text-indigo-500"
                                    >
                                        Verify Email
                                    </button>
                                )}
                            </div>

                            {/* Описание */}
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700">Description</label>
                                <textarea
                                    name="description"
                                    value={user.description}
                                    onChange={handleInputChange}
                                    disabled={!isEditing}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    rows={3}
                                />
                            </div>
                        </div>

                        {/* Кнопки */}
                        <div className="mt-6 flex justify-end space-x-4">
                            {isEditing ? (
                                <>
                                    <button
                                        type="button"
                                        onClick={() => setIsEditing(false)}
                                        className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600"
                                    >
                                        Save Changes
                                    </button>
                                </>
                            ) : (
                                <button
                                    type="button"
                                    onClick={() => setIsEditing(true)}
                                    className="px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600"
                                >
                                    Edit Profile
                                </button>
                            )}
                        </div>
                    </form>
                </div>

                {/* Блок с навыками */}
                <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">Skills</h2>

                    {/* Текущие навыки пользователя */}
                    <div className="flex flex-wrap gap-2 mb-4">
                        {user.skills.map((skill, index) => (
                            <span
                                key={index}
                                onClick={() => handleRemoveSkill(skill)}
                                className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm cursor-pointer hover:bg-indigo-200"
                            >
                                {skill}
                            </span>
                        ))}
                    </div>

                    {/* Кнопка редактирования навыков */}
                    <button
                        type="button"
                        onClick={() => setIsEditingSkills(!isEditingSkills)}
                        className="px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600"
                    >
                        {isEditingSkills ? 'Cancel Editing' : 'Edit Skills'}
                    </button>

                    {/* Доступные навыки (отображаются только в режиме редактирования) */}
                    {isEditingSkills && (
                        <div className="mt-4">
                            <h3 className="text-lg font-semibold text-gray-800 mb-2">Available Skills</h3>
                            <div className="flex flex-wrap gap-2">
                                {availableSkills.map((skill, index) => (
                                    <span
                                        key={index}
                                        onClick={() => handleAddSkill(skill)}
                                        className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm cursor-pointer hover:bg-green-200"
                                    >
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

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
                                />
                            </div>
                        </div>

                        {/* Кнопка */}
                        <div className="mt-6">
                            <button
                                type="submit"
                                className="px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600"
                            >
                                Change Password
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}