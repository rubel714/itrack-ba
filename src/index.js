import React, { Suspense } from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";

import "assets/css/main.css";
import "assets/css/modal.css";
import "assets/css/header.css";
import "assets/js/include.js";
import "assets/js/modal.js";

// pages for this kit
import Index from "views/Index.js";
import LoginPage from "views/screens/LoginPage.js";
// import SignUpPage from "views/screens/SignUp.js";
// import ResetPassword from "views/screens/ResetPasswordPage";
// import DashboardPage from "views/screens/DashboardPage";
import MyProfile from "views/screens/myprofile/index.js";
import CheckPermission from "views/screens/CheckPermission.js";
// import Dashboard from "views/screens/dashboard/index.js";

import ReportReviewDashboard from "views/screens/reportreviewdashboard/index.js";
import ProgramAndBuyerWiseTat from "views/screens/programandbuyerwisetat/index.js";


import BusinessLine from "views/screens/businessline/index.js";
import Buyer from "views/screens/buyer/index.js";
import UserEntry from "views/screens/userentry/index.js";
// import Team from "views/screens/team/index.js";
// import TeamMemberAssign from "views/screens/teammemberassign/index.js";
import Programs from "views/screens/programs/index.js";
import FactoryGroups from "views/screens/factorygroups/index.js";
import Factory from "views/screens/factory/index.js";
import AuditStage from "views/screens/auditstage/index.js";
import LeadStatus from "views/screens/leadstatus/index.js";
import RevenueType from "views/screens/revenuetype/index.js";

import Designation from "views/screens/designation/index.js";

import Department from "views/screens/department/index.js";
import Holiday from "views/screens/holiday/index.js";
import Leave from "views/screens/leave/index.js";
import Members from "views/screens/members/index.js";
import Auditors from "views/screens/auditors/index.js";
import Offices from "views/screens/offices/index.js";
import Zone from "views/screens/zone/index.js";
import State from "views/screens/state/index.js";
import InvoiceType from "views/screens/invoicetype/index.js";
import UserRole from "views/screens/userrole/index.js";
import RoleToMenuPermission from "views/screens/roletomenupermission/index.js";
import AuditLog from "views/screens/auditlog/index.js";
import ErrorLog from "views/screens/errorlog/index.js";
import SalesPersonInput from "views/screens/salespersoninput/index.js";
import CoordinatorInput from "views/screens/coordinatorinput/index.js";
import ReportReviewer from "views/screens/reportreviewer/index.js";
import Invoice from "views/screens/invoice/index.js";
import AuditCalendar from "views/screens/auditcalendar/index.js";
import UserContextProvider from './context/user-info-context';

// import { QueryClient, QueryClientProvider, useQuery } from 'react-query';

// const queryClient = new QueryClient()

const loading = (
  <div className="pt-3 text-center">
    <div className="sk-spinner sk-spinner-pulse"></div>
  </div>
);

let userInfo = null;

userInfo = {
  FacilityId: 0,
  FacilityName: 'NA',
  LangId: 'en_GB'
};

ReactDOM.render(
  <UserContextProvider userInfo={userInfo}>
    {/* <QueryClientProvider client={queryClient}> */}
      <BrowserRouter basename={process.env.REACT_APP_BASE_NAME}>
        <Suspense>
          <Switch>

            <Route path="/home" render={(props) => <Index {...props} />} />
            <Route path="/login" render={(props) => <LoginPage {...props} />} />
            {/* <Route path="/signup" render={(props) => <SignUpPage {...props} />} /> */}
            {/* <Route path="/reset-password" render={(props) => <ResetPassword {...props} />} /> */}
            {/* <Route path="/dashboard" render={(props) => <DashboardPage {...props} />} /> */}
      			<Route path="/myprofileweb" render={(props) => <MyProfile {...props} />} />
            <Route path="/check-permission" render={(props) => <CheckPermission {...props} />} />

            {/* <Route path="/dashboard" render={(props) => <Dashboard {...props} />} /> */}
            <Route path="/reportreviewdashboard" render={(props) => <ReportReviewDashboard {...props} />} />
            <Route path="/programandbuyerwisetat" render={(props) => <ProgramAndBuyerWiseTat {...props} />} />

            <Route path="/businessline" render={(props) => <BusinessLine {...props} />} />
            <Route path="/buyer" render={(props) => <Buyer {...props} />} />
            <Route path="/userentry" render={(props) => <UserEntry {...props} />} />
            {/* <Route path="/team" render={(props) => <Team {...props} />} />
            <Route path="/teammemberassign" render={(props) => <TeamMemberAssign {...props} />} /> */}

            <Route path="/programs" render={(props) => <Programs {...props} />} />
            <Route path="/factorygroups" render={(props) => <FactoryGroups {...props} />} />
            <Route path="/factory" render={(props) => <Factory {...props} />} />
            <Route path="/auditstage" render={(props) => <AuditStage {...props} />} />
            <Route path="/leadstatus" render={(props) => <LeadStatus {...props} />} />
            <Route path="/revenuetype" render={(props) => <RevenueType {...props} />} />


            <Route path="/designation" render={(props) => <Designation {...props} />} />
            <Route path="/department" render={(props) => <Department {...props} />} />
            <Route path="/holiday" render={(props) => <Holiday {...props} />} />
            <Route path="/leave" render={(props) => <Leave {...props} />} />
            <Route path="/members" render={(props) => <Members {...props} />} />
            <Route path="/auditors" render={(props) => <Auditors {...props} />} />
            <Route path="/offices" render={(props) => <Offices {...props} />} />
            <Route path="/zone" render={(props) => <Zone {...props} />} />
            <Route path="/state" render={(props) => <State {...props} />} />
            <Route path="/invoicetype" render={(props) => <InvoiceType {...props} />} />
            <Route path="/userrole" render={(props) => <UserRole {...props} />} />
            <Route path="/roletomenupermission" render={(props) => <RoleToMenuPermission {...props} />} />
            <Route path="/auditlog" render={(props) => <AuditLog {...props} />} />
            <Route path="/errorlog" render={(props) => <ErrorLog {...props} />} />

            <Route path="/salespersoninput" render={(props) => <SalesPersonInput {...props} />} />
            <Route path="/coordinatorinput" render={(props) => <CoordinatorInput {...props} />} />
            <Route path="/reportreviewer" render={(props) => <ReportReviewer {...props} />} />
            <Route path="/invoice" render={(props) => <Invoice {...props} />} />

            <Route path="/auditcalendar" render={(props) => <AuditCalendar {...props} />} />

            <Route path="/" render={(props) => <Index {...props} />} />

          </Switch>
        </Suspense>
      </BrowserRouter>
    {/* </QueryClientProvider> */}
  </UserContextProvider>,
  document.getElementById("root")
);
