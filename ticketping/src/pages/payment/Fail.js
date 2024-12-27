import { useSearchParams } from "react-router-dom";
import '../../style/Fail.css';

export function Fail() {
  const [searchParams] = useSearchParams();

  return (
    <div className="fail-container"> 
      <div className="fail-box_section"> 
        <img width="100px" src="https://static.toss.im/lotties/error-spot-no-loop-space-apng.png" alt="에러 이미지" />
        <h2>결제를 실패했어요</h2>

        <div className="p-grid typography--p" style={{ marginTop: "50px" }}>
          <div className="p-grid-col text--left">
            <b>에러메시지</b>
          </div>
          <div className="p-grid-col text--right" id="message">{`${searchParams.get("message")}`}</div>
        </div>
        <div className="p-grid typography--p" style={{ marginTop: "10px" }}>
          <div className="p-grid-col text--left">
            <b>에러코드</b>
          </div>
          <div className="p-grid-col text--right" id="code">{`${searchParams.get("code")}`}</div>
        </div>
      </div>
    </div>
  );
}

export default Fail;
