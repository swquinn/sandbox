import React from 'react';
import { Link } from 'react-router-dom';
import Article from 'app/components/Article';
import Sidebar from 'app/components/Sidebar';

function DashboardPage() {
    return (
        <React.Fragment>
            <Article>
                Dashboard
            </Article>

            <Sidebar title="Huh?">
                <ul>
                    <li><Link to="/">Dashboard</Link></li>
                    <li><Link to="/login">Login</Link></li>
                    <li><Link to="/account">My Account</Link></li>
                </ul>
            </Sidebar>
        </React.Fragment>
    );
}

export default DashboardPage;
