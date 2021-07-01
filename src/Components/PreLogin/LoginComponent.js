import { Button, TextInput, toaster, Dialog } from "evergreen-ui";
import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Col, Container, Row } from "reactstrap";

import LoginImage from "../../assets/login.jpg";
import { SERVER_URL } from "../../constants/variables";
import PreLoginHeader from "../PreLoginHeader";

import Cookies from "universal-cookie";
import { get, set } from "idb-keyval";

class LoginComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",

      //
      login_clicked: false,
      cookies: new Cookies(),

      //
      verify_email_first_clicked: false,
      verify_email_second_clicked: false,
      email_verify_string: "",
    };
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleEmailVerificationOpen = () => {
    this.setState({
      verify_email_first_clicked: true,
    });
  };

  handleEmailVerificationClose = () => {
    this.setState({
      verify_email_first_clicked: false,
      verify_email_second_clicked: false,
      email_verify_string: "",
    });
  };

  handleInputChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    console.log(value);
    this.setState({
      [name]: value,
    });
  }

  handleSubmit(e) {
    this.setState({
      login_clicked: true,
    });
    this.loginUser({
      username: this.state.email,
      password: this.state.password,
    });
  }

  loginUser = (creds) => {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify(creds);

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    fetch(SERVER_URL + "/users/login", requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        if (result.success) {
          toaster.success("Login Success");
          this.state.cookies.set("userToken", result.token);
          this.state.cookies.set("userDetails", result.user);
          this.setState({
            login_clicked: false,
          });
          get("Notes" + result.user._id).then((val) => {
            if (val === undefined) {
              set("Notes" + result.user._id, []);
            }
            window.location.href = "/projects";
          });
        } else if (result.message === "Email not verified") {
          this.setState({
            login_clicked: false,
          });
          toaster.danger("Verify your email to continue");
        } else if (result.message === "Blocked") {
          this.setState({
            login_clicked: false,
          });
          toaster.danger("Your account is blocked. Please contact admin.");
        } else {
          this.setState({
            login_clicked: false,
          });
          toaster.danger("Invalid Login Credentials");
        }
      })
      .catch((error) => {
        console.log("error", error);
        this.setState({
          login_clicked: false,
        });
        toaster.danger("Couldn't Login. Please try again.");
      });
  };

  verifyEmailAPI = () => {
    this.setState({
      verify_email_second_clicked: true,
    });
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
      verify_id: this.state.email_verify_string,
    });

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    fetch(SERVER_URL + "/users/verification/email", requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        if (result.success) {
          toaster.success("Email verification successful");
          this.handleEmailVerificationClose();
        } else {
          toaster.danger("Invalid verification code");
          this.setState({
            verify_email_second_clicked: false,
          });
        }
      })
      .catch((error) => console.log("error", error));
  };

  render() {
    return (
      <React.Fragment>
        {/* Email Verification Dialog */}
        <Dialog
          isShown={this.state.verify_email_first_clicked}
          title="Email Verification"
          onCloseComplete={this.handleEmailVerificationClose}
          confirmLabel="Verify"
          onConfirm={this.verifyEmailAPI}
          isConfirmLoading={this.state.verify_email_second_clicked}
        >
          <div>
            <p>Enter 6 digit verification code you received on your email.</p>
            <br />
            <br />
            <TextInput
              autoFocus
              name="email_verify_string"
              placeholder="Enter Verification Code here"
              value={this.state.email_verify_string}
              onChange={this.handleInputChange}
            />
          </div>
        </Dialog>
        <PreLoginHeader />
        <Container>
          <Row>
            <Col sm className="d-none d-sm-block" className="d-none d-sm-block">
              <div>
                <img
                  src={LoginImage}
                  alt="LoginImage"
                  className="img-fluid"
                  style={{ marginTop: "40px" }}
                />
              </div>
            </Col>
            <Col sm>
              <div className="LoginMainDiv">
                <h1>Login</h1>
                <div className="LoginFormDiv">
                  <TextInput
                    type="email"
                    name="email"
                    placeholder="Email address"
                    onChange={this.handleInputChange}
                  />
                  <br />
                  <br />
                  <TextInput
                    type="password"
                    name="password"
                    placeholder="Password"
                    onChange={this.handleInputChange}
                  />
                  <br />
                  <br />
                  <Button
                    appearance="primary"
                    isLoading={this.state.login_clicked}
                    onClick={this.handleSubmit}
                  >
                    Signin
                  </Button>
                </div>
                <div style={{ marginTop: "50px" }}>
                  <h6>
                    Not a member? <Link to="/register">Register</Link>
                  </h6>
                  <h6>
                    <Link to="/signup/client">
                      Click here to register as client
                    </Link>
                  </h6>
                </div>
                <div style={{ marginTop: "20px" }}>
                  <Button onClick={this.handleEmailVerificationOpen}>
                    Email Verification
                  </Button>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </React.Fragment>
    );
  }
}

export default LoginComponent;
