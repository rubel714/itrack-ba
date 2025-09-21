import React, { forwardRef, useRef, useContext, useEffect } from "react";
import swal from "sweetalert";
import { DeleteOutline, Edit, ViewList } from "@material-ui/icons";

import { Button } from "../../../components/CustomControl/Button";
import moment from "moment";

import {
  Typography,
  TextField,
} from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";

import CustomTable from "components/CustomTable/CustomTable";
import {
  apiCall,
  apiOption,
  LoginUserInfo,
  language,
} from "../../../actions/api";
import ExecuteQueryHook from "../../../components/hooks/ExecuteQueryHook";

const TeamMemberAssign = (props) => {
  const serverpage = "TeamMemberAssign"; // this is .php server page
  const permissionType = props.permissionType;
  const { useState } = React;
  const [bFirst, setBFirst] = useState(true);
  const [listEditPanelToggle, setListEditPanelToggle] = useState(true); //when true then show list, when false then show add/edit

  const [teamList, setTeamList] = useState([]);
  const [currTeamId, setCurrTeamId] = useState(0);
  // const [defaultTeam, setDefaultTeam] = useState(null);//{ id: 1, name: "Team 1" }

  // const [currentDate, setCurrentDate] = useState(
  //   moment().format("YYYY-MM-DD")
  // );


  const { isLoading, data: dataList, error, ExecuteQuery } = ExecuteQueryHook(); //Fetch data master list


  const UserInfo = LoginUserInfo();

    /* =====Start of Excel Export Code==== */
    const EXCEL_EXPORT_URL = process.env.REACT_APP_API_URL;

    // const PrintPDFExcelExportFunction = () => {
    //   let finalUrl = EXCEL_EXPORT_URL + "report/print_pdf_excel_server.php";

    //   let curRoleName = teamList.filter((obj)=> obj.id==currTeamId);

    //   window.open(
    //     finalUrl +
    //       "?action=RoleToMenuPermissionExport" +
    //       "&reportType=excel" +
    //       "&TeamId=" + currTeamId +   
    //       "&RoleName=" + curRoleName[0].name +   
    //       "&TimeStamp=" +
    //       Date.now()
    //   );
    // };
    /* =====End of Excel Export Code==== */
  

  /**Get data for table list */
  function getDataList(currTeamId) {
    let params = {
      action: "getDataList",
      lan: language(),
      UserId: UserInfo.UserId,
      TeamId: currTeamId,     
  
    };
    // console.log('LoginUserInfo params: ', params);

    ExecuteQuery(serverpage, params);
  }

  if (bFirst) {
    /**First time call for datalist */
   
    setBFirst(false);
    getTeamList();
  }


  function getTeamList() {
    let params = {
      action: "getTeamList",
      lan: language(),
      UserId: UserInfo.UserId
    };

    apiCall.post("combo_generic", { params }, apiOption()).then((res) => {

      // console.log(res.data.datalist);
     /*  setTeamList(
        [{ id: "", name: "Select a Role" }].concat(res.data.datalist)
      ); */

      setTeamList(res.data.datalist); 
      // console.log('res.data.datalist: ', res.data.datalist);
      // console.log('res.data.datalist: ', res.data.datalist[0]);
      // setDefaultTeam(res.data.datalist[0]);
      getDataList(currTeamId);

    });
  }

  const masterColumnList = [
    { field: "PermissionType", label: "PermissionType", visible: false, align: "center" },
    { field: "rownumber", label: "SL", align: "center", width: "5%" },
    // { field: 'SL', label: 'SL',width:'10%',align:'center',visible:true,sort:false,filter:false },
    {
      field: "custom",
      label: "Assign",
      width: "5%",
      align: "center",
      visible: true,
      // sort: false,
      // filter: false,
    },
    {
      field: "MemberName",
      label: "Member Name",
      width: "25%",
      align: "left",
      visible: true,
      sort: true,
      filter: true,
    },
    {
      field: "MemberCode",
      label: "Member Code",
      width: "15%",
      align: "left",
      visible: true,
      sort: true,
      filter: true,
    },
    {
      field: "Email",
      label: "Email",
      width: "10%",
      align: "left",
      visible: true,
      sort: true,
      filter: true,
    },
    {
      field: "PhoneNo",
      label: "Phone No",
      width: "10%",
      align: "left",
      visible: true,
      sort: true,
      filter: true,
    },
    {
      field: "Address",
      label: "Address",
      width: "30%",
      align: "left",
      visible: true,
      sort: true,
      filter: true,
    },

  ];

  /** Action from table row buttons*/
  function actioncontrolmaster(rowData) {

    return (
      <>
      
        {rowData.IsAssigned === 0 && (
          <span
          //className={"table-edit-icon"}
          className={"table-delete-icon clickable font-bold"}
          onClick={() => {
            assignData(rowData);
          }}
        >
          No
        </span>
          // <Edit
          //   className={"table-edit-icon"}
          //   onClick={() => {
          //     assignData(rowData);
          //   }}
          // />
        )}

        {rowData.IsAssigned === 1 && (
           <span
           className={"table-view-icon clickable font-bold"}
           onClick={() => {
            assignData(rowData);
           }}
         >
           Yes
         </span>
          // <DeleteOutline
          //   className={"table-delete-icon"}
          //   onClick={() => {
          //     deleteData(rowData);
          //   }}
          // />
        )}

  

      </>
    );
  }
  

  const assignData = (rowData) => {
    if(permissionType !== 0){
      /**when permissionType=0 then EDIT otherwise VIEW*/
      return;
    }
   
    if(!currTeamId){

      props.openNoticeModal({
        isOpen: true,
        msg: "Please, Select a Team First",
        msgtype: 0,
      });

      return;
    }

    assignApi(rowData);
  };

  function assignApi(rowData) {

    let params = {
      action: "assignData",
      lan: language(),
      UserId: UserInfo.UserId,
      TeamId: currTeamId,
      rowData: rowData,
    };

    apiCall.post(serverpage, { params }, apiOption()).then((res) => {
      props.openNoticeModal({
        isOpen: true,
        msg: res.data.message,
        msgtype: res.data.success,
      });
      getDataList(currTeamId);
    });
  }

 
  const handleChangeChoosenMany = (name, value) => {
    setCurrTeamId(value);
    getDataList(value);
  };

  return (
    <>
      <div class="bodyContainer">
        <div class="topHeader">
          <h4>
            Home ❯ Basic Setup ❯ Team Member Assign
          </h4>
        </div>

        {listEditPanelToggle && (
          <>
        
            <div class="searchAdd">
              {/* <input type="text" placeholder="Search Product Group"/> */}
              {/* <button
                onClick={() => {
                  addData();
                }}
                className="btnAdd"
              >
                ADD
              </button> */}
               <div>
              <label>Team:</label>
              </div>

              <div class="formControl-filter">
               
                  {/* <label>Role:</label> */}
              
                {/* <div class="plusGroup"> */}
                <div class="">
                  <Autocomplete
                    autoHighlight
                    // freeSolo
                    disableClearable
                    className="chosen_dropdown"
                    id="TeamId"
                    name="TeamId"
                    autoComplete
                    options={teamList ? teamList : []}
                    getOptionLabel={(option) => option.name}
                    // defaultValue={defaultTeam}
                    defaultValue={{id:0,name:"Select Team"}}
                  
                    // defaultValue={teamList?teamList[0]:""}
                    onChange={(event, valueobj) =>
                      handleChangeChoosenMany(
                        "TeamId",
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
              </div>
             

          {/* <Button label={"ADD"} class={"btnAdd"} onClick={addData} /> */}
          {/* <Button label={"Export"} class={"btnPrint"} onClick={PrintPDFExcelExportFunction} /> */}

            </div>


            {/* <!-- ####---Master invoice list---####s --> */}
             {/* <div class="subContainer tableHeight">
              <div className="App"> */}
                <CustomTable
                  columns={masterColumnList}
                  rows={dataList ? dataList : {}}
                  actioncontrol={actioncontrolmaster}
                  ispagination={false}
                />
              {/* </div>
            </div>  */}
          </>
        )}

        
      </div>
    </>
  );
};

export default TeamMemberAssign;