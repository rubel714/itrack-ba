import React, { forwardRef, useRef, useEffect, useState } from "react";
import { Button } from "../../../components/CustomControl/Button";
import {
  apiCall,
  apiOption,
  LoginUserInfo,
  language,
} from "../../../actions/api";
import Autocomplete from "@material-ui/lab/Autocomplete";

import { Typography, TextField } from "@material-ui/core";

const FactoryAddEditModal = (props) => {
  //console.log("props modal: ", props);
  const serverpage = "factory"; // this is .php server page
  const [currentRow, setCurrentRow] = useState(props.currentRow);
  const [errorObject, setErrorObject] = useState({});
  // const [currentFile, setCurrentFile] = useState(null);
  const UserInfo = LoginUserInfo();

  const [FactoryGroupList, setFactoryGroupList] = useState(null);
  const [currFactoryGroupId, setCurrFactoryGroupId] = useState(null);

  // const [DepartmentList, setDepartmentList] = useState(null);
  // const [BusinessLineList, setBusinessLineList] = useState(null);
  // const [currDepartmentId, setCurrDepartmentId] = useState(null);
  // const [currBusinessLineId, setCurrBusinessLineId] = useState(null);

  // const [TeamList, setTeamList] = useState(null);
  // const [currTeamId, setCurrTeamId] = useState(null);

  // const [UserList, setUserList] = useState(null);
  // const [currLinemanUserId, setCurrLinemanUserId] = useState(null);

  // const [RoleList, setRoleList] = useState(null);
  // const [currRoleId, setCurrRoleId] = useState(null);

  const baseUrl = process.env.REACT_APP_FRONT_URL;
  const [previewImage, setPreviewImage] = useState(
    `${baseUrl}image/user/placeholder.png`
  );

  const [previewImages, setPreviewImages] = useState({
    PhotoUrl: `${baseUrl}image/user/placeholder.png`,
  });

  React.useEffect(() => {
    getFactoryGroupList(props.currentRow.FactoryGroupId);
    // getRole(props.currentRow.RoleId);
    // getDepartment(props.currentRow.DepartmentId);
    // getTeam(props.currentRow.TeamId);
    // getUser(props.currentRow.LinemanUserId);
  }, []);

  function getFactoryGroupList(selectFactoryGroupId) {
    let params = {
      action: "FactoryGroupList",
      lan: language(),
      UserId: UserInfo.UserId,
      ClientId: UserInfo.ClientId,
      BranchId: UserInfo.BranchId,
    };

    apiCall.post("combo_generic", { params }, apiOption()).then((res) => {
      setFactoryGroupList(
        [{ id: "", name: "Select Factory Group" }].concat(res.data.datalist)
      );

      setCurrFactoryGroupId(selectFactoryGroupId);
    });
  }

  // function getRole(selectRoleId) {
  //   let params = {
  //     action: "RoleList",
  //     lan: language(),
  //     UserId: UserInfo.UserId,
  //     ClientId: UserInfo.ClientId,
  //     BranchId: UserInfo.BranchId,
  //   };

  //   apiCall.post("combo_generic", { params }, apiOption()).then((res) => {
  //     setRoleList([{ id: "", name: "Select Role" }].concat(res.data.datalist));

  //     setCurrRoleId(selectRoleId);
  //   });
  // }

  // function getDepartment(selectDepartmentId) {
  //   let params = {
  //     action: "DepartmentList",
  //     lan: language(),
  //     UserId: UserInfo.UserId,
  //     ClientId: UserInfo.ClientId,
  //     BranchId: UserInfo.BranchId,
  //   };

  //   apiCall.post("combo_generic", { params }, apiOption()).then((res) => {
  //     setDepartmentList(
  //       [{ id: "", name: "Select Department" }].concat(res.data.datalist)
  //     );

  //     setCurrDepartmentId(selectDepartmentId);
  //   });
  // }

  // function getTeam(selectTeamId) {
  //   let params = {
  //     action: "TeamList",
  //     lan: language(),
  //     UserId: UserInfo.UserId,
  //     ClientId: UserInfo.ClientId,
  //     BranchId: UserInfo.BranchId,
  //   };

  //   apiCall.post("combo_generic", { params }, apiOption()).then((res) => {
  //     setTeamList([{ id: "", name: "Select Team" }].concat(res.data.datalist));

  //     setCurrTeamId(selectTeamId);
  //   });
  // }

  // function getUser(selectLinemanUserId) {
  //   let params = {
  //     action: "UserList",
  //     lan: language(),
  //     UserId: UserInfo.UserId,
  //     ClientId: UserInfo.ClientId,
  //     BranchId: UserInfo.BranchId,
  //   };

  //   apiCall.post("combo_generic", { params }, apiOption()).then((res) => {
  //     setUserList([{ id: "", name: "Select User" }].concat(res.data.datalist));

  //     setCurrLinemanUserId(selectLinemanUserId);
  //   });
  // }

  /*  const handleChange = (e) => {
    const { name, value } = e.target;
    let data = { ...currentRow };
    data[name] = value;
    setCurrentRow(data);
    // console.log('aaa data: ', data);

    setErrorObject({ ...errorObject, [name]: null });

  }; */

  const handleChange = (e) => {
    const { name, value } = e.target;
    let data = { ...currentRow };
    data[name] = value;

    setCurrentRow(data);
    setErrorObject({ ...errorObject, [name]: null });

    // if (name === "DesignationId") {
    //   setCurrDesignationId(value);
    // }

  };

  const handleChangeFilterDropDown = (name, value) => {
    let data = { ...currentRow };

    if (name === "FactoryGroupId") {
      data["FactoryGroupId"] = value;
      setCurrFactoryGroupId(value);
    }

    setErrorObject({ ...errorObject, [name]: null });
    setCurrentRow(data);
  };


  
  const validateForm = () => {

    let validateFields = [
        "FactoryGroupId",
        "FactoryName"
      ];
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

 
  function addEditAPICall() {
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
        if (res.data.success === 1) {
          props.modalCallback("addedit");
        }
      });
    }
  }

  function modalClose() {
    // console.log("props modal: ", props);
    props.modalCallback("close");
  }
  
  return (
    <>
      {/* <!-- GROUP MODAL START --> */}
      <div id="groupModal" class="modal">
        {/* <!-- Modal content --> */}
        <div class="modal-content">
          <div class="modalHeader">
            <h4>Add/Edit Factory</h4>
          </div>

          <div class="contactmodalBody pt-10">
            <label>Factory Group *</label>
            <Autocomplete
              autoHighlight
              disableClearable
              className="chosen_dropdown"
              id="FactoryGroupId"
              name="FactoryGroupId"
              autoComplete
              class={errorObject.FactoryGroupId}
              options={FactoryGroupList ? FactoryGroupList : []}
              getOptionLabel={(option) => option.name}
              defaultValue={{ id: 0, name: "Select Factory Group" }}
              value={
                FactoryGroupList
                  ? FactoryGroupList[
                      FactoryGroupList.findIndex(
                        (list) => list.id === currFactoryGroupId
                      )
                    ]
                  : null
              }
              onChange={(event, valueobj) =>
                handleChangeFilterDropDown(
                  "FactoryGroupId",
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

            <label>Factory Name *</label>
            <input
              type="text"
              id="FactoryName"
              name="FactoryName"
              class={errorObject.FactoryName}
              placeholder="Enter Factory Name"
              value={currentRow.FactoryName}
              onChange={(e) => handleChange(e)}
            />
          </div>

          <div class="contactmodalBody pt-10">
            <label>Phone No</label>
            <input
              type="text"
              id="PhoneNo"
              name="PhoneNo"
              placeholder="Enter Phone No"
              // class={errorObject.PhoneNo}
              value={currentRow.PhoneNo}
              onChange={(e) => handleChange(e)}
            ></input>

            <label>Email</label>
            <input
              type="text"
              id="Email"
              name="Email"
              placeholder="Enter Email"
              // class={errorObject.Email}
              value={currentRow.Email}
              onChange={(e) => handleChange(e)}
            ></input>
          </div>

          <div class="contactmodalBody pt-10">
            <label>Address</label>
            <input
              type="text"
              id="Address"
              name="Address"
              // class={errorObject.Address}
              placeholder="Enter Address"
              value={currentRow.Address}
              onChange={(e) => handleChange(e)}
            />
          </div>

          <div class="modalItem">
            <Button label={"Close"} class={"btnClose"} onClick={modalClose} />
            {props.currentRow.id && (
              <Button
                label={"Update"}
                class={"btnUpdate"}
                onClick={addEditAPICall}
              />
            )}
            {!props.currentRow.id && (
              <Button
                label={"Save"}
                class={"btnSave"}
                onClick={addEditAPICall}
              />
            )}
          </div>
        </div>
      </div>
      {/* <!-- GROUP MODAL END --> */}
    </>
  );
};

export default FactoryAddEditModal;
