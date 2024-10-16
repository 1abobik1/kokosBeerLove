import React, {useContext, useEffect} from 'react';
import './App.css';
import MainPage from './pages/generalPages/MainPages/MainPage';
import {Route, Routes} from 'react-router-dom';
import {observer} from 'mobx-react-lite';
import {Context} from './index';
import Matches from './pages/generalPages/Matches/Matches';
import AdminPage from './pages/generalPages/MainPages/AdminPage';
import NewsAdmin from './pages/adminPages/NewsAdmin';
import MatchesAdmin from './pages/adminPages/MatchesAdmin';
import AboutClubAdmin from './pages/adminPages/AboutClubAdmin';
import ShopAdmin from './pages/adminPages/ShopAdmin';
import NotFound from './pages/generalPages/MainPages/NotFound';
import RequireAuthAdmin from './pages/hoc/RequireAuthAdmin';
import News from './pages/generalPages/News/News';
import AboutClub from './pages/generalPages/AboutClub/AboutClub';
import Shop from './pages/generalPages/Shop/Shop';
import Team from './pages/generalPages/Team/Team';
import NewsDetails from './pages/generalPages/News/NewsDetails';
import UserProfile from './pages/generalPages/MainPages/UserProfile';
import MatchDetails from './pages/generalPages/Matches/MatchDetails';
import ShopDetails from './pages/generalPages/Shop/ShopDetails';
import TeamAdmin from './pages/adminPages/TeamAdmin';
import RequireAuthFan from './pages/hoc/RequireAuthFan';

function App() {
    const {store} = useContext(Context);

    useEffect(() => {
        if (localStorage.getItem('token')) {
            store.checkAuth();
        }
    }, []);

    if (store.isLoading) {
        return <div className="loading-spinner"></div>;
    }

    return (
        <div className="App">
            <Routes>
                <Route path="/" element={<MainPage />} />
                <Route path="/matches" element={<Matches />} />
                <Route path="/match/:id" element={<MatchDetails />} />
                <Route path="/news" element={<News />} />
                <Route path="/news/:id" element={<NewsDetails />} />
                <Route path="/about" element={<AboutClub />} />
                <Route path="/shop" element={<Shop />} />
                <Route path="/shop/:id" element={<ShopDetails />} />
                <Route path="/team" element={<Team />} />
                <Route
                    path="/admin/"
                    element={
                        <RequireAuthAdmin>
                            <AdminPage />
                        </RequireAuthAdmin>
                    }
                >
                    <Route
                        path="news"
                        element={
                            <RequireAuthAdmin>
                                <NewsAdmin />
                            </RequireAuthAdmin>
                        }
                    />
                    <Route
                        path="matches"
                        element={
                            <RequireAuthAdmin>
                                <MatchesAdmin />
                            </RequireAuthAdmin>
                        }
                    />
                    <Route
                        path="team"
                        element={
                            <RequireAuthAdmin>
                                <TeamAdmin />
                            </RequireAuthAdmin>
                        }
                    />
                    <Route
                        path="about"
                        element={
                            <RequireAuthAdmin>
                                <AboutClubAdmin />
                            </RequireAuthAdmin>
                        }
                    />
                    <Route
                        path="shop"
                        element={
                            <RequireAuthAdmin>
                                <ShopAdmin />
                            </RequireAuthAdmin>
                        }
                    />
                </Route>
                <Route
                    path="/fan"
                    element={
                        <RequireAuthFan>
                            <UserProfile />
                        </RequireAuthFan>
                    }
                />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </div>
    );
}

export default observer(App);
