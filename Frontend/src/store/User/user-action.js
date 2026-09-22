import { userAction } from "./user-slice";
import { axiosInstance } from "../../utils/axios";

// ================= SIGNUP =================
export const signup = (user) => async (dispatch) => {
  try {
    dispatch(userAction.getSignupRequest());

    const { data } = await axiosInstance.post(
      "/v1/rent/user/signup",
      user
    );

    console.log("Signup Response:", data);

    dispatch(userAction.getSingupDetails(data.user));

  } catch (error) {
    console.error("Signup Error:", error);

    dispatch(
      userAction.getError(
        error.response?.data?.message || error.message
      )
    );
  }
};


// ================= LOGIN =================
export const getLogin = (user) => async (dispatch) => {
  try {
    dispatch(userAction.getLoginRequest());

    const { data } = await axiosInstance.post(
      "/v1/rent/user/login",
      user
    );

    console.log("LOGIN RESPONSE:", data);

    dispatch(userAction.getLoginDetails(data.user));

  } catch (error) {
    console.error("LOGIN ERROR:", error.response?.data || error);

    dispatch(
      userAction.getError(
        error.response?.data?.message || error.message
      )
    );
  }
};


// ================= CURRENT USER =================
export const currentUser = () => async (dispatch) => {
  try {
    dispatch(userAction.getCurrentRequest());

    const { data } = await axiosInstance.get(
      "/v1/rent/user/me"
    );

    console.log("CURRENT USER RESPONSE:", data);

    dispatch(userAction.getCurrentUser(data.user));

  } catch (error) {
    console.error(
      "CURRENT USER ERROR:",
      error.response?.data || error
    );

    dispatch(
      userAction.getError(
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message
      )
    );
  }
};


// ================= UPDATE USER =================
export const updateUser = (userData) => async (dispatch) => {
  try {
    dispatch(userAction.getUpdateUserRequest());

    const response = await axiosInstance.patch(
      "/v1/rent/user/updateMe",
      userData
    );

    const { data } = await axiosInstance.get(
      "/v1/rent/user/me"
    );

    console.log("Update User Response:", response.data);

    dispatch(userAction.getCurrentUser(data.user));

  } catch (error) {
    console.error("Update User Error:", error);

    dispatch(
      userAction.getError(
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message
      )
    );
  }
};


// ================= LOGOUT =================
export const logout = () => async (dispatch) => {
  try {
    dispatch(userAction.getLogoutRequest());

    const { data } = await axiosInstance.get(
      "/v1/rent/user/logout"
    );

    console.log("LOGOUT RESPONSE:", data);

    dispatch(userAction.getLogout());

  } catch (error) {
    console.error(
      "LOGOUT ERROR:",
      error.response?.data || error
    );

    dispatch(
      userAction.getError(
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message
      )
    );
  }
};


// ================= FORGOT PASSWORD =================
export const forgotPassword = (email) => async (dispatch) => {
  try {
    await axiosInstance.post(
      "/v1/rent/user/forgotPassword",
      { email }
    );

  } catch (error) {
    dispatch(
      userAction.getError(
        error.response?.data?.message || error.message
      )
    );
  }
};


// ================= RESET PASSWORD =================
export const resetPassword = (repassword, token) => async (dispatch) => {
  try {
    await axiosInstance.patch(
      `/v1/rent/user/resetPassword/${token}`,
      { repassword }
    );

  } catch (error) {
    dispatch(
      userAction.getError(
        error.response?.data?.message || error.message
      )
    );
  }
};


// ================= UPDATE PASSWORD =================
export const updatePassword = (passwords, newPassword) => async (dispatch) => {
  try {
    dispatch(userAction.getPasswordRequest());

    const { data } = await axiosInstance.patch(
      "/v1/rent/user/updateMyPassword",
      passwords
    );

    console.log("Update Password Response:", data);

    dispatch(userAction.getPasswordSuccess(true));

  } catch (error) {
    dispatch(
      userAction.getError(
        error.response?.data?.message || error.message
      )
    );
  }
};