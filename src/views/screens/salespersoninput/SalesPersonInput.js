import React, { forwardRef, useRef } from "react";
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
// import SalesPersonInputAddEditModal from "./SalesPersonInputAddEditModal";
import "../../../assets/css/audit.css";
const SalesPersonInput = (props) => {
  const permissionType = props.permissionType;

  const serverpage = "salespersoninput"; // this is .php server page

  const { useState } = React;
  const [bFirst, setBFirst] = useState(true);
  const [currentRow, setCurrentRow] = useState([]);
  // const [currentRowDelete, setCurrentRowDelete] = useState([]);
  // const [showModal, setShowModal] = useState(false); //true=show modal, false=hide modal
  const [toggle, setToggle] = useState(true); //true=show tabel, false= show add/edit form

  const [errorObject, setErrorObject] = useState({});
  const UserInfo = LoginUserInfo();

  const [ActivityList, setActivityList] = useState(null);
  const [currActivityId, setCurrActivityId] = useState(null);

  const [FactoryList, setFactoryList] = useState(null);
  const [currFactoryId, setCurrFactoryId] = useState(null);

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

  const [RemarksList, setRemarksList] = useState([
    { id: "New", name: "New" },
    { id: "Re-Certificate", name: "Re-Certificate" },
  ]);
  const [currRemarks, setCurrRemarks] = useState(null);

  // const [TeamList, setTeamList] = useState(null);
  // const [currTeamId, setCurrTeamId] = useState(null);

  const [DepartmentList, setDepartmentList] = useState(null);
  const [currDepartmentId, setCurrDepartmentId] = useState(null);

  const [MemberList, setMemberList] = useState(null);
  const [currMemberId, setCurrMemberId] = useState(null);

  // handleChangeWidthHeight
  const { isLoading, data: dataList, error, ExecuteQuery } = ExecuteQueryHook(); //Fetch data
  // const UserInfo = LoginUserInfo();
  const [selectedDate, setSelectedDate] = useState(
    //new Date()
    moment().format("YYYY-MM-DD")
  );

  /* =====Start of Excel Export Code==== */
  const EXCEL_EXPORT_URL = process.env.REACT_APP_API_URL;

  const PrintPDFExcelExportFunction = (reportType) => {
    let finalUrl = EXCEL_EXPORT_URL + "report/print_pdf_excel_server.php";

    window.open(
      finalUrl +
        "?action=SalesPersonInputExport" +
        "&reportType=excel" +
        "&UserId=" +
        UserInfo.UserId +
        "&RoleId=" +
        UserInfo.RoleId[0] +
        "&TimeStamp=" +
        Date.now()
    );
  };
  /* =====End of Excel Export Code==== */

  React.useEffect(() => {
    getActivityList("");
    getFactoryList("");
    getProgramList("");
    getCoordinatorList("");
    getAuditStageList("");
    getLeadStatusList("");
    getBuyerList("");
    getDepartmentList("");
    getMemberList("", "");

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
        [{ id: "", name: "Select Coordinator" }].concat(res.data.datalist)
      );

      setCurrCoordinatorId(selectCoordinatorId);
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    let data = { ...currentRow };
    data[name] = value;
    setCurrentRow(data);
    setErrorObject({ ...errorObject, [name]: null });
  };

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
    // if (name === "TeamId") {
    //   data["TeamId"] = value;
    //   setCurrTeamId(value);
    //   getMemberList(value, "");
    // }
    if (name === "DepartmentId") {
      data["DepartmentId"] = value;
      setCurrDepartmentId(value);
      getMemberList(value, "");
    }
    if (name === "MemberId") {
      data["MemberId"] = value;
      setCurrMemberId(value);
    }
    if (name === "Remarks") {
      data["Remarks"] = value;
      setCurrRemarks(value);
    }

    setErrorObject({ ...errorObject, [name]: null });
    setCurrentRow(data);
  };

  function handleChangeCheck(e) {
    const { name, value } = e.target;

    let data = { ...currentRow };
    data[name] = e.target.checked ? 5 : 1;
    setCurrentRow(data);
  }

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


      if(currentRow.CurrStatusId == 5){
      swal({
        title: "Are you sure?",
        text: "You want to forward this report to audit team. This will be lock for you!",
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
          addEditAPICallToServer();
        }

      });
    }else{
      addEditAPICallToServer();
    }


    }
  }


  function addEditAPICallToServer(){
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




  function showListView() {
    setToggle(true);
  }

  const columnList = [
    { field: "rownumber", label: "SL", align: "center", width: "3%" },
    // { field: 'SL', label: 'SL',width:'10%',align:'center',visible:true,sort:false,filter:false },
    // {
    //   field: "InvoiceNo",
    //   label: "Audit Number",
    //   align: "left",
    //   visible: true,
    //   sort: true,
    //   filter: true,
    // },
    // {
    //   field: "TransactionDate",
    //   label: "Report Date",
    //   align: "left",
    //   visible: true,
    //   sort: true,
    //   filter: true,
    //   width: "25%",
    // },
    {
      field: "ActivityName",
      label: "Activity",
      align: "left",
      visible: true,
      sort: true,
      filter: true,
      width: "10%",
    },
    {
      field: "FactoryName",
      label: "Factory Name",
      align: "left",
      visible: true,
      sort: true,
      filter: true,
      // width: "12%",
    },
    // {
    //   field: "FactoryGroupName",
    //   label: "Factory Group",
    //   align: "left",
    //   visible: true,
    //   sort: true,
    //   filter: true,
    //   width: "8%",
    // },

    {
      field: "ProgramName",
      label: "Program",
      align: "left",
      visible: true,
      sort: true,
      filter: true,
      width: "8%",
    },

    {
      field: "ExpireDate",
      label: "Expire Date",
      align: "left",
      visible: true,
      sort: true,
      filter: true,
      width: "7%",
    },

    {
      field: "OpportunityDate",
      label: "Opportunity Date",
      align: "left",
      visible: true,
      sort: true,
      filter: true,
      width: "8%",
    },

    {
      field: "AuditStageName",
      label: "Audit Stage",
      align: "left",
      visible: true,
      sort: true,
      filter: true,
      width: "8%",
    },
    {
      field: "LeadStatusName",
      label: "Lead Status",
      align: "left",
      visible: true,
      sort: true,
      filter: true,
      width: "6%",
    },
    {
      field: "BuyerName",
      label: "Buyer",
      align: "left",
      visible: true,
      sort: true,
      filter: true,
      width: "10%",
    },
    {
      field: "NextFollowupDate",
      label: "Next Followup Date",
      align: "left",
      visible: true,
      sort: true,
      filter: true,
      width: "10%",
    },
    {
      field: "custom",
      label: "Action",
      width: "6%",
      align: "left",
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

  /**Get data for table list */
  function getDataList() {
    let params = {
      action: "getDataList",
      lan: language(),
      UserId: UserInfo.UserId,
      RoleId: UserInfo.RoleId[0],
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

        {rowData.StatusId == 1 && permissionType == 0 && (<DeleteOutline
          className={"table-delete-icon"}
          onClick={() => {
            deleteData(rowData);
          }}
        />)}
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
    setCurrRemarks("");
    // setCurrMemberId(rowData.MemberId);
    getMemberList("", "");

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
      StatusId: 1,
      CurrStatusId: 1,
      FormData: null,
    });
    // openModal();
    setToggle(false); // true=show tabel, false= show add/edit form
  };

  const editData = (rowData) => {
    setCurrActivityId(rowData.ActivityId);
    setCurrFactoryId(rowData.FactoryId);
    setCurrProgramId(rowData.ProgramId);
    setCurrCoordinatorId(rowData.CoordinatorId);
    setCurrAuditStageId(rowData.AuditStageId);
    setCurrLeadStatusId(rowData.LeadStatusId);
    setCurrBuyerId(rowData.BuyerId);
    setCurrDepartmentId(rowData.DepartmentId);
    setCurrRemarks(rowData.Remarks);
    // setCurrMemberId(rowData.MemberId);

    getMemberList(rowData.DepartmentId, rowData.MemberId);

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

    // apiCall.post("productgroup", { params }, apiOption()).then((res) => {
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
          <h4>Home ❯ Audit ❯ Sales Person Input</h4>
        </div>

        {/* <!-- TABLE SEARCH AND GROUP ADD --> */}
        {toggle && (
          <div class="searchAdd">
            <>
              <Button
                label={"Export"}
                class={"btnPrint"}
                onClick={PrintPDFExcelExportFunction}
              />
              <Button label={"ADD"} class={"btnAdd"} onClick={addData} />
            </>

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
            <div class="formEntryColumnThree">
              {/* <div class="pt-10 control-row"> */}
              <label>Activity *</label>
              <Autocomplete
                autoHighlight
                disableClearable
                disabled={currentRow.StatusId == 5 || permissionType == 1}
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
              {/* </div> */}

              {/* <div class="control-row pt-10"> */}
              <label>Factory *</label>
              <Autocomplete
                autoHighlight
                disableClearable
                disabled={currentRow.StatusId == 5 || permissionType == 1}
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
{/* 
              <label>Factory Location</label>
              <input
                type="text"
                id="FactoryAddress"
                name="FactoryAddress"
                // class={errorObject.FactoryAddress}
                placeholder="Enter Factory Location"
                disabled={true}
                // value={currentRow.FactoryAddress}
                value={
                  currFactoryId
                    ? FactoryList[
                        FactoryList.findIndex(
                          (list) => list.id === currFactoryId
                        )
                      ].Address
                    : ""
                }
              /> */}

              {/* <div class="control-row pt-10"> */}
              <label>Program *</label>
              <Autocomplete
                autoHighlight
                disableClearable
                disabled={currentRow.StatusId == 5 || permissionType == 1}
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
                disabled={currentRow.StatusId == 5 || permissionType == 1}
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
                disabled={currentRow.StatusId == 5 || permissionType == 1}
                // class={errorObject.OpportunityDate}
                placeholder="Enter Opportunity Date"
                value={currentRow.OpportunityDate}
                onChange={(e) => handleChange(e)}
              />
              {/* </div>

            <div class="control-row pt-10"> */}
              <label>Tentative Offer Price</label>
              <input
                type="number"
                id="TentativeOfferPrice"
                name="TentativeOfferPrice"
                disabled={currentRow.StatusId == 5 || permissionType == 1}
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
                disabled={currentRow.StatusId == 5 || permissionType == 1}
                // class={errorObject.CertificateBody}
                placeholder="Enter Certificate Body"
                value={currentRow.CertificateBody}
                onChange={(e) => handleChange(e)}
              />

              <label>Coordinator</label>
              <Autocomplete
                autoHighlight
                disableClearable
                disabled={currentRow.StatusId == 5 || permissionType == 1}
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
              {/* </div> */}

              {/* <div class="control-row pt-10"> */}
              <label>Audit Stage</label>
              <Autocomplete
                autoHighlight
                disableClearable
                disabled={currentRow.StatusId == 5 || permissionType == 1}
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
                disabled={currentRow.StatusId == 5 || permissionType == 1}
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

              <label>Man Day</label>
              <input
                type="number"
                id="ManDay"
                name="ManDay"
                disabled={currentRow.StatusId == 5 || permissionType == 1}
                // class={errorObject.ManDay}
                placeholder="Enter Man Day"
                value={currentRow.ManDay}
                onChange={(e) => handleChange(e)}
              />
              {/* </div> */}

              {/* <div class="control-row pt-10"> */}
              <label>Buyer</label>
              <Autocomplete
                autoHighlight
                disableClearable
                disabled={currentRow.StatusId == 5 || permissionType == 1}
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
                disabled={currentRow.StatusId == 5 || permissionType == 1}
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
                disabled={currentRow.StatusId == 5 || permissionType == 1}
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
              {/* </div> */}

              {/* <div class="control-row pt-10"> */}
              <label>Next Followup Date</label>
              <input
                type="date"
                id="NextFollowupDate"
                name="NextFollowupDate"
                disabled={currentRow.StatusId == 5 || permissionType == 1}
                // class={errorObject.NextFollowupDate}
                placeholder="Enter Next Followup Date"
                value={currentRow.NextFollowupDate}
                onChange={(e) => handleChange(e)}
              />

              <label>Remarks/Note</label>
              <Autocomplete
                autoHighlight
                disableClearable
                disabled={currentRow.StatusId == 5 || permissionType == 1}
                className="chosen_dropdown"
                id="Remarks"
                name="Remarks"
                autoComplete
                //  class={errorObject.Remarks}
                options={RemarksList ? RemarksList : []}
                getOptionLabel={(option) => option.name}
                defaultValue={{ id: 0, name: "Select Remarks/Note" }}
                value={
                  RemarksList
                    ? RemarksList[
                        RemarksList.findIndex((list) => list.id === currRemarks)
                      ]
                    : null
                }
                onChange={(event, valueobj) =>
                  handleChangeDropDown("Remarks", valueobj ? valueobj.id : "")
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
              {/* <input
                type="text"
                id="Remarks"
                name="Remarks"
                // class={errorObject.Remarks}
                placeholder="Enter Remarks/Note"
                value={currentRow.Remarks}
                onChange={(e) => handleChange(e)}
              /> */}
            </div>

            <div class="modalItemButton">
              <label>Forward to Audit Team</label>
              <input
                id="CurrStatusId"
                name="CurrStatusId"
                disabled={currentRow.StatusId == 5 || permissionType == 1}
                type="checkbox"
                class={"formCheckBox"}
                checked={currentRow.CurrStatusId == 5}
                onChange={handleChangeCheck}
              />
              <label></label>
              <label></label>
              <label></label>
              <label></label>
              <label></label>
              <label></label>

              <Button
                label={"Cancel"}
                class={"btnClose"}
                onClick={showListView}
              />
              {currentRow.id && (
                <Button
                  label={"Update"}
                  class={"btnUpdate"}
                  disabled={currentRow.StatusId == 5 || permissionType == 1}
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

      {/* {showModal && (
        <SalesPersonInputAddEditModal
          masterProps={props}
          currentRow={currentRow}
          modalCallback={modalCallback}
        />
      )} */}
    </>
  );
};

export default SalesPersonInput;
