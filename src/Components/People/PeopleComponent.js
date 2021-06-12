import { Badge, Tooltip, Button, Table, SelectMenu } from "evergreen-ui";
import React, { Component } from "react";
import { IoAddOutline } from "react-icons/io5";
import { Row, Col } from "reactstrap";
import HeaderComponent from "../HeaderComponent";
import SidebarComponent from "../SidebarComponent";

class PeopleComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedFilter: "All",
      filterOptions: ["All", "Admins", "Finance", "Tech"],
    };
  }

  handleFilterChange = (option) => {
    this.setState({
      selectedFilter: option,
    });
  };
  render() {
    return (
      <React.Fragment>
        <div className="container-fluid">
          <div className="row">
            <div className="col-sm-0 nopadding">
              <SidebarComponent selected="people" />
            </div>

            <div className="col-sm-12 nopadding">
              <div className="PageContentMainDiv">
                <div className="PageContentContentDiv">
                  <HeaderComponent />
                  <div className="PageMainDiv">
                    <div className="PageMainDivContent">
                      <h2>
                        <b>People</b>
                      </h2>
                      <div>
                        <Button appearance="primary">Add New</Button>
                      </div>
                      <div style={{ marginTop: "30px" }}>
                        <SelectMenu
                          title="Select name"
                          options={this.state.filterOptions.map((label) => ({
                            label,
                            value: label,
                          }))}
                          selected={this.state.selectedFilter}
                          onSelect={(item) =>
                            this.handleFilterChange(item.value)
                          }
                        >
                          <Button>
                            {this.state.selectedFilter || "Filter people..."}
                          </Button>
                        </SelectMenu>
                      </div>
                      <div className="PeopleTableMainDiv">
                        <Table>
                          <Table.Head>
                            <Table.SearchHeaderCell />

                            <Table.TextHeaderCell>Role</Table.TextHeaderCell>
                          </Table.Head>
                          <Table.Body height={240}>
                            <Table.Row isSelectable>
                              <Table.TextCell>Surya</Table.TextCell>
                              <Table.TextCell>Admin</Table.TextCell>
                            </Table.Row>
                          </Table.Body>
                        </Table>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default PeopleComponent;
