import { createMuiTheme } from '@material-ui/core/styles';

const muiTheme = createMuiTheme({
    palette: {
        primary: {
            main: '#612d7f'
        }
    }

});

const theme = {
    ...muiTheme,
    background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
};

export default theme;