import { Button, Checkbox, Dialog, TextInput, toaster } from "evergreen-ui";
import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Col, Container, Row } from "reactstrap";

import LoginImage from "../../assets/login.jpg";
import { SERVER_URL } from "../../constants/variables";
import PreLoginHeader from "../PreLoginHeader";

class RegisterComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      first_name: "",
      last_name: "",
      email: "",
      mobile_number: "",
      password: "",
      company_name: "",

      terms_agreed: false,

      //
      login_clicked: false,
      verify_clicked: false,
      verifyDialogOpen: false,
      verify_id: "",
    };
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleVerifyDialogOpen = () => {
    this.setState({
      verifyDialogOpen: true,
    });
  };

  handleVerifyDialogClose = () => {
    this.setState({
      verifyDialogOpen: false,
    });
  };

  handleInputChange(event) {
    const target = event.target;
    var value = target.value;
    const name = target.name;

    this.setState({
      [name]: value,
    });
  }

  verifyEmail = () => {
    this.setState({
      verify_clicked: true,
    });
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
      verify_id: this.state.verify_id,
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
        if (!result.success) {
          toaster.danger("Invalid OTP. Please try again.");
          this.setState({
            verify_clicked: false,
          });
        } else if (result.success) {
          toaster.success("Email verification successful");
          this.setState({
            verify_clicked: false,
          });
          window.location.href = "/login";
        }
      })
      .catch((error) => {
        console.log("error", error);
        toaster.danger("Something went wrong");
        this.setState({
          verify_clicked: false,
        });
      });
  };

  handleSubmit(e) {
    this.setState({
      login_clicked: true,
    });

    if (
      this.state.first_name.trim().length === 0 ||
      this.state.last_name.trim().length === 0
    ) {
      toaster.danger("Please enter all required fields");
      this.setState({
        login_clicked: false,
      });
      return;
    }
    if (!this.state.terms_agreed) {
      toaster.danger("Please accept Terms and Conditions to continue");
      this.setState({
        login_clicked: false,
      });
      return;
    }

    this.registerUser({
      password: this.state.password,
      email: this.state.email,
      first_name: this.state.first_name,
      last_name: this.state.last_name,
      company_name: this.state.company_name,
      mobile_number: this.state.mobile_number,
      role_id: 1,
    });
  }

  registerUser(creds) {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify(creds);

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    fetch(SERVER_URL + "/users/signup", requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        if (!result.success) {
          toaster.warning("User with given email already exists.");
          this.setState({
            login_clicked: false,
          });
        } else if (result.success) {
          toaster.success("Registration Success");
          this.setState({
            verifyDialogOpen: true,
            login_clicked: false,
            first_name: "",
            last_name: "",
            mobile_number: "",
            password: "",
            company_name: "",
            terms_agreed: false,
          });
        }
      })
      .catch((error) => {
        console.log("error", error);
        toaster.danger("Something went wrong");
        this.setState({
          login_clicked: false,
        });
      });
  }
  render() {
    return (
      <React.Fragment>
        <PreLoginHeader />
        <Dialog
          isShown={this.state.verifyDialogOpen}
          title="Email Verification"
          onCloseComplete={this.verifyEmail}
          confirmLabel="OK"
        >
          <div>
            <p>
              We have sent an email with 6 digit OTP to your email address (
              {this.state.email}). Please enter the OTP to verify your email.
              You can do this later too.
            </p>
            <br />
            <TextInput
              name="verify_id"
              placeholder="Enter 6 digit OTP here"
              onChange={this.handleInputChange}
            />
          </div>
        </Dialog>
        <Container>
          <Row>
            <Col sm className="d-none d-sm-block">
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
              <div className="SignupMainDiv">
                <h1>Register</h1>
                <p>
                  Many companies like yours use TOSS to manage their flow of
                  work. Not only this, gain new clients through our listing.
                </p>
                <div className="LoginFormDiv">
                  <TextInput
                    name="first_name"
                    placeholder="First Name *"
                    onChange={this.handleInputChange}
                  />
                  <br />
                  <br />
                  <TextInput
                    name="last_name"
                    placeholder="Last Name *"
                    onChange={this.handleInputChange}
                  />
                  <br />
                  <br />
                  <TextInput
                    type="email"
                    name="email"
                    placeholder="Email address *"
                    onChange={this.handleInputChange}
                  />
                  <br />
                  <br />
                  <TextInput
                    name="mobile_number"
                    placeholder="Mobile Number *"
                    onChange={this.handleInputChange}
                  />
                  <br />
                  <br />
                  <TextInput
                    type="password"
                    name="password"
                    placeholder="Password *"
                    onChange={this.handleInputChange}
                  />
                  <br />
                  <br />
                  <TextInput
                    name="company_name"
                    placeholder="Company Name *"
                    onChange={this.handleInputChange}
                  />
                  <Checkbox
                    label="I agree to Terms and Conditions"
                    checked={this.state.terms_agreed}
                    onChange={(e) =>
                      this.setState({
                        terms_agreed: e.target.checked,
                      })
                    }
                  />

                  <Button
                    appearance="primary"
                    isLoading={this.state.login_clicked}
                    onClick={this.handleSubmit}
                  >
                    Signup
                  </Button>
                </div>
                <div style={{ marginTop: "30px", marginBottom: "30px" }}>
                  <p>
                    Already have a account? <Link to="/login">Login</Link>
                  </p>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </React.Fragment>
    );
  }
}

export default RegisterComponent;
