import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Link } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import { ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import AppRouter from './routing';
import theme from './themes/lorecall';

function App() {
    return (
        <ThemeProvider theme={theme}>
            <React.Fragment>
                <CssBaseline />
                <AppRouter />
            </React.Fragment>
        </ThemeProvider>
    );
}

ReactDOM.render(<App />, document.querySelector('#app'));
