import { useState, useEffect } from "react";

export default function SkillsInfoComponent({ token }) {
    const [availableSkills, setAvailableSkills] = useState([]);
    const [userSkills, setUserSkills] = useState([]);
    const [isEditingSkills, setIsEditingSkills] = useState(false);

    // Функция для выполнения запросов с JWT-токеном
    const fetchWithToken = (url, options = {}) => {
        return fetch(url, {
            ...options,
            headers: {
                ...options.headers,
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
    };

    // Загрузка всех навыков и навыков пользователя
    useEffect(() => {
        const fetchSkills = async () => {
            try {
                // Получаем все навыки
                const allSkillsResponse = await fetchWithToken('http://localhost:8080/user/skills');
                const allSkills = await allSkillsResponse.json();

                // Получаем навыки пользователя
                const userSkillsResponse = await fetchWithToken('http://localhost:8080/user/my-skills');
                const userSkills = await userSkillsResponse.json();

                // Фильтруем доступные навыки, исключая те, которые уже есть у пользователя
                const filteredAvailableSkills = allSkills.filter(
                    (skill) => !userSkills.some((userSkill) => userSkill.id === skill.id)
                );

                // Обновляем состояние
                setAvailableSkills(filteredAvailableSkills);
                setUserSkills(userSkills);
            } catch (error) {
                console.error('Ошибка при загрузке навыков:', error);
            }
        };

        fetchSkills();
    }, [token]);

    // Обработчик добавления навыка
    const handleAddSkill = async (skill) => {
        try {
            const response = await fetch(`http://localhost:8080/user/add-skill?skillId=${skill.id}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Ошибка при добавлении навыка');
            }

            const result = await response.json();
            console.log(result.message); // "Навык успешно добавлен"

            // Обновляем локальное состояние
            setUserSkills((prev) => [...prev, skill]); // Добавляем навык в список пользовательских навыков
            setAvailableSkills((prev) => prev.filter((s) => s.id !== skill.id)); // Удаляем навык из списка доступных навыков
        } catch (error) {
            console.error('Ошибка:', error);
        }
    };

    // Обработчик удаления навыка
    const handleRemoveSkill = async (skill) => {
        try {
            const response = await fetchWithToken(`http://localhost:8080/user/remove-skill?skillId=${skill.id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Ошибка при удалении навыка');
            }

            // Обновляем локальное состояние
            setUserSkills((prev) => prev.filter((s) => s.id !== skill.id)); // Удаляем навык из списка пользовательских навыков
            setAvailableSkills((prev) => [...prev, skill]); // Добавляем навык в список доступных навыков
        } catch (error) {
            console.error('Ошибка при удалении навыка:', error);
        }
    };

    console.log(userSkills);

    return (
        <>
            {/* Блок с навыками */}
            <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Skills</h2>

                {/* Текущие навыки пользователя */}
                <div className="flex flex-wrap gap-2 mb-4">
                    {userSkills.map((skill, index) => (
                        <span
                            key={index}
                            onClick={() => handleRemoveSkill(skill)}
                            className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm cursor-pointer hover:bg-indigo-200"
                        >
                            {skill.name}
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
                                    {skill.name}
                                </span>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}