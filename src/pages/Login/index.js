import React from "react";
import clsx from 'clsx';
import './style.css';
import { FormControl, InputAdornment, Input, IconButton, Button, FormHelperText } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { MailOutline, Visibility, VisibilityOff, LockOpen } from '@material-ui/icons';
import { isEmail, isEmpty, isLength, isContainWhiteSpace } from 'shared/validator';
import API from '../../services/api';
import { useHistory } from 'react-router-dom'
import api from "../../services/api";


//import das logos
const small = require('./../../assets/logo-home.png')
const medium = require('./../../assets/logo-home@2x.png')
const large = require('./../../assets/logo-home@3x.png')

//Classe implementada para deixar imagem responsiva
class ResponsiveImage extends React.Component {

    state = { currentSrc: '' };

    onLoad = (event) => {
        this.setState({
            currentSrc: event.target.currentSrc
        });
    }

    render() {
        return (
            <img src={small} srcSet={`${small} 300w, ${medium} 768w, ${large} 1280w`} alt="" className="logo-home" onLoad={this.onLoad} />
        );
    }
}

//styles utilizados dentro do FormControl
const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    margin: {
        margin: theme.spacing(1),
    },
    withoutLabel: {
        marginTop: theme.spacing(3),
    },
    textField: {
        width: '70%',
    },
}));

//função Login
function Login() {
    const history = useHistory();
    const classes = useStyles();
    const [values, setValues] = React.useState({
        email: '',
        password: '',
        showPassword: false,
        errors: { email: '', password: '', valid: '' }
    });

    //mapeia eventos dos inputs como mostrar e esconder senha
    const handleChange = (prop) => (event) => {
        setValues({ ...values, [prop]: event.target.value });
    };

    const handleClickShowPassword = () => {
        setValues({ ...values, showPassword: !values.showPassword });
    };

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    //confere campos e retorna erros, caso existam
    const validateLoginForm = (e) => {

        let errors = {};
        const { email, password } = values;

        if (isEmpty(email)) {
            errors.email = "Email é um campo obrigatório";
        } else if (!isEmail(email)) {
            errors.email = "Por favor insira um email válido";
        }

        if (isEmpty(password)) {
            errors.password = "Senha é um campo obrigatório";
        } else if (isContainWhiteSpace(password)) {
            errors.password = "A senha não deve conter espaços em branco";
        } else if (!isLength(password, { gte: 6, lte: 16, trim: true })) {
            errors.password = "O comprimento da senha deve ser entre 6 a 16";
        }

        if (isEmpty(errors)) {
            return true;
        } else {
            return errors;
        }
    };


    //função chamada ao clicar em entrar
    const login = (e) => {

        e.preventDefault();

        let errors = validateLoginForm();

        if (errors === true) {
            API.post(`users/auth/sign_in`, { email: values.email, password: values.password })
            .then(res => {
                api.defaults.headers.common['access-token'] = res.headers['access-token']
                api.defaults.headers.common['uid'] = res.headers['uid']
                api.defaults.headers.common['client'] = res.headers['client']
                console.log(api.defaults)
                history.push('/enterprise')
            })
            .catch(error => setValues({
                    ...values,
                    errors: {
                        valid: 'Credenciais informadas são inválidas, tente novamente.'
                    }
                }))
        } else {
            setValues({
                ...values,
                errors: {
                    email: errors.email,
                    password: errors.password
                }
            })
        }
    };

    return (
        <div className="Login">
            <div className="container">
                <div className="card">
                    <div className="centralize div-logo">
                        <ResponsiveImage />
                    </div>
                    <div className="centralize titulo">
                        <p>BEM-VINDO AO EMPRESAS</p>
                    </div>
                    <div className="centralize subtitulo">
                        <p>Lorem ipsum dolor sit amet, contetur adipiscing elit. Nunc accumsan.</p>
                    </div>
                    <div className="centralize">
                        <FormControl id="email" className={clsx(classes.margin, classes.withoutLabel, classes.textField)} error={values.errors.email !== '' && values.errors.valid !== '' ? true : false}>
                            <Input
                                value={values.email}
                                onChange={handleChange('email')}
                                startAdornment={
                                    <InputAdornment position="start">
                                        <MailOutline className="icon medium-pink" />
                                    </InputAdornment>
                                }
                                inputProps={{
                                    'aria-label': 'email',
                                }}
                            />
                            <FormHelperText id="component-error-text">{values.errors.email}</FormHelperText>
                        </FormControl>
                    </div>
                    <div className="centralize">
                        <FormControl id="password" className={clsx(classes.margin, classes.textField)} error={values.errors.password !== '' && values.errors.valid !== '' ? true : false}>
                            <Input
                                type={values.showPassword ? 'text' : 'password'}
                                value={values.password}
                                onChange={handleChange('password')}
                                startAdornment={
                                    <InputAdornment position="start">
                                        <LockOpen className="icon medium-pink" />
                                    </InputAdornment>
                                }
                                endAdornment={
                                    <InputAdornment position="end">
                                        <IconButton
                                            onClick={handleClickShowPassword}
                                            onMouseDown={handleMouseDownPassword}
                                        >
                                            {values.showPassword ? <Visibility className="icon charcoal-grey" /> : <VisibilityOff className="icon charcoal-grey" />}
                                        </IconButton>
                                    </InputAdornment>
                                }
                            />
                            <FormHelperText id="component-error-text">{values.errors.password}</FormHelperText>
                            <FormHelperText id="component-error-text">{values.errors.valid}</FormHelperText>
                        </FormControl>
                    </div>
                    <div className="centralize button">
                        <Button onClick={login} id="btn-entrar" variant="contained">ENTRAR</Button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login;