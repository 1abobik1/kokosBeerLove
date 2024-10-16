import React, {FC, useEffect, useState} from 'react';
import {Navigate} from 'react-router-dom';
import {observer} from 'mobx-react-lite';
import {store} from '../../index';

const RequireAuthFan: FC<any> = ({children}) => {
    const [loading, setLoading] = useState(true);
    const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

    useEffect(() => {
        const checkAuthentication = async () => {
            try {
                if (localStorage.getItem('token') && !store.isAuth) {
                    await store.checkAuth();
                    setIsAuthorized(true);
                } else if (!localStorage.getItem('token')) {
                    setIsAuthorized(false);
                } else {
                    setIsAuthorized(true);
                }
            } catch (error: any) {
                setIsAuthorized(false); // Ошибка при проверке
            } finally {
                setLoading(false); // Завершаем проверку
            }
        };

        checkAuthentication();
    }, []);

    if (loading) {
        return <div className="loading-spinner"></div>;
    }

    if (isAuthorized === false) {
        return <Navigate to="/" />;
    }

    return children;
};

export default observer(RequireAuthFan);
