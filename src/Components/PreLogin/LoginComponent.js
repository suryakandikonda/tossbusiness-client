import { Button, TextInput, toaster } from "evergreen-ui";
import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Col, Container, Row } from "reactstrap";

import LoginImage from "../../assets/login.jpg";
import { SERVER_URL } from "../../constants/variables";
import PreLoginHeader from "../PreLoginHeader";

import Cookies from "universal-cookie";

class LoginComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",

      //
      login_clicked: false,
      cookies: new Cookies(),
    };
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

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
          if (result.user.company !== null) window.location.href = "/projects";
          else toaster.notify("Client page coming soon");
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
  render() {
    return (
      <React.Fragment>
        <PreLoginHeader />
        <Container>
          <Row>
            <Col sm>
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
