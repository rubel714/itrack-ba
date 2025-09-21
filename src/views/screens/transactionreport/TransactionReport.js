import React, { forwardRef, useRef } from "react";
import swal from "sweetalert";
import { DeleteOutline, Edit } from "@material-ui/icons";
import { Button } from "../../../components/CustomControl/Button";
import moment from "moment";

import CustomTable from "components/CustomTable/CustomTable";
import {
  apiCall,
  apiOption,
  LoginUserInfo,
  language,
} from "../../../actions/api";
import ExecuteQueryHook from "../../../components/hooks/ExecuteQueryHook";

// import DesignationAddEditModal from "./DesignationAddEditModal";

const TransactionReport = (props) => {
  const serverpage = "transactionreport"; // this is .php server page

  const permissionType = props.permissionType;
  const { useState } = React;
  const [bFirst, setBFirst] = useState(true);
  // const [currentRow, setCurrentRow] = useState([]);
  // const [showModal, setShowModal] = useState(false); //true=show modal, false=hide modal

  const { isLoading, data: dataList, error, ExecuteQuery } = ExecuteQueryHook(); //Fetch data
  const [columnList, setColumnList] = useState([]);

  const UserInfo = LoginUserInfo();
  const [currReportTypeId, setCurrReportTypeId] = useState(0);

  const [DepartmentList, setDepartmentList] = useState(null);
  const [currDepartmentId, setCurrDepartmentId] = useState(0);

  const [UserList, setUserList] = useState(null);
  const [currUserId, setCurrUserId] = useState(0);
  const [isdisablevisitorlist, setIsdisablevisitorlist] = useState(true);

  const [TransactionList, setTransactionList] = useState(null);
  const [currTransactionId, setCurrTransactionId] = useState(0);

  const [StartDate, setStartDate] = useState(
    moment().subtract(30, "days").format("YYYY-MM-DD")
  );
  const [EndDate, setEndDate] = useState(moment().format("YYYY-MM-DD"));

  /* =====Start of Excel Export Code==== */
  const EXCEL_EXPORT_URL = process.env.REACT_APP_API_URL;

  
  const ExcelGenerate = () => {
    if(!chkValidation()){
      return;
    }

    let finalUrl = "";
    if (currReportTypeId == "CustomerVisitPunchLedger") {
      let finalUrl = EXCEL_EXPORT_URL + "report/CustomerVisitPunchLedger_excel.php";
      window.open(
        finalUrl +
          "?DepartmentId=" +
          currDepartmentId +
          "&VisitorId=" +
          currUserId +
          "&StartDate=" +
          StartDate +
          "&EndDate=" +
          EndDate +
          "&TimeStamp=" +
          Date.now()
      );
    } else if (currReportTypeId == "CustomerVisitPunchSummary") {
      let finalUrl = EXCEL_EXPORT_URL + "report/CustomerVisitPunchSummary_excel.php";
      window.open(
        finalUrl +
          "?DepartmentId=" +
          currDepartmentId +
          "&VisitorId=" +
          currUserId +
          "&StartDate=" +
          StartDate +
          "&EndDate=" +
          EndDate +
          "&TimeStamp=" +
          Date.now()
      );
    } else if (currReportTypeId == "VisitPlan") {
      let finalUrl = EXCEL_EXPORT_URL + "report/VisitPlan_excel.php";
      window.open(
        finalUrl +
          "?DepartmentId=" +
          currDepartmentId +
          "&VisitorId=" +
          currUserId +
          "&StartDate=" +
          StartDate +
          "&EndDate=" +
          EndDate +
          "&TimeStamp=" +
          Date.now()
      );
    } else if (currReportTypeId == "ConveyanceReport") {
      let finalUrl = EXCEL_EXPORT_URL + "report/ConveyanceReport_excel.php";
      window.open(
        finalUrl +
          "?DepartmentId=" +
          currDepartmentId +
          "&VisitorId=" +
          currUserId +
          "&StartDate=" +
          StartDate +
          "&EndDate=" +
          EndDate +
          "&TimeStamp=" +
          Date.now()
      );
    } else if (currReportTypeId == "LocalConveyance") {
      let finalUrl = EXCEL_EXPORT_URL + "report/LocalConveyance_excel.php";
      window.open(
        finalUrl +
          "?DepartmentId=" +
          currDepartmentId +
          "&VisitorId=" +
          currUserId +
          "&StartDate=" +
          StartDate +
          "&EndDate=" +
          EndDate +
          "&TimeStamp=" +
          Date.now()
      );
    } else if (currReportTypeId == "VisitSummaryReport") {
      let finalUrl = EXCEL_EXPORT_URL + "report/VisitSummaryReport_excel.php";
      window.open(
        finalUrl +
          "?DepartmentId=" +
          currDepartmentId +
          "&VisitorId=" +
          currUserId +
          "&StartDate=" +
          StartDate +
          "&EndDate=" +
          EndDate +
          "&TimeStamp=" +
          Date.now()
      );

    } else if (currReportTypeId == "MachineryServiceReport") {
      let finalUrl = EXCEL_EXPORT_URL + "report/MachineryServiceReport_excel.php";
      window.open(
        finalUrl +
          "?TransactionId=" +
          currTransactionId +
          "&TimeStamp=" +
          Date.now()
      );
  
    }


    
  };


  const PDFGenerate = () => {
    if(!chkValidation()){
      return;
    }

    let finalUrl = "";
    if (currReportTypeId == "CustomerVisitPunchLedger") {
      let finalUrl = EXCEL_EXPORT_URL + "report/CustomerVisitPunchLedger_pdf.php";
      window.open(
        finalUrl +
          "?DepartmentId=" +
          currDepartmentId +
          "&VisitorId=" +
          currUserId +
          "&StartDate=" +
          StartDate +
          "&EndDate=" +
          EndDate +
          "&TimeStamp=" +
          Date.now()
      );
    } else if (currReportTypeId == "CustomerVisitPunchSummary") {
      let finalUrl = EXCEL_EXPORT_URL + "report/CustomerVisitPunchSummary_pdf.php";
      window.open(
        finalUrl +
          "?DepartmentId=" +
          currDepartmentId +
          "&VisitorId=" +
          currUserId +
          "&StartDate=" +
          StartDate +
          "&EndDate=" +
          EndDate +
          "&TimeStamp=" +
          Date.now()
      );
    } else if (currReportTypeId == "VisitPlan") {
      let finalUrl = EXCEL_EXPORT_URL + "report/VisitPlan_pdf.php";
      window.open(
        finalUrl +
          "?DepartmentId=" +
          currDepartmentId +
          "&VisitorId=" +
          currUserId +
          "&StartDate=" +
          StartDate +
          "&EndDate=" +
          EndDate +
          "&TimeStamp=" +
          Date.now()
      );
    } else if (currReportTypeId == "ConveyanceReport") {
      let finalUrl = EXCEL_EXPORT_URL + "report/ConveyanceReport_pdf.php";
      window.open(
        finalUrl +
          "?DepartmentId=" +
          currDepartmentId +
          "&VisitorId=" +
          currUserId +
          "&StartDate=" +
          StartDate +
          "&EndDate=" +
          EndDate +
          "&TimeStamp=" +
          Date.now()
      );
    } else if (currReportTypeId == "LocalConveyance") {
      let finalUrl = EXCEL_EXPORT_URL + "report/LocalConveyance_pdf.php";
      window.open(
        finalUrl +
          "?DepartmentId=" +
          currDepartmentId +
          "&VisitorId=" +
          currUserId +
          "&StartDate=" +
          StartDate +
          "&EndDate=" +
          EndDate +
          "&TimeStamp=" +
          Date.now()
      );
    } else if (currReportTypeId == "VisitSummaryReport") {
      let finalUrl = EXCEL_EXPORT_URL + "report/VisitSummaryReport_pdf.php";
      window.open(
        finalUrl +
          "?DepartmentId=" +
          currDepartmentId +
          "&VisitorId=" +
          currUserId +
          "&StartDate=" +
          StartDate +
          "&EndDate=" +
          EndDate +
          "&TimeStamp=" +
          Date.now()
      );

    } else if (currReportTypeId == "MachineryServiceReport") {
      let finalUrl = EXCEL_EXPORT_URL + "report/MachineryServiceReport_pdf.php";
      window.open(
        finalUrl +
          "?TransactionId=" +
          currTransactionId +
          "&TimeStamp=" +
          Date.now()
      );
  
    }


    
  };

  /* =====End of Excel Export Code==== */

  const handleChange = (e) => {
    const { name, value } = e.target;
    // let data = { ...currentRow };
    // data[name] = value;

    // setCurrentRow(data);

    // setErrorObject({ ...errorObject, [name]: null });

    if (name === "DepartmentId") {
      setCurrDepartmentId(value);
      getUser(value);
      getTransactionList(value, 0, StartDate, EndDate);
    }

    if (name === "UserId") {
      setCurrUserId(value);
      getTransactionList(currDepartmentId, value, StartDate, EndDate);
    }
    if (name === "TransactionId") {
      setCurrTransactionId(value);
    }
  };

  const handleChangeFilterDate = (e) => {
    const { name, value } = e.target;
    if (name === "StartDate") {
      setStartDate(value);
      getTransactionList(currDepartmentId, currUserId, value, EndDate);
    }

    if (name === "EndDate") {
      setEndDate(value);
      getTransactionList(currDepartmentId, currUserId, StartDate, value);
    }
  };

  function getDepartment() {
    let params = {
      action: "DepartmentList",
      lan: language(),
      UserId: UserInfo.UserId,
    };

    apiCall.post("combo_generic", { params }, apiOption()).then((res) => {
      setDepartmentList([{ id: 0, name: "All" }].concat(res.data.datalist));

      setCurrDepartmentId(0);
    });
  }

  function getUser(deptId) {
    let params = {
      action: "UserList",
      lan: language(),
      UserId: UserInfo.UserId,
      DepartmentId: deptId,
    };

    apiCall.post("combo_generic", { params }, apiOption()).then((res) => {
      setUserList([{ id: 0, name: "All" }].concat(res.data.datalist));

      setCurrUserId(0);
    });
  }

  function getTransactionList(deptId, visitorId, sDate, eDate) {
    let params = {
      action: "TransactionList",
      lan: language(),
      UserId: UserInfo.UserId,
      DepartmentId: deptId,
      VisitorId: visitorId,
      StartDate: sDate,
      EndDate: eDate,
    };

    apiCall.post("combo_generic", { params }, apiOption()).then((res) => {
      setTransactionList([{ id: 0, name: "All" }].concat(res.data.datalist));

      setCurrTransactionId(0);
    });
  }

  const columnListCustomerVisitPunchLedger = [
    { field: "rownumber", label: "SL", align: "center", width: "5%" },
    {
      field: "TransactionDate",
      label: "Visit Date",
      align: "left",
      visible: true,
      sort: true,
      filter: true,
      // width: "10%"
    },
    {
      field: "UserId",
      label: "Employee ID",
      align: "left",
      visible: true,
      sort: true,
      filter: true,
      // width: "20%"
    },
    {
      field: "UserName",
      label: "Employee Name",
      align: "left",
      visible: true,
      sort: true,
      filter: true,
      // width: "20%"
    },
    {
      field: "PunchLocation",
      label: "Punch Location",
      align: "left",
      visible: true,
      sort: true,
      filter: true,
      // width: "20%"
    },
    {
      field: "Purpose",
      label: "Visit Purpose",
      align: "left",
      visible: true,
      sort: true,
      filter: true,
    },
    {
      field: "CustomerCode",
      label: "Customer No",
      align: "left",
      visible: true,
      sort: true,
      filter: true,
      // width: "6%"
    },
    {
      field: "CustomerName",
      label: "Customer Name",
      align: "left",
      visible: true,
      sort: true,
      filter: true,
      // width: "12%"
    },
    {
      field: "ContactPersonName",
      label: "Contact Per. Name",
      align: "left",
      visible: true,
      sort: true,
      filter: true,
      // width: "12%"
    },
    {
      field: "ContactPersonDesignation",
      label: "Contact Per. Designation",
      align: "left",
      visible: true,
      sort: true,
      filter: true,
      // width: "12%"
    },
    {
      field: "ContactPersonMobileNumber",
      label: "Contact Per. Mobile",
      align: "left",
      visible: true,
      sort: true,
      filter: true,
      // width: "12%"
    },
    {
      field: "Transportation",
      label: "Transportation",
      align: "left",
      visible: true,
      sort: true,
      filter: true,
      // width: "12%"
    },
    {
      field: "ApprovedConveyanceAmount",
      label: "Conveyance",
      align: "right",
      visible: true,
      sort: true,
      filter: true,
      // width: "12%",
    },
    {
      field: "ApprovedRefreshmentAmount",
      label: "Refreshment",
      align: "right",
      visible: true,
      sort: true,
      filter: true,
      // width: "12%",
    },

    {
      field: "LinemanUserId",
      label: "LM ID",
      align: "left",
      visible: true,
      sort: true,
      filter: true,
      // width: "12%"
    },
    {
      field: "LinemanUserName",
      label: "LM Name",
      align: "left",
      visible: true,
      sort: true,
      filter: true,
      // width: "12%"
    },
    {
      field: "SelfDiscussion",
      label: "Self Discussion",
      align: "left",
      visible: true,
      sort: true,
      filter: true,
      // width: "12%"
    },
    {
      field: "LMAdvice",
      label: "LM Advice",
      align: "left",
      visible: true,
      sort: true,
      filter: true,
      // width: "6%"
    },
  ];

  const columnListCustomerVisitPunchSummary = [
    { field: "rownumber", label: "SL", align: "center", width: "5%" },
    // { field: 'SL', label: 'SL',width:'10%',align:'center',visible:true,sort:false,filter:false },
    {
      field: "UserId",
      label: "Employee ID",
      align: "left",
      visible: true,
      sort: true,
      filter: true,
      width: "10%",
    },

    {
      field: "UserName",
      label: "Employee Name",
      align: "left",
      visible: true,
      sort: true,
      filter: true,
      // width: "20%"
    },
    {
      field: "ApprovedConveyanceAmount",
      label: "Conveyance",
      align: "right",
      visible: true,
      sort: true,
      filter: true,
      width: "12%",
    },
    {
      field: "ApprovedRefreshmentAmount",
      label: "Refreshment",
      align: "right",
      visible: true,
      sort: true,
      filter: true,
      width: "12%",
    },

    {
      field: "LinemanUserId",
      label: "Line Manager ID",
      align: "left",
      visible: true,
      sort: true,
      filter: true,
      width: "12%",
    },
    {
      field: "LinemanUserName",
      label: "Line Manager Name",
      align: "left",
      visible: true,
      sort: true,
      filter: true,
    },
  ];

  const columnListVisitPlan = [
    { field: "rownumber", label: "SL", align: "center", width: "5%" },
    {
      field: "TransactionDate",
      label: "Visit Plan Date",
      align: "left",
      visible: true,
      sort: true,
      filter: true,
      width: "10%",
    },

    {
      field: "UserId",
      label: "Employee ID",
      align: "left",
      visible: true,
      sort: true,
      filter: true,
      width: "8%",
    },

    {
      field: "UserName",
      label: "Employee Name",
      align: "left",
      visible: true,
      sort: true,
      filter: true,
      // width: "20%"
    },

    {
      field: "CustomerCode",
      label: "Customer Code",
      align: "left",
      visible: true,
      sort: true,
      filter: true,
      width: "10%",
    },
    {
      field: "CustomerName",
      label: "Customer Name",
      align: "left",
      visible: true,
      sort: true,
      filter: true,
    },

    {
      field: "LinemanUserId",
      label: "Line Manager ID",
      align: "left",
      visible: true,
      sort: true,
      filter: true,
      width: "10%",
    },
    {
      field: "LinemanUserName",
      label: "Line Manager Name",
      align: "left",
      visible: true,
      sort: true,
      filter: true,
    },
  ];

  const columnListConveyanceReport = [
    { field: "rownumber", label: "SL", align: "center", width: "5%" },
    {
      field: "TransactionDate",
      label: "Date",
      align: "left",
      visible: true,
      sort: true,
      filter: true,
      width: "10%",
    },

    {
      field: "UserName",
      label: "Sales Force",
      align: "left",
      visible: true,
      sort: true,
      filter: true,
      // width: "20%"
    },

    {
      field: "ContactPersonName",
      label: "Person Name",
      align: "left",
      visible: true,
      sort: true,
      filter: true,
    },
    {
      field: "ContactPersonDesignation",
      label: "Designation",
      align: "left",
      visible: true,
      sort: true,
      filter: true,
      width: "12%",
    },
    {
      field: "ContactPersonMobileNumber",
      label: "Mobile No",
      align: "left",
      visible: true,
      sort: true,
      filter: true,
    },
    {
      field: "ApprovedConveyanceAmount",
      label: "Transportation Amt",
      align: "right",
      visible: true,
      sort: true,
      filter: true,
      width: "12%",
    },
    {
      field: "ApprovedRefreshmentAmount",
      label: "Refreshment Amt",
      align: "right",
      visible: true,
      sort: true,
      filter: true,
      width: "12%",
    },
    {
      field: "AuthorisedBy",
      label: "Authorised By",
      align: "left",
      visible: true,
      sort: false,
      filter: false,
      width: "7%",
    },
  ];

  const columnListLocalConveyance = [
    { field: "rownumber", label: "SL", align: "center", width: "5%" },
    {
      field: "TransactionDate",
      label: "Date",
      align: "left",
      visible: true,
      sort: true,
      filter: true,
      width: "10%",
    },

    {
      field: "DisplayName",
      label: "Reason For Entertainment",
      align: "left",
      visible: true,
      sort: true,
      filter: true,
      // width: "20%"
    },
    {
      field: "CustomerName",
      label: "Travel Origin to Destination",
      align: "left",
      visible: true,
      sort: true,
      filter: true,
    },
    {
      field: "PublicTransportDesc",
      label: "Transport Details",
      align: "left",
      visible: true,
      sort: true,
      filter: true,
      width: "12%",
    },

    {
      field: "ApprovedConveyanceAmount",
      label: "Conveyance (TK)",
      align: "right",
      visible: true,
      sort: true,
      filter: true,
      width: "12%",
    },
    {
      field: "ApprovedRefreshmentAmount",
      label: "Entertainment (TK)",
      align: "right",
      visible: true,
      sort: true,
      filter: true,
      width: "12%",
    },
  ];

  const columnListVisitSummaryReport = [
    { field: "rownumber", label: "SL", align: "center", width: "5%" },
    {
      field: "TransactionDate",
      label: "Visit Date",
      align: "left",
      visible: true,
      sort: true,
      filter: true,
      width: "10%",
    },
    {
      field: "UserName",
      label: "Employee Name",
      align: "left",
      visible: true,
      sort: true,
      filter: true,
      // width: "20%"
    },
    {
      field: "CustomerName",
      label: "Customer Name",
      align: "left",
      visible: true,
      sort: true,
      filter: true,
    },
    {
      field: "ContactPersonName",
      label: "Contact Name",
      align: "left",
      visible: true,
      sort: true,
      filter: true,
      width: "12%",
    },
    {
      field: "ContactPersonDesignation",
      label: "Designation",
      align: "left",
      visible: true,
      sort: true,
      filter: true,
      width: "12%",
    },
    {
      field: "SelfDiscussion",
      label: "Self Discussion",
      align: "left",
      visible: true,
      sort: true,
      filter: true,
      width: "12%",
    },
    {
      field: "HOTAdvice",
      label: "HOT Advice",
      align: "left",
      visible: true,
      sort: true,
      filter: true,
      width: "6%",
    },
  ];

  const columnListMachineryServiceReport = [
    { field: "rownumber", label: "SL", align: "center", width: "5%" },
    {
      field: "TransactionDate",
      label: "Date",
      align: "left",
      visible: true,
      sort: true,
      filter: true,
      // width: "10%"
    },
    {
      field: "TimeIn",
      label: "Time In",
      align: "left",
      visible: true,
      sort: true,
      filter: true,
      // width: "10%"
    },
    {
      field: "TimeOut",
      label: "Time Out",
      align: "left",
      visible: true,
      sort: true,
      filter: true,
      // width: "10%"
    },

    {
      field: "UserName",
      label: "Service Engineer",
      align: "left",
      visible: true,
      sort: true,
      filter: true,
      // width: "20%"
    },

    {
      field: "CustomerName",
      label: "Customer Name",
      align: "left",
      visible: true,
      sort: true,
      filter: true,
    },
    {
      field: "Address",
      label: "Address",
      align: "left",
      visible: true,
      sort: true,
      filter: true,
    },
    {
      field: "MachineName",
      label: "Machine Name",
      align: "left",
      visible: true,
      sort: true,
      filter: true,
      // width: "6%"
    },
    {
      field: "MachineModelName",
      label: "Model No",
      align: "left",
      visible: true,
      sort: true,
      filter: true,
      // width: "12%"
    },
    {
      field: "MachineSerial",
      label: "Serial No",
      align: "left",
      visible: true,
      sort: true,
      filter: true,
      // width: "12%"
    },
    {
      field: "MachineComplain",
      label: "Customer Complaint/Problem/Symptom Description",
      align: "left",
      visible: true,
      sort: true,
      filter: true,
      // width: "12%"
    },
    {
      field: "MachineParts",
      label: "Machine Parts",
      align: "left",
      visible: true,
      sort: true,
      filter: true,
      // width: "12%"
    },
    {
      field: "SelfDiscussion",
      label: "Service Contents",
      align: "left",
      visible: true,
      sort: true,
      filter: true,
      // width: "12%"
    },
    {
      field: "SuggestionToCustomer",
      label: "Suggestion to Customer to Rectify the Problem",
      align: "left",
      visible: true,
      sort: true,
      filter: true,
      // width: "12%"
    },
    {
      field: "SuggestionFromCustomer",
      label: "Suggestion by Customer",
      align: "left",
      visible: true,
      sort: true,
      filter: true,
      // width: "12%"
    },
  ];

  if (bFirst) {
    /**First time call for datalist */
    getDepartment();
    getUser(0);
    // getDataList();
    getTransactionList(0, 0, StartDate, EndDate);
    setBFirst(false);
  }


  const selectCurrentReport = (e) => {
    const { name, value } = e.target;
    // console.log('name: ', name);
    // console.log('value: ', value);

    setCurrReportTypeId(value);

    if (value == "CustomerVisitPunchLedger") {
      setIsdisablevisitorlist(true);
      setColumnList(columnListCustomerVisitPunchLedger);
    } else if (value == "CustomerVisitPunchSummary") {
      setIsdisablevisitorlist(true);
      setColumnList(columnListCustomerVisitPunchSummary);
    } else if (value == "CustomerVisitPunchSummary") {
      setIsdisablevisitorlist(true);
      setColumnList(columnListCustomerVisitPunchSummary);
    } else if (value == "VisitPlan") {
      setIsdisablevisitorlist(true);
      setColumnList(columnListVisitPlan);
    } else if (value == "ConveyanceReport") {
      setIsdisablevisitorlist(true);
      setColumnList(columnListConveyanceReport);
    } else if (value == "LocalConveyance") {
      setIsdisablevisitorlist(true);
      setColumnList(columnListLocalConveyance);
      setDateFilter();

    } else if (value == "VisitSummaryReport") {
      setIsdisablevisitorlist(true);
      setColumnList(columnListVisitSummaryReport);
    } else if (value == "MachineryServiceReport") {
      setIsdisablevisitorlist(false);
      setColumnList(columnListMachineryServiceReport);
      setDateFilter();
    }


  };

  const setDateFilter=()=>{
    let currDay = moment().format("DD");
    let currMonth = moment().format("MM");
    let currYear = moment().format("YYYY");

    if(currDay>15){
      //from curr month
      setStartDate(currYear+"-"+currMonth+"-01");
      setEndDate(currYear+"-"+currMonth+"-15");

    }else{

      let premontMonth = moment().subtract(1, "months").format("YYYY-MM-DD");// Go pre month
      let myd = premontMonth.split("-");

      let preMonthLastDay = new Date(currYear+"-"+currMonth+"-00").getDate();//return premonth last day
      // console.log('preMonthLastDay: ', preMonthLastDay);

      setStartDate(myd[0]+"-"+myd[1]+"-16");
      setEndDate(myd[0]+"-"+myd[1]+"-"+preMonthLastDay);
    }
  }

  const chkValidation=()=>{
    if (currReportTypeId == "CustomerVisitPunchLedger") {
     
    } else if (currReportTypeId == "CustomerVisitPunchSummary") {
      
    } else if (currReportTypeId == "CustomerVisitPunchSummary") {
      
    } else if (currReportTypeId == "VisitPlan") {
      
    } else if (currReportTypeId == "ConveyanceReport") {
      
    } else if (currReportTypeId == "LocalConveyance") {
      if(currUserId == 0){
        alert("Select Sales Force");
        return false;
      }
    } else if (currReportTypeId == "VisitSummaryReport") {
      
    } else if (currReportTypeId == "MachineryServiceReport") {
      if(currTransactionId == 0){
        alert("Select Visit");
        return false;
      }
    }

    return true;

  }


  const generateReport = () => {
    if(!chkValidation()){
      return;
    }

    getDataList();
  };

  // const [DepartmentList, setDepartmentList] = useState(null);
  // const [currDepartmentId, setCurrDepartmentId] = useState(0);

  // const [UserList, setUserList] = useState(null);
  // const [currUserId, setCurrUserId] = useState(0);

  // const [TransactionList, setTransactionList] = useState(null);
  // const [currTransactionId, setCurrTransactionId] = useState(0);

  // const [StartDate, setStartDate] = useState(
  //   moment().subtract(30, "days").format("YYYY-MM-DD")
  // );
  // const [EndDate, setEndDate] = useState(moment().format("YYYY-MM-DD"));

  /**Get data for table list */
  function getDataList() {
    let params = {
      action: "getDataList",
      lan: language(),
      UserId: UserInfo.UserId,
      ReportTypeId: currReportTypeId,
      DepartmentId: currDepartmentId,
      VisitorId: currUserId,
      StartDate: StartDate,
      EndDate: EndDate,
      TransactionId: currTransactionId,
    };
    // console.log('LoginUserInfo params: ', params);

    ExecuteQuery(serverpage, params);
  }

  /** Action from table row buttons*/
  // function actioncontrol(rowData) {
  //   return (
  //     <>
  //       {permissionType === 0 && (
  //         <Edit
  //           className={"table-edit-icon"}
  //           onClick={() => {
  //             editData(rowData);
  //           }}
  //         />
  //       )}

  //       {permissionType === 0 && (
  //         <DeleteOutline
  //           className={"table-delete-icon"}
  //           onClick={() => {
  //             deleteData(rowData);
  //           }}
  //         />
  //       )}
  //     </>
  //   );
  // }

  // const addData = () => {
  //   // console.log("rowData: ", rowData);
  //   // console.log("dataList: ", dataList);

  //   setCurrentRow({
  //     id: "",
  //     DesignationName: "",
  //   });
  //   openModal();
  // };

  // const editData = (rowData) => {
  //   // console.log("rowData: ", rowData);
  //   // console.log("dataList: ", dataList);

  //   setCurrentRow(rowData);
  //   openModal();
  // };

  // function openModal() {
  //   setShowModal(true); //true=modal show, false=modal hide
  // }

  // function modalCallback(response) {
  //   //response = close, addedit
  //   // console.log('response: ', response);
  //   getDataList();
  //   setShowModal(false); //true=modal show, false=modal hide
  // }

  // const deleteData = (rowData) => {
  //   swal({
  //     title: "Are you sure?",
  //     text: "Once deleted, you will not be able to recover this data!",
  //     icon: "warning",
  //     buttons: {
  //       confirm: {
  //         text: "Yes",
  //         value: true,
  //         visible: true,
  //         className: "",
  //         closeModal: true,
  //       },
  //       cancel: {
  //         text: "No",
  //         value: null,
  //         visible: true,
  //         className: "",
  //         closeModal: true,
  //       },
  //     },
  //     dangerMode: true,
  //   }).then((allowAction) => {
  //     if (allowAction) {
  //       deleteApi(rowData);
  //     }
  //   });
  // };

  // function deleteApi(rowData) {
  //   let params = {
  //     action: "deleteData",
  //     lan: language(),
  //     UserId: UserInfo.UserId,
  //     rowData: rowData,
  //   };

  //   // apiCall.post("productgroup", { params }, apiOption()).then((res) => {
  //   apiCall.post(serverpage, { params }, apiOption()).then((res) => {
  //     console.log("res: ", res);
  //     props.openNoticeModal({
  //       isOpen: true,
  //       msg: res.data.message,
  //       msgtype: res.data.success,
  //     });
  //     getDataList();
  //   });
  // }

  return (
    <>
      <div class="bodyContainer">
        {/* <!-- ######-----TOP HEADER-----####### --> */}
        <div class="topHeader">
          <h4>
            <a href="#">Home</a> ❯ Reports ❯ Transaction Report
          </h4>
        </div>

        {/* <!-- TABLE SEARCH AND GROUP ADD --> */}
        {/* <div class="searchAdd">
 
          <Button
            disabled={permissionType}
            label={"ADD"}
            class={"btnAdd"}
            onClick={addData}
          />
        </div> */}

        <div class="pad-10p">
          <div class="transaction-report-style">
            <div class="modalHeader">
              <h4>Transaction Reports</h4>
            </div>
            {/* <p>Select a report</p> */}

            <div class="modalItem">
              {/* <label>Designation *</label>
            <input
              type="text"
              id="DesignationName"
              name="DesignationName"
              // class={errorObject.DesignationName}
              placeholder="Enter Designation"
              // value={currentRow.DesignationName}
              // onChange={(e) => handleChange(e)}
            /> */}

              <input
                type="radio"
                id="CustomerVisitPunchLedger"
                name="trans_report"
                value="CustomerVisitPunchLedger"
                class="reportslist"
                onClick={selectCurrentReport}
              />
              <label for="CustomerVisitPunchLedger">
                Visit Punch Ledger
              </label>
            </div>
            <div class="modalItem">
              <input
                type="radio"
                id="CustomerVisitPunchSummary"
                name="trans_report"
                value="CustomerVisitPunchSummary"
                class="reportslist"
                onClick={selectCurrentReport}
              />
              <label for="CustomerVisitPunchSummary">
                Visit Punch Summary
              </label>
            </div>
            <div class="modalItem">
              <input
                type="radio"
                id="VisitPlan"
                name="trans_report"
                value="VisitPlan"
                class="reportslist"
                onClick={selectCurrentReport}
              />
              <label for="VisitPlan">Visit Plan</label>
            </div>
            <div class="modalItem">
              <input
                type="radio"
                id="ConveyanceReport"
                name="trans_report"
                value="ConveyanceReport"
                class="reportslist"
                onClick={selectCurrentReport}
              />
              <label for="ConveyanceReport">Conveyance Report</label>
            </div>
            <div class="modalItem">
              <input
                type="radio"
                id="LocalConveyance"
                name="trans_report"
                value="LocalConveyance"
                class="reportslist"
                onClick={selectCurrentReport}
              />
              <label for="LocalConveyance">Local Conveyance</label>
            </div>
            <div class="modalItem">
              <input
                type="radio"
                id="VisitSummaryReport"
                name="trans_report"
                value="VisitSummaryReport"
                class="reportslist"
                onClick={selectCurrentReport}
              />
              <label for="VisitSummaryReport">Visit Summary Report</label>
            </div>
            <div class="modalItem">
              <input
                type="radio"
                id="MachineryServiceReport"
                name="trans_report"
                value="MachineryServiceReport"
                class="reportslist"
                onClick={selectCurrentReport}
              />
              <label for="MachineryServiceReport">
                Machinery Service Report
              </label>
            </div>
          </div>

          <div class="transaction-report-style">
            <div class="modalHeader">
              <h4>Report Filter</h4>
            </div>

            <label>Department</label>
            <select
              id="DepartmentId"
              name="DepartmentId"
              value={currDepartmentId}
              onChange={(e) => handleChange(e)}
            >
              {DepartmentList &&
                DepartmentList.map((item, index) => {
                  return <option value={item.id}>{item.name}</option>;
                })}
            </select>

            <label>Sales Force</label>
            <select
              id="UserId"
              name="UserId"
              value={currUserId}
              onChange={(e) => handleChange(e)}
            >
              {UserList &&
                UserList.map((item, index) => {
                  return <option value={item.id}>{item.name}</option>;
                })}
            </select>

            <label>Start Date</label>
            <div>
              <input
                type="date"
                id="StartDate"
                name="StartDate"
                value={StartDate}
                onChange={(e) => handleChangeFilterDate(e)}
              />
            </div>

            <label>End Date</label>
            <div>
              <input
                type="date"
                id="EndDate"
                name="EndDate"
                value={EndDate}
                onChange={(e) => handleChangeFilterDate(e)}
              />
            </div>

            <label>Visit List</label>
            <select
              id="TransactionId"
              name="TransactionId"
              value={currTransactionId}
              disabled={isdisablevisitorlist}
              onChange={(e) => handleChange(e)}
            >
              {TransactionList &&
                TransactionList.map((item, index) => {
                  return <option value={item.id}>{item.name}</option>;
                })}
            </select>

            <Button
              label={"Generate Report"}
              class={"btnUpdate"}
              onClick={generateReport}
              // onClick={PrintPDFExcelExportFunction}
            />

            <Button
              label={"Excel"}
              class={"btnPrint"}
              onClick={ExcelGenerate}
            />

            <Button label={"PDF"} class={"btnClose"} onClick={PDFGenerate} />
          </div>
        </div>
{/* 
        <div class="subContainer ">
          <div className="App"> */}
            <CustomTable
              columns={columnList}
              rows={dataList ? dataList : {}}
              // actioncontrol={actioncontrol}
            />
          {/* </div>
        </div> */}
      </div>
      {/* <!-- BODY CONTAINER END --> */}
    </>
  );
};

export default TransactionReport;
