import {createBrowserRouter, Navigate, RouterProvider} from "react-router-dom"
import Header from "./components/Header.jsx";
import Root from "./components/Root.jsx";
import ErrorPage from "./pages/ErrorPage.jsx";
import Orders from "./pages/Orders.jsx";
import Freelancers from "./pages/Freelancers.jsx";
import Blog from "./pages/Blog.jsx";
import Help from "./pages/Help.jsx";
import SignInPage from "./pages/auth/SignInPage.jsx";
import SignUpPage from "./pages/auth/SignUpPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import ProjectPage from "./pages/ProjectPage.jsx";
import SettingsPage from "./pages/SettingsPage.jsx";
import ConfirmEmailPage from "./pages/auth/ConfirmEmailPage.jsx";
import FillUserDetails from "./pages/auth/FillUserDetailsPage.jsx";
import AdminPanelPage from "./pages/admin-pages/AdminPanelPage.jsx";
import AdminListPage from "./pages/admin-pages/AdminListPage.jsx";
import UsersListPage from "./pages/admin-pages/UsersListPage.jsx";
import DisputesListPage from "./pages/admin-pages/DisputesListPage.jsx";

function App() {

    const router = createBrowserRouter([
        {
            path: '/', RouterProvider,
            element: <Root/>,
            errorElement: <ErrorPage/>,
            children: [
                {
                    path: '/',
                    element: <Navigate to="/orders" replace />
                },
                {
                    path: '/orders',
                    element:
                        <Orders />
                },
                {
                    path: '/freelancers',
                    element:
                        <Freelancers />
                },
                {
                    path: '/blog',
                    element: <Blog />
                },
                {
                    path: '/help',
                    element: <Help />
                },
                {
                    path: '/admin-panel',
                    element: <AdminPanelPage />,
                    children: [
                        {
                            path: '/admins',
                            element: <AdminListPage />
                        },
                        {
                            path: '/users',
                            element: <UsersListPage />
                        },
                        {
                            path: '/disputes',
                            element: <DisputesListPage />
                        },
                    ]
                },
                {
                    path: '/sign-in',
                    element: <SignInPage/>
                },
                {
                    path: '/sign-up',
                    element: <SignUpPage/>
                },
                {
                    path: '/confirm-email',
                    element: <ConfirmEmailPage/>
                },
                {
                    path: '/fill-user-details',
                    element: <FillUserDetails />
                },
                {
                    path: '/profile/:username', // Динамический путь для профиля (искать по username или id?)
                    element: <ProfilePage />
                },
                {
                    path: '/project/:projectId', // Проект принимаем по id
                    element: <ProjectPage />
                },
                {
                    path: '/settings', // Проект принимаем по id
                    element: <SettingsPage />
                }

            ]
        },
    ])

    return (
        <>
            <RouterProvider router={router}/>
        </>
    )
}

export default App
