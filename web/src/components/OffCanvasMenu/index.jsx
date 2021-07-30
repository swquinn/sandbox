import React from 'react';
import { NavLink } from 'react-router-dom';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import HomeIcon from '@material-ui/icons/Home';

function OffCanvasMenu() {
    return (
        <div role="presentation">
            <List>
                <ListItem button key="Dashboard" component={NavLink} to="/">
                    <ListItemIcon><HomeIcon /></ListItemIcon>
                    <ListItemText primary="Dashboard" />
                </ListItem>

                <ListItem button key="Login" component={NavLink} to="/login">
                    <ListItemIcon><HomeIcon /></ListItemIcon>
                    <ListItemText primary="Login" />
                </ListItem>

                <ListItem button key="My Account" component={NavLink} to="/account">
                    <ListItemIcon><HomeIcon /></ListItemIcon>
                    <ListItemText primary="My Account" />
                </ListItem>
            </List>
        </div>
    );
}

export default OffCanvasMenu;
