import {
  Badge,
  Tooltip,
  Button,
  Table,
  SelectMenu,
  Dialog,
  TextInput,
  RadioGroup,
  toaster,
  Textarea,
  TrashIcon,
} from "evergreen-ui";
import { get, set } from "idb-keyval";
import moment from "moment";
import React, { Component } from "react";
import { BlockPicker, GithubPicker, SketchPicker } from "react-color";
import { IoAddOutline } from "react-icons/io5";
import { Row, Col, Container } from "reactstrap";
import Cookies from "universal-cookie/es6";
import { SERVER_URL } from "../../constants/variables";
import HeaderComponent from "../HeaderComponent";
import SidebarComponent from "../SidebarComponent";
import BottomBarMobileComponent from "../BottomBarMobileComponent";

class NotesComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cookies: new Cookies(),
      userDetails: "",

      //
      create_first_clicked: false,

      //
      title: "",
      description: "",
      textColor: "black",
      textBackgroundColor: "#ffffff",

      //
      Notes: [],
    };
    this.handleInputChange = this.handleInputChange.bind(this);
  }

  deleteAllNotes = () => {
    set("Notes" + this.state.userDetails._id, [])
      .then(() => {
        toaster.success("Everything is cleared");
        this.setState({ Notes: [] });
      })
      .catch(() => toaster.danger("Something went wrong"));
  };

  deleteNotes = (id) => {
    get("Notes" + this.state.userDetails._id).then((val) => {
      var Arr = [];
      Object.values(val).forEach((item) => {
        if (Number(item.id) !== Number(id)) {
          Arr.push(item);
        }
      });
      set("Notes" + this.state.userDetails._id, Arr);

      toaster.success("A Note has been deleted");

      this.setState({
        Notes: Arr,
      });
    });
  };

  createNotes = () => {
    var newNotes = {
      id: Date.now(),
      created_at: new Date(),
      description: this.state.description,
      textColor: this.state.textColor,
      textBackgroundColor: this.state.textBackgroundColor,
    };
    get("Notes" + this.state.userDetails._id).then((Arr) => {
      var oldNotes = Arr;

      oldNotes[newNotes.id] = newNotes;
      set("Notes" + this.state.userDetails._id, oldNotes);
      this.handleAddDialogClose();
    });
  };

  handleInputChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    this.setState({
      [name]: value,
    });
  }

  handleAddDialogOpen = () => {
    this.setState({
      create_first_clicked: true,
    });
  };

  handleAddDialogClose = () => {
    this.setState({
      title: "",
      description: "",
      textColor: "black",
      textBackgroundColor: "white",
      create_first_clicked: false,
    });
    this.getNotes();
  };

  handleTextColorChange = (color) => {
    this.setState({ textColor: color.hex });
    console.log("color", color.hex);
  };

  handleTextBackgroundColorChange = (color) => {
    this.setState({ textBackgroundColor: color.hex });
    console.log("background", color.hex);
  };

  getNotes = () => {
    get("Notes" + this.state.cookies.get("userDetails")._id).then((val) => {
      console.log(val);
      if (val === undefined) {
        this.setState({ Notes: [] });
      } else {
        var Arr = [];
        Object.values(val).forEach((item) => Arr.push(item));
        this.setState({
          Notes: Arr,
        });
      }
    });
  };

  componentDidMount() {
    var userDetails = this.state.cookies.get("userDetails");
    this.getNotes();
    this.setState({
      userDetails: userDetails,
    });
  }
  render() {
    return (
      <React.Fragment>
        <Dialog
          isShown={this.state.create_first_clicked}
          title="Create Notes"
          confirmLabel="Create"
          onCloseComplete={this.handleAddDialogClose}
          onConfirm={this.createNotes}
        >
          <div>
            <textarea
              placeholder="Description"
              name="description"
              className="CreateNotesTextArea"
              onChange={this.handleInputChange}
              value={this.state.description}
              width="100%"
              style={{
                backgroundColor: this.state.textBackgroundColor,
                color: this.state.textColor,
              }}
            />

            <p>Text Color: </p>
            <GithubPicker
              color={this.state.textColor}
              onChangeComplete={this.handleTextColorChange}
            />
            <br />
            <p>Background Color:</p>
            <GithubPicker
              color={this.state.textBackgroundColor}
              onChangeComplete={this.handleTextBackgroundColorChange}
            />
          </div>
        </Dialog>
        <div className="container-fluid">
          <div className="row">
            <div className="col-sm-0 nopadding">
              <SidebarComponent />
            </div>

            <div className="col-sm-12 nopadding">
              <div className="PageContentMainDiv">
                <div className="PageContentContentDiv">
                  <HeaderComponent />
                  <div className="PageMainDiv">
                    <div className="PageMainDivContent">
                      <h2>
                        <b>Notes</b>
                      </h2>
                      <Button
                        appearance="primary"
                        onClick={this.handleAddDialogOpen}
                      >
                        Create New Notes
                      </Button>

                      <Button
                        onClick={this.deleteAllNotes}
                        intent="danger"
                        iconBefore={TrashIcon}
                        marginLeft={10}
                      >
                        Delete all
                      </Button>

                      <div className="NotesItemsMainDiv">
                        <div>
                          <Row>
                            {this.state.Notes.reverse().map((item) => (
                              <Col
                                sm="3"
                                className="NotesItem"
                                style={{
                                  backgroundColor: item.textBackgroundColor,
                                  color: item.textColor,
                                }}
                              >
                                <div>
                                  <p style={{ fontSize: "12px" }}>
                                    <span>
                                      {moment(item.created_at).format(
                                        "DD MMM, YYYY"
                                      )}
                                    </span>
                                    <span style={{ float: "right" }}>
                                      <TrashIcon
                                        onClick={() =>
                                          this.deleteNotes(item.id)
                                        }
                                        style={{ cursor: "pointer" }}
                                      />
                                    </span>
                                  </p>
                                  <br />
                                  <p
                                    style={{
                                      textAlign: "center",
                                      whiteSpace: "no-wrap",
                                    }}
                                  >
                                    {item.description}
                                  </p>
                                  <br />
                                </div>
                              </Col>
                            ))}
                          </Row>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="d-block d-sm-none">
          <BottomBarMobileComponent />
        </div>
      </React.Fragment>
    );
  }
}

export default NotesComponent;
