import React, { useState } from "react";
import {Button}  from "../../../components/CustomControl/Button";
import {apiCall, apiOption, LoginUserInfo, language}  from "../../../actions/api";


const ProgramCategoryAddEditModal = (props) => { 
  const serverpage = "programcategory";// this is .php server page
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

    let validateFields = ["ProgramCategoryName"]
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
        
        props.masterProps.openNoticeModal({
          isOpen: true,
          msg: res.data.message,
          msgtype: res.data.success,
        });
        
        
        if(res.data.success === 1){
          props.modalCallback("addedit");
        }


      });

    }

    
  }

  function modalClose(){
    props.modalCallback("close");
  }


  return (
    <>

      {/* <!-- GROUP MODAL START --> */}
      <div id="groupModal" class="modal">
        {/* <!-- Modal content --> */}
        <div class="modal-content-small">
          <div class="modalHeader">
            <h4>Add/Edit Program Category</h4>
          </div>

           <div class="modalItemColumnOne">
            <label>Program Category Name *</label>
            <input
              type="text"
              id="ProgramCategoryName"
              name="ProgramCategoryName"
              class={errorObject.ProgramCategoryName}
              placeholder="Enter Program Category Name"
              value={currentRow.ProgramCategoryName}
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

export default ProgramCategoryAddEditModal;
