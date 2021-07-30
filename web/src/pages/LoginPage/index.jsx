import React from 'react';
import { Grid, Paper } from '@material-ui/core';
import LoginForm from 'app/components/LoginForm';
import styles from './styles.css';


function LoginPage() {
    return (
        <React.Fragment>
            <Grid item xs={4}>
                <Paper>
                    <h2 className={styles.loginHeader}>
                        Log in to Lorecall
                    </h2>
                    <LoginForm />
                </Paper>
            </Grid>
        </React.Fragment>
    );
}

export default LoginPage;
