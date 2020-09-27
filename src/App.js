import React, { useEffect, useState } from "react";
import axios from "axios";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import List from "@material-ui/core/List";
import Divider from "@material-ui/core/Divider";
import ListItem from "@material-ui/core/ListItem";
import FormLabel from "@material-ui/core/FormLabel";
import FormControl from "@material-ui/core/FormControl";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormHelperText from "@material-ui/core/FormHelperText";
import Checkbox from "@material-ui/core/Checkbox";
import Typography from "@material-ui/core/Typography";
import CssBaseline from "@material-ui/core/CssBaseline";
import { makeStyles } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import Home from "./components/home";
import { Button } from "@material-ui/core";
import _ from "lodash";
import DragSortableList from "react-drag-sortable";
import "./App.css";

let service = axios.create({
  baseURL: "https://my-json-server.typicode.com/guruprasath-s/react-dynobj-app/"
});

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  app: {
    display: "flex"
  },
  toolBar: {
    justifyContent: "center"
  },
  main: {
    padding: theme.spacing(3)
  },
  appBar: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0
  },
  drawerPaper: {
    width: drawerWidth
  },
  toolbar: theme.mixins.toolbar,
  formControl: {
    margin: theme.spacing(3)
  },
  button__cont: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between"
  },
  save__button: {
    margin: theme.spacing(1)
  },
  default__button: {
    margin: theme.spacing(1),
    backgroundColor: "#ccc"
  }
}));

let highKeyObj = {}; //For storing which object has most number of keys
let unSortedHighKeyObj = {};

function App() {
  const classes = useStyles();
  const [businessObj, setBusinessObj] = useState([]); // For maintaining businessObject from API
  const [view, setView] = useState("grid"); // For maintaining default view
  const [viewConfig, setViewConfig] = useState({
    grid: {
      selectedAttr: [],
      attrOrder: [],
      attrOptions: {}
    },
    list: {
      selectedAttr: [],
      attrOrder: [],
      attrOptions: {}
    },
    view: view
  });
  const [listArr, setListArr] = useState([]);
  //Event for checkbox selection
  const handleChange = (event) => {
    setViewConfig({
      ...viewConfig,
      [view]: {
        ...viewConfig[view],
        attrOptions: {
          ...viewConfig[view].attrOptions,
          [event.target.name]: event.target.checked
        }
      }
    });
  };
  //Event for Saving using preference
  const handleConfigSave = () => {
    console.log("saved");
    localStorage.setItem("viewConfig", JSON.stringify(viewConfig));
  };
  useEffect(() => {
    let checkboxOptions = viewConfig[view].attrOptions;
    let selKeys = Object.keys(checkboxOptions).map((key) => {
      if (checkboxOptions[key] === true) {
        return key;
      }
    });
    let selectedAttributes = _.pick(highKeyObj, selKeys);
    setViewConfig({
      ...viewConfig,
      [view]: {
        ...viewConfig[view],
        selectedAttr: [...Object.keys(selectedAttributes)]
      }
    });
    setList();
  }, [viewConfig[view].attrOptions, highKeyObj]);
  useEffect(() => {
    const order = viewConfig[view].attrOrder;
    let sorted;
    if (order.length > 0) {
      let not_sorted = highKeyObj;
      sorted = order.reduce(function (acc, key) {
        acc[key] = not_sorted[key];
        return acc;
      }, {});
      highKeyObj = sorted;
      setList();
    }
  }, [view, viewConfig[view].attrOrder]);
  useEffect(() => {
    service
      .get("/users")
      .then((response) => {
        return response;
      })
      .then((val) => {
        val.data && setBusinessObj(val.data);
        val.data &&
          val.data.reduce((len, obj) => {
            let length = Object.keys(obj).length;
            if (length > len) {
              len = length;
              highKeyObj = obj;
            }
            return len;
          }, 0);
      });
    try {
      const selViewConfig =
        JSON.parse(localStorage.getItem("viewConfig")) || {};
      Object.keys(selViewConfig).length > 0 &&
        setViewConfig({ ...selViewConfig });
      Object.keys(selViewConfig).length > 0 && setView(selViewConfig.view);
    } catch (e) {
      console.log(e);
    }
  }, []);
  useEffect(() => {
    //console.log(viewConfig);
  }, [viewConfig]);
  useEffect(() => {
    businessObj.reduce((len, obj) => {
      let length = Object.keys(obj).length;
      if (length > len) {
        len = length;
        highKeyObj = obj;
        unSortedHighKeyObj = obj;
      }
      return len;
    }, 0);
    setList();
    setDefCheckboxOptions();
  }, [businessObj]);
  useEffect(() => {
    setDefCheckboxOptions();
  }, [view]);
  const setList = () => {
    let list = Object.keys(highKeyObj).map((key, index) => {
      return {
        content: (
          <ListItem key={index}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={
                    viewConfig[view].attrOptions[key] == true ? true : false
                  }
                  onChange={handleChange}
                  name={key}
                />
              }
              label={key}
            />
          </ListItem>
        ),
        classes: [key]
      };
    });
    setListArr(list);
  };
  //Event action when reorder
  const onSort = function (sortedList) {
    setListArr(sortedList);
    let sortedArr = [];
    _.forEach(sortedList, (list) => {
      sortedArr.push(_.toString(list.classes));
    });
    setViewConfig({
      ...viewConfig,
      [view]: {
        ...viewConfig[view],
        attrOrder: [...sortedArr]
      }
    });
  };
  const changeView = (view) => {
    setView(view);
    setViewConfig({
      ...viewConfig,
      view: view
    });
  };
  const setDefCheckboxOptions = () => {
    const checkDefState = Object.keys(highKeyObj).reduce((acc, attr) => {
      return { ...acc, [attr]: true };
    }, {});
    let checkboxOptions = viewConfig[view].attrOptions;
    if (
      Object.keys(checkDefState).length > 0 &&
      Object.keys(checkboxOptions).length == 0
    ) {
      setViewConfig({
        ...viewConfig,
        [view]: {
          ...viewConfig[view],
          attrOptions: {
            ...viewConfig[view].attrOptions,
            ...checkDefState
          },
          attrOrder: [...Object.keys(highKeyObj)]
        }
      });
    }
  };
  const setDefaults = () => {
    const checkDefState = Object.keys(highKeyObj).reduce((acc, attr) => {
      return { ...acc, [attr]: true };
    }, {});
    setViewConfig({
      ...viewConfig,
      [view]: {
        ...viewConfig[view],
        attrOptions: {
          ...viewConfig[view].attrOptions,
          ...checkDefState
        },
        attrOrder: [...Object.keys(unSortedHighKeyObj)]
      }
    });
  };
  return (
    <>
      <CssBaseline />
      <div className={classes.app}>
        <AppBar position="fixed" className={classes.appBar}>
          <Toolbar className={classes.toolBar}>
            <Typography variant="h6">Business Objects</Typography>
          </Toolbar>
        </AppBar>
        <Drawer
          className={classes.drawer}
          variant="permanent"
          classes={{
            paper: classes.drawerPaper
          }}
          anchor="left"
        >
          <div className={classes.toolbar} />
          <Divider />
          <FormControl component="fieldset" className={classes.formControl}>
            <FormLabel component="legend">
              Select attributes to show and drag to order
            </FormLabel>
            <FormGroup>
              <List>
                <DragSortableList
                  items={listArr}
                  moveTransitionDuration={0.3}
                  onSort={onSort}
                  type="vertical"
                ></DragSortableList>
              </List>
            </FormGroup>
            <FormHelperText>
              Please select atleast one to make content visible
            </FormHelperText>
            <div className={classes.button__cont}>
              <Button
                onClick={handleConfigSave}
                variant="contained"
                color="primary"
                className={classes.save__button}
              >
                Save
              </Button>
              <Button
                onClick={setDefaults}
                variant="contained"
                className={classes.default__button}
              >
                Default
              </Button>
            </div>
          </FormControl>
          <Divider />
        </Drawer>
        <main className={classes.main}>
          <div className={classes.toolbar} />
          <Home
            businessObj={businessObj}
            selectedAttr={viewConfig[view].selectedAttr}
            attrOrder={viewConfig[view].attrOrder}
            view={view}
            changeView={changeView}
          />
        </main>
      </div>
    </>
  );
}

export default App;
