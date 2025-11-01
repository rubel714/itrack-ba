import React, { forwardRef, useRef, useEffect, useState } from "react";
import { Button } from "../../../components/CustomControl/Button";
import {
  apiCall,
  apiOption,
  LoginUserInfo,
  language,
} from "../../../actions/api";
import Autocomplete from "@material-ui/lab/Autocomplete";
import ExecuteQueryHook from "../../../components/hooks/ExecuteQueryHook";
import {
  DeleteOutline,
  Edit,
  AddAPhoto,
  PictureAsPdf,
} from "@material-ui/icons";
import {
  Typography,
  Paper,
  Grid,
  Input,
  makeStyles,
  CircularProgress,
} from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "10px",
  },
  paper: {
    padding: theme.spacing(4),
    maxWidth: "100%",
    width: "100%",
  },
}));

const FilesUploadModal = (props) => {
  // console.log("props modal: ", props);
  const serverpage = "coordinatorinput"; // this is .php server page
  const [currentRow, setCurrentRow] = useState(props.currentRow);
  console.log("props.currentRow: ", props.currentRow);
  console.log(
    "props.currentRow.AttachedDocuments: ",
    props.currentRow.AttachedDocuments
  );
  // const [errorObject, setErrorObject] = useState({});
  const UserInfo = LoginUserInfo();
  const classes = useStyles();
  const [loading, setLoading] = useState(false);
  // const [selectedFile, setSelectedFile] = useState(null);
  const [selectedFile, setSelectedFile] = useState(
    props.currentRow.AttachedDocuments
  );

  const handleFileChange = (e) => {
    let file = e.target.files[0];
    let name = file.name;
    let size = file.size;
    let extention = name.split(".").pop();

    console.log("file: ", file);
    console.log("name: ", name);
    console.log("size: ", size);

    if (file) {
      let reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        console.log("selectedFile---: ", selectedFile);

        let obj = {
          name: name,
          extention: extention,
          size: size,
          status: "new",
          file: event.target.result,
        };

        let data;
        // if(selectedFile != '[]'){
        data = selectedFile ? [...selectedFile] : [];
        console.log("data: ", data);

        data.push(obj);
        // }else{
        //   data = obj;
        // }
        console.log("data: ", data);

        setSelectedFile(data);
        // setSelectedFile(event.target.result);
      };
    }
  };

  function handleUpload() {
    console.log("selectedFile: ", selectedFile);
    // return;

    if (selectedFile.length > 0) {
      let params = {
        action: "FilesUpload",
        lan: language(),
        UserId: UserInfo.UserId,
        rowData: selectedFile,
        TransactionId: currentRow.id,
      };

      setLoading(true); //Show loader
      apiCall.post(serverpage, { params }, apiOption()).then((res) => {
        // props.masterProps.openNoticeModal({
        //   isOpen: true,
        //   msg: res.data.message,
        //   msgtype: res.data.success,
        // });

        setLoading(false); //Hide loader
        if (res.data.success === 1) {
          importModalCallback(selectedFile);
        }
      });
    } else {
      props.masterProps.openNoticeModal({
        isOpen: true,
        msg: "Please select file",
        msgtype: 0,
      });
    }
  }

  function importModalCallback(type) {
    props.fileUploadModalCallback(type);
  }

  function deleteFile(file) {
    // selectedFile
    // console.log('file: ', file);

    let result = selectedFile.filter((x) => x.name !== file);
    console.log("result: ", result);
    setSelectedFile(result);
  }
  return (
    <>
      {/* <!-- GROUP MODAL START --> */}
      <div id="groupModal" class="modal">
        {/* <!-- Modal content --> */}
        <div class="modal-content-reportblock">
          <div class="modalHeader">
            <h4>File(s) Upload</h4>
          </div>

          <div class=" pt-10">
            <div className={classes.root}>
              <Paper className={classes.paper} elevation={3}>
                {/* <Typography variant="h5" align="center" gutterBottom>
                  Upload files
                </Typography> */}
                <ul>
                  {selectedFile &&
                    selectedFile.map((obj, index) => (
                      <>
                        <li>
                          {obj.name}
                          <DeleteOutline
                            className={"table-delete-icon"}
                            onClick={() => {
                              deleteFile(obj.name);
                            }}
                          />
                        </li>
                      </>
                    ))}
                </ul>
                <br></br>
                <Input
                  type="file"
                  // multiple
                  onChange={(e) => handleFileChange(e)}
                  fullWidth
                  className={classes.input}
                  inputProps={{
                    style: {
                      height: "100px",
                    },
                  }}
                />

                <Grid container justify="center">
                  {loading && (
                    <div style={{ textAlign: "center", marginTop: "5px" }}>
                      <CircularProgress size={24} />
                    </div>
                  )}

                  <Button
                    disabled={loading}
                    label={"Upload"}
                    class={"btnAdd"}
                    onClick={handleUpload}
                  />
                </Grid>
              </Paper>
            </div>
          </div>

          <div class="modalItem">
            <Button
              label={"Close"}
              class={"btnClose"}
              onClick={() => {
                importModalCallback("Close");
              }}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default FilesUploadModal;
