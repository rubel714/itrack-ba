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

const MembersAddEditModal = (props) => {
  // console.log('props modal: ', props);
  const serverpage = "members"; // this is .php server page
  const [currentRow, setCurrentRow] = useState(props.currentRow);
  const [errorObject, setErrorObject] = useState({});
  const UserInfo = LoginUserInfo();

  const [DepartmentList, setDepartmentList] = useState(null);
  const [currDepartmentId, setCurrDepartmentId] = useState(null);

  React.useEffect(() => {
    getDepartmentList(props.currentRow.DepartmentId);
  }, []);

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    let data = { ...currentRow };
    data[name] = value;

    setCurrentRow(data);
    setErrorObject({ ...errorObject, [name]: null });
  };

  const validateForm = () => {
    let validateFields = ["MemberName", "PhoneNo", "DepartmentId"];
    let errorData = {};
    let isValid = true;
    validateFields.map((field) => {
      if (!currentRow[field]) {
        errorData[field] = "validation-style";
        isValid = false;
      }
    });
    setErrorObject(errorData);
    return isValid;
  };

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
    // console.log('props modal: ', props);
    props.modalCallback("close");
  }

  const handleChangeFilterDropDown = (name, value) => {
    let data = { ...currentRow };

    if (name === "DepartmentId") {
      data["DepartmentId"] = value;
      setCurrDepartmentId(value);
    }

    setErrorObject({ ...errorObject, [name]: null });
    setCurrentRow(data);
  };

  return (
    <>
      {/* <!-- GROUP MODAL START --> */}
      <div id="groupModal" class="modal">
        {/* <!-- Modal content --> */}
        <div class="modal-content-small">
          <div class="modalHeader">
            <h4>Add/Edit Employee</h4>
          </div>

          <div class="modalItemColumnOne">
            <label>Code</label>
            <input
              type="text"
              id="MemberCode"
              name="MemberCode"
              // class={errorObject.MemberCode}
              placeholder="Enter Code"
              value={currentRow.MemberCode}
              onChange={(e) => handleChange(e)}
            />

            <label>Name *</label>
            <input
              type="text"
              id="MemberName"
              name="MemberName"
              class={errorObject.MemberName}
              placeholder="Enter Name"
              value={currentRow.MemberName}
              onChange={(e) => handleChange(e)}
            />

            <label>Department *</label>
            <Autocomplete
              autoHighlight
              disableClearable
              className="chosen_dropdown"
              id="DepartmentId"
              name="DepartmentId"
              autoComplete
              class={errorObject.DepartmentId}
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
                handleChangeFilterDropDown(
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

            <label>PhoneNo *</label>
            <input
              type="text"
              id="PhoneNo"
              name="PhoneNo"
              class={errorObject.PhoneNo}
              placeholder="Enter PhoneNo"
              value={currentRow.PhoneNo}
              onChange={(e) => handleChange(e)}
            />

            <label>Email</label>
            <input
              type="text"
              id="Email"
              name="Email"
              // class={errorObject.Email}
              placeholder="Enter Email"
              value={currentRow.Email}
              onChange={(e) => handleChange(e)}
            />

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

          <div class="modalItemButton">
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

export default MembersAddEditModal;
