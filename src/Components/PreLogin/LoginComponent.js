import { Button, TextInput, toaster, Dialog } from "evergreen-ui";
import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Col, Container, Row } from "reactstrap";

import LoginImage from "../../assets/login.jpg";
import { SERVER_URL } from "../../constants/variables";
import PreLoginHeader from "../PreLoginHeader";

import Cookies from "universal-cookie";
import { get, set } from "idb-keyval";
import { emailRegex, otpRegex } from "../../constants/regexValues";

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

      //
      send_email_clicked: false,
      email_verify: "",

      forgot_password_clicked: false,
    };
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleForgotPasswordOpen = () => {
    this.setState({
      forgot_password_clicked: true,
    });
  };

  handleForgotPasswordClose = () => {
    this.setState({
      forgot_password_clicked: false,
      email_verify: "",
    });
  };

  handleSendMailOpen = () => {
    this.setState({
      verify_email_first_clicked: false,
      verify_email_second_clicked: false,
      email_verify_string: "",
      send_email_clicked: true,
    });
  };

  handleSendMailClose = () => {
    this.setState({
      send_email_clicked: false,
      email_verify: "",
      verify_email_first_clicked: true,
    });
  };

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
    if (
      this.state.email.trim().length === 0 ||
      this.state.password.trim().length === 0
    ) {
      toaster.danger("Please enter both email and password");
      this.setState({
        login_clicked: false,
      });
      return;
    }
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
    if (this.state.email_verify_string.trim().length === 0) {
      toaster.danger("Please Enter OTP");
      return;
    }
    if (!this.state.email_verify_string.match(otpRegex)) {
      toaster.danger("OTP will be only numeric");
      return;
    }
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

  sendEmail = () => {
    if (this.state.email_verify.trim().length === 0) {
      toaster.danger("Please enter email address");
      return;
    }
    if (!this.state.email_verify.match(emailRegex)) {
      toaster.danger("Please enter valid email address");
      return;
    }
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
      email: this.state.email_verify,
    });

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    fetch(SERVER_URL + "/users/sendemailverification", requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        if (result.success) {
          toaster.success("OTP sent your email.");
          this.handleSendMailClose();
        } else {
          toaster.danger("Given email not associated with any account.");
        }
      })
      .catch((error) => console.log("error", error));
  };

  forgotPasswordAPI = () => {
    if (this.state.email_verify.trim().length === 0) {
      toaster.danger("Please enter email address");
      return;
    }
    if (!this.state.email_verify.match(emailRegex)) {
      toaster.danger("Please enter valid email address");
      return;
    }
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
      email: this.state.email_verify,
    });

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    fetch(SERVER_URL + "/users/forgotpassword", requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        if (result.success) {
          toaster.success("New Password sent to your email successfully");
          this.handleForgotPasswordClose();
        } else {
          toaster.danger("Given email not associated with any account.");
        }
      })
      .catch((error) => console.log("error", error));
  };

  render() {
    return (
      <React.Fragment>
        {/* Forgot Password Dialog */}
        <Dialog
          isShown={this.state.forgot_password_clicked}
          title="Forgot Password?"
          onCloseComplete={this.handleForgotPasswordClose}
          confirmLabel="Confirm"
          onConfirm={this.forgotPasswordAPI}
        >
          <div>
            <p>
              Enter the email you used while registering. You will get email
              with new password.
            </p>
            <br />
            <br />
            <TextInput
              autoFocus
              name="email_verify"
              placeholder="Enter email"
              value={this.state.email_verify}
              onChange={this.handleInputChange}
            />
          </div>
        </Dialog>

        {/* Send Mail */}
        <Dialog
          isShown={this.state.send_email_clicked}
          title="Send Verification Email"
          onCloseComplete={this.handleSendMailClose}
          confirmLabel="Send"
          onConfirm={this.sendEmail}
        >
          <div>
            <p>Enter the email you used while registering.</p>
            <br />
            <br />
            <TextInput
              autoFocus
              name="email_verify"
              placeholder="Enter email"
              value={this.state.email_verify}
              onChange={this.handleInputChange}
            />
          </div>
        </Dialog>
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
            <p
              style={{ cursor: "pointer" }}
              onClick={() => this.handleSendMailOpen()}
            >
              <b>Click here to send email verification again.</b>
            </p>
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
                  <div style={{ fontSize: "12px" }}>
                    <p onClick={this.handleForgotPasswordOpen}>
                      Forgot Password?
                    </p>
                  </div>
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
