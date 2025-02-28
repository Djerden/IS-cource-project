// Компонент для карточки
import {NavLink} from "react-router-dom";

export default function HelpCard({ id, title, description }) {
    return (
        <NavLink to={`/help/${id}`} className="block">
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{title}</h3>
                <p className="text-gray-600">{description}</p>
            </div>
        </NavLink>
    );
}