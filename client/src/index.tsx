import React, {createContext} from 'react';
import ReactDOM from 'react-dom/client';
import Store from './api/store/store';
import './index.css';
import App from './App';
import {BrowserRouter} from 'react-router-dom';

interface State {
    store: Store;
}

export const store = new Store();

export const Context = createContext<State>({
    store,
});

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
    // <React.StrictMode>
    <Context.Provider value={{store}}>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </Context.Provider>,
    // </React.StrictMode>
);
