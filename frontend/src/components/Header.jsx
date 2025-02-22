import {NavLink} from 'react-router-dom'

export default function Header() {

    return (
        <header className="flex items-center justify-between px-6 py-4 bg-gray-800 text-white shadow-md">
            {/* Левое меню */}
            <div className="flex items-center space-x-6">
                <span className="text-xl font-bold text-indigo-400">
                    <NavLink to="/groups" className="hover:text-indigo-300 transition duration-200">
                        Lab1
                    </NavLink>
                </span>
                <nav className="flex space-x-4">
                    <NavLink
                        to="/groups"
                        className={({isActive}) =>
                            isActive
                                ? "text-indigo-400 font-semibold"
                                : "text-white hover:text-indigo-400"
                        }
                    >
                        All Groups
                    </NavLink>
                    <NavLink
                        to="/special"
                        className={({isActive}) =>
                            isActive
                                ? "text-indigo-400 font-semibold"
                                : "text-white hover:text-indigo-400"
                        }
                    >
                        Special Functions
                    </NavLink>
                    <NavLink
                        to="/imports"
                        className={({isActive}) =>
                            isActive
                                ? "text-indigo-400 font-semibold"
                                : "text-white hover:text-indigo-400"
                        }
                    >
                        Imports History
                    </NavLink>

                    {userRole === "ROLE_ADMIN" && (
                        <NavLink
                            to="/admin"
                            className={({isActive}) =>
                                isActive
                                    ? "text-indigo-400 font-semibold"
                                    : "text-white hover:text-indigo-400"
                            }
                        >
                            Admin Panel
                        </NavLink>
                    )}
                </nav>
            </div>

            {/* Правая сторона */}
            <div className="flex items-center space-x-4">
                {userName ? (
                    <>
                        <span
                            className="font-medium cursor-pointer hover:text-indigo-300 transition duration-200"
                            onClick={() => setIsModalOpen(true)}
                        >
                            {userName}
                        </span>
                        {/* Иконка для пользователей с ролью ROLE_USER */}
                        {userRole === "ROLE_USER" ? (
                            <FaUserCircle
                                className="text-3xl text-indigo-400 cursor-pointer hover:text-indigo-300 transition duration-200"
                                onClick={() => setIsModalOpen(true)}
                            />
                        ) : (
                            // Иконка для пользователей с ролью ROLE_ADMIN
                            <FaUserShield
                                className="text-3xl text-indigo-400 cursor-pointer hover:text-indigo-300 transition duration-200"
                                onClick={() => setIsModalOpen(true)}
                            />
                        )}
                        <button
                            onClick={handleLogout}
                            className="px-4 py-2 bg-red-500 text-white font-medium rounded hover:bg-red-600 transition duration-200"
                        >
                            Sign out
                        </button>
                    </>
                ) : (
                    <>
                        <NavLink
                            to="/sign-in"
                            className="px-4 py-2 bg-indigo-500 text-white font-medium rounded hover:bg-indigo-600 transition duration-200"
                        >
                            Sign In
                        </NavLink>
                        <NavLink
                            to="/sign-up"
                            className="px-4 py-2 bg-green-500 text-white font-medium rounded hover:bg-green-600 transition duration-200"
                        >
                            Sign Up
                        </NavLink>
                    </>
                )}
            </div>


        </header>
    );
}