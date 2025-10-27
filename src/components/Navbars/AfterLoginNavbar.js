import React, { useContext } from "react";
import { apiCall, apiOption, LoginUserInfo, language } from "../../actions/api";

function AfterLoginNavbar(props) {
  const [userInfo, setUserInfo] = React.useState(LoginUserInfo());

  const baseUrl = process.env.REACT_APP_FRONT_URL;
  // const [previewImage, setPreviewImage] = useState(
  //   `${baseUrl}image/user/placeholder.png`
  // );

  function menuShowPermision(pMenuKey) {
    let isShow = 0;

    let menuList = LoginUserInfo().UserAllowdMenuList;

    menuList.forEach((menu, i) => {
      if (menu.MenuKey === pMenuKey) {
        isShow = 1;
        return;
      }
    });

    return isShow;
  }

  return (
    <>
      {/* <!-- LOGO --> */}
      <div class="logo">
        <img alt="..." src={require("assets/img/logo.png")}></img>
        <label>iTrack BA</label>
      </div>

      {/* menuBar */}
      <div class="menuBar">
        <div class="menuListBar">
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

            {menuShowPermision("settings") === 1 && (
              <li class="dropdownMenu">
                {" "}
                Settings
                <ul class="dropdownList">
                  {menuShowPermision("programs") === 1 && (
                    <li>
                      <a
                        href="javascript:void(0)"
                        onClick={() => props.history.push("programs")}
                      >
                        Programs
                      </a>
                    </li>
                  )}

                  {menuShowPermision("auditors") === 1 && (
                    <li>
                      <a
                        href="javascript:void(0)"
                        onClick={() => props.history.push("auditors")}
                      >
                        Auditors
                      </a>
                    </li>
                  )}

                  {menuShowPermision("members") === 1 && (
                    <li>
                      <a
                        href="javascript:void(0)"
                        onClick={() => props.history.push("members")}
                      >
                        Employee
                      </a>
                    </li>
                  )}

                  {menuShowPermision("factorygroups") === 1 && (
                    <li>
                      <a
                        href="javascript:void(0)"
                        onClick={() => props.history.push("factorygroups")}
                      >
                        Factory Groups
                      </a>
                    </li>
                  )}

                  {menuShowPermision("factory") === 1 && (
                    <li>
                      <a
                        href="javascript:void(0)"
                        onClick={() => props.history.push("factory")}
                      >
                        Factory
                      </a>
                    </li>
                  )}

                  {menuShowPermision("auditstage") === 1 && (
                    <li>
                      <a
                        href="javascript:void(0)"
                        onClick={() => props.history.push("auditstage")}
                      >
                        Audit Stage
                      </a>
                    </li>
                  )}
                  {menuShowPermision("leadstatus") === 1 && (
                    <li>
                      <a
                        href="javascript:void(0)"
                        onClick={() => props.history.push("leadstatus")}
                      >
                        Lead Status
                      </a>
                    </li>
                  )}
                  {menuShowPermision("revenuetype") === 1 && (
                    <li>
                      <a
                        href="javascript:void(0)"
                        onClick={() => props.history.push("revenuetype")}
                      >
                        Revenue Type
                      </a>
                    </li>
                  )}
                  {menuShowPermision("designation") === 1 && (
                    <li>
                      <a
                        href="javascript:void(0)"
                        onClick={() => props.history.push("designation")}
                      >
                        Designation
                      </a>
                    </li>
                  )}
                  {menuShowPermision("department") === 1 && (
                    <li>
                      <a
                        href="javascript:void(0)"
                        onClick={() => props.history.push("department")}
                      >
                        Department
                      </a>
                    </li>
                  )}

                  {menuShowPermision("buyer") === 1 && (
                    <li>
                      <a
                        href="javascript:void(0)"
                        onClick={() => props.history.push("buyer")}
                      >
                        Buyer
                      </a>
                    </li>
                  )}
                  {menuShowPermision("holiday") === 1 && (
                    <li>
                      <a
                        href="javascript:void(0)"
                        onClick={() => props.history.push("holiday")}
                      >
                        Holiday
                      </a>
                    </li>
                  )}
                  {menuShowPermision("leave") === 1 && (
                    <li>
                      <a
                        href="javascript:void(0)"
                        onClick={() => props.history.push("leave")}
                      >
                        Leave
                      </a>
                    </li>
                  )}
                  {menuShowPermision("offices") === 1 && (
                    <li>
                      <a
                        href="javascript:void(0)"
                        onClick={() => props.history.push("offices")}
                      >
                        Office List
                      </a>
                    </li>
                  )}

                  {menuShowPermision("zone") === 1 && (
                    <li>
                      <a
                        href="javascript:void(0)"
                        onClick={() => props.history.push("zone")}
                      >
                        Zone List
                      </a>
                    </li>
                  )}
                </ul>
              </li>
            )}

            {menuShowPermision("security") === 1 && (
              <li class="dropdownMenu">
                {" "}
                Security
                <ul class="dropdownList">
                  {menuShowPermision("userrole") === 1 && (
                    <li>
                      <a
                        href="javascript:void(0)"
                        onClick={() => props.history.push("userrole")}
                      >
                        User Role
                      </a>
                    </li>
                  )}

                  {menuShowPermision("userentry") === 1 && (
                    <li>
                      <a
                        href="javascript:void(0)"
                        onClick={() => props.history.push("userentry")}
                      >
                        User Entry
                      </a>
                    </li>
                  )}

                  {menuShowPermision("roletomenupermission") === 1 && (
                    <li>
                      <a
                        href="javascript:void(0)"
                        onClick={() =>
                          props.history.push("roletomenupermission")
                        }
                      >
                        Role to Menu Permission
                      </a>
                    </li>
                  )}

                  {menuShowPermision("auditlog") === 1 && (
                    <li>
                      <a
                        href="javascript:void(0)"
                        onClick={() => props.history.push("auditlog")}
                      >
                        Audit Log
                      </a>
                    </li>
                  )}

                  {menuShowPermision("errorlog") === 1 && (
                    <li>
                      <a
                        href="javascript:void(0)"
                        onClick={() => props.history.push("errorlog")}
                      >
                        Error Log
                      </a>
                    </li>
                  )}
                </ul>
              </li>
            )}

            {menuShowPermision("audit") === 1 && (
              <li class="dropdownMenu">
                {" "}
                Audit
                <ul class="dropdownList">
                  {menuShowPermision("salespersoninput") === 1 && (
                    <li>
                      <a
                        href="javascript:void(0)"
                        onClick={() => props.history.push("salespersoninput")}
                      >
                        Sales Person Input
                      </a>
                    </li>
                  )}
                  {menuShowPermision("coordinatorinput") === 1 && (
                    <li>
                      <a
                        href="javascript:void(0)"
                        onClick={() => props.history.push("coordinatorinput")}
                      >
                        Coordinator Input
                      </a>
                    </li>
                  )}

                  {menuShowPermision("invoice") === 1 && (
                    <li>
                      <a
                        href="javascript:void(0)"
                        onClick={() => props.history.push("invoice")}
                      >
                        Invoice
                      </a>
                    </li>
                  )}

                  {menuShowPermision("reportreviewer") === 1 && (
                    <li>
                      <a
                        href="javascript:void(0)"
                        onClick={() => props.history.push("reportreviewer")}
                      >
                        Report Reviewer
                      </a>
                    </li>
                  )}
                </ul>
              </li>
            )}

            {menuShowPermision("reports") === 1 && (
              <li class="dropdownMenu">
                {" "}
                Reports
                <ul class="dropdownList">
                  {menuShowPermision("auditcalendar") === 1 && (
                    <li>
                      <a
                        href="javascript:void(0)"
                        onClick={() => props.history.push("auditcalendar")}
                      >
                        Audit Calendar
                      </a>
                    </li>
                  )}
                </ul>
              </li>
            )}
          </ul>
        </div>

        {/* <!-- ICON BAR --> */}
      </div>

      <div class="user">
        <div class="user-img">
          <img src={baseUrl + "image/user/" + userInfo.PhotoUrl} alt="User" />
        </div>
        <div class="user-label">
          <ul>
            <li class="dropdownMenu">
              {" "}
              {userInfo.UserName} &nabla;
              <ul class="dropdownList">
                <li>
                  <a
                    href="javascript:void(0)"
                    onClick={() => props.history.push("myprofileweb")}
                  >
                    My Profile
                  </a>
                </li>

                <li>
                  <a
                    href="javascript:void(0)"
                    onClick={(e) => {
                      e.preventDefault();
                      sessionStorage.clear();
                      setTimeout(() => {
                        props.history.push("/login");
                      }, 1000);
                    }}
                  >
                    {"Logout"}
                  </a>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </div>

      {/* <!-- NAV BAR --> */}
      {/* <nav class="navbar non-printable">
        <div class="logo">
          <img alt="..." src={require("assets/img/logo.png")}></img>
          <label>iTrack BA</label>
        </div>

        <div class="menuBar">
          <div class="menuListBar">
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
              {menuShowPermision("basicsetup") === 1 && (
                <li class="dropdownMenu">
                  {" "}
                  Settings
                  <ul class="dropdownList">
                    {menuShowPermision("programs") === 1 && (
                      <li>
                        <a
                          href="javascript:void(0)"
                          onClick={() => props.history.push("programs")}
                        >
                          Programs
                        </a>
                      </li>
                    )}

                    {menuShowPermision("auditors") === 1 && (
                      <li>
                        <a
                          href="javascript:void(0)"
                          onClick={() => props.history.push("auditors")}
                        >
                          Auditors
                        </a>
                      </li>
                    )}

                    {menuShowPermision("members") === 1 && (
                      <li>
                        <a
                          href="javascript:void(0)"
                          onClick={() => props.history.push("members")}
                        >
                          Employee
                        </a>
                      </li>
                    )}

                    {menuShowPermision("factorygroups") === 1 && (
                      <li>
                        <a
                          href="javascript:void(0)"
                          onClick={() => props.history.push("factorygroups")}
                        >
                          Factory Groups
                        </a>
                      </li>
                    )}

                    {menuShowPermision("factory") === 1 && (
                      <li>
                        <a
                          href="javascript:void(0)"
                          onClick={() => props.history.push("factory")}
                        >
                          Factory
                        </a>
                      </li>
                    )}

                    {menuShowPermision("auditstage") === 1 && (
                      <li>
                        <a
                          href="javascript:void(0)"
                          onClick={() => props.history.push("auditstage")}
                        >
                          Audit Stage
                        </a>
                      </li>
                    )}
                    {menuShowPermision("leadstatus") === 1 && (
                      <li>
                        <a
                          href="javascript:void(0)"
                          onClick={() => props.history.push("leadstatus")}
                        >
                          Lead Status
                        </a>
                      </li>
                    )}
                    {menuShowPermision("revenuetype") === 1 && (
                      <li>
                        <a
                          href="javascript:void(0)"
                          onClick={() => props.history.push("revenuetype")}
                        >
                          Revenue Type
                        </a>
                      </li>
                    )}
                    {menuShowPermision("designation") === 1 && (
                      <li>
                        <a
                          href="javascript:void(0)"
                          onClick={() => props.history.push("designation")}
                        >
                          Designation
                        </a>
                      </li>
                    )}
                    {menuShowPermision("department") === 1 && (
                      <li>
                        <a
                          href="javascript:void(0)"
                          onClick={() => props.history.push("department")}
                        >
                          Department
                        </a>
                      </li>
                    )}

                    {menuShowPermision("buyer") === 1 && (
                      <li>
                        <a
                          href="javascript:void(0)"
                          onClick={() => props.history.push("buyer")}
                        >
                          Buyer
                        </a>
                      </li>
                    )}
                    {menuShowPermision("holiday") === 1 && (
                      <li>
                        <a
                          href="javascript:void(0)"
                          onClick={() => props.history.push("holiday")}
                        >
                          Holiday
                        </a>
                      </li>
                    )}
                    {menuShowPermision("offices") === 1 && (
                      <li>
                        <a
                          href="javascript:void(0)"
                          onClick={() => props.history.push("offices")}
                        >
                          Office List
                        </a>
                      </li>
                    )}

                    {menuShowPermision("zone") === 1 && (
                      <li>
                        <a
                          href="javascript:void(0)"
                          onClick={() => props.history.push("zone")}
                        >
                          Zone List
                        </a>
                      </li>
                    )}

                    {menuShowPermision("userrole") === 1 && (
                      <li>
                        <a
                          href="javascript:void(0)"
                          onClick={() => props.history.push("userrole")}
                        >
                          User Role
                        </a>
                      </li>
                    )}

                    {menuShowPermision("userentry") === 1 && (
                      <li>
                        <a
                          href="javascript:void(0)"
                          onClick={() => props.history.push("userentry")}
                        >
                          User Entry
                        </a>
                      </li>
                    )}

                    {menuShowPermision("roletomenupermission") === 1 && (
                      <li>
                        <a
                          href="javascript:void(0)"
                          onClick={() =>
                            props.history.push("roletomenupermission")
                          }
                        >
                          Role to Menu Permission
                        </a>
                      </li>
                    )}
                    {menuShowPermision("auditlog") === 1 && (
                      <li>
                        <a
                          href="javascript:void(0)"
                          onClick={() => props.history.push("auditlog")}
                        >
                          Audit Log
                        </a>
                      </li>
                    )}

                    {menuShowPermision("errorlog") === 1 && (
                      <li>
                        <a
                          href="javascript:void(0)"
                          onClick={() => props.history.push("errorlog")}
                        >
                          Error Log
                        </a>
                      </li>
                    )}
                  </ul>
                </li>
              )}

              {menuShowPermision("audit") === 1 && (
                <li class="dropdownMenu">
                  {" "}
                  Audit
                  <ul class="dropdownList">
                    {menuShowPermision("salespersoninput") === 1 && (
                      <li>
                        <a
                          href="javascript:void(0)"
                          onClick={() => props.history.push("salespersoninput")}
                        >
                          Sales Person Input
                        </a>
                      </li>
                    )}
                    {menuShowPermision("coordinatorinput") === 1 && (
                      <li>
                        <a
                          href="javascript:void(0)"
                          onClick={() => props.history.push("coordinatorinput")}
                        >
                          Coordinator Input
                        </a>
                      </li>
                    )}

                     {menuShowPermision("invoice") === 1 && (
                      <li>
                        <a
                          href="javascript:void(0)"
                          onClick={() => props.history.push("invoice")}
                        >
                          Invoice
                        </a>
                      </li>
                    )}

                     {menuShowPermision("reportreviewer") === 1 && (
                      <li>
                        <a
                          href="javascript:void(0)"
                          onClick={() => props.history.push("reportreviewer")}
                        >
                          Report Reviewer
                        </a>
                      </li>
                    )}
                  </ul>
                </li>
              )}

              {menuShowPermision("reports") === 1 && (
                <li class="dropdownMenu">
                  {" "}
                  Reports
                  <ul class="dropdownList">
                  </ul>
                </li>
              )}
            </ul>
          </div>

        </div>

        <div class="userPanel">

          <div class="user">
            <img
              src={baseUrl + "image/user/" + userInfo.PhotoUrl}
              alt="User"
            />
            <ul>
              <li class="dropdownMenu">
                {" "}
                {userInfo.UserName} &nabla;
                <ul class="dropdownList">
                  <li>
                    <a
                      href="javascript:void(0)"
                      onClick={() => props.history.push("myprofileweb")}
                    >
                      My Profile
                    </a>
                  </li>
                  <li>
                    <a
                      href="javascript:void(0)"
                      onClick={(e) => {
                        e.preventDefault();
                        sessionStorage.clear();
                        setTimeout(() => {
                          props.history.push("/login");
                        }, 1000);
                      }}
                    >
                      {"Logout"}
                    </a>
                  </li>
                </ul>
              </li>
            </ul>
          </div>
        </div>
      </nav> */}
    </>
  );
}

export default AfterLoginNavbar;
