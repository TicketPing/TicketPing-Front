import { axiosInstance } from "../api";
import { useAppContext, deleteToken, setToken } from "../store";

export const useCheckExpiredToken = () => {
  const { dispatch } = useAppContext();
  const { store: { jwtToken }} = useAppContext();

  const checkExpiredToken = async (errorMessage) => {
    if (errorMessage == "토큰이 만료되었습니다.") {
      const headers = { Authorization: jwtToken };

      try {
        const response = await axiosInstance.post(
          "/api/v1/auth/refresh",
          {},
          { headers }
        );
        const jwtToken = response.data.data.accessToken;

        // dispatch(deleteToken());
        dispatch(setToken(jwtToken));
      } catch (err) {

      }
    }
  };

  return { checkExpiredToken };
};
