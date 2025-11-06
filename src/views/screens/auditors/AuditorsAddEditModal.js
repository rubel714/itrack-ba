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
const AuditorsAddEditModal = (props) => {
  // console.log('props modal: ', props);
  const serverpage = "auditors"; // this is .php server page
  const [currentRow, setCurrentRow] = useState(props.currentRow);
  const [errorObject, setErrorObject] = useState({});
  const UserInfo = LoginUserInfo();

  const [ProgramList, setProgramList] = useState(null);
  const [currProgramId, setCurrProgramId] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    let data = { ...currentRow };
    data[name] = value;

    setCurrentRow(data);
    setErrorObject({ ...errorObject, [name]: null });
  };

  const validateForm = () => {
    let validateFields = ["AuditorName", "PhoneNo","Email"];
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

  React.useEffect(() => {
    getProgram("");
    // getProgram(props.currentRow.DesignationId);
  }, []);

  function getProgram(selectProgramId) {
    let params = {
      action: "ProgramList",
      lan: language(),
      UserId: UserInfo.UserId,
    };

    apiCall.post("combo_generic", { params }, apiOption()).then((res) => {
      setProgramList(res.data.datalist);
      //         setProgramList(
      //   [{ id: "", name: "Select Program" }].concat(res.data.datalist)
      // );

      setCurrProgramId(selectProgramId);
    });
  }

  return (
    <>
      {/* <!-- GROUP MODAL START --> */}
      <div id="groupModal" class="modal">
        {/* <!-- Modal content --> */}
        <div class="modal-content">
          <div class="modalHeader">
            <h4>Add/Edit Auditor</h4>
          </div>

          <div class="modalItemColumnTwo">
            <label>Emp Id</label>
            <input
              type="text"
              id="AuditorCode"
              name="AuditorCode"
              // class={errorObject.AuditorCode}
              placeholder="Enter Emp Id"
              value={currentRow.AuditorCode}
              onChange={(e) => handleChange(e)}
            />

            <label>Name *</label>
            <input
              type="text"
              id="AuditorName"
              name="AuditorName"
              class={errorObject.AuditorName}
              placeholder="Enter Name"
              value={currentRow.AuditorName}
              onChange={(e) => handleChange(e)}
            />

            <label>Email *</label>
            <input
              type="text"
              id="Email"
              name="Email"
              class={errorObject.Email}
              placeholder="Enter Email"
              value={currentRow.Email}
              onChange={(e) => handleChange(e)}
            />

            <label>Phone Number *</label>
            <input
              type="text"
              id="PhoneNo"
              name="PhoneNo"
              class={errorObject.PhoneNo}
              placeholder="Enter Phone Number"
              value={currentRow.PhoneNo}
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
          <div class="modalItemColumnOne">
            {props.currentRow.id && (
              <div
                class=""
                style={{
                  display: "inline-block",
                  alignItems: "left",
                  marginBottom: 4,
                }}
              >
                <label>Capability of Lead Auditor Program</label>
                {ProgramList &&
                  ProgramList.map((program) => (
                    <div key={program.id}>
                      <input
                        type="checkbox"
                        id={`program_${program.id}`}
                        checked={(currentRow.LeadAuditorProgram || []).includes(
                          program.id
                        )}
                        onChange={(e) => {
                          const selected = currentRow.LeadAuditorProgram || [];
                          let newSelected;
                          if (e.target.checked) {
                            newSelected = [...selected, program.id];
                          } else {
                            newSelected = selected.filter(
                              (id) => id !== program.id
                            );
                          }
                          handleChange({
                            target: {
                              name: "LeadAuditorProgram",
                              value: newSelected,
                            },
                          });
                        }}
                      />
                      <span htmlFor={`program_${program.id}`}>
                        {program.name}
                      </span>
                    </div>
                  ))}
              </div>
            )}

            {props.currentRow.id && (
              <div
                class=""
                style={{
                  display: "inline-block",
                  alignItems: "left",
                  marginBottom: 4,
                }}
              >
                <label>Capability of Team Auditor Program</label>
                {ProgramList &&
                  ProgramList.map((program) => (
                    // <div style={{ display: "grid", flexDirection: "row", gap: "4px", marginBottom: "8px" }}>

                    <div key={program.id}>
                      <input
                        type="checkbox"
                        id={`program_${program.id}`}
                        checked={(currentRow.TeamAuditorProgram || []).includes(
                          program.id
                        )}
                        onChange={(e) => {
                          const selected = currentRow.TeamAuditorProgram || [];
                          let newSelected;
                          if (e.target.checked) {
                            newSelected = [...selected, program.id];
                          } else {
                            newSelected = selected.filter(
                              (id) => id !== program.id
                            );
                          }
                          handleChange({
                            target: {
                              name: "TeamAuditorProgram",
                              value: newSelected,
                            },
                          });
                        }}
                      />
                      <span htmlFor={`program_${program.id}`}>
                        {program.name}
                      </span>
                    </div>
                  ))}
              </div>
            )}
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

export default AuditorsAddEditModal;
