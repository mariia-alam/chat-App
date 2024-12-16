import { useState, useCallback, createContext } from "react";
const NotificationContext = createContext();

export function NotificationProvider({ children }) {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const clearNotification = useCallback(() => {
    setError("");
    setSuccess("");
  }, [error , success]);

  return (
    <NotificationContext.Provider value={{ error , success,  setSuccess, setError, clearNotification }}>
      {children}
    </NotificationContext.Provider>
  );
}
export {NotificationContext}