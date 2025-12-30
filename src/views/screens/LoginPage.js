import React, { useState, useContext } from "react";
import { Button } from "../../components/CustomControl/Button";
import BeforeLoginNavbar from "../../components/Navbars/BeforeLoginNavbar.js";
import DarkFooter from "../../components/Footers/DarkFooter.js";
// services & auth
import * as Service from "../../services/Service.js";
//Import Preloader
import LoadingSpinnerOpaque from "../../services/LoadingSpinnerOpaque";
import swal from "sweetalert";

// import {
//   Typography,
//   TextField,
// } from "@material-ui/core";
// import Autocomplete from "@material-ui/lab/Autocomplete";

// const regex =
//   /^[a-z0-9][a-z0-9-_\.]+@([a-z]|[a-z0-9]?[a-z0-9-]+[a-z0-9])\.[a-z0-9]{2,10}(?:\.[a-z]{2,10})?$/;

function LoginPage(props) {
  // const userCtx = useContext(UserContext);
  let token = sessionStorage.getItem("token");

  if (token) {
    //if already login then redirect to home page
    props.history.push("/home");
  }

  const [state, setState] = React.useState({
    service: Service,
    ClientId: "",
    BranchId: "",
    email: "",
    password: "",
  });

  const [isLoading, setLoading] = useState(false);
  const [clientList, setClientList] = useState(null);
  const [branchList, setBranchList] = useState(null);
  const [bFirst, setBFirst] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  React.useEffect(() => {
    document.body.classList.add("login-page");
    document.body.classList.add("sidebar-collapse");
    document.documentElement.classList.remove("nav-open");
    window.scrollTo(0, 0);
    document.body.scrollTop = 0;
    return function cleanup() {
      document.body.classList.remove("login-page");
      document.body.classList.remove("sidebar-collapse");
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    let data = { ...state };
    data[name] = value;
    console.log("data: ", data);

    setState(data);
  };

  const LoginPage = (data) => {
    if (state.email.length > 0 && state.password.length > 0) {
      setLoading(true);
      const body = {
        email: state.email,
        password: state.password,
      };

      state.service.default
        .postApi("source/login.php", body)
        .then((res) => {
          if (res.success == 1) {
            sessionStorage.setItem("token", res.token);
            sessionStorage.setItem("User_info", JSON.stringify(res.user_data));

            const auth_token = sessionStorage.getItem("token")
              ? sessionStorage.getItem("token")
              : null;

            let options = {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${auth_token}`,
              },
            };

            setLoading(false);

            window.location.href = process.env.REACT_APP_BASE_NAME + "/";
            // window.location.href = process.env.REACT_APP_BASE_NAME + `/check-permission`;
          } else if (res.success == 0) {
            setLoading(false);
            swal("Error!", `${res.message}`, "error");
          }
        })
        .catch((err) => {
          setLoading(false);
          swal("Error!", `${err}`, "error");
        });
      //}
    } else {
      swal("Oops Error!", "Please fill all required fields", "error");
    }
  };

  if (bFirst) {
    /**First time call for datalist */
    setBFirst(false);
  }

  return (
    <div>
      {isLoading && <LoadingSpinnerOpaque />}
      <div class="mainContainer ">
        <div class="sideBar">
          <BeforeLoginNavbar {...props} />
        </div>
        {/* <BeforeLoginNavbar {...props} /> */}

        <div class="LoginBody">
          <div class="loginContainer">
            <div class="loginHeader">
              <h3>User Login</h3>
            </div>
            <div class="userLogin">
              <label>User Name</label>
              <input
                type="text"
                id="email"
                name="email"
                onChange={(e) => handleChange(e)}
              />
              <label>Password</label>
              <div style={{ position: 'relative', display: 'inline-block', width: '100%' }}>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  onChange={(e) => handleChange(e)}
                  style={{ width: '100%', paddingRight: '40px' }}
                />
                <span
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '10px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    cursor: 'pointer',
                    fontSize: '18px',
                    color: '#666'
                  }}
                >
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </span>
              </div>
            </div>

            <Button label={"Login"} class={"btnLogin"} onClick={LoginPage} />

            <span>
              * If you forget your password, contact your IT Administrator
            </span>
          </div>
        </div>

        {/* <DarkFooter {...props} /> */}
      </div>
    </div>
  );
}

export default LoginPage;
