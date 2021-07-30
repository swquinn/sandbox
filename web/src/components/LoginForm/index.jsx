import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { AccountCircle, Lock, Visibility, VisibilityOff } from '@material-ui/icons';
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormGroup from '@material-ui/core/FormGroup';
import IconButton from '@material-ui/core/IconButton';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import styles from './styles.css';

const useStyles = makeStyles(theme => ({
    formControl: {
        margin: theme.spacing(1),
    },
}));

function getUsernamePlaceholder() {
    const classes = useStyles();
    const usernameOptions = [
        '8bit.hero@lorecall.com',
        'advanced.cyborg@lorecall.com',
        'evil.knight@lorecall.com',
        'heroic.paladin@lorecall.com',
        'powerful.wizard@lorecall.com',
        'the.beastmaster@lorecall.com',
        'treacherous.ally@lorecall.com',
        'undead.mastermind@lorecall.com',
        'world.hero@lorecall.com',
    ]
    return usernameOptions[Math.floor(Math.random() * usernameOptions.length)];
}

const LoginForm = () => {
    const [values, setValues] = React.useState({
        usernamePlaceholder: getUsernamePlaceholder(),
        password: '',
        showPassword: false,
    });

    const handleChange = prop => event => {
        setValues({ ...values, [prop]: event.target.value });
    };

    const handleClickShowPassword = () => {
        setValues({ ...values, showPassword: !values.showPassword });
    };

    const handleMouseDownPassword = event => {
        event.preventDefault();
    };

    return (
        <React.Fragment>
            <form>
                <FormGroup row className={styles.controlRowSpacing}>
                    <FormControl fullWidth variant="outlined">
                        <InputLabel htmlFor="username">Email or Username</InputLabel>
                        <OutlinedInput
                            id="username"
                            placeholder={values.usernamePlaceholder}
                            labelWidth={140}
                            startAdornment={
                                <InputAdornment position="start" >
                                    <AccountCircle />
                                </InputAdornment>
                            }
                        />
                    </FormControl>
                </FormGroup>

                <FormGroup row className={styles.controlRowSpacing}>
                    <FormControl fullWidth variant="outlined">
                        <InputLabel htmlFor="password">Password</InputLabel>
                        <OutlinedInput
                            id="password"
                            type={values.showPassword ? 'text' : 'password'}
                            value={values.password}
                            placeholder="••••••••"
                            onChange={handleChange('password')}
                            labelWidth={70}
                            startAdornment={
                                <InputAdornment position="start" >
                                    <Lock />
                                </InputAdornment>
                            }
                            endAdornment={
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={handleClickShowPassword}
                                        onMouseDown={handleMouseDownPassword}
                                    >
                                        {values.showPassword ? <Visibility /> : <VisibilityOff />}
                                    </IconButton>
                                </InputAdornment>
                            }
                        />
                    </FormControl>
                </FormGroup>

                <FormGroup row className={styles.controlRowSpacing}>
                    <FormControlLabel
                        control={
                            <Checkbox id="remember_me" color="primary" />
                        }
                        label="Remember Me?"
                    />
                </FormGroup>

                <FormGroup row className={styles.controlRowSpacing}>
                    <Button fullWidth variant="contained" color="primary">Log In</Button>
                </FormGroup>
            </form>
        </React.Fragment>
    );
}

export default LoginForm;
