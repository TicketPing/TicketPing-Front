import { loadTossPayments } from "@tosspayments/tosspayments-sdk";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { axiosInstance } from "../../api";
import { useAppContext } from "../../store";
import '../../style/Checkout.css';

export function Checkout() {
  const location = useLocation();
  const { order } = location.state || {};
  const { store: { jwtToken } } = useAppContext();
  const headers = { Authorization: jwtToken };

  const clientKey = process.env.REACT_APP_TOSS_CLIENT_KEY;
  const customerKey = order.userId;
  const [amount, setAmount] = useState({
    currency: "KRW",
    value: order.price,
  });
  const [ready, setReady] = useState(false);
  const [widgets, setWidgets] = useState(null);

  useEffect(() => {
    async function fetchPaymentWidgets() {
      try {
        const tossPayments = await loadTossPayments(clientKey);
        const widgets = tossPayments.widgets({
          customerKey,
        });
        setWidgets(widgets);
      } catch (error) {
        console.error("Error fetching payment widget:", error);
      }
    }

    fetchPaymentWidgets();
  }, [clientKey, customerKey]);

  useEffect(() => {
    async function renderPaymentWidgets() {
      if (widgets == null) {
        return;
      }

      await widgets.setAmount(amount);
      await widgets.renderPaymentMethods({
        selector: "#payment-method",
        variantKey: "DEFAULT",
      });
      await widgets.renderAgreement({
        selector: "#agreement",
        variantKey: "AGREEMENT",
      });

      setReady(true);
    }

    renderPaymentWidgets();
  }, [widgets]);

  const requestPayment = async () => {
    if (!widgets) return;

    try {
      // 주문 검증 API 호출
      const response = await axiosInstance.post(`/api/v1/orders/${order.id}/validate`, null, { headers });

      if (response.status == 200) {
        await widgets.requestPayment({
          orderId: order.id,
          orderName: "공연: " + order.performanceName,
          successUrl: window.location.origin + "/success",
          failUrl: window.location.origin + "/fail",
        });
      }
    } catch (error) {
      console.error("Error requesting payment:", error);
    }
  };

  return (
    <div className="checkout-container">
      <div className="wrapper">
        <div className="box_section">
          {/* 결제 UI */}
          <div id="payment-method" />
          {/* 이용약관 UI */}
          <div id="agreement" />
        </div>
        <button
          className="checkout-button"
          disabled={!ready}
          onClick={requestPayment}
        >
          결제하기
        </button>
      </div>
    </div>
  );
}

export default Checkout;