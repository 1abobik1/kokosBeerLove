import React from 'react';
import {Link} from 'react-router-dom';

const NotFound = () => {
    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                width: '100%',
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >
            <h1>Not Found</h1>
            <Link to="/">На главную</Link>
        </div>
    );
};

export default NotFound;
