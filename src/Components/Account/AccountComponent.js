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
import { passwordRegex } from "../../constants/regexValues";

class AccountComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cookies: new Cookies(),
      userDetails: "",

      //
      password: "",
      confirm_password: "",

      change_password_clicked: false,
      password_error: false,
    };
    this.handleInputChange = this.handleInputChange.bind(this);
  }

  handleInputChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    if (name === "confirm_password") {
      if (value !== this.state.password) {
        this.setState({
          password_error: true,
        });
      }
      if (value === this.state.password) {
        this.setState({
          password_error: false,
        });
      }
    }

    this.setState({
      [name]: value,
    });
  }

  componentDidMount() {
    var userDetails = this.state.cookies.get("userDetails");
    this.setState({
      userDetails: userDetails,
    });
  }

  resetPassword = () => {
    this.setState({
      change_password_clicked: true,
    });
    if (this.state.password_error) {
      toaster.danger("Passwords doesn't match.");
      this.setState({
        change_password_clicked: false,
      });
      return;
    }
    if (
      this.state.password.trim().length === 0 ||
      this.state.confirm_password.trim().length === 0
    ) {
      toaster.danger("Please enter all the fields");
      this.setState({
        change_password_clicked: false,
      });
      return;
    }
    if (!this.state.password.match(passwordRegex)) {
      toaster.danger("Password is not in required format.");
      this.setState({
        change_password_clicked: false,
      });
      return;
    }
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
      email: this.state.cookies.get("userDetails").email,
      password: this.state.password,
    });

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    fetch(SERVER_URL + "/users/resetpassword", requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        if (result.success) {
          toaster.success("Password updated successfully");
          this.setState({
            password: "",
            confirm_password: "",
            change_password_clicked: false,
            password_error: false,
          });
        } else {
          toaster.danger("Something went wrong. Please try again.");
        }
      })
      .catch((error) => console.log("error", error));
  };
  render() {
    return (
      <React.Fragment>
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
                        <b>Account Settings</b>
                      </h2>
                      <div style={{ marginTop: "20px" }}>
                        <h6>Change Password: </h6>
                        <p style={{ fontSize: "12px" }}>Password should: </p>
                        <ul style={{ fontSize: "12px" }}>
                          <li>Contain minimum 8 characters.</li>
                          <li>At least one uppercase letter</li>
                          <li>One lowercase letter</li>
                          <li>One digit</li>
                          <li>One special character</li>
                        </ul>
                        <br />
                        <TextInput
                          type="password"
                          name="password"
                          placeholder="New Password"
                          value={this.state.password}
                          onChange={this.handleInputChange}
                        />
                        <br />
                        <br />
                        <TextInput
                          type="password"
                          name="confirm_password"
                          placeholder="Confirm New Password"
                          value={this.state.confirm_password}
                          onChange={this.handleInputChange}
                        />
                        <br />
                        {this.state.password_error && (
                          <p style={{ color: "red", fontSize: "12px" }}>
                            Passwords doesn't match
                          </p>
                        )}
                        <br />

                        <Button
                          appearance="primary"
                          isLoading={this.state.change_password_clicked}
                          onClick={this.resetPassword}
                        >
                          Update
                        </Button>
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

export default AccountComponent;
