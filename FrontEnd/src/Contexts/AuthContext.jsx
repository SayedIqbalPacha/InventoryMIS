import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  login as loginRequest,
  signup as signupRequest,
  forgotPassword as forgotPasswordRequest,
  resetPassword as resetPasswordRequest,
  updateMe as updateMeRequest,
  deleteMe as deleteMeRequest,
  logout as logoutRequest,
  getCurrentUser,
  getToken,
  saveAuthData,
} from "@/services/auth";


// CREATE CONTEXT
const AuthContext = createContext(null);


// PROVIDER
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);


  // RESTORE AUTHENTICATION WHEN APP STARTS
  useEffect(() => {
    const storedToken = getToken();
    const storedUser = getCurrentUser();

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(storedUser);
    }

    setLoading(false);
  }, []);


  // LOGIN
  // useCallback is used to memoize the function and prevent unnecessary re-renders react will not create a new instance of the function on every render, which can cause performance issues and unnecessary re-renders of child components that depend on this function.
  const login = useCallback(async (email, password) => {
    const data = await loginRequest(email, password);

    saveAuthData(data);

    setToken(data.token);
    setUser(data.data);

    return data;
  }, []);


  // SIGNUP

  const signup = useCallback(async (userData) => {
    const data = await signupRequest(userData);

    return data;
  }, []);


  // FORGOT PASSWORD
  const forgotPassword = useCallback(async (email) => {
    const data = await forgotPasswordRequest(email);

    return data;
  }, []);


  // RESET PASSWORD
  const resetPassword = useCallback(
    async (resetToken, password, passwordConfirm) => {
      const data = await resetPasswordRequest(
        resetToken,
        password,
        passwordConfirm
      );

      return data;
    },
    []
  );


  // UPDATE CURRENT USER
  const updateMe = useCallback(async (userData) => {
    const data = await updateMeRequest(userData);

    const updatedUser = data.data?.user || data.data;

    setUser(updatedUser);

    localStorage.setItem(
      "user",
      JSON.stringify(updatedUser)
    );

    return data;
  }, []);


  // DELETE CURRENT USER
  const deleteMe = useCallback(async () => {
    const data = await deleteMeRequest();

    logoutRequest();

    setUser(null);
    setToken(null);

    return data;
  }, []);


  // LOGOUT
  const logout = useCallback(() => {
    logoutRequest();

    setUser(null);
    setToken(null);
  }, []);


  // AUTHENTICATED?
  const isAuthenticated = Boolean(token && user);


  // CONTEXT VALUE
  // useMemo is used to remember the calculated value of the context and only recompute it when the dependencies change. This can help to optimize performance by preventing unnecessary re-renders of components that consume the context.
  const value = useMemo(() => ({
      user,
      token,
      loading,
      isAuthenticated,

      login,
      signup,
      forgotPassword,
      resetPassword,
      updateMe,
      deleteMe,
      logout,
    }),
    [
      user,
      token,
      loading,
      isAuthenticated,
      login,
      signup,
      forgotPassword,
      resetPassword,
      updateMe,
      deleteMe,
      logout,
    ]
  );


  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}


// CUSTOM HOOK
export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider"
    );
  }

  return context;
}