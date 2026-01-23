import React, { forwardRef, useRef, useEffect } from "react";
import swal from "sweetalert";
import {
  DeleteOutline,
  Edit,
  AddAPhoto,
  PictureAsPdf,
} from "@material-ui/icons";
import { Button } from "../../../components/CustomControl/Button";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { Typography, TextField } from "@material-ui/core";
import CustomTable from "components/CustomTable/CustomTable";
import {
  apiCall,
  apiCallReport,
  apiOption,
  LoginUserInfo,
  language,
} from "../../../actions/api";
import ExecuteQueryHook from "../../../components/hooks/ExecuteQueryHook";
import moment from "moment";
import "../../../assets/css/audit.css";
import {
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Checkbox,
  ListItemText,
} from "@material-ui/core";

const ReportReviewer = (props) => {
  const permissionType = props.permissionType;
  const serverpage = "reportreviewer"; // this is .php server page

  const { useState } = React;
  const [bFirst, setBFirst] = useState(true);
  const [currentRow, setCurrentRow] = useState([]);
  const [toggle, setToggle] = useState(true); //true=show tabel, false= show add/edit form

  const [errorObject, setErrorObject] = useState({});
  const UserInfo = LoginUserInfo();

  const [ActivityList, setActivityList] = useState(null);
  const [currActivityId, setCurrActivityId] = useState(null);

  const [FactoryList, setFactoryList] = useState(null);
  const [currFactoryId, setCurrFactoryId] = useState(null);

  const [StateList, setStateList] = useState(null);
  const [currStateId, setCurrStateId] = useState(null);

  const [ProgramList, setProgramList] = useState(null);
  const [currProgramId, setCurrProgramId] = useState(null);

  const [CoordinatorList, setCoordinatorList] = useState(null);
  const [currCoordinatorId, setCurrCoordinatorId] = useState(null);

  const [AuditStageList, setAuditStageList] = useState(null);
  const [currAuditStageId, setCurrAuditStageId] = useState(null);

  const [LeadStatusList, setLeadStatusList] = useState(null);
  const [currLeadStatusId, setCurrLeadStatusId] = useState(null);

  const [BuyerList, setBuyerList] = useState(null);
  const [currBuyerId, setCurrBuyerId] = useState(null);

  const [DepartmentList, setDepartmentList] = useState(null);
  const [currDepartmentId, setCurrDepartmentId] = useState(null);

  const [MemberList, setMemberList] = useState(null);
  const [currMemberId, setCurrMemberId] = useState(null);

  const [CountryList, setCountryList] = useState(null);
  const [currCountryId, setCurrCountryId] = useState(null);

  const [LeadAuditorList, setLeadAuditorList] = useState(null);
  const [currLeadAuditorId, setCurrLeadAuditorId] = useState(null);

  const [TeamAuditorList, setTeamAuditorList] = useState(null);
  const [currTeamAuditorId, setCurrTeamAuditorId] = useState([]);

  const [AuditTypeList, setAuditTypeList] = useState(null);
  const [currAuditTypeId, setCurrAuditTypeId] = useState(null);

  const [AuditorList, setAuditorList] = useState(null);
  const [currReportWriterId, setCurrReportWriterId] = useState(null);

  const [LocalReviewerList, setLocalReviewerList] = useState(null);
  const [currLocalReviewerId, setCurrLocalReviewerId] = useState(null);

  const [ReleasedStatusList, setReleasedStatusList] = useState(null);
  const [currReportReleasedStatusId, setCurrReportReleasedStatusId] =
    useState(null);

  const [StartDate, setStartDate] = useState(
    moment().add(-30, "days").format("YYYY-MM-DD")
  );
  const [EndDate, setEndDate] = useState(moment().format("YYYY-MM-DD"));

  const { isLoading, data: dataList, error, ExecuteQuery } = ExecuteQueryHook(); //Fetch data
  const [selectedDate, setSelectedDate] = useState(
    moment().format("YYYY-MM-DD")
  );

  /* =====Start of Excel Export Code==== */
  const EXCEL_EXPORT_URL = process.env.REACT_APP_API_URL;

  const PrintPDFExcelExportFunction = (reportType) => {
    let finalUrl = EXCEL_EXPORT_URL + "report/print_pdf_excel_server.php";

    window.open(
      finalUrl +
        "?action=ReportReviewerExport" +
        "&reportType=excel" +
        "&StartDate=" +
        StartDate +
        "&EndDate=" +
        EndDate +
        "&UserId=" +
        UserInfo.UserId +
        "&RoleId=" +
        UserInfo.RoleId[0] +
        "&TimeStamp=" +
        Date.now()
    );
  };
  /* =====End of Excel Export Code==== */

  const handleChangeFilterDate = (e) => {
    const { name, value } = e.target;
    if (name === "StartDate") {
      setStartDate(value);
      //getTransactionList(currDepartmentId, currUserId, value, EndDate);
    }

    if (name === "EndDate") {
      setEndDate(value);
      // getTransactionList(currDepartmentId, currUserId, StartDate, value);
    }
  };

  React.useEffect(() => {
    getActivityList("");
    getFactoryList("");

    getStateList("");
    getProgramList("");
    getCoordinatorList("");
    getReportReviewerList("");
    getAuditStageList("");
    getLeadStatusList("");
    getBuyerList("");
    getDepartmentList("");
    getMemberList("", "");
    getCountryList("");
    // getLeadAuditorList("");
    // getTeamAuditorList("");
    getAuditTypeList("");
    getReleasedStatusList("");

    // console.log("calling use effect");
  }, []);

  function getActivityList(selectActivityId) {
    let params = {
      action: "ActivityList",
      lan: language(),
      UserId: UserInfo.UserId,
    };

    apiCall.post("combo_generic", { params }, apiOption()).then((res) => {
      setActivityList(
        [{ id: "", name: "Select Activity" }].concat(res.data.datalist)
      );

      setCurrActivityId(selectActivityId);
    });
  }

  function getFactoryList(selectFactoryId) {
    let params = {
      action: "FactoryList",
      lan: language(),
      UserId: UserInfo.UserId,
    };

    apiCall.post("combo_generic", { params }, apiOption()).then((res) => {
      setFactoryList(
        [{ id: "", name: "Select Factory" }].concat(res.data.datalist)
      );

      setCurrFactoryId(selectFactoryId);
    });
  }

  function getStateList(selectStateId) {
    let params = {
      action: "StateList",
      lan: language(),
      UserId: UserInfo.UserId,
    };

    apiCall.post("combo_generic", { params }, apiOption()).then((res) => {
      setStateList(
        [{ id: "", name: "Select State" }].concat(res.data.datalist)
      );

      setCurrStateId(selectStateId);
    });
  }

  function getProgramList(selectProgramId) {
    let params = {
      action: "ProgramList",
      lan: language(),
      UserId: UserInfo.UserId,
    };

    apiCall.post("combo_generic", { params }, apiOption()).then((res) => {
      setProgramList(
        [{ id: "", name: "Select Program" }].concat(res.data.datalist)
      );

      setCurrProgramId(selectProgramId);
    });
  }

  function getCoordinatorList(selectCoordinatorId) {
    let params = {
      action: "getCoordinatorList",
      lan: language(),
      UserId: UserInfo.UserId,
    };

    apiCall.post("combo_generic", { params }, apiOption()).then((res) => {
      setCoordinatorList(
        [{ id: "", name: "Select" }].concat(res.data.datalist)
      );

      setCurrCoordinatorId(selectCoordinatorId);
    });
  }

  function getReportReviewerList(selectLocalReviewerId) {
    let params = {
      action: "getReportReviewerList",
      lan: language(),
      UserId: UserInfo.UserId,
    };

    apiCall.post("combo_generic", { params }, apiOption()).then((res) => {
      setLocalReviewerList(
        [{ id: "", name: "Select" }].concat(res.data.datalist)
      );

      setCurrLocalReviewerId(selectLocalReviewerId);
    });
  }

  function getAuditorList(selectReportWriterId) {
    // console.log('selectReportWriterId: ', selectReportWriterId);
    let params = {
      action: "getAuditorList",
      lan: language(),
      UserId: UserInfo.UserId,
    };

    apiCall.post("combo_generic", { params }, apiOption()).then((res) => {
      setAuditorList([{ id: "", name: "Select" }].concat(res.data.datalist));

      setCurrReportWriterId(selectReportWriterId);
    });
  }
  function getAuditStageList(selectAuditStageId) {
    let params = {
      action: "AuditStageList",
      lan: language(),
      UserId: UserInfo.UserId,
    };

    apiCall.post("combo_generic", { params }, apiOption()).then((res) => {
      setAuditStageList(
        [{ id: "", name: "Select Audit Stage" }].concat(res.data.datalist)
      );

      setCurrAuditStageId(selectAuditStageId);
    });
  }

  function getLeadStatusList(selectLeadStatusId) {
    let params = {
      action: "getLeadStatusList",
      lan: language(),
      UserId: UserInfo.UserId,
    };

    apiCall.post("combo_generic", { params }, apiOption()).then((res) => {
      setLeadStatusList(
        [{ id: "", name: "Select Lead Status" }].concat(res.data.datalist)
      );

      setCurrLeadStatusId(selectLeadStatusId);
    });
  }

  function getBuyerList(selectBuyerId) {
    let params = {
      action: "getBuyerList",
      lan: language(),
      UserId: UserInfo.UserId,
    };

    apiCall.post("combo_generic", { params }, apiOption()).then((res) => {
      setBuyerList(
        [{ id: "", name: "Select Buyer" }].concat(res.data.datalist)
      );

      setCurrBuyerId(selectBuyerId);
    });
  }

  function getDepartmentList(selectDepartmentId) {
    let params = {
      action: "DepartmentList",
      lan: language(),
      UserId: UserInfo.UserId,
    };

    apiCall.post("combo_generic", { params }, apiOption()).then((res) => {
      setDepartmentList(
        [{ id: "", name: "Select Department" }].concat(res.data.datalist)
      );

      setCurrDepartmentId(selectDepartmentId);
    });
  }

  function getMemberList(pDepartmentId, selectMemberId) {
    let params = {
      action: "getMemberList",
      lan: language(),
      UserId: UserInfo.UserId,
      DepartmentId: pDepartmentId ? pDepartmentId : 0,
    };

    apiCall.post("combo_generic", { params }, apiOption()).then((res) => {
      console.log(res.data.datalist);
      setMemberList(
        [{ id: "", name: "Select Member" }].concat(res.data.datalist)
      );

      setCurrMemberId(selectMemberId ? selectMemberId : "");
    });
  }

  function getCountryList(selectCountryId) {
    let params = {
      action: "getCountryList",
      lan: language(),
      UserId: UserInfo.UserId,
    };

    apiCall.post("combo_generic", { params }, apiOption()).then((res) => {
      setCountryList(
        [{ id: "", name: "Select Country" }].concat(res.data.datalist)
      );

      setCurrCountryId(selectCountryId);
    });
  }

  function getLeadAuditorList(selectLeadAuditorId) {
    let params = {
      action: "getAuditorList",
      lan: language(),
      UserId: UserInfo.UserId,
    };

    apiCall.post("combo_generic", { params }, apiOption()).then((res) => {
      setLeadAuditorList(
        [{ id: "", name: "Select Lead Auditor" }].concat(res.data.datalist)
      );

      setCurrLeadAuditorId(selectLeadAuditorId);
    });
  }

  function getTeamAuditorList(selectTeamAuditorId) {
    let params = {
      action: "getAuditorList",
      lan: language(),
      UserId: UserInfo.UserId,
    };

    apiCall.post("combo_generic", { params }, apiOption()).then((res) => {
      setTeamAuditorList(
        [{ id: "", name: "Select Team Auditor" }].concat(res.data.datalist)
      );

      setCurrTeamAuditorId(selectTeamAuditorId ? selectTeamAuditorId : []);
    });
  }

  function getAuditTypeList(selectAuditTypeId) {
    let params = {
      action: "getAuditTypeList",
      lan: language(),
      UserId: UserInfo.UserId,
    };

    apiCall.post("combo_generic", { params }, apiOption()).then((res) => {
      setAuditTypeList(
        [{ id: "", name: "Select Audit Type" }].concat(res.data.datalist)
      );

      setCurrAuditTypeId(selectAuditTypeId);
    });
  }

  function getReleasedStatusList(selectReportReleasedStatusId) {
    let params = {
      action: "getReleasedStatusList",
      lan: language(),
      UserId: UserInfo.UserId,
    };

    apiCall.post("combo_generic", { params }, apiOption()).then((res) => {
      setReleasedStatusList(
        [{ id: "", name: "Select Released Status" }].concat(res.data.datalist)
      );

      setCurrReportReleasedStatusId(selectReportReleasedStatusId);
    });
  }
  const handleChange = (e) => {
    const { name, value } = e.target;
    // console.log('name: ', name);
    // console.log('value: ', value);
    let data = { ...currentRow };
    data[name] = value;
    setCurrentRow(data);
    setErrorObject({ ...errorObject, [name]: null });
  };

  function handleChangeCheck(e) {
    // console.log('e.target.checked: ', e.target.checked);
    const { name, value } = e.target;

    let data = { ...currentRow };
    data[name] = e.target.checked;
    setCurrentRow(data);
    //  console.log('aaa data: ', data);
  }

  function handleChangeRadio(e) {
    let data = { ...currentRow };
    data[e.target.id] = e.target.value;
    setCurrentRow(data);
  }

  const handleChangeDropDown = (name, value) => {
    let data = { ...currentRow };

    if (name === "ActivityId") {
      data["ActivityId"] = value;
      setCurrActivityId(value);
    }

    if (name === "FactoryId") {
      data["FactoryId"] = value;
      setCurrFactoryId(value);
    }
    if (name === "StateId") {
      data["StateId"] = value;
      setCurrStateId(value);
    }
    if (name === "ProgramId") {
      data["ProgramId"] = value;
      setCurrProgramId(value);
    }

    if (name === "CoordinatorId") {
      data["CoordinatorId"] = value;
      setCurrCoordinatorId(value);
    }

    if (name === "AuditStageId") {
      data["AuditStageId"] = value;
      setCurrAuditStageId(value);
    }

    if (name === "LeadStatusId") {
      data["LeadStatusId"] = value;
      setCurrLeadStatusId(value);
    }

    if (name === "BuyerId") {
      data["BuyerId"] = value;
      setCurrBuyerId(value);
    }
    if (name === "DepartmentId") {
      data["DepartmentId"] = value;
      setCurrDepartmentId(value);
      getMemberList(value, "");
    }
    if (name === "MemberId") {
      data["MemberId"] = value;
      setCurrMemberId(value);
    }

    if (name === "CountryId") {
      data["CountryId"] = value;
      setCurrCountryId(value);
    }

    if (name === "LeadAuditorId") {
      data["LeadAuditorId"] = value;
      setCurrLeadAuditorId(value);
    }

    // if (name === "TeamAuditorId") {
    //   data["TeamAuditorId"] = value;
    //   setCurrTeamAuditorId(value);
    // }

    if (name === "AuditTypeId") {
      data["AuditTypeId"] = value;
      setCurrAuditTypeId(value);
    }

    if (name === "ReportWriterId") {
      data["ReportWriterId"] = value;
      setCurrReportWriterId(value);
    }

    if (name === "LocalReviewerId") {
      data["LocalReviewerId"] = value;
      setCurrLocalReviewerId(value);
    }
    if (name === "ReportReleasedStatusId") {
      data["ReportReleasedStatusId"] = value;
      setCurrReportReleasedStatusId(value);
    }
    setErrorObject({ ...errorObject, [name]: null });
    setCurrentRow(data);
  };
  const handleChangeMulpleCbo = (event) => {
    let data = { ...currentRow };

    // console.log('selected: ', selected);

    // console.log('eventeventeventevent: ', event);
    // console.log('eventeventeventevent TeamAuditorList: ', TeamAuditorList);
    const value = event.target.value;
    // console.log('value: ', value);
    setCurrTeamAuditorId(typeof value === "string" ? value.split(",") : value);

    data["TeamAuditorId"] =
      typeof value === "string" ? value.split(",") : value;
    // setErrorObject({ ...errorObject, [name]: null });
    setCurrentRow(data);
  };
  const validateForm = () => {
    let validateFields = [];
    validateFields = ["ActivityId", "FactoryId", "ProgramId"];
    let errorData = {};
    let isValid = true;
    validateFields.map((field) => {
      if (!currentRow[field]) {
        errorData[field] = " validation-style ";
        isValid = false;
      }
    });
    setErrorObject(errorData);
    return isValid;
  };

  function addEditAPICall() {
    if (validateForm()) {
      // console.log('currentRow: ', currentRow);
      let params = {
        action: "dataAddEdit",
        lan: language(),
        UserId: UserInfo.UserId,
        rowData: currentRow,
      };

      apiCall.post(serverpage, { params }, apiOption()).then((res) => {
        props.openNoticeModal({
          isOpen: true,
          msg: res.data.message,
          msgtype: res.data.success,
        });

        if (res.data.success === 1) {
          setToggle(true); // true=show tabel, false= show add/edit form
          getDataList();
        }
      });
    }
  }

  function showListView() {
    setToggle(true);
  }

  const columnList = [
    { field: "rownumber", label: "SL", align: "center", width: "3%" },
    // {
    //   field: "ActivityName",
    //   label: "Activity",
    //   align: "left",
    //   visible: true,
    //   sort: true,
    //   filter: true,
    //   width: "13%",
    // },
    {
      field: "FactoryName",
      label: "Factory Name",
      align: "left",
      visible: true,
      sort: true,
      filter: true,
      // width: "12%",
    },
    {
      field: "ProgramName",
      label: "Program",
      align: "left",
      visible: true,
      sort: true,
      filter: true,
      width: "7%",
    },

    // {
    //   field: "ExpireDate",
    //   label: "Expire Date",
    //   align: "left",
    //   visible: true,
    //   sort: true,
    //   filter: true,
    //   width: "7%",
    // },

    // {
    //   field: "OpportunityDate",
    //   label: "Opportunity Date",
    //   align: "left",
    //   visible: true,
    //   sort: true,
    //   filter: true,
    //   width: "6%",
    // },

    {
      field: "AuditStageName",
      label: "Audit Stage",
      align: "left",
      visible: true,
      sort: true,
      filter: true,
      width: "6%",
    },
    {
      field: "LeadStatusName",
      label: "Lead Status",
      align: "left",
      visible: true,
      sort: true,
      filter: true,
      width: "7%",
    },
    // {
    //   field: "BuyerName",
    //   label: "Buyer",
    //   align: "left",
    //   visible: true,
    //   sort: true,
    //   filter: true,
    //   width: "7%",
    // },
    // {
    //   field: "NextFollowupDate",
    //   label: "Next Followup Date",
    //   align: "left",
    //   visible: true,
    //   sort: true,
    //   filter: true,
    //   width: "6%",
    // },
    {
      field: "AssessmentNo",
      label: "Assessment No",
      align: "left",
      visible: true,
      sort: true,
      filter: true,
      width: "6%",
    },
    {
      field: "AuditStartDate",
      label: "Audit Start Date",
      align: "left",
      visible: true,
      sort: true,
      filter: true,
      width: "5%",
    },
    {
      field: "AuditEndDate",
      label: "Audit End Date",
      align: "left",
      visible: true,
      sort: true,
      filter: true,
      width: "5%",
    },
        {
      field: "ReportWriter",
      label: "Report Writer",
      align: "left",
      visible: true,
      sort: true,
      filter: true,
      width: "8%",
    },
    {
      field: "ReportReleaseStatus",
      label: "Report Release Status",
      align: "left",
      visible: true,
      sort: true,
      filter: true,
      width: "5%",
    },
    {
      field: "LocalReviewer",
      label: "Local Reviewer",
      align: "left",
      visible: true,
      sort: true,
      filter: true,
      width: "7%",
    },
    {
      field: "StandardTAT",
      label: "Standard TAT",
      align: "left",
      visible: true,
      sort: true,
      filter: true,
      width: "6%",
    },
    {
      field: "StrategicTAT",
      label: "Strategic TAT",
      align: "left",
      visible: true,
      sort: true,
      filter: true,
      width: "6%",
    },
    // {
    //   field: "ReportReleasedStatus",
    //   label: "Released Status",
    //   align: "left",
    //   visible: true,
    //   sort: true,
    //   filter: true,
    //   width: "5%",
    // },
    {
      field: "custom",
      label: "Action",
      width: "5%",
      align: "center",
      visible: true,
      sort: false,
      filter: false,
    },
  ];

  if (bFirst) {
    /**First time call for datalist */
    getDataList();
    setBFirst(false);
  }

  useEffect(() => {
    getDataList();
  }, [StartDate, EndDate]);

  /**Get data for table list */
  function getDataList() {
    let params = {
      action: "getDataList",
      lan: language(),
      UserId: UserInfo.UserId,
      RoleId: UserInfo.RoleId[0],
      StartDate: StartDate,
      EndDate: EndDate,
    };
    // console.log('LoginUserInfo params: ', params);

    ExecuteQuery(serverpage, params);
  }

  /** Action from table row buttons*/
  function actioncontrol(rowData) {
    return (
      <>
        <Edit
          className={"table-edit-icon"}
          onClick={() => {
            editData(rowData);
          }}
        />

        {/* <DeleteOutline
          className={"table-delete-icon"}
          onClick={() => {
            deleteData(rowData);
          }}
        /> */}
      </>
    );
  }

  const addData = () => {
    setCurrActivityId("");
    setCurrFactoryId("");
    setCurrProgramId("");
    setCurrCoordinatorId("");
    setCurrAuditStageId("");
    setCurrLeadStatusId("");
    setCurrBuyerId("");
    setCurrDepartmentId("");
    // setCurrMemberId(rowData.MemberId);
    getMemberList("", "");

    setCurrCountryId("");
    setCurrLeadAuditorId("");
    setCurrTeamAuditorId([]);
    setCurrAuditTypeId("");
    setCurrReportWriterId("");
    setCurrLocalReviewerId("");
    setCurrReportReleasedStatusId("");

    setCurrentRow({
      id: "",
      TransactionTypeId: 1,
      TransactionDate: selectedDate,
      InvoiceNo: selectedDate,
      ActivityId: "",
      FactoryId: "",
      FactoryAddress: "",
      FactoryGroupName: "",
      ProgramId: "",
      ExpireDate: "",
      OpportunityDate: "",
      TentativeOfferPrice: "",
      CertificateBody: "",
      CoordinatorId: "",
      AuditStageId: "",
      LeadStatusId: "",
      ManDay: "",
      BuyerId: "",
      NextFollowupDate: "",
      DepartmentId: "",
      MemberId: "",
      Remarks: "",
      Comments: "",
      StatusId: 5,

      AssessmentNo: "",
      AuditStartDate: "",
      AuditEndDate: "",
      CountryId: "",
      LeadAuditorId: "",
      TeamAuditorId: "",
      AuditTypeId: "",
      Window: "",
      PaymentStatus: "No",
      ReportWriterId: "",

      ReportWritingDate: "",
      NoOfEmployee: "",
      AuditFee: "",
      OPE: "",
      PINo: "",
      AttachedDocuments: "",
      AuditTypeId: "",
      IsSendMail: 0,
      ReportReleaseStatus: "No",

      InvStatusId: "",
      InvStatusName: "",
      InvoiceComments: "",

      IsReportReceivedFromWriter: "No",
      ReportReceivedDate: "",
      LocalReviewerId: "",
      StandardTAT: "",
      StrategicTAT: "",
      ReportReleasedStatusId: "",
      OverseasSendingDate: "",
      AuditorLogInTime: "",
      AduditorLogOutTime: "",
      ReleaseDate: "",


      FormData: null,
    });
    // openModal();
    setToggle(false); // true=show tabel, false= show add/edit form
  };

  const editData = (rowData) => {
    setCurrActivityId(rowData.ActivityId);
    setCurrFactoryId(rowData.FactoryId);
    setCurrStateId(rowData.StateId);

    setCurrProgramId(rowData.ProgramId);
    setCurrCoordinatorId(rowData.CoordinatorId);
    setCurrAuditStageId(rowData.AuditStageId);
    setCurrLeadStatusId(rowData.LeadStatusId);
    setCurrBuyerId(rowData.BuyerId);
    setCurrDepartmentId(rowData.DepartmentId);
    // setCurrMemberId(rowData.MemberId);

    getMemberList(rowData.DepartmentId, rowData.MemberId);
    setCurrCountryId(rowData.CountryId);
    getLeadAuditorList(rowData.LeadAuditorId);
    // setCurrLeadAuditorId(rowData.LeadAuditorId);
    // setCurrTeamAuditorId(rowData.TeamAuditorId);

    getTeamAuditorList(JSON.parse(rowData.TeamAuditorId || "[]"));

    setCurrAuditTypeId(rowData.AuditTypeId);
    getAuditorList(rowData.ReportWriterId);
    // setCurrReportWriterId(rowData.ReportWriterId);

    setCurrLocalReviewerId(rowData.LocalReviewerId);
    setCurrReportReleasedStatusId(rowData.ReportReleasedStatusId);

    setCurrentRow(rowData);
    setToggle(false); // true=show tabel, false= show add/edit form
  };

  const deleteData = (rowData) => {
    swal({
      title: "Are you sure?",
      text: "Once deleted, you will not be able to recover this data!",
      icon: "warning",
      buttons: {
        confirm: {
          text: "Yes",
          value: true,
          visible: true,
          className: "",
          closeModal: true,
        },
        cancel: {
          text: "No",
          value: null,
          visible: true,
          className: "",
          closeModal: true,
        },
      },
      dangerMode: true,
    }).then((allowAction) => {
      if (allowAction) {
        deleteApi(rowData);
      }
    });
  };

  function deleteApi(rowData) {
    let params = {
      action: "deleteData",
      lan: language(),
      UserId: UserInfo.UserId,
      rowData: rowData,
    };

    apiCall.post(serverpage, { params }, apiOption()).then((res) => {
      // console.log("res: ", res);
      props.openNoticeModal({
        isOpen: true,
        msg: res.data.message,
        msgtype: res.data.success,
      });
      getDataList();
    });
  }

  return (
    <>
      <div class="bodyContainer">
        {/* <!-- ######-----TOP HEADER-----####### --> */}
        <div class="topHeader">
          <h4>Home ❯ Audit ❯ Report Reviewer</h4>
        </div>

        {/* <!-- TABLE SEARCH AND GROUP ADD --> */}
        {toggle && (
          <div class="searchAdd">
            <div>
              <label>Audit End Date - Start</label>
              <div class="">
                <input
                  type="date"
                  id="StartDate"
                  name="StartDate"
                  value={StartDate}
                  onChange={(e) => handleChangeFilterDate(e)}
                />
              </div>
            </div>

            <div>
              <label>Audit End Date - End</label>
              <div class="">
                <input
                  type="date"
                  id="EndDate"
                  name="EndDate"
                  value={EndDate}
                  onChange={(e) => handleChangeFilterDate(e)}
                />
              </div>
            </div>
            <Button
              label={"Export"}
              class={"btnPrint"}
              onClick={PrintPDFExcelExportFunction}
            />
            {/* <Button label={"ADD"} class={"btnAdd"} onClick={addData} /> */}

            {/* {!toggle && (
            <Button
              label={"Back to List"}
              class={"btnClose"}
              onClick={showListView}
            />
          )} */}
          </div>
        )}

        {/* <!-- ####---THIS CLASS IS USE FOR TABLE GRID---####s --> */}

        {toggle && (
          <CustomTable
            columns={columnList}
            rows={dataList ? dataList : {}}
            actioncontrol={actioncontrol}
          />
        )}

        {!toggle && (
          <>
            {/* <!-- GROUP MODAL START --> */}

            <div class="formEntryColumnFour">
              <label>Activity *</label>
              <Autocomplete
                autoHighlight
                disableClearable
                disabled={true}
                className={`chosen_dropdown ${
                  errorObject.ActivityId ? errorObject.ActivityId : ""
                }`}
                id="ActivityId"
                name="ActivityId"
                autoComplete
                // class={errorObject.ActivityId}
                options={ActivityList ? ActivityList : []}
                getOptionLabel={(option) => option.name}
                defaultValue={{ id: 0, name: "Select Activity" }}
                value={
                  ActivityList
                    ? ActivityList[
                        ActivityList.findIndex(
                          (list) => list.id === currActivityId
                        )
                      ]
                    : null
                }
                onChange={(event, valueobj) =>
                  handleChangeDropDown(
                    "ActivityId",
                    valueobj ? valueobj.id : ""
                  )
                }
                renderOption={(option) => (
                  <Typography className="chosen_dropdown_font">
                    {option.name}
                  </Typography>
                )}
                renderInput={(params) => (
                  <TextField {...params} variant="standard" fullWidth />
                )}
              />

              <label>Factory *</label>
              <Autocomplete
                autoHighlight
                disableClearable
                disabled={true}
                // className="chosen_dropdown"
                className={`chosen_dropdown ${
                  errorObject.FactoryId ? errorObject.FactoryId : ""
                }`}
                id="FactoryId"
                name="FactoryId"
                autoComplete
                // class={errorObject.FactoryId}
                options={FactoryList ? FactoryList : []}
                getOptionLabel={(option) => option.name}
                defaultValue={{ id: 0, name: "Select Factory" }}
                value={
                  FactoryList
                    ? FactoryList[
                        FactoryList.findIndex(
                          (list) => list.id === currFactoryId
                        )
                      ]
                    : null
                }
                onChange={(event, valueobj) =>
                  handleChangeDropDown("FactoryId", valueobj ? valueobj.id : "")
                }
                renderOption={(option) => (
                  <Typography className="chosen_dropdown_font">
                    {option.name}
                  </Typography>
                )}
                renderInput={(params) => (
                  <TextField {...params} variant="standard" fullWidth />
                )}
              />
              <label>Group Name</label>
              <input
                type="text"
                id="FactoryGroupName"
                name="FactoryGroupName"
                // class={errorObject.FactoryGroupName}
                placeholder="Enter Factory Group"
                disabled={true}
                // value={currentRow.FactoryGroupName}
                value={
                  currFactoryId
                    ? FactoryList[
                        FactoryList.findIndex(
                          (list) => list.id === currFactoryId
                        )
                      ].FactoryGroupName
                    : ""
                }
                // onChange={(e) => handleChange(e)}
              />

              <label>Factory Address</label>
              <input
                type="text"
                id="FactoryAddress"
                name="FactoryAddress"
                disabled={true}
                // class={errorObject.FactoryAddress}
                placeholder="Enter Factory Address"
                value={currentRow.FactoryAddress}
                onChange={(e) => handleChange(e)}
              />

              <label>State</label>
              <Autocomplete
                autoHighlight
                disableClearable
                disabled={true}
                // disabled={true}
                // className="chosen_dropdown"
                className={`chosen_dropdown ${
                  errorObject.StateId ? errorObject.StateId : ""
                }`}
                id="StateId"
                name="StateId"
                autoComplete
                // class={errorObject.StateId}
                options={StateList ? StateList : []}
                getOptionLabel={(option) => option.name}
                defaultValue={{ id: 0, name: "Select State" }}
                value={
                  StateList
                    ? StateList[
                        StateList.findIndex((list) => list.id === currStateId)
                      ]
                    : null
                }
                onChange={(event, valueobj) =>
                  handleChangeDropDown("StateId", valueobj ? valueobj.id : "")
                }
                renderOption={(option) => (
                  <Typography className="chosen_dropdown_font">
                    {option.name}
                  </Typography>
                )}
                renderInput={(params) => (
                  <TextField {...params} variant="standard" fullWidth />
                )}
              />

              <label>Factory Contact Person</label>
              <input
                type="text"
                id="FactoryContactPerson"
                name="FactoryContactPerson"
                disabled={true}
                // class={errorObject.FactoryContactPerson}
                placeholder="Enter Factory Contact Person"
                value={currentRow.FactoryContactPerson}
                onChange={(e) => handleChange(e)}
              />

              <label>Factory Contact Person Phone</label>
              <input
                type="text"
                id="FactoryContactPersonPhone"
                name="FactoryContactPersonPhone"
                disabled={true}
                // class={errorObject.FactoryContactPersonPhone}
                placeholder="Enter Factory Contact Person Phone"
                value={currentRow.FactoryContactPersonPhone}
                onChange={(e) => handleChange(e)}
              />

              <label>Factory Contact Person Email</label>
              <input
                type="text"
                id="FactoryContactPersonEmail"
                name="FactoryContactPersonEmail"
                disabled={true}
                // class={errorObject.FactoryContactPersonEmail}
                placeholder="Enter Factory Contact Person Email"
                value={currentRow.FactoryContactPersonEmail}
                onChange={(e) => handleChange(e)}
              />

              <label>Factory Weekend</label>
              <input
                type="text"
                id="FactoryHoliday"
                name="FactoryHoliday"
                disabled={true}
                title={
                  currentRow.FactoryHoliday ? currentRow.FactoryHoliday : ""
                }
                // class={errorObject.FactoryHoliday}
                placeholder="Enter Factory Weekend"
                value={currentRow.FactoryHoliday}
                onChange={(e) => handleChange(e)}
              />

              <label>Program *</label>
              <Autocomplete
                autoHighlight
                disableClearable
                disabled={true}
                // className="chosen_dropdown"
                className={`chosen_dropdown ${
                  errorObject.ProgramId ? errorObject.ProgramId : ""
                }`}
                id="ProgramId"
                name="ProgramId"
                autoComplete
                // class={errorObject.ProgramId}
                options={ProgramList ? ProgramList : []}
                getOptionLabel={(option) => option.name}
                defaultValue={{ id: 0, name: "Select Program" }}
                value={
                  ProgramList
                    ? ProgramList[
                        ProgramList.findIndex(
                          (list) => list.id === currProgramId
                        )
                      ]
                    : null
                }
                onChange={(event, valueobj) =>
                  handleChangeDropDown("ProgramId", valueobj ? valueobj.id : "")
                }
                renderOption={(option) => (
                  <Typography className="chosen_dropdown_font">
                    {option.name}
                  </Typography>
                )}
                renderInput={(params) => (
                  <TextField {...params} variant="standard" fullWidth />
                )}
              />

              <label>Expire Date</label>
              <input
                type="date"
                id="ExpireDate"
                name="ExpireDate"
                disabled={true}
                // class={errorObject.ExpireDate}
                placeholder="Enter Expire Date"
                value={currentRow.ExpireDate}
                onChange={(e) => handleChange(e)}
              />

              <label>Opportunity Date</label>
              <input
                type="date"
                id="OpportunityDate"
                name="OpportunityDate"
                disabled={true}
                // class={errorObject.OpportunityDate}
                placeholder="Enter Opportunity Date"
                value={currentRow.OpportunityDate}
                onChange={(e) => handleChange(e)}
              />

              <label>Tentative Offer Price</label>
              <input
                type="number"
                id="TentativeOfferPrice"
                name="TentativeOfferPrice"
                disabled={true}
                // class={errorObject.TentativeOfferPrice}
                placeholder="Enter Tentative Offer Price"
                value={currentRow.TentativeOfferPrice}
                onChange={(e) => handleChange(e)}
              />

              <label>CB (Certificate Body)</label>
              <input
                type="text"
                id="CertificateBody"
                name="CertificateBody"
                disabled={true}
                // class={errorObject.CertificateBody}
                placeholder="Enter Certificate Body"
                value={currentRow.CertificateBody}
                onChange={(e) => handleChange(e)}
              />

              <label>Coordinator</label>
              <Autocomplete
                autoHighlight
                disableClearable
                disabled={true}
                className="chosen_dropdown"
                id="CoordinatorId"
                name="CoordinatorId"
                autoComplete
                //  class={errorObject.CoordinatorId}
                options={CoordinatorList ? CoordinatorList : []}
                getOptionLabel={(option) => option.name}
                defaultValue={{ id: 0, name: "Select Coordinator" }}
                value={
                  CoordinatorList
                    ? CoordinatorList[
                        CoordinatorList.findIndex(
                          (list) => list.id === currCoordinatorId
                        )
                      ]
                    : null
                }
                onChange={(event, valueobj) =>
                  handleChangeDropDown(
                    "CoordinatorId",
                    valueobj ? valueobj.id : ""
                  )
                }
                renderOption={(option) => (
                  <Typography className="chosen_dropdown_font">
                    {option.name}
                  </Typography>
                )}
                renderInput={(params) => (
                  <TextField {...params} variant="standard" fullWidth />
                )}
              />

              <label>Audit Stage</label>
              <Autocomplete
                autoHighlight
                disableClearable
                disabled={true}
                className="chosen_dropdown"
                id="AuditStageId"
                name="AuditStageId"
                autoComplete
                //  class={errorObject.AuditStageId}
                options={AuditStageList ? AuditStageList : []}
                getOptionLabel={(option) => option.name}
                defaultValue={{ id: 0, name: "Select Audit Stage" }}
                value={
                  AuditStageList
                    ? AuditStageList[
                        AuditStageList.findIndex(
                          (list) => list.id === currAuditStageId
                        )
                      ]
                    : null
                }
                onChange={(event, valueobj) =>
                  handleChangeDropDown(
                    "AuditStageId",
                    valueobj ? valueobj.id : ""
                  )
                }
                renderOption={(option) => (
                  <Typography className="chosen_dropdown_font">
                    {option.name}
                  </Typography>
                )}
                renderInput={(params) => (
                  <TextField {...params} variant="standard" fullWidth />
                )}
              />

              <label>Lead Status</label>
              <Autocomplete
                autoHighlight
                disableClearable
                // disabled={true}
                disabled={permissionType == 1}
                className="chosen_dropdown"
                id="LeadStatusId"
                name="LeadStatusId"
                autoComplete
                //  class={errorObject.LeadStatusId}
                options={LeadStatusList ? LeadStatusList : []}
                getOptionLabel={(option) => option.name}
                defaultValue={{ id: 0, name: "Select Lead Status" }}
                value={
                  LeadStatusList
                    ? LeadStatusList[
                        LeadStatusList.findIndex(
                          (list) => list.id === currLeadStatusId
                        )
                      ]
                    : null
                }
                onChange={(event, valueobj) =>
                  handleChangeDropDown(
                    "LeadStatusId",
                    valueobj ? valueobj.id : ""
                  )
                }
                renderOption={(option) => (
                  <Typography className="chosen_dropdown_font">
                    {option.name}
                  </Typography>
                )}
                renderInput={(params) => (
                  <TextField {...params} variant="standard" fullWidth />
                )}
              />

              <label>Manday(s)</label>
              <input
                type="number"
                id="ManDay"
                name="ManDay"
                disabled={true}
                // class={errorObject.ManDay}
                placeholder="Enter Manday(s)"
                value={currentRow.ManDay}
                onChange={(e) => handleChange(e)}
              />

              <label>Buyer</label>
              <Autocomplete
                autoHighlight
                disableClearable
                disabled={true}
                className="chosen_dropdown"
                id="BuyerId"
                name="BuyerId"
                autoComplete
                //  class={errorObject.BuyerId}
                options={BuyerList ? BuyerList : []}
                getOptionLabel={(option) => option.name}
                defaultValue={{ id: 0, name: "Select Buyer" }}
                value={
                  BuyerList
                    ? BuyerList[
                        BuyerList.findIndex((list) => list.id === currBuyerId)
                      ]
                    : null
                }
                onChange={(event, valueobj) =>
                  handleChangeDropDown("BuyerId", valueobj ? valueobj.id : "")
                }
                renderOption={(option) => (
                  <Typography className="chosen_dropdown_font">
                    {option.name}
                  </Typography>
                )}
                renderInput={(params) => (
                  <TextField {...params} variant="standard" fullWidth />
                )}
              />

              <label>Lead Generated by (Department)</label>
              <Autocomplete
                autoHighlight
                disableClearable
                disabled={true}
                className="chosen_dropdown"
                id="DepartmentId"
                name="DepartmentId"
                autoComplete
                //  class={errorObject.DepartmentId}
                options={DepartmentList ? DepartmentList : []}
                getOptionLabel={(option) => option.name}
                defaultValue={{ id: 0, name: "Select Department" }}
                value={
                  DepartmentList
                    ? DepartmentList[
                        DepartmentList.findIndex(
                          (list) => list.id === currDepartmentId
                        )
                      ]
                    : null
                }
                onChange={(event, valueobj) =>
                  handleChangeDropDown(
                    "DepartmentId",
                    valueobj ? valueobj.id : ""
                  )
                }
                renderOption={(option) => (
                  <Typography className="chosen_dropdown_font">
                    {option.name}
                  </Typography>
                )}
                renderInput={(params) => (
                  <TextField {...params} variant="standard" fullWidth />
                )}
              />

              <label>Lead Generated by (Person)</label>
              <Autocomplete
                autoHighlight
                disableClearable
                disabled={true}
                className="chosen_dropdown"
                id="MemberId"
                name="MemberId"
                autoComplete
                //  class={errorObject.MemberId}
                options={MemberList ? MemberList : []}
                getOptionLabel={(option) => option.name}
                defaultValue={{ id: "", name: "Select Member" }}
                value={
                  MemberList
                    ? MemberList[
                        MemberList.findIndex((list) => list.id === currMemberId)
                      ]
                    : ""
                }
                onChange={(event, valueobj) =>
                  handleChangeDropDown("MemberId", valueobj ? valueobj.id : "")
                }
                renderOption={(option) => (
                  <Typography className="chosen_dropdown_font">
                    {option.name}
                  </Typography>
                )}
                renderInput={(params) => (
                  <TextField {...params} variant="standard" fullWidth />
                )}
              />

              <label>Next Followup Date</label>
              <input
                type="date"
                id="NextFollowupDate"
                name="NextFollowupDate"
                disabled={true}
                // class={errorObject.NextFollowupDate}
                placeholder="Enter Next Followup Date"
                value={currentRow.NextFollowupDate}
                onChange={(e) => handleChange(e)}
              />

              <label>Business Type</label>
              <input
                type="text"
                id="Remarks"
                name="Remarks"
                disabled={true}
                // class={errorObject.Remarks}
                placeholder="Enter Business Type"
                value={currentRow.Remarks}
                onChange={(e) => handleChange(e)}
              />

              <label>Comments</label>
              <input
                type="text"
                id="Comments"
                name="Comments"
                disabled={true}
                // class={errorObject.Comments}
                placeholder="Enter Comments"
                value={currentRow.Comments}
                onChange={(e) => handleChange(e)}
              />

              <label>Assessment No.</label>
              <input
                type="text"
                id="AssessmentNo"
                name="AssessmentNo"
                disabled={true}
                // class={errorObject.AssessmentNo}
                placeholder="Enter Assessment No"
                value={currentRow.AssessmentNo}
                onChange={(e) => handleChange(e)}
              />

              <label>Audit Start Date</label>
              <input
                type="date"
                id="AuditStartDate"
                name="AuditStartDate"
                disabled={true}
                // class={errorObject.AuditStartDate}
                placeholder="Enter Audit Start Date"
                value={currentRow.AuditStartDate}
                onChange={(e) => handleChange(e)}
              />

              <label>Audit End Date</label>
              <input
                type="date"
                id="AuditEndDate"
                name="AuditEndDate"
                disabled={true}
                // class={errorObject.AuditEndDate}
                placeholder="Enter Audit End Date"
                value={currentRow.AuditEndDate}
                onChange={(e) => handleChange(e)}
              />

              <label>Country</label>
              <Autocomplete
                autoHighlight
                disableClearable
                disabled={true}
                className="chosen_dropdown"
                id="CountryId"
                name="CountryId"
                autoComplete
                // class={errorObject.CountryId}
                options={CountryList ? CountryList : []}
                getOptionLabel={(option) => option.name}
                defaultValue={{ id: 0, name: "Select Country" }}
                value={
                  CountryList
                    ? CountryList[
                        CountryList.findIndex(
                          (list) => list.id === currCountryId
                        )
                      ]
                    : null
                }
                onChange={(event, valueobj) =>
                  handleChangeDropDown("CountryId", valueobj ? valueobj.id : "")
                }
                renderOption={(option) => (
                  <Typography className="chosen_dropdown_font">
                    {option.name}
                  </Typography>
                )}
                renderInput={(params) => (
                  <TextField {...params} variant="standard" fullWidth />
                )}
              />

              <label>Lead Auditor</label>
              <Autocomplete
                autoHighlight
                disableClearable
                disabled={true}
                className="chosen_dropdown"
                id="LeadAuditorId"
                name="LeadAuditorId"
                autoComplete
                // class={errorObject.LeadAuditorId}
                options={LeadAuditorList ? LeadAuditorList : []}
                getOptionLabel={(option) => option.name}
                defaultValue={{ id: 0, name: "Select Lead Auditor" }}
                value={
                  LeadAuditorList
                    ? LeadAuditorList[
                        LeadAuditorList.findIndex(
                          (list) => list.id === currLeadAuditorId
                        )
                      ]
                    : null
                }
                onChange={(event, valueobj) =>
                  handleChangeDropDown(
                    "LeadAuditorId",
                    valueobj ? valueobj.id : ""
                  )
                }
                renderOption={(option) => (
                  <Typography className="chosen_dropdown_font">
                    {option.name}
                  </Typography>
                )}
                renderInput={(params) => (
                  <TextField {...params} variant="standard" fullWidth />
                )}
              />

              <label>Team Auditor</label>
              <FormControl sx={{ width: 300 }}>
                <Select
                  multiple
                  disabled={true}
                  value={currTeamAuditorId}
                  onChange={handleChangeMulpleCbo}
                  title={currTeamAuditorId
                    .map((id) => {
                      const auditor = (TeamAuditorList || []).find(
                        (a) => a.id === id
                      );
                      return auditor ? auditor.name : "";
                    })
                    .filter(Boolean)
                    .join(", ")}
                  renderValue={(selected) =>
                    (TeamAuditorList || [])
                      .filter((a) => currTeamAuditorId.includes(a.id))
                      .map((a) => a.name)
                      .join(", ")
                  }
                >
                  {(TeamAuditorList || []).map((auditor) => (
                    <MenuItem key={auditor.id} value={auditor.id}>
                      <Checkbox
                        checked={currTeamAuditorId.includes(auditor.id)}
                      />
                      <ListItemText primary={auditor.name} />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* <Autocomplete
                autoHighlight
                disableClearable
                disabled={true}
                className="chosen_dropdown"
                id="TeamAuditorId"
                name="TeamAuditorId"
                autoComplete
                options={TeamAuditorList ? TeamAuditorList : []}
                getOptionLabel={(option) => option.name}
                defaultValue={{ id: 0, name: "Select Team Auditor" }}
                value={
                  TeamAuditorList
                    ? TeamAuditorList[
                        TeamAuditorList.findIndex(
                          (list) => list.id === currTeamAuditorId
                        )
                      ]
                    : null
                }
                onChange={(event, valueobj) =>
                  handleChangeDropDown(
                    "TeamAuditorId",
                    valueobj ? valueobj.id : ""
                  )
                }
                renderOption={(option) => (
                  <Typography className="chosen_dropdown_font">
                    {option.name}
                  </Typography>
                )}
                renderInput={(params) => (
                  <TextField {...params} variant="standard" fullWidth />
                )}
              /> */}

              <label>Audit Type</label>
              <Autocomplete
                autoHighlight
                disableClearable
                disabled={true}
                className="chosen_dropdown"
                id="AuditTypeId"
                name="AuditTypeId"
                autoComplete
                // class={errorObject.AuditTypeId}
                options={AuditTypeList ? AuditTypeList : []}
                getOptionLabel={(option) => option.name}
                defaultValue={{ id: 0, name: "Select Audit Type" }}
                value={
                  AuditTypeList
                    ? AuditTypeList[
                        AuditTypeList.findIndex(
                          (list) => list.id === currAuditTypeId
                        )
                      ]
                    : null
                }
                onChange={(event, valueobj) =>
                  handleChangeDropDown(
                    "AuditTypeId",
                    valueobj ? valueobj.id : ""
                  )
                }
                renderOption={(option) => (
                  <Typography className="chosen_dropdown_font">
                    {option.name}
                  </Typography>
                )}
                renderInput={(params) => (
                  <TextField {...params} variant="standard" fullWidth />
                )}
              />

              <label>Window Start</label>
              <input
                type="date"
                id="Window"
                name="Window"
                disabled={true}
                // class={errorObject.Window}
                placeholder="Enter Window Start"
                value={currentRow.Window}
                onChange={(e) => handleChange(e)}
              />

              <label>Window End</label>
              <input
                type="date"
                id="WindowEnd"
                name="WindowEnd"
                disabled={true}
                // class={errorObject.WindowEnd}
                placeholder="Enter Window End"
                value={currentRow.WindowEnd}
                onChange={(e) => handleChange(e)}
              />

              <label>Report Writer</label>
              <Autocomplete
                autoHighlight
                disableClearable
                disabled={true}
                className="chosen_dropdown"
                id="ReportWriterId"
                name="ReportWriterId"
                autoComplete
                options={AuditorList ? AuditorList : []}
                getOptionLabel={(option) => option.name}
                defaultValue={{ id: 0, name: "Select" }}
                value={
                  AuditorList
                    ? AuditorList[
                        AuditorList.findIndex(
                          (list) => list.id === currReportWriterId
                        )
                      ]
                    : null
                }
                onChange={(event, valueobj) =>
                  handleChangeDropDown(
                    "ReportWriterId",
                    valueobj ? valueobj.id : ""
                  )
                }
                renderOption={(option) => (
                  <Typography className="chosen_dropdown_font">
                    {option.name}
                  </Typography>
                )}
                renderInput={(params) => (
                  <TextField {...params} variant="standard" fullWidth />
                )}
              />
              <label>Report Writing Date</label>
              <input
                type="date"
                id="ReportWritingDate"
                name="ReportWritingDate"
                disabled={true}
                // class={errorObject.Window}
                placeholder="Enter Report Writing Date"
                value={currentRow.ReportWritingDate}
                onChange={(e) => handleChange(e)}
              />
              <label>Payment Status</label>
              <div>
                <label>Yes</label>
                <input
                  style={{
                    width: "15px",
                    height: "15px",
                    "margin-right": "15px",
                  }}
                  type="radio"
                  id="PaymentStatus"
                  name="PaymentStatus"
                  disabled={true}
                  value="Yes"
                  checked={currentRow.PaymentStatus == "Yes"}
                  onChange={handleChangeRadio}
                ></input>
                <label>No</label>
                <input
                  style={{ width: "15px", height: "15px" }}
                  type="radio"
                  id="PaymentStatus"
                  name="PaymentStatus"
                  disabled={true}
                  value="No"
                  checked={currentRow.PaymentStatus == "No"}
                  onChange={handleChangeRadio}
                ></input>
              </div>

              <label>No Of Employee</label>
              <input
                type="text"
                id="NoOfEmployee"
                name="NoOfEmployee"
                disabled={true}
                // class={errorObject.NoOfEmployee}
                placeholder="Enter No Of Employee"
                value={currentRow.NoOfEmployee}
                onChange={(e) => handleChange(e)}
              />

              <label>Audit Fee</label>
              <input
                type="number"
                id="AuditFee"
                name="AuditFee"
                disabled={true}
                // class={errorObject.AuditFee}
                placeholder="Enter Audit Fee"
                value={currentRow.AuditFee}
                onChange={(e) => handleChange(e)}
              />

              <label>OPE</label>
              <input
                type="number"
                id="OPE"
                name="OPE"
                disabled={true}
                // class={errorObject.OPE}
                placeholder="Enter OPE"
                value={currentRow.OPE}
                onChange={(e) => handleChange(e)}
              />

              <label>Others Amount</label>
              <input
                type="number"
                id="OthersAmount"
                name="OthersAmount"
                disabled={true}
                // class={errorObject.OthersAmount}
                placeholder="Enter Others Amount"
                value={currentRow.OthersAmount}
                onChange={(e) => handleChange(e)}
              />

              <label>Revenue (BDT)</label>
              <input
                type="number"
                id="RevenueBDT"
                name="RevenueBDT"
                disabled={true}
                // class={errorObject.RevenueBDT}
                placeholder="Enter Revenue BDT"
                value={currentRow.RevenueBDT}
                onChange={(e) => handleChange(e)}
              />

              {/* <label>Attached Documents</label>
              <input
                type="text"
                id="AttachedDocuments"
                name="AttachedDocuments"
                disabled={true}
                // class={errorObject.AttachedDocuments}
                placeholder="Enter Attached Documents"
                value={currentRow.AttachedDocuments}
                onChange={(e) => handleChange(e)}
              /> */}

              <label>PI No</label>
              <input
                type="text"
                id="PINo"
                name="PINo"
                disabled={true}
                // class={errorObject.PINo}
                placeholder="Enter PI No"
                value={currentRow.PINo}
                onChange={(e) => handleChange(e)}
              />

              <label>File Uploaded</label>
              <input
                id="FileUploaded"
                name="FileUploaded"
                disabled={true}
                type="checkbox"
                class={"formCheckBox"}
                checked={currentRow.FileUploaded}
                onChange={handleChangeCheck}
              />

              <label>Report Sent to Customer</label>
              <input
                id="ReportSentToCustomer"
                name="ReportSentToCustomer"
                disabled={true}
                type="checkbox"
                class={"formCheckBox"}
                checked={currentRow.ReportSentToCustomer}
                onChange={handleChangeCheck}
              />

              <label>Send Mail</label>
              <input
                id="IsSendMail"
                name="IsSendMail"
                type="checkbox"
                class={"formCheckBox"}
                disabled={true}
                checked={currentRow.IsSendMail}
                onChange={handleChangeCheck}
              />
              <label>Audit Book</label>
              <div>
                <label>Yes</label>
                <input
                  style={{
                    width: "15px",
                    height: "15px",
                    "margin-right": "15px",
                  }}
                  type="radio"
                  id="AuditBook"
                  name="AuditBook"
                  disabled={true}
                  value="Yes"
                  checked={currentRow.AuditBook == "Yes"}
                  onChange={handleChangeRadio}
                ></input>
                <label>No</label>
                <input
                  style={{ width: "15px", height: "15px" }}
                  type="radio"
                  id="AuditBook"
                  name="AuditBook"
                  disabled={true}
                  value="No"
                  checked={currentRow.AuditBook == "No"}
                  onChange={handleChangeRadio}
                ></input>
              </div>
              {/* <label>Report Release</label>
              <div>
                <label>Yes</label>
                <input
                  style={{
                    width: "15px",
                    height: "15px",
                    "margin-right": "15px",
                  }}
                  type="radio"
                  id="ReportReleaseStatus"
                  name="ReportReleaseStatus"
                  disabled={true}
                  value="Yes"
                  checked={currentRow.ReportReleaseStatus == "Yes"}
                  onChange={handleChangeRadio}
                ></input>
                <label>No</label>
                <input
                  style={{ width: "15px", height: "15px" }}
                  type="radio"
                  id="ReportReleaseStatus"
                  name="ReportReleaseStatus"
                  disabled={true}
                  value="No"
                  checked={currentRow.ReportReleaseStatus == "No"}
                  onChange={handleChangeRadio}
                ></input>
              </div> */}

              <label>Invoice Number</label>
              <input
                type="text"
                id="InvoiceTo"
                name="InvoiceTo"
                disabled={true}
                // class={errorObject.InvoiceTo}
                placeholder="Enter Invoice Number"
                value={currentRow.InvoiceTo}
                onChange={(e) => handleChange(e)}
              />

              <label>Name of Applicant</label>
              <input
                type="text"
                id="NameofApplicant"
                name="NameofApplicant"
                disabled={true}
                // class={errorObject.NameofApplicant}
                placeholder="Enter Name of Applicant"
                value={currentRow.NameofApplicant}
                onChange={(e) => handleChange(e)}
              />

              <label>Address</label>
              <input
                type="text"
                id="InvoiceAddress"
                name="InvoiceAddress"
                disabled={true}
                // class={errorObject.InvoiceAddress}
                placeholder="Enter Address"
                value={currentRow.InvoiceAddress}
                onChange={(e) => handleChange(e)}
              />

              <label>Email</label>
              <input
                type="text"
                id="InvoiceEmail"
                name="InvoiceEmail"
                disabled={true}
                // class={errorObject.InvoiceEmail}
                placeholder="Enter Email"
                value={currentRow.InvoiceEmail}
                onChange={(e) => handleChange(e)}
              />

              <label>Mobile</label>
              <input
                type="text"
                id="InvoiceMobile"
                name="InvoiceMobile"
                disabled={true}
                // class={errorObject.InvoiceMobile}
                placeholder="Enter Mobile"
                value={currentRow.InvoiceMobile}
                onChange={(e) => handleChange(e)}
              />

              <label>Discount (%)</label>
              <input
                type="number"
                id="Discount"
                name="Discount"
                disabled={true}
                // class={errorObject.Discount}
                placeholder="Enter Discount"
                value={currentRow.Discount}
                onChange={(e) => handleChange(e)}
              />

              <label>Invoice Status</label>
              <input
                type="text"
                id="InvStatusName"
                name="InvStatusName"
                disabled={true}
                // class={errorObject.InvStatusName}
                placeholder="Enter Invoice Status"
                value={currentRow.InvStatusName}
                onChange={(e) => handleChange(e)}
              />
    
              <label>Invoice Comments</label>
              <input
                type="text"
                id="InvoiceComments"
                name="InvoiceComments"
                disabled={true}
                // class={errorObject.InvoiceComments}
                placeholder="Enter Invoice Comments"
                value={currentRow.InvoiceComments}
                onChange={(e) => handleChange(e)}
              />
            </div>

            <div class="formEntryColumnThree">
              <label>Report Received From Writer</label>
              <div>
                <label>Yes</label>
                <input
                  style={{
                    width: "15px",
                    height: "15px",
                    "margin-right": "15px",
                  }}
                  type="radio"
                  id="IsReportReceivedFromWriter"
                  name="IsReportReceivedFromWriter"
                  disabled={permissionType == 1}
                  // disabled={true}
                  value="Yes"
                  checked={currentRow.IsReportReceivedFromWriter == "Yes"}
                  onChange={handleChangeRadio}
                ></input>
                <label>No</label>
                <input
                  style={{ width: "15px", height: "15px" }}
                  type="radio"
                  id="IsReportReceivedFromWriter"
                  name="IsReportReceivedFromWriter"
                  disabled={permissionType == 1}
                  // disabled={true}
                  value="No"
                  checked={currentRow.IsReportReceivedFromWriter == "No"}
                  onChange={handleChangeRadio}
                ></input>
              </div>

              <label>Report Received Date</label>
              <input
                type="date"
                id="ReportReceivedDate"
                name="ReportReceivedDate"
                disabled={permissionType == 1}
                // disabled={true}
                // class={errorObject.ReportReceivedDate}
                placeholder="Enter Report Received Date"
                value={currentRow.ReportReceivedDate}
                onChange={(e) => handleChange(e)}
              />

              <label>Local Reviewer</label>
              <Autocomplete
                autoHighlight
                disableClearable
                disabled={permissionType == 1}
                // disabled={true}
                className="chosen_dropdown"
                id="LocalReviewerId"
                name="LocalReviewerId"
                autoComplete
                // class={errorObject.LocalReviewerId}
                options={LocalReviewerList ? LocalReviewerList : []}
                getOptionLabel={(option) => option.name}
                defaultValue={{ id: 0, name: "Select" }}
                value={
                  LocalReviewerList
                    ? LocalReviewerList[
                        LocalReviewerList.findIndex(
                          (list) => list.id === currLocalReviewerId
                        )
                      ]
                    : null
                }
                onChange={(event, valueobj) =>
                  handleChangeDropDown(
                    "LocalReviewerId",
                    valueobj ? valueobj.id : ""
                  )
                }
                renderOption={(option) => (
                  <Typography className="chosen_dropdown_font">
                    {option.name}
                  </Typography>
                )}
                renderInput={(params) => (
                  <TextField {...params} variant="standard" fullWidth />
                )}
              />

              <label>Standard TAT</label>
              <input
                type="date"
                id="StandardTAT"
                name="StandardTAT"
                disabled={permissionType == 1}
                // disabled={true}
                // class={errorObject.StandardTAT}
                placeholder="Enter Standard TAT"
                value={currentRow.StandardTAT}
                onChange={(e) => handleChange(e)}
              />

              <label>Strategic TAT</label>
              <input
                type="date"
                id="StrategicTAT"
                name="StrategicTAT"
                disabled={permissionType == 1}
                // disabled={true}
                // class={errorObject.StrategicTAT}
                placeholder="Enter Strategic TAT"
                value={currentRow.StrategicTAT}
                onChange={(e) => handleChange(e)}
              />

              <label>Report Release</label>
              <div>
                <label>Yes</label>
                <input
                  style={{
                    width: "15px",
                    height: "15px",
                    "margin-right": "15px",
                  }}
                  type="radio"
                  id="ReportReleaseStatus"
                  name="ReportReleaseStatus"
                  disabled={permissionType == 1}
                  value="Yes"
                  checked={currentRow.ReportReleaseStatus == "Yes"}
                  onChange={handleChangeRadio}
                ></input>
                <label>No</label>
                <input
                  style={{ width: "15px", height: "15px" }}
                  type="radio"
                  id="ReportReleaseStatus"
                  name="ReportReleaseStatus"
                  disabled={permissionType == 1}
                  value="No"
                  checked={currentRow.ReportReleaseStatus == "No"}
                  onChange={handleChangeRadio}
                ></input>
              </div>

              {/* <label>Report Released Status</label>
              <Autocomplete
                autoHighlight
                disableClearable
                // disabled={true}
                className="chosen_dropdown"
                id="ReportReleasedStatusId"
                name="ReportReleasedStatusId"
                autoComplete
                // class={errorObject.ReportReleasedStatusId}
                options={ReleasedStatusList ? ReleasedStatusList : []}
                getOptionLabel={(option) => option.name}
                defaultValue={{ id: 0, name: "Select Released Status" }}
                value={
                  ReleasedStatusList
                    ? ReleasedStatusList[
                        ReleasedStatusList.findIndex(
                          (list) => list.id === currReportReleasedStatusId
                        )
                      ]
                    : null
                }
                onChange={(event, valueobj) =>
                  handleChangeDropDown(
                    "ReportReleasedStatusId",
                    valueobj ? valueobj.id : ""
                  )
                }
                renderOption={(option) => (
                  <Typography className="chosen_dropdown_font">
                    {option.name}
                  </Typography>
                )}
                renderInput={(params) => (
                  <TextField {...params} variant="standard" fullWidth />
                )}
              /> */}

              <label>Overseas Sending Date</label>
              <input
                type="date"
                id="OverseasSendingDate"
                name="OverseasSendingDate"
                disabled={permissionType == 1}
                // disabled={true}
                // class={errorObject.OverseasSendingDate}
                placeholder="Enter Overseas Sending Date"
                value={currentRow.OverseasSendingDate}
                onChange={(e) => handleChange(e)}
              />
              <label>Auditor Log In Time</label>
              <input
                type="datetime-local"
                id="AuditorLogInTime"
                name="AuditorLogInTime"
                disabled={permissionType == 1}
                // disabled={true}
                // class={errorObject.AuditorLogInTime}
                placeholder="Enter Auditor Log In Time"
                value={currentRow.AuditorLogInTime}
                onChange={(e) => handleChange(e)}
              />

              <label>Aduditor Log Out Time</label>
              <input
                type="datetime-local"
                id="AduditorLogOutTime"
                name="AduditorLogOutTime"
                disabled={permissionType == 1}
                // disabled={true}
                // class={errorObject.AduditorLogOutTime}
                placeholder="Enter Aduditor Log Out Time"
                value={currentRow.AduditorLogOutTime}
                onChange={(e) => handleChange(e)}
              />

              <label>Report Result</label>
              <input
                type="text"
                id="ReportResult"
                name="ReportResult"
                disabled={permissionType == 1}
                // disabled={true}
                // class={errorObject.ReportResult}
                placeholder="Enter Report Result"
                value={currentRow.ReportResult}
                onChange={(e) => handleChange(e)}
              />
                            <label>Release Date</label>
              <input
                type="date"
                id="ReleaseDate"
                name="ReleaseDate"
                disabled={permissionType == 1}
                // class={errorObject.ReleaseDate}
                placeholder="Enter Release Date"
                value={currentRow.ReleaseDate}
                onChange={(e) => handleChange(e)}
              />
            </div>

            <div class="modalItemButton">
              <Button
                label={"Cancel"}
                class={"btnClose"}
                onClick={showListView}
              />
              {currentRow.id && (
                <Button
                  label={"Update"}
                  class={"btnUpdate"}
                  disabled={permissionType == 1}
                  onClick={addEditAPICall}
                />
              )}
              {!currentRow.id && (
                <Button
                  label={"Save"}
                  class={"btnSave"}
                  onClick={addEditAPICall}
                />
              )}
            </div>
          </>
        )}

        {/* </div>
          </div> */}
      </div>
      {/* <!-- BODY CONTAINER END --> */}
    </>
  );
};

export default ReportReviewer;
