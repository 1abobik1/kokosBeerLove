import React, {FC} from 'react';
import AdminNav from '../../adminPages/adminPageComponents/AdminNav';
import {Outlet} from 'react-router-dom';

const AdminPage: FC = () => {
    return (
        <div>
            <AdminNav />
            <Outlet />
        </div>
    );
};

export default AdminPage;
