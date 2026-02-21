import React, { forwardRef, useRef, useEffect } from "react";
import {
  apiCall,
  apiOption,
  LoginUserInfo,
  language,
} from "../../../actions/api";

import { Button } from "../../../components/CustomControl/Button";
import ExecuteQueryHook from "../../../components/hooks/ExecuteQueryHook";
import moment from "moment";
import "../../../assets/css/audit.css";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { Typography, TextField } from "@material-ui/core";

// react-tabulator
import "react-tabulator/lib/styles.css";
import "react-tabulator/lib/css/tabulator.min.css";
import { ReactTabulator } from "react-tabulator";

const MemberTarget = (props) => {
  const serverpage = "membertarget"; // this is .php server page
  const tableRef = useRef(null);

  const { useState } = React;
  const [bFirst, setBFirst] = useState(true);
  const [dataList, setDataList] = useState([]);

  const UserInfo = LoginUserInfo();

  // Year and Month state
  const [YearList, setYearList] = useState([]);
  const [MonthList, setMonthList] = useState([]);
  const [DepartmentList, setDepartmentList] = useState([]);

  const [currYearName, setCurrYearName] = useState(moment().format("YYYY"));
  const [currMonthId, setCurrMonthId] = useState(parseInt(moment().format("M")));
  const [currDepartmentId, setCurrDepartmentId] = useState(63); // 63 = BA-Sales

  // Load year and month dropdowns on mount
  useEffect(() => {
    getYearList();
    getMonthList();
    getDepartmentList();
  }, []);

  function getYearList() {
    let params = {
      action: "YearList",
      lan: language(),
      UserId: UserInfo.UserId,
    };

    apiCall.post("combo_generic", { params }, apiOption()).then((res) => {
      setYearList(res.data.datalist || []);
    });
  }

  function getMonthList() {
    let params = {
      action: "MonthList",
      lan: language(),
      UserId: UserInfo.UserId,
    };

    apiCall.post("combo_generic", { params }, apiOption()).then((res) => {
      setMonthList(res.data.datalist || []);
    });
  }

  function getDepartmentList() {
    let params = {
      action: "DepartmentList",
      lan: language(),
      UserId: UserInfo.UserId,
    };

    apiCall.post("combo_generic", { params }, apiOption()).then((res) => {
      setDepartmentList(res.data.datalist || []);
    });
  }

  const columnList = [
    {
      field: "rownumber",
      title: "SL",
      hozAlign: "center",
      width: "60",
      formatter: "rownum",
    },
    {
      field: "MemberName",
      title: "Member Name",
      hozAlign: "left",
      width: "200",
    },
    {
      field: "OnSiteTarget",
      title: "OnSite Target",
      hozAlign: "right",
      width: "150",
      editor: "number",
      editorParams: {
        min: 0,
        step: 1,
      },
      formatter: function (cell) {
        return cell.getValue();// parseFloat(cell.getValue() || 0).toFixed(0);
      },
    },
    {
      field: "OffSiteTarget",
      title: "OffSite Target",
      hozAlign: "right",
      width: "150",
      editor: "number",
      editorParams: {
        min: 0,
        step: 1,
      },
      formatter: function (cell) {
        return cell.getValue();// parseFloat(cell.getValue() || 0).toFixed(0);
      },
    },
    {
      field: "RevenueTarget",
      title: "Revenue Target",
      hozAlign: "right",
      width: "150",
      editor: "number",
      editorParams: {
        min: 0,
        step: 1,
      },
      formatter: function (cell) {
        return cell.getValue();// parseFloat(cell.getValue() || 0).toFixed(0);
      },
    },
  ];

  if (bFirst) {
    getDataList();
    setBFirst(false);
  }

  useEffect(() => {
    if (currYearName && currMonthId && currDepartmentId) {
      getDataList();
    }
  }, [currYearName, currMonthId, currDepartmentId]);

  function getDataList() {
    let params = {
      action: "getDataList",
      lan: language(),
      UserId: UserInfo.UserId,
      YearName: currYearName,
      MonthId: currMonthId,
      DepartmentId: currDepartmentId,
    };

    apiCall.post(serverpage, { params }, apiOption()).then((res) => {
      setDataList(res.data.datalist || []);
    });
  }

  const handleChangeYear = (event, valueobj) => {
    if (valueobj) {
      setCurrYearName(valueobj.id);
    }
  };

  const handleChangeMonth = (event, valueobj) => {
    if (valueobj) {
      setCurrMonthId(valueobj.id);
    }
  };
  
    const handleChangeDepartment = (event, valueobj) => {
    if (valueobj) {
      setCurrDepartmentId(valueobj.id);
    }
  };
  
  const saveTargets = () => {
    // Get data from tabulator
    const tableData = tableRef.current ? tableRef.current.table.getData() : dataList;

    let params = {
      action: "saveTargets",
      lan: language(),
      UserId: UserInfo.UserId,
      YearName: currYearName,
      MonthId: currMonthId,
      targets: tableData,
    };

    apiCall.post(serverpage, { params }, apiOption()).then((res) => {
      props.openNoticeModal({
        isOpen: true,
        msg: res.data.message,
        msgtype: res.data.success,
      });

      if (res.data.success === 1) {
        getDataList(); // Refresh to get updated MemberTargetIds
      }
    });
  };

  return (
    <>
      <div class="bodyContainer">
        {/* <!-- TOP HEADER --> */}
        <div class="topHeader">
          <h4>Home ❯ Settings ❯ Assign Member wise Target</h4>
        </div>

        {/* <!-- FILTER SECTION --> */}
        <div class="searchAdd">
          <div>
            <label>Year</label>
            <Autocomplete
              autoHighlight
              disableClearable
              className="chosen_dropdown"
              id="YearName"
              name="YearName"
              autoComplete
              options={YearList}
              getOptionLabel={(option) => option.name || ""}
              value={
                YearList.find((item) => item.id == currYearName) || null
              }
              onChange={handleChangeYear}
              renderOption={(option) => (
                <Typography className="chosen_dropdown_font">
                  {option.name}
                </Typography>
              )}
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="standard"
                  placeholder="Select Year"
                  fullWidth
                />
              )}
              style={{ width: 150 }}
            />
          </div>

          <div>
            <label>Month</label>
            <Autocomplete
              autoHighlight
              disableClearable
              className="chosen_dropdown"
              id="MonthId"
              name="MonthId"
              autoComplete
              options={MonthList}
              getOptionLabel={(option) => option.name || ""}
              value={
                MonthList.find((item) => item.id === currMonthId) || null
              }
              onChange={handleChangeMonth}
              renderOption={(option) => (
                <Typography className="chosen_dropdown_font">
                  {option.name}
                </Typography>
              )}
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="standard"
                  placeholder="Select Month"
                  fullWidth
                />
              )}
              style={{ width: 150 }}
            />
          </div>

  <div>
            <label>Department</label>
            <Autocomplete
              autoHighlight
              disableClearable
              className="chosen_dropdown"
              id="DepartmentId"
              name="DepartmentId"
              disabled={true}
              autoComplete
              options={DepartmentList}
              getOptionLabel={(option) => option.name || ""}
              value={
                DepartmentList.find((item) => item.id === currDepartmentId) || null
              }
              onChange={handleChangeDepartment}
              renderOption={(option) => (
                <Typography className="chosen_dropdown_font">
                  {option.name}
                </Typography>
              )}
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="standard"
                  placeholder="Select Department"
                  fullWidth
                />
              )}
              style={{ width: 150 }}
            />
          </div>

          <Button
            label={"Save Targets"}
            class={"btnAdd"}
            onClick={saveTargets}
          />
        </div>

        {/* <!-- TABLE --> */}
        <div>
          <ReactTabulator
            ref={tableRef}
            data={dataList}
            columns={columnList}
            height="600px"
            layout="fitData"
          />
        </div>
      </div>
    </>
  );
};

export default MemberTarget;
