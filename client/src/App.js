import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { IMaskInput } from "react-imask";
import IMask from "imask";
import { getCardTypeByValue } from "./utils/cardTypes";
import { validateDate } from "./utils/validateDate";
import CardTypeDisplay from "./CardTypeDisplay";
import {useHttp} from "./hooks/http.hook";

import "./index.css";

export default function App() {
    const { register, handleSubmit, watch, errors } = useForm();
    const [amount, setAmount] = useState(0)
    const {loading, request} = useHttp()
    const [form, setForm] = useState({
        cardNumber: '', expDate: '', cvv: '', amount: ''
    })
    const [response, setResponse] = useState(null)

    const card = getCardTypeByValue(watch("cardNumber"));

    const changeHandler = event => {
        setForm({ ...form, [event.target.name]: event.target.value })
    }

    const amountChangeHandler = event => {
        changeHandler(event)
        setAmount(event.target.value)
    }


    const onSubmit = async () => {
        form.cardNumber = form.cardNumber.replace(/\s/g,"")
        form.cardNumber = parseInt(form.cardNumber)
        form.cvv = parseInt(form.cvv)
        form.amount = parseInt(form.amount)
        const data = await request('/api/payment/submit', 'POST', {...form})
        setResponse(data)
    };

    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)} className="card-form">
                <div className="form-group">
                    <IMaskInput
                        mask={"0000 0000 0000 0000"}
                        unmask={true}
                        name="cardNumber"
                        onChange={changeHandler}
                        placeholder="Номер карты"
                        autoComplete="cc-number"
                        inputRef={register({
                            required: "Номер карты введен некоректно",
                            pattern: {
                                value: /[\d| ]{16}/,
                                message: "Номер карты введен некоректно"
                            }
                        })}
                        className={`form-input ${
                            errors.cardNumber ? "form-input--error" : ""
                        }`}
                    />
                    <CardTypeDisplay
                        cards={["visa", "mastercard", "amex", "diners"]}
                        selected={card && card.type}
                    />
                    {errors.cardNumber && (
                        <span className="error-display">{errors.cardNumber.message}</span>
                    )}
                </div>

                <div className="input-group">
                    <div className="form-group">
                        <IMaskInput
                            mask={"MM/YY"}
                            blocks={{
                                YY: {
                                    mask: "00"
                                },
                                MM: {
                                    mask: IMask.MaskedRange,
                                    from: 1,
                                    to: 12
                                }
                            }}
                            unmask={false}
                            name="expDate"
                            onChange={changeHandler}
                            placeholder="MM/YY"
                            autoComplete="cc-exp"
                            inputRef={register({
                                required: "Срок действия банковской карты введен некоректно",
                                pattern: {
                                    value: /\d\d\/\d\d/,
                                    message: "Срок действия банковской карты введен некоректно"
                                },
                                validate: (value) =>
                                    validateDate(value) || "Срок действия банковской введен некоректно"
                            })}
                            className={`form-input ${
                                errors.expDate ? "form-input--error" : ""
                            }`}
                        />
                        {errors.expDate && (
                            <span className="error-display">{errors.expDate.message}</span>
                        )}
                    </div>

                    <div className="form-group">
                        <input
                            name="cvv"
                            onChange={changeHandler}
                            placeholder={card ? card.code.name : "CVV"}
                            autoComplete="cc-csc"
                            ref={register({
                                required: true,
                                pattern: /\d{3,4}/
                            })}
                            className={`form-input ${errors.cvc ? "form-input--error" : ""}`}
                        />
                        {errors.cvc && (
                            <span className="error-display">CVV введена некорректно</span>
                        )}
                    </div>
                </div>

                <div className="form-group">
                    <input
                        name="amount"
                        placeholder="Сумма оплаты"
                        autoComplete="cc-name"
                        ref={register({
                            required: true
                        })}
                        className={`form-input ${
                            errors.cardName ? "form-input--error" : ""
                        }`}
                        onChange={amountChangeHandler}
                    />
                    {errors.cardName && (
                        <span className="error-display">Сумма оплаты введена некоректно</span>
                    )}
                </div>

                <button
                    type="submit"
                    className={`form-submit-button ${
                        loading ? "form-submit-button--loading" : ""
                    }`}
                >
                    {loading ? <div className="spinner"></div> : `Оплатить $${amount}`}
                </button>
            </form>

            {response
                ? <div><p>RequestId: {response.RequestId}</p> <p>Amount: {response.amount}</p></div>
                : null
            }
        </>
    );
}
