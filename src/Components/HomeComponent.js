import React, { Component } from "react";

import PreLoginHeader from "./PreLoginHeader";

import HomeBack from "../assets/homeback.jpg";

import TossLogo from "../assets/TossLogo.png";
import { Container, Row, Col } from "reactstrap";
import { TextInput, Select } from "evergreen-ui";
import { projectCategories } from "../constants/projectCategories";

class HomeComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      //
      ratingOptions: ["5", "4", "3", "2", "1"],

      name: "",
      location: "",
      category: "All",
      rating: "All",
    };
  }
  render() {
    return (
      <React.Fragment>
        <div>
          <PreLoginHeader />
        </div>

        <div className="HomeMainDiv">
          <div className="HomeBackImage"></div>
          <Container>
            <div className="HomeDiv">
              <div style={{ textAlign: "center" }}>
                <img src={TossLogo} style={{ width: "200px" }} />
                <h6>Find the best company for your project.</h6>
              </div>

              <div style={{ textAlign: "center", marginTop: "40px" }}>
                <p>Filters: </p>
                <Row>
                  <Col sm style={{ marginTop: "20px" }}>
                    <div>
                      <TextInput placeholder="Company Name" />
                    </div>
                  </Col>

                  <Col sm style={{ marginTop: "20px" }}>
                    <div>
                      <TextInput placeholder="Location" />
                    </div>
                  </Col>
                  <Col sm style={{ marginTop: "20px" }}>
                    <div>
                      <Select
                        defaultValue={this.state.category}
                        width="95%"
                        value={this.state.category}
                        onChange={(event) => {
                          this.setState({ category: event.target.value });
                        }}
                      >
                        <option value="All">All</option>
                        {projectCategories.map((item) => (
                          <option value={item}>{item}</option>
                        ))}
                      </Select>
                    </div>
                  </Col>
                  <Col sm style={{ marginTop: "20px" }}>
                    <div>
                      <Select
                        placeholder="Rating"
                        width="95%"
                        value={this.state.rating}
                        onChange={(event) => {
                          this.setState({ rating: event.target.value });
                        }}
                      >
                        <option value="All">All</option>
                        {this.state.ratingOptions.map((item) => (
                          <option value={item}>{item}</option>
                        ))}
                      </Select>
                    </div>
                  </Col>
                </Row>
              </div>
            </div>
          </Container>
        </div>
      </React.Fragment>
    );
  }
}

export default HomeComponent;
