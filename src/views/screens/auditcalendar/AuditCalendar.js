import React, { forwardRef, useRef, useEffect } from "react";
import swal from "sweetalert";
import {
  DeleteOutline,
  Edit,
  AddAPhoto,
  PictureAsPdf,
} from "@material-ui/icons";
import { Button } from "../../../components/CustomControl/Button";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { Typography, TextField } from "@material-ui/core";
import CustomTable from "components/CustomTable/CustomTable";
import {
  apiCall,
  apiCallReport,
  apiOption,
  LoginUserInfo,
  language,
} from "../../../actions/api";
import ExecuteQueryHook from "../../../components/hooks/ExecuteQueryHook";
import moment from "moment";
import "../../../assets/css/audit.css";

import {
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Checkbox,
  ListItemText,
} from "@material-ui/core";
// react-tabulator
import "react-tabulator/lib/styles.css"; // required styles
import "react-tabulator/lib/css/tabulator.min.css"; // theme
import { ReactTabulator, reactFormatter } from "react-tabulator";

const AuditCalendar = (props) => {
  const serverpage = "auditcalendar"; // this is .php server page

  const { useState } = React;
  const [bFirst, setBFirst] = useState(true);
  const [currentRow, setCurrentRow] = useState([]);
  // const [toggle, setToggle] = useState(true); //true=show tabel, false= show add/edit form

  // const [errorObject, setErrorObject] = useState({});
  const UserInfo = LoginUserInfo();

  const [ProgramList, setProgramList] = useState(null);
  const [currProgramId, setCurrProgramId] = useState(null);

  const [AuditorList, setAuditorList] = useState(null);
  const [currReportWriterId, setCurrReportWriterId] = useState(null);

  const [StartDate, setStartDate] = useState(moment().format("YYYY-MM-DD"));
  const [EndDate, setEndDate] = useState(
    moment().add(30, "days").format("YYYY-MM-DD")
  );

  const [columnList, setColumnList] = useState([]); // Table column list

  // handleChangeWidthHeight
  const { isLoading, data: dataList, error, ExecuteQuery } = ExecuteQueryHook(); //Fetch data
  // const UserInfo = LoginUserInfo();
  const [selectedDate, setSelectedDate] = useState(
    //new Date()
    moment().format("YYYY-MM-DD")
  );

  /* =====Start of Excel Export Code==== */
  const EXCEL_EXPORT_URL = process.env.REACT_APP_API_URL;

  const PrintPDFExcelExportFunction = (reportType) => {
    let finalUrl = EXCEL_EXPORT_URL + "report/print_pdf_excel_server.php";

    window.open(
      finalUrl +
        "?action=CoordinatorInputExport" +
        "&reportType=excel" +
        "&StartDate=" +
        StartDate +
        "&EndDate=" +
        EndDate +
        "&TimeStamp=" +
        Date.now()
    );
  };
  /* =====End of Excel Export Code==== */

  const handleChangeFilterDate = (e) => {
    const { name, value } = e.target;
    if (name === "StartDate") {
      setStartDate(value);
    }

    if (name === "EndDate") {
      setEndDate(value);
    }
  };

  React.useEffect(() => {
    // getProgramList("");
    // getAuditorList("");
  }, []);

  // function getProgramList(selectProgramId) {
  //   let params = {
  //     action: "ProgramList",
  //     lan: language(),
  //     UserId: UserInfo.UserId,
  //   };

  //   apiCall.post("combo_generic", { params }, apiOption()).then((res) => {
  //     setProgramList(
  //       [{ id: "", name: "Select Program" }].concat(res.data.datalist)
  //     );

  //     setCurrProgramId(selectProgramId);
  //   });
  // }

  // function getAuditorList(selectReportWriterId) {
  //   let params = {
  //     action: "getAuditorList",
  //     lan: language(),
  //     UserId: UserInfo.UserId,
  //   };

  //   apiCall.post("combo_generic", { params }, apiOption()).then((res) => {
  //     setAuditorList(
  //       [{ id: "", name: "Select" }].concat(res.data.datalist)
  //     );

  //     setCurrReportWriterId(selectReportWriterId);
  //   });
  // }

  if (bFirst) {
    /**First time call for datalist */
    createColumnList();
    getDataList();
    setBFirst(false);
  }

  useEffect(() => {
    createColumnList();
    getDataList();
  }, [StartDate, EndDate]);

  function createColumnList() {

    /**Get column for table */
    // let params = {
    //   action: "getDataList",
    //   lan: language(),
    //   UserId: UserInfo.UserId,
    //   StartDate: StartDate,
    //   EndDate: EndDate,
    // };

    // ExecuteQuery(serverpage, params);
  
    // setColumnList([
    //   { field: "rownumber", label: "SL", align: "center", width: "3%" },
    //   {
    //     field: "Year",
    //     label: "Year",
    //     align: "left",
    //     visible: true,
    //     sort: true,
    //     filter: true,
    //     width: "5%",
    //   },
    //   {
    //     field: "MonthName",
    //     label: "Month",
    //     align: "left",
    //     visible: true,
    //     sort: true,
    //     filter: true,
    //     width: "10%",
    //   },
    //   {
    //     field: "ProgramName",
    //     label: "Program",
    //     align: "left",
    //     visible: true,
    //     sort: true,
    //     filter: true,
    //     width: "7%",
    //   },
    //   {
    //     field: "ExpireDate",
    //     label: "Expire Date",
    //     align: "left",
    //     visible: true,
    //     sort: true,
    //     filter: true,
    //     width: "7%",
    //   },
    // ]);
  }


  /**Get data for table list */
  function getDataList() {
    let params = {
      action: "getDataList",
      lan: language(),
      UserId: UserInfo.UserId,
      StartDate: StartDate,
      EndDate: EndDate,
    };

    ExecuteQuery(serverpage, params);
  }

  return (
    <>
      <div class="bodyContainer">
        {/* <!-- ######-----TOP HEADER-----####### --> */}
        <div class="topHeader">
          <h4>Home ❯ Reports ❯ Audit Calendar</h4>
        </div>

        {/* <!-- TABLE SEARCH AND GROUP ADD --> */}
        <div class="searchAdd">
          <div>
            <label>Start Date</label>
            <div class="">
              <input
                type="date"
                id="StartDate"
                name="StartDate"
                value={StartDate}
                onChange={(e) => handleChangeFilterDate(e)}
              />
            </div>
          </div>

          <div>
            <label>End Date</label>
            <div class="">
              <input
                type="date"
                id="EndDate"
                name="EndDate"
                value={EndDate}
                onChange={(e) => handleChangeFilterDate(e)}
              />
            </div>
          </div>
        </div>

        {/* <!-- ####---THIS CLASS IS USE FOR TABLE GRID---####s --> */}

       {/*  <CustomTable
          columns={dataList.column ? dataList.column : []}
          rows={dataList.data ? dataList.data : {}}
          ispagination={false}
        />*/}

        
                  <ReactTabulator 
          data={dataList.data ? dataList.data : []}
          columns={dataList.column ? dataList.column : []}
  height="600px"
  layout="fitData"
  
           />

      </div>
      {/* <!-- BODY CONTAINER END --> */}
    </>
  );
};

export default AuditCalendar;
