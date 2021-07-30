import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Card, CardHeader, CardContent } from '@material-ui/core';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import styles from './styles.css';


const Sidebar = (props) => {
    const useStyles = makeStyles(theme => ({
        card: {},
        cardHeader: {
            padding: 5,
        },
        cardContent: {},
    }));

    const theme = useTheme();
    const classes = useStyles(theme);

    return (
        <Grid item xs={props.size}>
            <Card component='section' className={styles.sidebar}>
                {props.title && <CardHeader title={props.title} className={classes.cardHeader} />}
                <CardContent>
                    {props.children}
                </CardContent>
            </Card>
        </Grid>
    );
}

Sidebar.defaultProps = {
    size: 3,
}

Sidebar.propTypes = {
    size: PropTypes.number,
    title: PropTypes.string
};

export default Sidebar;
