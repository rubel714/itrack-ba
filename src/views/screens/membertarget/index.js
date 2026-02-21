import React from "react";
import { Switch, Route, useRouteMatch } from "react-router-dom";
import AfterLoginNavbar from "components/Navbars/AfterLoginNavbar";
import Notification from "../../../services/Notification";
import {
  checkLogin,
  checkUserPermission,
} from "../../../services/CheckUserAccess";
import MemberTarget from "./MemberTarget";

const Index = (props) => {
  const { path } = useRouteMatch();
  const menukey = "membertarget"; // this is in t_menu table

  const [RedirectLogin, setRedirectLogin] = React.useState(true);
  const [hasUserPermission, setHasUserPermission] = React.useState(false);

  if (RedirectLogin) {
    setHasUserPermission(checkUserPermission(menukey)); // To check user has permission in this page
    checkLogin();
    setRedirectLogin(false);
  }

  const [msgObj, setMsgObj] = React.useState({
    isOpen: false,
  });

  const openNoticeModal = (obj) => {
    setMsgObj(obj);
  };

  const closeNoticeModal = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setMsgObj({ isOpen: false });
  };

  return (
    hasUserPermission && (
      <div>
        <div class="mainContainer ">
          <div class="sideBar">
            <AfterLoginNavbar {...props} />
          </div>

          <Switch>
            <Route
              path={`${path}/`}
              render={(props) => (
                <MemberTarget
                  {...props}
                  openNoticeModal={openNoticeModal}
                />
              )}
            ></Route>
          </Switch>
          <Notification
            closeNoticeModal={closeNoticeModal}
            msgObj={msgObj}
            {...props}
          ></Notification>
        </div>
      </div>
    )
  );
};

export default Index;
