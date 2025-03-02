import {useEffect, useState} from "react";
import {Avatar, message} from "antd";
import {UserOutlined} from "@ant-design/icons";
import {useNavigate} from "react-router-dom";

export default function ProfileInfoComponent({user, setUser, fetchAndSetProfileInfo}) {

    const navigate = useNavigate();

    const [newProfilePicture, setNewProfilePicture] = useState(null);

    const [isEditingUsername, setIsEditingUsername] = useState(false);
    const [newUsername, setNewUsername] = useState('');

    const [isEditingEmail, setIsEditingEmail] = useState(false);
    const [newEmail, setNewEmail] = useState('');

    const [isEditingDetails, setIsEditingDetails] = useState(false);

    const [tempUserDetails, setTempUserDetails] = useState({
        name: user.name,
        surname: user.surname,
        middleName: user.middleName,
        description: user.description,
    });

    useEffect(() => {
        setTempUserDetails({
            name: user.name || '',
            surname: user.surname || '',
            middleName: user.middleName || '',
            description: user.description || '',
        })
    }, [user])

    console.log(tempUserDetails)
    const token = localStorage.getItem('jwt');

    // Обработчик загрузки картинки профиля
    const handleProfilePictureChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setNewProfilePicture(file);
            setUser((prev) => ({ ...prev, profilePictureUrl: URL.createObjectURL(file) }));
        }
    };

    // Обработчик отправки картинки на сервер
    const handleUploadProfilePicture = async () => {
        if (!newProfilePicture) {
            message.warning('Please select a file first.');
            return;
        }

        const formData = new FormData();
        formData.append('file', newProfilePicture);

        try {
            const response = await fetch('http://localhost:8080/user/update-profile-picture', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('jwt')}`,
                },
                body: formData,
            });

            if (response.ok) {
                const result = await response.json();
                message.success(result.message || 'Profile picture updated successfully');
                // Обновляем состояние пользователя, если сервер возвращает обновленные данные
                fetchAndSetProfileInfo(); // Предположим, что эта функция загружает обновленные данные профиля
            } else {
                const errorData = await response.json();
                message.error(errorData.message || 'Failed to update profile picture');
            }
        } catch (error) {
            console.error('Error:', error);
            message.error('An error occurred while updating profile picture');
        }
    };

    // Обработчик смены username
    const handleChangeUsername = async () => {
        try {
            const response = await fetch('http://localhost:8080/user/change-username', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ newUsername }),
            });

            if (response.ok) {
                setUser((prev) => ({ ...prev, username: newUsername }));
                setIsEditingUsername(false);
                message.success('Username successfully changed');
            } else {
                const errorData = await response.json();
                message.error(errorData.message || 'Failed to change username');
            }
        } catch (error) {
            console.error('Error:', error);
            message.error('An error occurred while changing username');
        }

        localStorage.removeItem('jwt');
        navigate('/sign-in');
    };

    // Обработчик смены email
    const handleChangeEmail = async () => {
        try {
            const response = await fetch('http://localhost:8080/user/change-email', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ newEmail }),
            });

            if (response.ok) {
                setUser((prev) => ({ ...prev, email: newEmail }));
                setIsEditingEmail(false);
                message.success('Email successfully changed');
            } else {
                const errorData = await response.json();
                message.error(errorData.message || 'Failed to change email');
            }
        } catch (error) {
            console.error('Error:', error);
        }
        localStorage.removeItem('jwt');
        navigate('/sign-in');
    };

    // Обработчик изменения временных данных пользователя
    const handleTempUserDetailsChange = (e) => {
        const { name, value } = e.target;
        setTempUserDetails((prev) => ({ ...prev, [name]: value }));
    };

    // Обработчик отправки формы
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('http://localhost:8080/user/update-user-details', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(tempUserDetails),
            });

            if (response.ok) {
                const result = await response.json();
                message.success(result.message || 'User details updated successfully');
                setUser((prev) => ({ ...prev, ...tempUserDetails }));
                setIsEditingDetails(false);
            } else {
                const errorData = await response.json();
                message.error(errorData.message || 'Failed to update user details');
            }
        } catch (error) {
            console.error('Error:', error);
            message.error('An error occurred while updating user details');
        }
    };

    // Обработчик подтверждения email
    const handleVerifyEmail = () => {
        navigate('/confirm-email', { state: { from: window.location.pathname } })
    };

    return (
        <>
            {/* Форма для редактирования данных */}
            <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Profile Information</h2>

                {/* Картинка профиля */}
                <div className="flex flex-col space-y-4 mb-6">
                    {/* Аватар с использованием компонента Avatar из antd */}
                    <Avatar
                        src={user.profilePictureUrl}
                        icon={<UserOutlined />}
                        alt="Profile"
                        size={150}
                        className="rounded-full object-cover"
                    />

                    {/* Блок для выбора файла и загрузки */}
                    <div className="flex items-center space-x-4">
                        <input
                            className="px-4 py-2 bg-indigo-500 text-white rounded cursor-pointer hover:bg-indigo-600 focus:outline-none"
                            type="file"
                            accept="image/*"
                            onChange={handleProfilePictureChange}
                            id="profile-picture-upload"
                        />

                        {/* Кнопка для отправки файла на сервер */}
                        <button
                            type="button"
                            onClick={handleUploadProfilePicture}
                            disabled={!newProfilePicture}
                            className="px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600 disabled:bg-indigo-300"
                        >
                            Upload
                        </button>
                    </div>
                </div>

                {/* Форма для username */}
                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700">Username</label>
                    {isEditingUsername ? (
                        <div className="flex items-center space-x-2">
                            <input
                                type="text"
                                value={newUsername}
                                onChange={(e) => setNewUsername(e.target.value)}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            />
                            <button
                                type="button"
                                onClick={handleChangeUsername}
                                className="px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600"
                            >
                                Save
                            </button>
                            <button
                                type="button"
                                onClick={() => setIsEditingUsername(false)}
                                className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                            >
                                Cancel
                            </button>
                        </div>
                    ) : (
                        <div className="flex items-center space-x-2">
                                <span className="mt-1 block w-full rounded-md border-gray-300 shadow-sm">
                                    {user.username || 'No username set'}
                                </span>
                            <button
                                type="button"
                                onClick={() => setIsEditingUsername(true)}
                                className="px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600"
                            >
                                Edit
                            </button>
                        </div>
                    )}
                </div>

                {/* Форма для email */}
                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    {isEditingEmail ? (
                        <div className="flex items-center space-x-2">
                            <input
                                type="email"
                                value={newEmail}
                                onChange={(e) => setNewEmail(e.target.value)}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            />
                            <button
                                type="button"
                                onClick={handleChangeEmail}
                                className="px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600"
                            >
                                Save
                            </button>
                            <button
                                type="button"
                                onClick={() => setIsEditingEmail(false)}
                                className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                            >
                                Cancel
                            </button>
                        </div>
                    ) : (
                        <div className="flex items-center space-x-2">
                                <span className="mt-1 block w-full rounded-md border-gray-300 shadow-sm">
                                    {user.email || 'No email set'}
                                </span>
                            <button
                                type="button"
                                onClick={() => setIsEditingEmail(true)}
                                className="px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600"
                            >
                                Edit
                            </button>
                        </div>
                    )}
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

                {/* Форма для остальных данных профиля */}
                <div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Имя */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Name</label>
                            <input
                                type="text"
                                name="name"
                                value={tempUserDetails.name || ''}
                                onChange={handleTempUserDetailsChange}
                                disabled={!isEditingDetails}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            />
                        </div>

                        {/* Фамилия */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Surname</label>
                            <input
                                type="text"
                                name="surname"
                                value={tempUserDetails.surname || ''}
                                onChange={handleTempUserDetailsChange}
                                disabled={!isEditingDetails}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            />
                        </div>

                        {/* Отчество */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Middle Name</label>
                            <input
                                type="text"
                                name="middleName"
                                value={tempUserDetails.middleName || ''}
                                onChange={handleTempUserDetailsChange}
                                disabled={!isEditingDetails}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            />
                        </div>

                        {/* Описание */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700">Description</label>
                            <textarea
                                name="description"
                                value={tempUserDetails.description || ''}
                                onChange={handleTempUserDetailsChange}
                                disabled={!isEditingDetails}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                rows={3}
                            />
                        </div>
                    </div>

                    {/* Кнопки */}
                    <div className="mt-6 flex justify-end space-x-4">
                        {isEditingDetails ? (
                            <>
                                <button
                                    type="submit"
                                    onClick={handleSubmit}
                                    className="px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600"
                                >
                                    Save
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setIsEditingDetails(false)}
                                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                                >
                                    Cancel
                                </button>
                            </>
                        ) : (
                            <button
                                type="button"
                                onClick={() => setIsEditingDetails(true)}
                                className="px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600"
                            >
                                Edit
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}