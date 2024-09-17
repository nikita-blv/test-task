import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import { PrivateRoute } from '@root/routes/PrivateRoute';
import { PublicRoute } from '@root/routes/PublicRoute';
import { routes } from '@root/routes/routes';

import { HomePage } from '@root/pages/index';
import { SignIn } from '@root/pages/SignIn';
import { LootBoxes } from '@root/pages/LootBoxes';
import { SignUp } from "@root/pages/SignUp";
import { Stats } from "@root/pages/Stats";

const router = createBrowserRouter([
    {
        path: '/client',
        element: (
            <PublicRoute>
                <HomePage />
            </PublicRoute>
        ),
    },
    {
        path: routes.signIn,
        element: (
            <PublicRoute>
                <SignIn />
            </PublicRoute>
        ),
    },
    {
        path: routes.signUp,
        element: (
            <PublicRoute>
                <SignUp />
            </PublicRoute>
        ),
    },
    {
        path: routes.lootBoxes,
        element: (
            <PrivateRoute>
                <LootBoxes />
            </PrivateRoute>
        ),
    },
    {
        path: routes.stats,
        element: (
            <PrivateRoute>
                <Stats />
            </PrivateRoute>
        ),
    },
]);

export const App = () => {
    return <RouterProvider router={router} />;
};
