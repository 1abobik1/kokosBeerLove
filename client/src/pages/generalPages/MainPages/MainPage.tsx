import React, {Suspense} from 'react';
import Header from '../../../components/HeaderAndItsComponents/Header';
import Footer from '../../../components/Footer/Footer';
import NearestMatch from '../../../components/MainPageComponents/NearestMatch';
import './MainPage.css';

const ShopPreview = React.lazy(() => import('../../../components/MainPageComponents/ShopPreview'));
const NewsPreview = React.lazy(() => import('../../../components/MainPageComponents/NewsPreview'));
const ClubPreview = React.lazy(() => import('../../../components/MainPageComponents/ClubPreview'));
const MatchesPreview = React.lazy(() => import('../../../components/MainPageComponents/MatchesPreview'));

const MainPage: React.FC = () => {
    return (
        <div
            style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'column',
                width: '100%',
            }}
            id="header"
        >
            <Header />
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100%',
                    width: '100%',

                    background: `linear-gradient(180deg, rgba(227,39,38,0) 0%, rgba(0,0,0,0) 0%, rgba(227,38,39,0.5) 50%, rgba(0,0,0,0.7) 50%, rgba(0,0,0,0.7) 50%, rgba(227,39,38,0.5) 50%, rgba(0,0,0,0) 100%, rgba(227,39,38,0) 100%)`,
                }}
            >
                <Suspense fallback={<div className="loading-spinner"></div>}>
                    <NearestMatch />
                    <MatchesPreview />
                    <NewsPreview />
                </Suspense>
            </div>
            <Suspense fallback={<div className="loading-spinner"></div>}>
                <ClubPreview />
                <ShopPreview />
            </Suspense>
            <Footer />
        </div>
    );
};

export default MainPage;
