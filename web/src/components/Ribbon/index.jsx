import React from 'react';
import { Link } from 'react-router-dom';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import Drawer from '@material-ui/core/Drawer';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import Toolbar from '@material-ui/core/Toolbar';
import AccountCircle from '@material-ui/icons/AccountCircle';
import MenuIcon from '@material-ui/icons/Menu';
import PropTypes from 'prop-types';
import OffCanvasMenu from 'app/components/OffCanvasMenu';
import styles from './styles.css'

/**
 * The application bar, or ribbon, at the top of the page.
 *
 * @extends React.Component
 */
class Ribbon extends React.Component {
    static defaultProps = {
        user: null
    }

    constructor(props) {
        super(props);
        this.state = {
            open: false
        };
    }

    render() {
        return (
            <AppBar position="relative" className={styles.ribbon}>
                <Toolbar>
                    <div>
                        <IconButton
                            edge="start"
                            className={styles.menuButton}
                            color="inherit"
                            aria-label="menu"
                            onClick={this.toggleDrawer.bind(this)}
                        >
                            <MenuIcon />
                        </IconButton>
                        <SwipeableDrawer
                            anchor="left"
                            open={this.state.open}
                            onClose={this.toggleDrawer.bind(this)}
                            onOpen={this.toggleDrawer.bind(this)}
                        >
                            <OffCanvasMenu />
                        </SwipeableDrawer>
                    </div>
                    <div className={styles.grow} />
                    {!this.props.user
                        ? this.renderUnauthenticatedRibbon()
                        : this.renderAuthenticatedRibbon()}
                </Toolbar>
            </AppBar>
        );
    }

    /**
     * 
     */
    renderAuthenticatedRibbon() {
        return (
            <div>
                <IconButton
                    edge="end"
                    aria-label="account of current user"
                    // aria-controls={menuId}
                    // aria-haspopup="true"
                    // onClick={handleProfileMenuOpen}
                    color="inherit"
                >
                    <AccountCircle />
                </IconButton>
            </div>
        )
    }

    /**
     * Renders the `Ribbon` with the unauthenticated state.
     * 
     * When a user is unauthenticated they have a fewer navigational options
     * available to them. For instance, the "My Account" option is replaced
     * with a "Login" link.
     */
    renderUnauthenticatedRibbon() {
        return (
            <div>
                <Button color="inherit">Login</Button>
            </div>
        )
    }

    /**
     * Toggles the drawer containing the off canvas menu.
     * 
     * This will not change the state of the drawer (either opening it or
     * closing it) if a keydown event is detected and that keydown event is
     * a `tab` key press or a `shift` key press.
     */
    toggleDrawer() {
        // if (event && event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
        //     return;
        // }
        this.setState({ open: !this.state.open })
    }
}

Ribbon.propTypes = {
    user: PropTypes.object
};
    
export default Ribbon;
