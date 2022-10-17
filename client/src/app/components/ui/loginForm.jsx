import React, { useEffect, useState } from "react";
import { validator } from "../../utils/validator";
import TextField from "../common/textForm/textField";
import CheckBoxField from "../common/textForm/checkBoxField";
import { useDispatch, useSelector } from "react-redux";
import { getAuthError, logIn } from "../../store/users";
import { useHistory } from "react-router-dom";

const LoginForm = () => {
    const history = useHistory();
    const dispatch = useDispatch();
    const loginError = useSelector(getAuthError());
    const [data, setData] = useState({
        email: "",
        password: "",
        stayOn: false
    });
    const [errors, setErrors] = useState({});

    const handleChange = (target) => {
        setData((prevState) => ({
            ...prevState,
            [target.name]: target.value
        }));
    };

    const validatorConfig = {
        email: {
            isRequired: {
                message: "Электронная почта обязательна для заполнения"
            }
            // isEmail: {
            //     message: "Электронная почта введена некоректно"
            // }
        },
        password: {
            isRequired: { message: "Пароль обязателен для заполнения" }
            // isCapital: {
            //     message: "Пароль должен содержать хотя бы одну заглавную букву"
            // },
            // isContainDigit: {
            //     message: "Пароль должен содержать хотя бы одну цифру"
            // },
            // min: {
            //     message: "Пароль должен содержать минимум 8 символов",
            //     value: 8
            // }
        }
    };

    useEffect(() => {
        validate();
    }, [data]);

    const validate = () => {
        const errors = validator(data, validatorConfig);
        setErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const isValid = Object.keys(errors).length === 0;

    const handleSubmit = async (event) => {
        event.preventDefault();
        const isValid = validate();
        if (!isValid) return;

        const redirect = history.location.state
            ? history.location.state.from.pathname
            : "/";
        dispatch(logIn({ payload: data, redirect }));
    };
    return (
        <form onSubmit={handleSubmit}>
            <TextField
                label="Email"
                name="email"
                onChange={handleChange}
                value={data.email}
                error={errors.email}
            />
            <TextField
                label="Пароль"
                type="password"
                name="password"
                value={data.password}
                onChange={handleChange}
                error={errors.password}
            />
            <CheckBoxField
                value={data.stayOn}
                name="stayOn"
                onChange={handleChange}
            >
                Оставаться в системе
            </CheckBoxField>
            {loginError && <p className="text-danger">{loginError}</p>}
            <button
                disabled={!isValid}
                className="btn btn-primary w-100 mx-auto"
            >
                Отправить форму
            </button>
        </form>
    );
};

export default LoginForm;
