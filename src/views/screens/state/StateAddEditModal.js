import React, { forwardRef, useRef,useEffect,useState } from "react";
import {Button}  from "../../../components/CustomControl/Button";
import {apiCall, apiOption, LoginUserInfo, language}  from "../../../actions/api";


const StateAddEditModal = (props) => { 
  // console.log('props modal: ', props);
  const serverpage = "state";// this is .php server page
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

    let validateFields = ["StateName"]
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


  return (
    <>

      {/* <!-- GROUP MODAL START --> */}
      <div id="groupModal" class="modal">
        {/* <!-- Modal content --> */}
        <div class="modal-content-small">
          <div class="modalHeader">
            <h4>Add/Edit State</h4>
          </div>

          <div class="modalItemColumnOne">
            <label>State Name *</label>
            <input
              type="text"
              id="StateName"
              name="StateName"
              class={errorObject.StateName}
              placeholder="Enter State Name"
              value={currentRow.StateName}
              onChange={(e) => handleChange(e)}
            />
          </div>
          <div class="modalItemColumnOne">
            <label>Color Code</label>
            <input
              type="text"
              id="ColorCode"
              name="ColorCode"
              class={errorObject.ColorCode}
              placeholder="Enter Color Code"
              value={currentRow.ColorCode}
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

export default StateAddEditModal;
