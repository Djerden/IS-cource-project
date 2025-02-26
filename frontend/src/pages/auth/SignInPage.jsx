import backgroundImage from './../../assets/black_sky.jpg'
import {useEffect} from "react";
import {NavLink} from "react-router-dom";
import BackgroundImage from "../../components/BackgroundImage.jsx";

export default function SignInPage() {

    return (
        <BackgroundImage>
            {/* Контейнер для формы */}
            <div className="bg-white p-8 rounded-lg shadow-lg w-96">
                <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">Sign In</h1>

                {/* Форма для входа */}
                <form>
                    {/* Поле для ввода username или email */}
                    <div className="mb-4">
                        <label htmlFor="username" className="block text-gray-700 text-sm font-medium mb-2">
                            Username or Email
                        </label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            placeholder="Enter your username or email"
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
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
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
                        />
                    </div>

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