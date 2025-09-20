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
import { DeleteOutline, Edit } from "@material-ui/icons";

import CustomTable from "components/CustomTable/CustomTable";
// import ExecuteQueryHook from "../../../components/hooks/ExecuteQueryHook";
import swal from "sweetalert";
import { set } from "date-fns";

const FactoryAddEditModal = (props) => {
  //console.log("props modal: ", props);
  const serverpage = "factory"; // this is .php server page
  const [currentRow, setCurrentRow] = useState(props.currentRow);
  const [errorObject, setErrorObject] = useState({});
  // const [currentFile, setCurrentFile] = useState(null);
  const UserInfo = LoginUserInfo();

  const [isLocationList, setIsLocationList] = useState(true); //when true show location list otherwise show edit
  const [LocationId, setLocationId] = useState("");
  const [LocationName, setLocationName] = useState("");

  const [isContactInfoList, setIsContactInfoList] = useState(true); //when true show contact list otherwise show edit
  const [ContactInfoId, setContactInfoId] = useState("");
  const [ContactPerson, setContactPerson] = useState("");
  const [ContactNumber, setContactNumber] = useState("");
  const [Designation, setDesignation] = useState("");
  const [Email, setEmail] = useState("");


  const [FactoryGroupList, setFactoryGroupList] = useState(null);
  const [currFactoryGroupId, setCurrFactoryGroupId] = useState(null);

  // const { isLoading, data: dataList, error, ExecuteQuery } = ExecuteQueryHook(); //Fetch data

  const baseUrl = process.env.REACT_APP_FRONT_URL;
  const [previewImage, setPreviewImage] = useState(
    `${baseUrl}image/user/placeholder.png`
  );

  const [previewImages, setPreviewImages] = useState({
    PhotoUrl: `${baseUrl}image/user/placeholder.png`,
  });

  React.useEffect(() => {
    getFactoryGroupList(props.currentRow.FactoryGroupId);
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
    let validateFields = ["FactoryGroupId", "FactoryName", "FactoryCode"];
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
    // console.log("props modal: ", props);
    props.modalCallback("close");
  }

  const columnListLocation = [
    { field: "rownumber", label: "SL", align: "center", width: "3%" },
    {
      field: "Location",
      label: "Location",
      align: "left",
      visible: true,
      sort: true,
      filter: true,
    },

    {
      field: "custom",
      label: "Action",
      width: "4%",
      align: "center",
      visible: true,
      sort: false,
      filter: false,
    },
  ];

  /** Action from table row buttons*/
  function actioncontrollocation(rowData) {
    return (
      <>
        <Edit
          className={"table-edit-icon"}
          onClick={() => {
            editDataLocation(rowData);
          }}
        />

        <DeleteOutline
          className={"table-delete-icon"}
          onClick={() => {
            deleteDataLocation(rowData);
          }}
        />
      </>
    );
  }

// addDataCOntactInfo
  const addDataLocation = () => {
    // console.log('rowData: ', rowData);
    setLocationId("");
    // console.log('rowData.LocationId: ', rowData.Id);
    setLocationName("");
    // console.log('rowData.LocationName: ', rowData.Location);
    setIsLocationList(false);
  };

  const editDataLocation = (rowData) => {
    // console.log('rowData: ', rowData);
    setLocationId(rowData.Id);
    // console.log('rowData.LocationId: ', rowData.Id);
    setLocationName(rowData.Location);
    // console.log('rowData.LocationName: ', rowData.Location);
    setIsLocationList(false);
  };

  const handleChangeLocation = (e) => {
    const { name, value } = e.target;
    setLocationName(value);
  };

  const addEditLocation = () => {
    if (LocationName == "") {
      swal("Warning", "Location name is required!", "warning");
      return;
    }

    let data = { ...currentRow };
    let Locations = data.Locations ? data.Locations : [];

    if (LocationId) {
      Locations.forEach((element, i) => {
        if (element.Id == LocationId) {
          // console.log("i=",i);
          data.Locations[i].Location = LocationName;
        }
      });
      //update
    } else {
      //add new
      data.Locations.push({
        Id: Date.now(), // Math.floor(Math.random() * 1000000), //temporary id for react key
        Location: LocationName,
      });
    }
    setIsLocationList(true);
    setCurrentRow(data);
  };

  const CloseLocationEdit = () => {
    setIsLocationList(true);
  };

  const deleteDataLocation = (rowData) => {
    console.log("rowData: ", rowData);
    swal({
      title: "Are you sure?",
      text: "Once deleted, you will not be able to recover this data!",
      icon: "warning",
      buttons: {
        confirm: {
          text: "Yes",
          value: true,
          visible: true,
          className: "",
          closeModal: true,
        },
        cancel: {
          text: "No",
          value: null,
          visible: true,
          className: "",
          closeModal: true,
        },
      },
      dangerMode: true,
    }).then((allowAction) => {
      if (allowAction) {
        // deleteApi(rowData);
        let data = { ...currentRow };
        let Locations = data.Locations ? data.Locations : [];

        let newArr = Locations.filter((item) => item.Id !== rowData.Id);
        data.Locations = newArr;
        setCurrentRow(data);

        // Locations.forEach((element, i) => {
        //   if (element.Id == rowData.Id) {
        //     // console.log("i=",i);
        //     data.Locations[i].Location = LocationName;
        //   }
        // });
      }
    });
  };

  const columnListContactInfo = [
    { field: "rownumber", label: "SL", align: "center", width: "3%" },
    {
      field: "ContactPerson",
      label: "Contact Person",
      align: "left",
      visible: true,
      sort: true,
      filter: true,
    },
    {
      field: "ContactNumber",
      label: "Contact Number",
      align: "left",
      visible: true,
      sort: true,
      filter: true,
      width: "20%",
    },
    {
      field: "Designation",
      label: "Designation",
      align: "left",
      visible: true,
      sort: true,
      filter: true,
      width: "20%",
    },
    {
      field: "Email",
      label: "Email",
      align: "left",
      visible: true,
      sort: true,
      filter: true,
      width: "20%",
    },
    {
      field: "custom",
      label: "Action",
      width: "4%",
      align: "center",
      visible: true,
      sort: false,
      filter: false,
    },
  ];

  /** Action from table row buttons*/
  function actioncontrolContactInfo(rowData) {
    return (
      <>
        <Edit
          className={"table-edit-icon"}
          onClick={() => {
            editDataContactInfo(rowData);
          }}
        />

        <DeleteOutline
          className={"table-delete-icon"}
          onClick={() => {
            deleteDataContactInfo(rowData);
          }}
        />
      </>
    );
  }


  
// addDataCOntactInfo
  const addDataCOntactInfo = () => {
    // console.log('rowData: ', rowData);
    setContactInfoId("");
    setContactPerson("");
    setContactNumber("");
    setDesignation("");
    setEmail("");
    setIsContactInfoList(false);
  };

  const editDataContactInfo = (rowData) => {
    // console.log('rowData: ', rowData);
    setContactInfoId(rowData.Id);
    // console.log('rowData.LocationId: ', rowData.Id);
    setContactPerson(rowData.ContactPerson);
    setContactNumber(rowData.ContactNumber);
    setDesignation(rowData.Designation);
    setEmail(rowData.Email);
    setIsContactInfoList(false);
  };

  const handleChangeContactInfo = (e) => {
    const { name, value } = e.target;

    if(name=="ContactPerson"){
        setContactPerson(value);
    }
    if(name=="ContactNumber"){
        setContactNumber(value);
    }
    if(name=="Designation"){
        setDesignation(value);
    }
    if(name=="Email"){
        setEmail(value);
    }
 
  };

  const addEditContactInfo = () => {
    if (ContactPerson == "" && ContactNumber=="" && Designation=="" && Email=="") {
      swal("Warning", "Contact Information is required!", "warning");
      return;
    }

    let data = { ...currentRow };
    let ContactInfo = data.ContactInfo ? data.ContactInfo : [];

    if (ContactInfoId) {
      ContactInfo.forEach((element, i) => {
        if (element.Id == ContactInfoId) {
          // console.log("i=",i);
          data.ContactInfo[i].ContactPerson = ContactPerson;
          data.ContactInfo[i].ContactNumber = ContactNumber;
          data.ContactInfo[i].Designation = Designation;
          data.ContactInfo[i].Email = Email;  
        }
      });
      //update
    } else {
      //add new
      data.ContactInfo.push({
        Id: Date.now(), // Math.floor(Math.random() * 1000000), //temporary id for react key
        ContactPerson: ContactPerson,
        ContactNumber: ContactNumber,
        Designation: Designation,
        Email: Email,
      });
    }
    setIsContactInfoList(true);
    setCurrentRow(data);
  };

  const CloseContactInfoEdit = () => {
    setIsContactInfoList(true);
  };

  const deleteDataContactInfo = (rowData) => {
    console.log("rowData: ", rowData);
    swal({
      title: "Are you sure?",
      text: "Once deleted, you will not be able to recover this data!",
      icon: "warning",
      buttons: {
        confirm: {
          text: "Yes",
          value: true,
          visible: true,
          className: "",
          closeModal: true,
        },
        cancel: {
          text: "No",
          value: null,
          visible: true,
          className: "",
          closeModal: true,
        },
      },
      dangerMode: true,
    }).then((allowAction) => {
      if (allowAction) {
        // deleteApi(rowData);
        let data = { ...currentRow };
        let ContactInfo = data.ContactInfo ? data.ContactInfo : [];

        let newArr = ContactInfo.filter((item) => item.Id !== rowData.Id);
        data.ContactInfo = newArr;
        setCurrentRow(data);
      }
    });
  };

  // const editDataContactInfo = (rowData) => {
  //   // setCurrentRow(rowData);
  //   // openModal();
  // };

  // const deleteDataContactInfo = (rowData) => {
  //   swal({
  //     title: "Are you sure?",
  //     text: "Once deleted, you will not be able to recover this data!",
  //     icon: "warning",
  //     buttons: {
  //       confirm: {
  //         text: "Yes",
  //         value: true,
  //         visible: true,
  //         className: "",
  //         closeModal: true,
  //       },
  //       cancel: {
  //         text: "No",
  //         value: null,
  //         visible: true,
  //         className: "",
  //         closeModal: true,
  //       },
  //     },
  //     dangerMode: true,
  //   }).then((allowAction) => {
  //     if (allowAction) {
  //       // deleteApi(rowData);
  //     }
  //   });
  // };

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

            <label>Factory Code *</label>
            <input
              type="text"
              id="FactoryCode"
              name="FactoryCode"
              placeholder="Enter Factory Code"
              class={errorObject.FactoryCode}
              value={currentRow.FactoryCode}
              onChange={(e) => handleChange(e)}
            ></input>

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
          </div>

<div class="pt-10">
<hr ></hr>
     </div>
          <div class="pt-10" style={{"text-align": "right"}}>
            {isLocationList && (<Button label={"ADD Location"} class={"btnAdd"} onClick={addDataLocation} />)}

            {/* <label>Contact Locations</label> */}
            {isLocationList && (
              <CustomTable
                columns={columnListLocation}
                rows={currentRow.Locations ? currentRow.Locations : {}}
                actioncontrol={actioncontrollocation}
                ispagination={false}
              />
            )}

            {!isLocationList && (
              <div class="contactmodalBody pt-10">
                <label>Location *</label>
                <input
                  type="text"
                  id="Location"
                  name="Location"
                  // class={errorObject.Location}
                  placeholder="Enter Location"
                  value={LocationName}
                  onChange={(e) => handleChangeLocation(e)}
                />
            

                <div class="modalItem" style={{"padding-top": "40px"}}>
                  <Button
                    label={"Cancel"}
                    class={"btnClose"}
                    onClick={CloseLocationEdit}
                  />
                  {LocationId && (
                    <Button
                      label={"Update"}
                      class={"btnUpdate"}
                      onClick={addEditLocation}
                    />
                  )}
                  {!LocationId && (
                    <Button
                      label={"Save"}
                      class={"btnSave"}
                      onClick={addEditLocation}
                    />
                  )}
                </div>


              </div>
            )}
          </div>
<div class="pt-10">
<hr ></hr>
     </div>
            <div class="pt-10" style={{"text-align": "right"}}>
            {isContactInfoList && (<Button label={"ADD Contact Information"} class={"btnAdd"} onClick={addDataCOntactInfo} />)}
            {/* <label>Contact Information</label> */}
            {isContactInfoList && (
              <CustomTable
                columns={columnListContactInfo}
                rows={currentRow.ContactInfo ? currentRow.ContactInfo : {}}
                actioncontrol={actioncontrolContactInfo}
                ispagination={false}
              />
            )}

            {!isContactInfoList && (
              <div class="contactmodalBody pt-10">
                <label>Contact Person</label>
                <input
                  type="text"
                  id="ContactPerson"
                  name="ContactPerson"
                  // class={errorObject.ContactPerson}
                  placeholder="Enter Contact Person"
                  value={ContactPerson}
                  onChange={(e) => handleChangeContactInfo(e)}
                />
                <label>Contact Number</label>
                <input
                  type="text"
                  id="ContactNumber"
                  name="ContactNumber"
                  // class={errorObject.ContactNumber}
                  placeholder="Enter Contact Number"
                  value={ContactNumber}
                  onChange={(e) => handleChangeContactInfo(e)}
                />

                <label>Designation</label>
                <input
                  type="text"
                  id="Designation"
                  name="Designation"
                  // class={errorObject.Designation}
                  placeholder="Enter Designation"
                  value={Designation}
                  onChange={(e) => handleChangeContactInfo(e)}
                />

                <label>Email</label>
                <input
                  type="text"
                  id="Email"
                  name="Email"
                  // class={errorObject.Email}
                  placeholder="Enter Email"
                  value={Email}
                  onChange={(e) => handleChangeContactInfo(e)}
                />


                
                <div class="modalItem">
                  <Button
                    label={"Cancel"}
                    class={"btnClose"}
                    onClick={CloseContactInfoEdit}
                  />
                  {ContactInfoId && (
                    <Button
                      label={"Update"}
                      class={"btnUpdate"}
                      onClick={addEditContactInfo}
                    />
                  )}
                  {!ContactInfoId && (
                    <Button
                      label={"Save"}
                      class={"btnSave"}
                      onClick={addEditContactInfo}
                    />
                  )}
                </div>
              </div>
            )}
          </div>








         {isLocationList && isContactInfoList && (<div class="modalItem">
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
          </div>)}



        </div>
      </div>
      {/* <!-- GROUP MODAL END --> */}
    </>
  );
};

export default FactoryAddEditModal;
