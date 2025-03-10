import { useState, useEffect } from 'react';
import ProfileInfoComponent from "../components/settings/ProfileInfoComponent.jsx";
import SkillsInfoComponent from "../components/settings/SkillsInfoComponent.jsx";
import ChangePasswordComponent from "../components/settings/ChangePasswordComponent.jsx";

export default function SettingsPage() {
    const [user, setUser] = useState({
        id: null,
        username: '',
        email: '',
        name: '',
        surname: '',
        middleName: '',
        role: '',
        description: '',
        createdAt: '',
        rating: '',
        isEmailVerified: false,
        twoFactorEnabled: false,
        isBanned: false,
        banReason: '',
        profilePicture: [],
        pictureMimeType: ''
    });

    const token = localStorage.getItem('jwt');
    console.log(user);


    useEffect(() => {
        fetchAndSetProfileInfo();
    }, []);

    // Функция для получения данных профиля
    const fetchAndSetProfileInfo = async () => {
        try {
            const response = await fetch('http://localhost:8080/user/get-full-profile-info', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (response.ok) {
                const data = await response.json();
                setUser({
                    ...data,
                    profilePictureUrl: data.profilePicture
                        ? `data:${data.pictureMimeType};base64,${data.profilePicture}`
                        : '', // Если картинка отсутствует, оставляем пустую строку
                });
            } else {
                const errorData = await response.json();
                console.error('Error:', errorData.message || 'Failed to fetch profile info');
                alert(errorData.message || 'Failed to fetch profile info');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred while fetching profile info');
        }
    };

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

                <ProfileInfoComponent user={user} setUser={setUser} fetchAndSetProfileInfo={fetchAndSetProfileInfo}/>

                {user.role === 'ROLE_FREELANCER'? <SkillsInfoComponent token={token} /> : null}

                <ChangePasswordComponent token={token} />

            </div>
        </div>
    );
}