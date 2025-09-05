import React, { forwardRef, useRef, useEffect, useState } from "react";
import { Button } from "../../../components/CustomControl/Button";
import {
  apiCall,
  apiOption,
  LoginUserInfo,
  language,
} from "../../../actions/api";

const AuditorsAddEditModal = (props) => {
  // console.log('props modal: ', props);
  const serverpage = "auditors"; // this is .php server page
  const [currentRow, setCurrentRow] = useState(props.currentRow);
  const [errorObject, setErrorObject] = useState({});
  const UserInfo = LoginUserInfo();

  const handleChange = (e) => {
    const { name, value } = e.target;
    let data = { ...currentRow };
    data[name] = value;

    setCurrentRow(data);
    setErrorObject({ ...errorObject, [name]: null });
  };

  const validateForm = () => {
    let validateFields = ["AuditorName","PhoneNo"];
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
            <h4>Add/Edit Auditor</h4>
          </div>

          <div class="modalItem">
            <label>Auditor Code</label>
            <input
              type="text"
              id="AuditorCode"
              name="AuditorCode"
              // class={errorObject.AuditorCode}
              placeholder="Enter Auditor Code"
              value={currentRow.AuditorCode }
              onChange={(e) => handleChange(e)}
            />
          </div>

          <div class="modalItem">
            <label>Auditor Name *</label>
            <input
              type="text"
              id="AuditorName"
              name="AuditorName"
              class={errorObject.AuditorName}
              placeholder="Enter Auditor Name"
              value={currentRow.AuditorName}
              onChange={(e) => handleChange(e)}
            />
          </div>

         <div class="modalItem">
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
          </div>

          <div class="modalItem">
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
          </div>

          <div class="modalItem">
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

export default AuditorsAddEditModal;
