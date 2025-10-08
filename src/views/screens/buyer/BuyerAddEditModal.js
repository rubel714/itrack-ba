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
        <div class="modal-content-small">
          <div class="modalHeader">
            <h4>Add/Edit Buyer</h4>
          </div>

          <div class="modalItemColumnOne">
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
   
            <label>Client Type</label>
            <input
              type="text"
              id="ClientType"
              name="ClientType"
              // class={errorObject.ClientType}
              placeholder="Enter Client Type"
              value={currentRow.ClientType}
              onChange={(e) => handleChange(e)}
            />
 
            <label>Country</label>
            <input
              type="text"
              id="Country"
              name="Country"
              // class={errorObject.Country}
              placeholder="Enter Country"
              value={currentRow.Country}
              onChange={(e) => handleChange(e)}
            />
   
            <label>Sun Code</label>
            <input
              type="text"
              id="SunCode"
              name="SunCode"
              // class={errorObject.SunCode}
              placeholder="Enter Sun Code"
              value={currentRow.SunCode}
              onChange={(e) => handleChange(e)}
            />
   
            <label>Ebitz Code</label>
            <input
              type="text"
              id="EbitzCode"
              name="EbitzCode"
              // class={errorObject.EbitzCode}
              placeholder="Enter Ebitz Code"
              value={currentRow.EbitzCode}
              onChange={(e) => handleChange(e)}
            />
 
            <label>ITS Code</label>
            <input
              type="text"
              id="ItsCode"
              name="ItsCode"
              // class={errorObject.ItsCode}
              placeholder="Enter ITS Code"
              value={currentRow.ItsCode}
              onChange={(e) => handleChange(e)}
            />
 
            <label>Register No</label>
            <input
              type="text"
              id="RegisterNo"
              name="RegisterNo"
              // class={errorObject.RegisterNo}
              placeholder="Enter Register No"
              value={currentRow.RegisterNo}
              onChange={(e) => handleChange(e)}
            />
 
            <label>Customer Code</label>
            <input
              type="text"
              id="CustomerCode"
              name="CustomerCode"
              // class={errorObject.CustomerCode}
              placeholder="Enter Customer Code"
              value={currentRow.CustomerCode}
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

export default BuyerAddEditModal;
