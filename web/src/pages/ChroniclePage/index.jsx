import React from 'react';
import Article from 'app/components/Article';
import Sidebar from 'app/components/Sidebar';


function ChroniclePage() {
    return (
        <React.Fragment>
            <Article>
                Article
            </Article>
            <Sidebar anchor="right">
                Sidebar
            </Sidebar>
        </React.Fragment>
    );
}

export default ChroniclePage;
