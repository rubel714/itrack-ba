import React from "react";

// material components
// import "react-date-range/dist/styles.css"; // main css file
// import "react-date-range/dist/theme/default.css"; // theme css file
// import { makeStyles } from "@material-ui/core/styles";

// react-tabulator
// import "react-tabulator/lib/styles.css"; // required styles
// import "react-tabulator/lib/css/tabulator.min.css"; // theme

import * as Service from "../../services/Service.js";

// core components
import AfterLoginNavbar from "components/Navbars/AfterLoginNavbar.js";
import BeforeLoginNavbar from "components/Navbars/BeforeLoginNavbar.js";
import DarkFooter from "../../components/Footers/DarkFooter.js";

const ReportPage = (props) => {
  return (
    <div>
      <div class="mainContainer ">
        <div class="sideBar">
          {Service.default.authToken() != null ? (
            <AfterLoginNavbar {...props} />
          ) : (
            <BeforeLoginNavbar {...props} />
          )}
        </div>

        <div class="permission_card">
          <h3>{"You have no permission to this page."}</h3>
          <div class="pt-10">
            <a class="goto_btn" href={process.env.REACT_APP_BASE_NAME}>
              {"Go To Home"}
            </a>
          </div>
        </div>
      </div>

      {/* <DarkFooter  {...props}  /> */}
    </div>
  );
};

export default ReportPage;
