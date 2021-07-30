import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Paper } from '@material-ui/core';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import styles from './styles.css';


const Article = (props) => {
    const useStyles = makeStyles(theme => ({
        paper: {
            borderRadius: 0,
        }
    }));

    const theme = useTheme();
    const classes = useStyles(theme);

    return (
        <Grid item xs={props.size}>
            <Paper component='article' className={[classes.paper, styles.article].join(' ')}>
                {props.children}
            </Paper>
        </Grid>
    );
}

Article.defaultProps = {
    size: 8,
}

Article.propTypes = {
    size: PropTypes.number
};

export default Article;
