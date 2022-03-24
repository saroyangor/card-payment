const {Router} = require('express')
const {check, validationResult} = require('express-validator')
const Card = require('../models/Card')
const router = Router()

// /api/payment/submit
router.post(
    '/submit',
    [
        check('cardNumber', "Некорректный номер карты").isNumeric().isLength({min: 16, max: 16}),
        check('expDate', "Некорректная дата").exists(),
        check('cvv', "Некорректный cvv").isNumeric().isLength({min: 3, max: 3}),
        check('amount', "Введите сумму оплаты").isLength({min: 1})
    ],
    (req, res) => {

        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array(),
                message: "Некорректные данные при оплате"
            })
        }

        try {
            const {cardNumber, expDate, cvv, amount} = req.body

            const payment = new Card({cardNumber, expDate, cvv, amount})
            payment.save()
                .then( res.send({"RequestId": payment._id, "amount": payment.amount}) )

            res.status(201).json({message: "Оплата прошла успешно"})

        } catch (e) {
            res.status(500).json({message: 'Что-то пошло не так, попробуйте снова'})
        }
    })


module.exports = router
