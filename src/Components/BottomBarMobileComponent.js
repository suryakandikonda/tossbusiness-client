import React, { Component } from "react";
import {
  IoHomeOutline,
  IoLaptopOutline,
  IoPeopleCircleOutline,
  IoLocationOutline,
  IoCalculatorOutline,
  IoStatsChartOutline,
  IoEllipsisHorizontalCircleOutline,
} from "react-icons/io5";
import { Col, Container, Row } from "reactstrap";
import { Nav, NavItem } from "reactstrap";

import { Link } from "react-router-dom";
import { NavLink } from "react-router-dom";

class BottomBarMobileComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: this.props.selected,
      tabs: [
        {
          route: "/dashboard",
          icon: <IoStatsChartOutline />,
          label: "Dashboard",
          name: "dashboard",
        },
        {
          route: "/projects",
          icon: <IoLaptopOutline />,
          label: "Projects",
          name: "projects",
        },
        {
          route: "/people",
          icon: <IoPeopleCircleOutline />,
          label: "People",
          name: "people",
        },
        {
          route: "/people",
          icon: <IoEllipsisHorizontalCircleOutline />,
          label: "More",
          name: "more",
        },
      ],
    };
  }
  render() {
    return (
      <React.Fragment>
        {/* <Container fluid>
          <div className="BottomBarMobileMainDiv w-100">
            <Row>
              <Col sm xs>
                <div className="BottomBarMobileItem">
                  <IoHomeOutline size={30} />
                  <h6>Home</h6>
                </div>
              </Col>
              <Col sm xs>
                <div className="BottomBarMobileItem">
                  <IoHomeOutline size={30} />
                  <h6>Home</h6>
                </div>
              </Col>
              <Col sm xs>
                <div className="BottomBarMobileItem">
                  <IoHomeOutline size={30} />
                  <h6>Home</h6>
                </div>
              </Col>
              <Col sm xs>
                <div className="BottomBarMobileItem">
                  <IoHomeOutline size={30} />
                  <h6>Home</h6>
                </div>
              </Col>
              <Col sm xs>
                <div className="BottomBarMobileItem">
                  <IoHomeOutline size={30} />
                  <h6>Home</h6>
                </div>
              </Col>
            </Row>
          </div>
        </Container> */}
        <nav
          className="navbar fixed-bottom navbar-light bottom-tab-nav"
          role="navigation"
        >
          <Nav className="w-100">
            <div className=" d-flex flex-row justify-content-around w-100">
              {this.state.tabs.map((tab, index) => (
                <div key={`tab-${index}`}>
                  <Link
                    to={tab.route}
                    className="nav-link bottom-nav-link"
                    id="NoHoverLink"
                  >
                    <div
                      className="row d-flex flex-column justify-content-center align-items-center"
                      id={
                        tab.name === this.state.selected
                          ? "BottomBarItemSelected"
                          : ""
                      }
                    >
                      {tab.icon}
                      <div className="bottom-tab-label">{tab.label}</div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </Nav>
        </nav>
      </React.Fragment>
    );
  }
}

export default BottomBarMobileComponent;
