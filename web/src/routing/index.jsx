import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { PageRoute } from './PageRoute';
import AccountPage from 'app/pages/AccountPage';
import DashboardPage from 'app/pages/DashboardPage';
import LoginPage from 'app/pages/LoginPage';


function AppRouter(props) {
    return (
        <BrowserRouter basename="/app">
            <PageRoute exact path="/" component={DashboardPage} />
            <PageRoute path="/login" component={LoginPage} />
            {/* <CharacterRoutes /> */}
            {/* <ChronicleRoutes /> */}
            <PageRoute path="/account" component={AccountPage} />
        </BrowserRouter>
    );
}

export default AppRouter;
