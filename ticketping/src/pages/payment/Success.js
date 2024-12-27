import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { axiosInstance } from "../../api";
import { useAppContext } from "../../store";
import '../../style/Success.css';

export function Success() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { store: { jwtToken } } = useAppContext();
    const headers = { Authorization: jwtToken };
    const [responseData, setResponseData] = useState(null);

    useEffect(() => {
        async function confirm() {
            const requestData = {
                orderId: searchParams.get("orderId"),
                amount: searchParams.get("amount"),
                paymentKey: searchParams.get("paymentKey"),
            };

            try {
              const response = await axiosInstance.post("/api/v1/payments/confirm", requestData, { headers });                   
              setResponseData(response.data.data); 
            } catch (error) {
              const errorMessage = error.response?.data?.message || "Unknown error";
              const errorCode = error.response?.data?.code || error.response?.data?.status || "Unknown code";
              navigate(`/fail?code=${errorCode}&message=${errorMessage}`);
            }
        }

        confirm();
    }, [searchParams]);

    return (
        <div className="success-container">
            <div className="success-box_section">
                <img
                    width="100px"
                    src="https://static.toss.im/illusts/check-blue-spot-ending-frame.png"
                    alt="결제 성공 이미지"
                />
                <h2>결제를 완료했어요</h2>
                <div className="success-p-grid typography--p" style={{ marginTop: "50px" }}>
                    <div className="success-p-grid-col success-text--left">
                        <b>결제금액</b>
                    </div>
                    <div className="success-p-grid-col success-text--right" id="amount">
                        {`${Number(searchParams.get("amount")).toLocaleString()}원`}
                    </div>
                </div>
                <div className="success-p-grid typography--p">
                    <div className="success-p-grid-col success-text--left">
                        <b>주문번호</b>
                    </div>
                    <div className="success-p-grid-col success-text--right" id="orderId">
                        {`${searchParams.get("orderId")}`}
                    </div>
                </div>
                <div className="success-p-grid typography--p">
                    <div className="success-p-grid-col success-text--left">
                        <b>paymentKey</b>
                    </div>
                    <div
                        className="success-p-grid-col success-text--right"
                        id="paymentKey"
                        style={{ whiteSpace: "initial", width: "250px" }}
                    >
                        {`${searchParams.get("paymentKey")}`}
                    </div>
                </div>
            </div>
            <div className="success-box_section">
                <b>Response Data :</b>
                <div id="response" style={{ whiteSpace: "initial" }}>
                    {responseData && <pre>{JSON.stringify(responseData, null, 4)}</pre>}
                </div>
            </div>
        </div>
    );
}

export default Success;
