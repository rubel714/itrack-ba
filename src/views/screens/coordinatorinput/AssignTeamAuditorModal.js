import React, { forwardRef, useRef, useEffect, useState } from "react";
import { Button } from "../../../components/CustomControl/Button";
import {
  apiCall,
  apiOption,
  LoginUserInfo,
  language,
} from "../../../actions/api";
import swal from "sweetalert";
import Autocomplete from "@material-ui/lab/Autocomplete";
import ExecuteQueryHook from "../../../components/hooks/ExecuteQueryHook";
import CustomTable from "components/CustomTable/CustomTable";

import {
  DeleteOutline,
  Edit,
  AddAPhoto,
  PictureAsPdf,
} from "@material-ui/icons";
import {
  Typography,
  Paper,
  Grid,
  Input,
  makeStyles,
  CircularProgress,
  TextField,
} from "@material-ui/core";
import { set } from "date-fns";
import { get } from "react-hook-form";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "10px",
  },
  paper: {
    padding: theme.spacing(4),
    maxWidth: "100%",
    width: "100%",
  },
}));

const AssignTeamAuditorModal = (props) => {
  console.log("props modal TeamAuditorList: ", props.TeamAuditorList);
  console.log("props modal: ", props);
  const serverpage = "coordinatorinput"; // this is .php server page
  const [currentRow, setCurrentRow] = useState(props.currentRow);
  const [TeamAuditorList, setTeamAuditorList] = useState(props.TeamAuditorList);

  const [currTeamAuditorId, setCurrTeamAuditorId] = useState(0);
  const [errorMsg, setErrorMsg] = useState("");

  const UserInfo = LoginUserInfo();
  const classes = useStyles();
  const [loading, setLoading] = useState(false);
  const { isLoading, data: dataList, error, ExecuteQuery } = ExecuteQueryHook(); //Fetch data


    useEffect(() => {
      getMemberDateAssignDataList();
    }, [props.currentRow.id]);

    /**Get data for table list */
    function getMemberDateAssignDataList() {
      let params = {
        action: "getMemberDateAssignDataList",
        lan: language(),
        TransactionId: props.currentRow.id
      };
      // console.log('LoginUserInfo params: ', params);
  
      ExecuteQuery(serverpage, params);
    }

  const newFormData = {
    Id: "",
    TransactionId: props.currentRow.id,
    AssignDate: "",
    AuditorId: 0,
    StartTime: "09:00",
    EndTime: "17:00",
    AuditorName: "",
  };
  const [currentFormData, setCurrentFormData] = useState(newFormData);


  function importModalCallback(type) {
    props.teamAuditorAssignModalCallback(dataList);
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    let data = { ...currentFormData };
    data[name] = value;
      setErrorMsg("");

    setCurrentFormData(data);
  };

  const handleChangeDropDown = (name, value) => {
    let data = { ...currentFormData };

    if (name === "AuditorId") {
      data["AuditorId"] = value;
      setCurrTeamAuditorId(value);
    }
      setErrorMsg("");

    setCurrentFormData(data);
  };

  function handleSave() {
    // setLoading(true); //Show loader
    console.log("currentFormData: ", currentFormData);
    console.log("newFormData: ", newFormData);

    if (currentFormData.AssignDate === "" || currentFormData.AuditorId === 0 || currentFormData.StartTime === "" || currentFormData.EndTime === "" ) {
      setErrorMsg("Please fill all required fields (*)");
      return;
    }

   

      // console.log('currentRow: ', currentRow);
      let params = {
        action: "MemberDateAssignDataAddEdit",
        lan: language(),
        UserId: UserInfo.UserId,
        rowData: currentFormData,
      };

      apiCall.post(serverpage, { params }, apiOption()).then((res) => {
        props.masterProps.openNoticeModal({
          isOpen: true,
          msg: res.data.message,
          msgtype: res.data.success,
        });

        if (res.data.success === 1) {
          setCurrentFormData(newFormData);
          setCurrTeamAuditorId(0);

          getMemberDateAssignDataList();
        }
      });
  }

  const columnList = [
    // { field: "rownumber", label: "SL", align: "center", width: "3%" },

    {
      field: "AssignDate",
      label: "Date",
      align: "left",
      visible: true,
      sort: true,
      filter: true,
      width: "20%",
    },
    {
      field: "StartTime",
      label: "Start Time",
      align: "left",
      visible: true,
      sort: true,
      filter: true,
      width: "15%",
    },
    {
      field: "EndTime",
      label: "End Time",
      align: "left",
      visible: true,
      sort: true,
      filter: true,
      width: "15%",
    },
    {
      field: "AuditorName",
      label: "Auditor",
      align: "left",
      visible: true,
      sort: true,
      filter: true,
      // width: "60%",
    },

    {
      field: "custom",
      label: "Action",
      width: "10%",
      align: "center",
      visible: true,
      sort: false,
      filter: false,
    },
  ];

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

        <DeleteOutline
            className={"table-delete-icon"}
            onClick={() => {
              deleteData(rowData);
            }}
          />
      </>
    );
  }


  
  const editData = (rowData) => {
    // console.log('rowData: ', rowData);
    setCurrTeamAuditorId(rowData.AuditorId); 
    setCurrentFormData(rowData);
    setErrorMsg("");
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
        action: "deleteMemberDateAssignData",
        lan: language(),
        UserId: UserInfo.UserId,
        rowData: rowData,
      };
  
      apiCall.post(serverpage, { params }, apiOption()).then((res) => {
        props.masterProps.openNoticeModal({
          isOpen: true,
          msg: res.data.message,
          msgtype: res.data.success,
        });
        getMemberDateAssignDataList();
      });
    }
  
  return (
    <>
      {/* <!-- GROUP MODAL START --> */}
      <div id="groupModal" class="modal">
        {/* <!-- Modal content --> */}
        <div class="modal-content-reportblock">
          <div class="modalHeader">
            <h4>Team Auditor Alocation</h4>
          </div>

          <div class=" pt-10 ">
            {/* <div className={classes.root}> */}
            {/* <Paper className={classes.paper} elevation={3}> */}
            <div class="formEntryColumnTwo">
              <label>Audit Start Date</label>
              <input
                type="text"
                // id="FactoryAddress"
                // name="FactoryAddress"
                disabled={true}
                // className={errorObject.FactoryAddress}
                // placeholder="Enter Factory Address"
                value={currentRow.AuditStartDate}
                // onChange={(e) => handleChange(e)}
              />

              <label>Audit End Date</label>
              <input
                type="text"
                // id="FactoryAddress"
                // name="FactoryAddress"
                disabled={true}
                // className={errorObject.FactoryAddress}
                // placeholder="Enter Factory Address"
                value={currentRow.AuditEndDate}
                // onChange={(e) => handleChange(e)}
              />

              <label>Alocation Date *</label>
              <input
                type="date"
                id="AssignDate"
                name="AssignDate"
                min={currentRow.AuditStartDate || ""}
                max={currentRow.AuditEndDate || ""}
                // disabled={permissionType == 1}
                // className={errorObject.AssignDate}
                placeholder="Enter Alocation Date"
                value={currentFormData.AssignDate}
                onChange={(e) => handleChange(e)}
              />

              <label>Start Time *</label>
              <input
                type="time"
                id="StartTime"
                name="StartTime"
                // disabled={permissionType == 1}
                // className={errorObject.FactoryAddress}
                placeholder="Enter Start Time"
                value={currentFormData.StartTime}
                onChange={(e) => handleChange(e)}
              />

              <label>End Time *</label>
              <input
                type="time"
                id="EndTime"
                name="EndTime"
                // disabled={permissionType == 1}
                // className={errorObject.FactoryAddress}
                placeholder="Enter End Time"
                value={currentFormData.EndTime}
                onChange={(e) => handleChange(e)}
              />

              <label>Team Auditor *</label>
              <Autocomplete
                autoHighlight
                // disabled={permissionType == 1}
                className={`chosen_dropdown `}
                id="AuditorId"
                name="AuditorId"
                autoComplete
                // class={errorObject.AuditorId}
                options={TeamAuditorList ? TeamAuditorList : []}
                getOptionLabel={(option) => option.name}
                value={
                  TeamAuditorList && currTeamAuditorId
                    ? TeamAuditorList.find((list) => list.id === currTeamAuditorId) || { id: 0, name: "Select Team Auditor" }
                    : { id: 0, name: "Select Team Auditor" }
                }
                onChange={(event, valueobj) =>
                  handleChangeDropDown("AuditorId", valueobj ? valueobj.id : "")
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

              <Button
                disabled={loading}
                label={"Save"}
                class={"btnAdd"}
                onClick={handleSave}
              />

              {errorMsg && <div style={{ color: 'red' }}>{errorMsg}</div>}
            

            </div>
            <CustomTable
              columns={columnList}
              rows={dataList ? dataList : {}}
              actioncontrol={actioncontrol}
            />
            <Grid container justify="center">
              {loading && (
                <div style={{ textAlign: "center", marginTop: "5px" }}>
                  <CircularProgress size={24} />
                </div>
              )}

            </Grid>
          </div>

          <div class="modalItem">
            <Button
              label={"Close"}
              class={"btnClose"}
              onClick={() => {
                importModalCallback("Close");
              }}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default AssignTeamAuditorModal;
