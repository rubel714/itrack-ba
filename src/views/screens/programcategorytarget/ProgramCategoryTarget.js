import React, { useRef, useEffect } from "react";
import {
  apiCall,
  apiOption,
  LoginUserInfo,
  language,
} from "../../../actions/api";

import { Button } from "../../../components/CustomControl/Button";
import moment from "moment";
import "../../../assets/css/audit.css";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { Typography, TextField } from "@material-ui/core";

import "react-tabulator/lib/styles.css";
import "react-tabulator/lib/css/tabulator.min.css";
import { ReactTabulator } from "react-tabulator";

const ProgramCategoryTarget = (props) => {
  const serverpage = "programcategorytarget";
  const tableRef = useRef(null);

  const { useState } = React;
  const [bFirst, setBFirst] = useState(true);
  const [dataList, setDataList] = useState([]);

  const UserInfo = LoginUserInfo();

  const [YearList, setYearList] = useState([]);
  const [MonthList, setMonthList] = useState([]);

  const [currYearName, setCurrYearName] = useState(Number(moment().format("YYYY")));
  const [currMonthId, setCurrMonthId] = useState(parseInt(moment().format("M"), 10));

  useEffect(() => {
    getYearList();
    getMonthList();
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

  const columnList = [
    {
      field: "rownumber",
      title: "SL",
      hozAlign: "center",
      width: "60",
      formatter: "rownum",
    },
    {
      field: "ProgramCategoryName",
      title: "Program Category",
      hozAlign: "left",
      width: "220",
      editable: false,
    },
    {
      field: "ReCertification",
      title: "Re-Certification",
      hozAlign: "right",
      width: "260",
      editor: "number",
      editorParams: { min: 0, step: 1 },
      formatter: (cell) => cell.getValue(),
      cellEdited: function (cell) {
        const row = cell.getRow();
        const reCert = parseFloat(row.getData().ReCertification ?? 0) || 0;
        const newCert = parseFloat(row.getData().NewCertification ?? 0) || 0;
        row.getCell("TotalCertification").setValue(reCert + newCert);
      },
    },
    {
      field: "NewCertification",
      title: "New Certification",
      hozAlign: "right",
      width: "260",
      editor: "number",
      editorParams: { min: 0, step: 1 },
      formatter: (cell) => cell.getValue(),
      cellEdited: function (cell) {
        const row = cell.getRow();
        const reCert = parseFloat(row.getData().ReCertification ?? 0) || 0;
        const newCert = parseFloat(row.getData().NewCertification ?? 0) || 0;
        row.getCell("TotalCertification").setValue(reCert + newCert);
      },
    },
    {
      field: "TotalCertification",
      title: "Total Certification",
      hozAlign: "right",
      width: "150",
      formatter: (cell) => parseFloat(cell.getValue() ?? 0).toFixed(0),
      editable: false,
      mutator: (value, data) => {
        const reCert = parseFloat(data.ReCertification ?? 0) || 0;
        const newCert = parseFloat(data.NewCertification ?? 0) || 0;
        return reCert + newCert;
      },
    },
  ];

  if (bFirst) {
    getDataList();
    setBFirst(false);
  }

  useEffect(() => {
    if (currYearName && currMonthId) {
      getDataList();
    }
  }, [currYearName, currMonthId]);

  function getDataList() {
    let params = {
      action: "getDataList",
      lan: language(),
      UserId: UserInfo.UserId,
      YearId: Number(currYearName),
      MonthId: Number(currMonthId),
    };

    apiCall.post(serverpage, { params }, apiOption()).then((res) => {
      setDataList(res.data.datalist || []);
    });
  }

  const handleChangeYear = (event, valueobj) => {
    if (valueobj) {
      setCurrYearName(Number(valueobj.id));
    }
  };

  const handleChangeMonth = (event, valueobj) => {
    if (valueobj) {
      setCurrMonthId(valueobj.id);
    }
  };

  const normalizeTargetValue = (value) => {
    if (value === null || value === undefined || value === "") {
      return null;
    }

    const numericValue = Number(value);
    return Number.isFinite(numericValue) && numericValue === 0 ? null : value;
  };

  const saveTargets = () => {
    const tableData = tableRef.current ? tableRef.current.table.getData() : dataList;
    const normalizedTargets = (tableData || []).map((row) => ({
      ...row,
      ReCertification: normalizeTargetValue(row.ReCertification),
      NewCertification: normalizeTargetValue(row.NewCertification),
      TotalCertification: normalizeTargetValue(row.TotalCertification),
    }));

    let params = {
      action: "saveTargets",
      lan: language(),
      UserId: UserInfo.UserId,
      YearId: Number(currYearName),
      MonthId: Number(currMonthId),
      targets: normalizedTargets,
    };

    apiCall.post(serverpage, { params }, apiOption()).then((res) => {
      props.openNoticeModal({
        isOpen: true,
        msg: res.data.message,
        msgtype: res.data.success,
      });

      if (res.data.success === 1) {
        getDataList();
      }
    });
  };

  return (
    <>
      <div class="bodyContainer">
        <div class="topHeader">
          <h4>Home ❯ Settings ❯ Assign Program Category wise Target</h4>
        </div>

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
              value={YearList.find((item) => Number(item.id) === Number(currYearName)) || null}
              onChange={handleChangeYear}
              renderOption={(option) => (
                <Typography className="chosen_dropdown_font">{option.name}</Typography>
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
              value={MonthList.find((item) => item.id === currMonthId) || null}
              onChange={handleChangeMonth}
              renderOption={(option) => (
                <Typography className="chosen_dropdown_font">{option.name}</Typography>
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

          <Button label={"Save Targets"} class={"btnAdd"} onClick={saveTargets} />
        </div>

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

export default ProgramCategoryTarget;
