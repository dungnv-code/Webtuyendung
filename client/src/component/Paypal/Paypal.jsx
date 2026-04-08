import {
    PayPalScriptProvider,
    PayPalButtons,
    usePayPalScriptReducer
} from "@paypal/react-paypal-js";
import { useEffect } from "react";
import Swal from "sweetalert2";

import { createInvoidBusiness } from "../../api/business";

const style = { layout: "vertical" };
import path from "../../ultils/path";
import { useNavigate } from "react-router-dom";
const ButtonWrapper = ({ currency, showSpinner, amount, payload, setIsSuccess }) => {
    const [{ isPending, options }, dispatch] = usePayPalScriptReducer();

    useEffect(() => {
        dispatch({
            type: "resetOptions",
            value: { ...options, currency }
        });
    }, [currency]);

    const hanleSaveOder = async () => {
        const respon = await createInvoidBusiness(payload);
        if (respon?.success) {
            setIsSuccess(true);
            setTimeout(() => {
                Swal.fire({
                    title: "Thanh toán thành công",
                    icon: "success",
                    confirmButtonText: "Đóng"
                }).then((result) => {
                    if (result.isConfirmed) {
                        window.close();
                        useNavigate(`${path.HOME}`)
                    }
                });
            }, 1000)

            setTimeout(() => {
                setIsSuccess(false);
            }, 6000);
        }
    };

    return (
        <>
            {showSpinner && isPending && <div className="spinner" />}
            <PayPalButtons
                style={style}
                disabled={false}
                forceReRender={[style, currency, amount]}
                fundingSource={undefined}
                createOrder={(data, actions) => {
                    return actions.order.create({
                        purchase_units: [{
                            amount: {
                                currency_code: currency,
                                value: amount
                            }
                        }]
                    }).then(orderID => orderID);
                }}
                onApprove={(data, actions) => {
                    return actions.order.capture().then((response) => {
                        console.log("Thanh toán thành công:", response);
                        console.log("Payload: ", payload);
                        if (response.status === "COMPLETED") {
                            hanleSaveOder();
                        }
                    });
                }}
            />
        </>
    );
};

export default function App({ amount, payload, setIsSuccess }) {
    return (
        <div style={{ maxWidth: "750px", minHeight: "200px" }}>
            <PayPalScriptProvider options={{
                clientId: "test",
                components: "buttons",
                currency: "USD"
            }}>
                <ButtonWrapper
                    payload={payload}
                    currency="USD"
                    amount={amount}
                    showSpinner={false}
                    setIsSuccess={setIsSuccess}
                />
            </PayPalScriptProvider>
        </div>
    );
}