const {body, validationResult } = require('express-validator')
const User = require('../models/user')

module.exports = {
    loginValidators: [
        body('email')
            .isEmail()
            .withMessage('Введите корректный email!')
            .custom(async (value, {req}) => {
                const candidate = await User.findOne({ email: req.body.email })
    
                if (!candidate) return Promise.reject('Пользователя с таким email не существует!')
            })
            .normalizeEmail()
    ],
    registerValidators: [
        body('email')
            .isEmail()
            .withMessage('Введите корректный email!')
            .custom(async (value, {req}) => {
                const candidate = await User.findOne({ email: req.body.email })
    
                if (candidate) return Promise.reject('Пользователь с таким email уже существует!')
            })
            .normalizeEmail(),
        body('password', 'Пароль должен быть минимум 6 символов!')
            .isLength({min: 6, max: 56})
            .isAlphanumeric()
            .trim(),
        body('confirm')
            .custom((value, {req}) => {

                if (value !== req.body.password) throw new Error('Пароли должны совпадать!')
                return true

            })
            .trim(),
        body('name')
            .isLength({min: 3})
            .trim()
            .withMessage('Длина имени должно быть как минимум 3 символа!')
    ],
    productValidator: [
        body('title')
            .isLength({min: 3})
            .trim()
            .withMessage('Минимальная длинна названия 3 символа'),
        body('price')
            .isNumeric()
            .withMessage('Введите корректную цену'),
        body('img', 'Введите корректный Url картинки')
            .trim()
            .isURL()
    ]
}
