import React, { Component } from "react";
import {
  Button,
  EditIcon,
  ManualIcon,
  ManuallyEnteredDataIcon,
  Paragraph,
  RemoveColumnLeftIcon,
  RemoveIcon,
  Tooltip,
  TrashIcon,
  SideSheet,
  Dialog,
  Badge,
  AddIcon,
  TextInput,
  Textarea,
  SelectMenu,
  toaster,
  PeopleIcon,
  StopIcon,
  RadioGroup,
  Select,
  StarEmptyIcon,
  StarIcon,
  LogOutIcon,
} from "evergreen-ui";
import {
  IoHomeOutline,
  IoLaptopOutline,
  IoPeopleCircleOutline,
  IoLocationOutline,
  IoCalculatorOutline,
  IoStatsChartOutline,
  IoEllipsisHorizontalCircleOutline,
  IoDocumentTextOutline,
  IoNewspaperOutline,
  IoCartOutline,
} from "react-icons/io5";
import { Col, Container, Row } from "reactstrap";
import { Nav, NavItem } from "reactstrap";

import { Link } from "react-router-dom";
import { NavLink } from "react-router-dom";
import { logOutUser } from "../constants/functions";

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

      //
      more_clicked: false,
    };
  }

  handleMoreClickedOpen = () => {
    this.setState({
      more_clicked: true,
    });
  };

  handleMoreClickedClose = () => {
    this.setState({
      more_clicked: false,
    });
  };
  render() {
    return (
      <React.Fragment>
        {/* More Dialog */}
        <Dialog
          isShown={this.state.more_clicked}
          hasFooter={false}
          onCloseComplete={this.handleMoreClickedClose}
        >
          <div>
            {/* <div className="HeaderProfileIconItem">
              <h4>
                <span>
                  <PersonIcon size={28} />
                </span>
                <span style={{ marginLeft: "20px" }}>Profile</span>
              </h4>
            </div> */}

            <Link to="/inventory" id="NoHoverLink">
              <div className="HeaderProfileIconItem">
                <h4>
                  <span>
                    <IoCartOutline size={28} />
                  </span>
                  <span style={{ marginLeft: "20px" }}>Inventory</span>
                </h4>
              </div>
            </Link>

            <Link to="/notes" id="NoHoverLink">
              <div className="HeaderProfileIconItem">
                <h4>
                  <span>
                    <IoDocumentTextOutline size={28} />
                  </span>
                  <span style={{ marginLeft: "20px" }}>Notes</span>
                </h4>
              </div>
            </Link>

            <Link to="/posts" id="NoHoverLink">
              <div className="HeaderProfileIconItem">
                <h4>
                  <span>
                    <IoNewspaperOutline size={28} />
                  </span>
                  <span style={{ marginLeft: "20px" }}>Posts</span>
                </h4>
              </div>
            </Link>
          </div>
        </Dialog>

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
              {this.state.tabs.map((tab, index) =>
                tab.name !== "more" ? (
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
                ) : (
                  <div
                    key={`tab-${index}`}
                    onClick={this.handleMoreClickedOpen}
                  >
                    <div className="nav-link bottom-nav-link" id="NoHoverLink">
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
                    </div>
                  </div>
                )
              )}
            </div>
          </Nav>
        </nav>
      </React.Fragment>
    );
  }
}

export default BottomBarMobileComponent;
