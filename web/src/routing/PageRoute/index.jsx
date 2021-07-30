import React from 'react';
import { Route } from 'react-router-dom';
import Layout from 'app/layouts/Layout';

export const PageRoute = ({component: Component, ...props}) => {
    return (
        <Route {...props} render={componentProps => (
            <Layout>
                <Component {...componentProps} />
            </Layout>
        )} />
    );
}
