import React from 'react';
import Grid from '@material-ui/core/Grid';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Ribbon from 'app/components/Ribbon';
import styles from './styles.css'


/**
 * The chrome of the application.
 *
 * @extends React.Component
 */
const Edge = (props) => {
    const useStyles = makeStyles(theme => ({
        grid: {
            margin: theme.spacing(0),
            flexGrow: 0,
            maxWidth: `100%`,
            flexBasis: `100%`,
        }
    }));

    const theme = useTheme();
    const classes = useStyles(theme);

    return (
        <div className={styles.root}>
            {/* <Header> */}
            <Ribbon />
            {/* </Header> */}
            
            <Grid container justify="center" spacing={2} className={classes.grid}>
                {props.children}
            </Grid>

            {/* <Footer /> */}
        </div>
    );
};

export default Edge;
