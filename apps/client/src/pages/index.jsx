import { Navigate } from 'react-router-dom';
import { routes } from '@root/routes/routes.js';

export const HomePage = () => {
    return <Navigate to={routes.lootBoxes}/>
}