import React, { createContext, useContext, useReducer, useEffect } from "react";
import { getStorageItem, setStorageItem } from "./utils/useLocalStorage";

const AppContext = createContext();

const SET_TOKEN = "APP/SET_TOKEN";
const DELETE_TOKEN = "APP/DELETE_TOKEN";

export const setToken = token => ({ type: SET_TOKEN, payload: token });
export const deleteToken = () => ({ type: DELETE_TOKEN });

const reducer = (prevState, action) => {
  const { type } = action;

  switch (type) {
    case SET_TOKEN: {
      const { payload: jwtToken } = action;
      return { 
        ...prevState, 
        jwtToken, 
        isAuthenticated: true 
      };
    }
    case DELETE_TOKEN: {
      return { 
        ...prevState, 
        jwtToken: "", 
        isAuthenticated: false 
      };
    }
    default:
      return prevState;
  }
};

export const AppProvider = ({ children }) => {
  const jwtToken = getStorageItem("jwtToken", "");
  
  const [store, dispatch] = useReducer(reducer, {
    jwtToken,
    isAuthenticated: jwtToken.length > 0
  });

  useEffect(() => {
    if (store.jwtToken) {
      setStorageItem("jwtToken", store.jwtToken);
    } else {
      setStorageItem("jwtToken", "");
    }
  }, [store.jwtToken]);

  return (
    <AppContext.Provider value={{ store, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);