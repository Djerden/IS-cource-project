import {NavLink} from 'react-router-dom'
import {useEffect, useState} from "react";
import {Avatar} from "antd";

export default function Header() {

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("jwt");

        if (token) {
            fetch("/api/user", {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
                .then((response) => response.json())
                .then((data) => {
                    setUser(data);
                    setLoading(false);
                })
                .catch((error) => {
                    console.error("Error fetching user data:", error);
                    setLoading(false);
                });
        } else {
            setLoading(false);
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("jwt");
        setUser(null);
    };

    return (
        <header className="bg-black text-white p-4">
            <div className="container mx-auto flex justify-between items-center">
                <NavLink to="/orders" className="text-3xl font-semibold">
                    <span className="text-indigo-500">Pro</span>
                    <span>Talent</span>
                </NavLink>

                <nav className="space-x-6">
                    <NavLink to="/orders" className="text-white hover:text-indigo-500">
                        Orders
                    </NavLink>
                    <NavLink to="/freelancers" className="text-white hover:text-indigo-500">
                        Freelancers
                    </NavLink>
                    <NavLink to="/blog" className="text-white hover:text-indigo-500">
                        Blog
                    </NavLink>
                    <NavLink to="/help" className="text-white hover:text-indigo-500">
                        Help
                    </NavLink>
                </nav>

                <div className="flex items-center space-x-4">
                    {loading ? (
                        <div>Loading...</div>
                    ) : user ? (
                        <div className="flex items-center space-x-2">
                            <Avatar src={user.avatar} />
                            <span className="text-white">{user.username}</span>
                        </div>
                    ) : (
                        <>
                            <NavLink to="/sign-in" className="text-white hover:text-indigo-500">
                                Sign in
                            </NavLink>
                            <NavLink to="/sign-up" className="text-white hover:text-indigo-500">
                                Sign up
                            </NavLink>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
}
