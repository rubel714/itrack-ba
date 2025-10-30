import React, { forwardRef, useRef,useEffect,useState } from "react";
import {Button}  from "../../../components/CustomControl/Button";
import {apiCall, apiOption, LoginUserInfo, language}  from "../../../actions/api";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { Typography, TextField } from "@material-ui/core";

const DepartmentAddEditModal = (props) => { 
  // console.log('props modal: ', props);
  const serverpage = "leave";// this is .php server page
  const [currentRow, setCurrentRow] = useState(props.currentRow);
  const [errorObject, setErrorObject] = useState({});
  const UserInfo = LoginUserInfo();

  const [AuditorList, setAuditorList] = useState(null);
  const [currAuditorId, setCurrAuditorId] = useState(null);

  const [LeaveStatusList, setLeaveStatusList] = useState(null);
  const [currLeaveStatusId, setCurrLeaveStatusId] = useState(null);

  
  React.useEffect(() => {
    getAuditorList(props.currentRow.AuditorId);
    getLeaveStatusList(props.currentRow.LeaveStatusId);
  }, []);
  
    function getAuditorList(selectAuditorId) {
      let params = {
        action: "getAuditorList",
        lan: language(),
        UserId: UserInfo.UserId,
      };
  
      apiCall.post("combo_generic", { params }, apiOption()).then((res) => {
        setAuditorList(
          [{ id: "", name: "Select Auditor" }].concat(res.data.datalist)
        );
  
        setCurrAuditorId(selectAuditorId);
      });
    }
  
    function getLeaveStatusList(selectLeaveStatusId) {
      let params = {
        action: "getLeaveStatusList",
        lan: language(),
        UserId: UserInfo.UserId,
      };
  
      apiCall.post("combo_generic", { params }, apiOption()).then((res) => {
        setLeaveStatusList(
          [{ id: "", name: "Select Status" }].concat(res.data.datalist)
        );
  
        setCurrLeaveStatusId(selectLeaveStatusId);
      });
    }



  const handleChange = (e) => {
    const { name, value } = e.target;
    let data = { ...currentRow };
    data[name] = value;

    setCurrentRow(data);
    setErrorObject({ ...errorObject, [name]: null });

  };
 
  
  const validateForm = () => {

    let validateFields = ["HoliDate","AuditorId","LeaveStatusId"]
    let errorData = {}
    let isValid = true
    validateFields.map((field) => {
      if (!currentRow[field]) {
        errorData[field] = "validation-style";
        isValid = false
      }
    })
    setErrorObject(errorData);
    return isValid
  }


  function addEditAPICall(){

    if (validateForm()) {

      let params = {
        action: "dataAddEdit",
        lan: language(),
        UserId: UserInfo.UserId,
        rowData: currentRow,
      };

      apiCall.post(serverpage, { params }, apiOption()).then((res) => {
        // console.log('res: ', res);
        
        props.masterProps.openNoticeModal({
          isOpen: true,
          msg: res.data.message,
          msgtype: res.data.success,
        });
        
        
        // console.log('props modal: ', props);
        if(res.data.success === 1){
          props.modalCallback("addedit");
        }


      });

    }

    
  }

  function modalClose(){
    // console.log('props modal: ', props);
    props.modalCallback("close");
  }

  const handleChangeDropDown = (name, value) => {
    let data = { ...currentRow };

    if (name === "AuditorId") {
      data["AuditorId"] = value;
      setCurrAuditorId(value);
    }

    if (name === "LeaveStatusId") {
      data["LeaveStatusId"] = value;
      setCurrLeaveStatusId(value);
    }

    setErrorObject({ ...errorObject, [name]: null });
    setCurrentRow(data);
  };


  return (
    <>

      {/* <!-- GROUP MODAL START --> */}
      <div id="groupModal" class="modal">
        {/* <!-- Modal content --> */}
        <div class="modal-content-small" >
          <div class="modalHeader">
            <h4>Add/Edit Leave/Office Work</h4>
          </div>

          <div class="modalItemColumnTwo">
            <label>Date*</label>
            <input
              type="date"
              id="HoliDate"
              name="HoliDate"
              // style={{"width":"30%"}}
              class={errorObject.HoliDate}
              placeholder="Enter Date"
              value={currentRow.HoliDate}
              onChange={(e) => handleChange(e)}
            />
           
             <label>Auditor *</label>
            <Autocomplete
              autoHighlight
              disableClearable
              className="chosen_dropdown"
              id="AuditorId"
              name="AuditorId"
              autoComplete
              class={errorObject.AuditorId}
              options={AuditorList ? AuditorList : []}
              getOptionLabel={(option) => option.name}
              defaultValue={{ id: 0, name: "Select Auditor" }}
              value={
                AuditorList
                  ? AuditorList[
                      AuditorList.findIndex(
                        (list) => list.id === currAuditorId
                      )
                    ]
                  : null
              }
              onChange={(event, valueobj) =>
                handleChangeDropDown(
                  "AuditorId",
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
           
             <label>Status *</label>
            <Autocomplete
              autoHighlight
              disableClearable
              className="chosen_dropdown"
              id="LeaveStatusId"
              name="LeaveStatusId"
              autoComplete
              class={errorObject.LeaveStatusId }
              options={LeaveStatusList ? LeaveStatusList : []}
              getOptionLabel={(option) => option.name}
              defaultValue={{ id: 0, name: "Select Status" }}
              value={
                LeaveStatusList
                  ? LeaveStatusList[
                      LeaveStatusList.findIndex(
                        (list) => list.id === currLeaveStatusId
                      )
                    ]
                  : null
              }
              onChange={(event, valueobj) =>
                handleChangeDropDown(
                  "LeaveStatusId",
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


            <label>Comments</label>
            <input
              type="text"
              id="Comments"
              name="Comments"
              // class={errorObject.Comments}
              placeholder="Enter Comments"
              value={currentRow.Comments}
              onChange={(e) => handleChange(e)}
            />

          </div>
  

          <div class="modalItemButton">

            <Button label={"Close"} class={"btnClose"} onClick={modalClose} />
            {props.currentRow.id && (<Button label={"Update"} class={"btnUpdate"} onClick={addEditAPICall} />)}
            {!props.currentRow.id && (<Button label={"Save"} class={"btnSave"} onClick={addEditAPICall} />)}
            
          </div>
        </div>
      </div>
      {/* <!-- GROUP MODAL END --> */}



    </>
  );
};

export default DepartmentAddEditModal;
