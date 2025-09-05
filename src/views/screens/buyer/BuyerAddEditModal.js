import React, { forwardRef, useRef, useEffect, useState } from "react";
import { Button } from "../../../components/CustomControl/Button";
import {
  apiCall,
  apiOption,
  LoginUserInfo,
  language,
} from "../../../actions/api";

const BuyerAddEditModal = (props) => {
  // console.log('props modal: ', props);
  const serverpage = "buyer"; // this is .php server page
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
    let validateFields = ["BuyerName"];
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

  return (
    <>
      {/* <!-- GROUP MODAL START --> */}
      <div id="groupModal" class="modal">
        {/* <!-- Modal content --> */}
        <div class="modal-content">
          <div class="modalHeader">
            <h4>Add/Edit Buyer</h4>
          </div>
 

          <div class="modalItem">
            <label>Buyer Name *</label>
            <input
              type="text"
              id="BuyerName"
              name="BuyerName"
              class={errorObject.BuyerName}
              placeholder="Enter Buyer Name"
              value={currentRow.BuyerName}
              onChange={(e) => handleChange(e)}
            />
          </div>

         <div class="modalItem">
            <label>Phone No</label>
            <input
              type="text"
              id="Phone"
              name="Phone"
              // class={errorObject.Phone}
              placeholder="Enter Phone No"
              value={currentRow.Phone}
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

export default BuyerAddEditModal;
