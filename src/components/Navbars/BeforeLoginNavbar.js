import React, { useContext } from "react";
import { apiCall, apiOption, LoginUserInfo, language } from "../../actions/api";

function BeforeLoginNavbar(props) {
  return (
    <>
      {/* <!-- NAV BAR --> */}
      {/* <nav class="navbar"> */}
      {/* <!-- LOGO --> */}
      <div class="logo">
        <img alt="..." src={require("assets/img/logo.png")}></img>
        <label>iTrack BA</label>
      </div>
      {/* <span class="demotext">This is DEMO site</span> */}

      {/* <div class="userPanel">
          <div></div>

          <a
            id="login"
            class="btnLogin"
            onClick={(e) => {
              e.preventDefault();
              props.history.push("/login");
            }}
          >
            <p>Login</p>
          </a>
        </div> */}
      <div class="menuBar">
        {/* <div class="menuListBar">
                <ul>
                  <li class="dropdownMenu">
                    {" "}
                    <a
                      class="parentMenu"
                      href="javascript:void(0)"
                      onClick={() => props.history.push("/home")}
                    >
                      Home
                    </a>
                  </li>
 </ul> </div> */}

        <div class="user">
          <a
            id="login"
            class="btnLogin"
            onClick={(e) => {
              e.preventDefault();
              props.history.push("/login");
            }}
          >
            <p>Login</p>
          </a>
        </div>
      </div>
      {/* </nav> */}
    </>
  );
}

export default BeforeLoginNavbar;
