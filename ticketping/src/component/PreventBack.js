import { useEffect } from "react";

function PreventBack() {
  useEffect(() => {
    const handlePopState = (event) => {
      window.history.pushState(null, "", window.location.href);
      alert("뒤로 가기가 제한되어 있습니다.");
    };

    window.history.pushState(null, "", window.location.href);

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  return null;
}

export default PreventBack;
