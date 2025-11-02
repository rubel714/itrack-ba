import React from "react";
// import { makeStyles } from "@material-ui/core/styles";
import { Switch, Route, useRouteMatch } from "react-router-dom";
import AfterLoginNavbar from "components/Navbars/AfterLoginNavbar";
import Notification from "../../../services/Notification";
import {
  checkLogin,
  checkUserPermission,
  getUserActionPermission,
} from "../../../services/CheckUserAccess";
import DarkFooter from "../../../components/Footers/DarkFooter.js";
import Invoice from "./Invoice";

const Index = (props) => {
  const { path } = useRouteMatch();
  const menukey = "invoice"; // this is in t_menu table

  const [RedirectLogin, setRedirectLogin] = React.useState(true);
  const [hasUserPermission, setHasUserPermission] = React.useState(false);

  if (RedirectLogin) {
    setHasUserPermission(checkUserPermission(menukey)); // To check user has permission in this page
    checkLogin();
    setRedirectLogin(false);
  }

    //This is for user has VIEW/EDIT permission in this page start
    const permissionType = getUserActionPermission(menukey);
    console.log("propsprops permissionType index: ", permissionType);
    //This is for user has VIEW/EDIT permission in this page end
  
    
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
                <Invoice
                  {...props}
                  permissionType={permissionType}
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
        {/* <DarkFooter {...props} /> */}
      </div>
    )
  );
};

export default Index;
