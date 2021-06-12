import React, { Component } from "react";
import {
  IoHomeOutline,
  IoLaptopOutline,
  IoPeopleCircleOutline,
  IoLocationOutline,
  IoCalculatorOutline,
} from "react-icons/io5";
import { Link } from "react-router-dom";

class SidebarComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: this.props.selected,
    };
  }
  render() {
    return (
      <React.Fragment>
        <div className="col-sm-0 nopadding d-none d-sm-block">
          <div className="SidePanel fixed-top">
            <div className="SidePanelItemsDiv">
              <Link to="/home" id="NoHoverLink">
                <div
                  className="SidePanelItem"
                  id={
                    this.state.selected === "home"
                      ? "SidePanelItemSelected"
                      : ""
                  }
                >
                  <IoHomeOutline size={40} />

                  <p>Home</p>
                </div>
              </Link>
              <Link to="/projects" id="NoHoverLink">
                <div
                  className="SidePanelItem"
                  id={
                    this.state.selected === "projects"
                      ? "SidePanelItemSelected"
                      : ""
                  }
                >
                  <IoLaptopOutline size={40} />
                  <p>Projects</p>
                </div>
              </Link>
              <Link to="/people" id="NoHoverLink">
                <div
                  className="SidePanelItem"
                  id={
                    this.state.selected === "people"
                      ? "SidePanelItemSelected"
                      : ""
                  }
                >
                  <IoPeopleCircleOutline size={40} />
                  <p>People</p>
                </div>
              </Link>

              <Link to="/visits" id="NoHoverLink">
                <div
                  className="SidePanelItem"
                  id={
                    this.state.selected === "visits"
                      ? "SidePanelItemSelected"
                      : ""
                  }
                >
                  <IoLocationOutline size={40} />
                  <p>Visits</p>
                </div>
              </Link>

              <Link to="/funds" id="NoHoverLink">
                <div
                  className="SidePanelItem"
                  id={
                    this.state.selected === "funds"
                      ? "SidePanelItemSelected"
                      : ""
                  }
                >
                  <IoCalculatorOutline size={40} />
                  <p>Funds</p>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default SidebarComponent;
