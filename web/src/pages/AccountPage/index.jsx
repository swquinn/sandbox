import React from 'react';
import { Link } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';

function AccountPage() {
    return (
        <React.Fragment>
            <Grid item xs={8}>
                <Paper>
                    <Button variant="contained" color="primary">
                        Hello World
                            </Button>
                </Paper>
            </Grid>

            <Grid item xs={3}>
                <Paper>
                    <ul>
                        <li><Link to="/">Dashboard</Link></li>
                        <li><Link to="/login">Login</Link></li>
                        <li><Link to="/account">My Account</Link></li>
                    </ul>
                </Paper>
            </Grid>
        </React.Fragment>
    );
}

export default AccountPage;
