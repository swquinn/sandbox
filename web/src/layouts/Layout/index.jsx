import React from 'react';
import Edge from 'app/components/Edge';

function Layout(props) {
    return (
        <Edge>
            {props.children}
        </Edge>
    );
}

export default Layout;
