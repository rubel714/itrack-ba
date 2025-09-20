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

const ProgramsAddEditModal = (props) => {
  // console.log('props modal: ', props);
  const serverpage = "programs"; // this is .php server page
  const [currentRow, setCurrentRow] = useState(props.currentRow);
  const [errorObject, setErrorObject] = useState({});
  const UserInfo = LoginUserInfo();

  const [TATDayTypeList, setTATDayTypeList] = useState(null);
  const [currTATDayTypeId, setCurrTATDayTypeId] = useState(null);

  React.useEffect(() => {
    getTATDayTypeList(props.currentRow.TATDayTypeId);
  }, []);

  function getTATDayTypeList(selectTATDayTypeId) {
    let params = {
      action: "TATDayTypeList",
      lan: language(),
      UserId: UserInfo.UserId,
    };

    apiCall.post("combo_generic", { params }, apiOption()).then((res) => {
      setTATDayTypeList(
        [{ id: "", name: "Select TAT Day Type" }].concat(res.data.datalist)
      );

      setCurrTATDayTypeId(selectTATDayTypeId);
    });
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    let data = { ...currentRow };
    data[name] = value;

    setCurrentRow(data);
    setErrorObject({ ...errorObject, [name]: null });
  };

  const handleChangeFilterDropDown = (name, value) => {
    let data = { ...currentRow };

    if (name === "TATDayTypeId") {
      data["TATDayTypeId"] = value;
      setCurrTATDayTypeId(value);
    }

    setErrorObject({ ...errorObject, [name]: null });
    setCurrentRow(data);
  };

  const validateForm = () => {
    let validateFields = ["ProgramName","TATDayTypeId"];
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
        ClientId: UserInfo.ClientId,
        BranchId: UserInfo.BranchId,
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

  return (
    <>
      {/* <!-- GROUP MODAL START --> */}
      <div id="groupModal" class="modal">
        {/* <!-- Modal content --> */}
        <div class="modal-content">
          <div class="modalHeader">
            <h4>Add/Edit Program</h4>
          </div>

          <div class="modalItem">
            <label>Program Name *</label>
            <input
              type="text"
              id="ProgramName"
              name="ProgramName"
              class={errorObject.ProgramName}
              placeholder="Enter Program Name"
              value={currentRow.ProgramName}
              onChange={(e) => handleChange(e)}
            />
   </div>
          <div class="modalItem">
            <label>TAT Day Type *</label>
            <Autocomplete
              autoHighlight
              disableClearable
              className="chosen_dropdown"
              id="TATDayTypeId"
              name="TATDayTypeId"
              autoComplete
              class={errorObject.TATDayTypeId}
              options={TATDayTypeList ? TATDayTypeList : []}
              getOptionLabel={(option) => option.name}
              defaultValue={{ id: 0, name: "Select TAT Day Type" }}
              value={
                TATDayTypeList
                  ? TATDayTypeList[
                      TATDayTypeList.findIndex(
                        (list) => list.id === currTATDayTypeId
                      )
                    ]
                  : null
              }
              onChange={(event, valueobj) =>
                handleChangeFilterDropDown(
                  "TATDayTypeId",
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
          </div>
          <div class="modalItem">
            <label>Standard TAT Day</label>
            <input
              type="number"
              id="StandardTATDay"
              name="StandardTATDay"
              class={errorObject.StandardTATDay}
              placeholder="Enter Standard TAT Day"
              value={currentRow.StandardTATDay}
              onChange={(e) => handleChange(e)}
            />
   </div>
          <div class="modalItem">
            <label>Strategice TAT Day</label>
            <input
              type="number"
              id="StrategiceTATDay"
              name="StrategiceTATDay"
              class={errorObject.StrategiceTATDay}
              placeholder="Enter Strategice TAT Day"
              value={currentRow.StrategiceTATDay}
              onChange={(e) => handleChange(e)}
            />
          </div>
          <div class="modalItem">
            <label>Is it Multiple</label>
            <input
              type="text"
              id="IsitMultiple"
              name="IsitMultiple"
              // class={errorObject.IsitMultiple}
              placeholder="Enter Is it Multiple"
              value={currentRow.IsitMultiple}
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

export default ProgramsAddEditModal;
