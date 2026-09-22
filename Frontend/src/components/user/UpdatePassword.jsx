
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { updatePassword } from "../../store/User/user-action";
import toast from "react-hot-toast";
import { userAction } from "../../store/User/user-slice";

const UpdatePassword = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [passwordCurrent, setPasswordCurrent] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");

  const { error, success } = useSelector((state) => state.user);

  const submitHandler = (e) => {
    e.preventDefault();

    if (password !== passwordConfirm) {
      toast.error("Password does not match");
      return;
    }

    console.log({
      passwordCurrent,
      password,
      passwordConfirm,
    });

    dispatch(
      updatePassword({
        passwordCurrent,
        password,
        passwordConfirm,
      })
    );
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(userAction.clearError());
    } else if (success) {
      toast.success("Password updated successfully");

      navigate("/profile");

      dispatch(userAction.getPasswordSuccess(false));
    }
  }, [error, success, dispatch, navigate]);

  return (
    <>
      <div className="row wrapper">
        <div className="col-10 col-lg-5 updateprofile">
          <form onSubmit={submitHandler}>

            <h1 className="password_title">
              Update Password
            </h1>

            {/* CURRENT PASSWORD */}
            <div className="form-group">
              <label htmlFor="old_password_field">
                Current Password
              </label>

              <input
                type="password"
                id="old_password_field"
                className="form-control"
                value={passwordCurrent}
                onChange={(e) =>
                  setPasswordCurrent(e.target.value)
                }
              />
            </div>

            {/* NEW PASSWORD */}
            <div className="form-group">
              <label htmlFor="new_password_field">
                New Password
              </label>

              <input
                type="password"
                id="new_password_field"
                className="form-control"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
              />
            </div>

            {/* CONFIRM PASSWORD */}
            <div className="form-group">
              <label htmlFor="new_password_confirm_field">
                New Password Confirm
              </label>

              <input
                type="password"
                id="new_password_confirm_field"
                className="form-control"
                value={passwordConfirm}
                onChange={(e) =>
                  setPasswordConfirm(e.target.value)
                }
              />
            </div>

            <button
              type="submit"
              className="btn-block py-3 password-btn"
            >
              Update Password
            </button>

          </form>
        </div>
      </div>
    </>
  );
};

export default UpdatePassword;
