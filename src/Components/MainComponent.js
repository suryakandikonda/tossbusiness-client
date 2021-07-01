import React, { Component } from "react";
import { Redirect, Route, Switch } from "react-router";
import DashboardComponent from "./Dashboard/DashboardComponent";
import NotesComponent from "./Notes/NotesComponent";
import PeopleComponent from "./People/PeopleComponent";
import LoginComponent from "./PreLogin/LoginComponent";
import RegisterComponent from "./PreLogin/RegisterComponent";
import ProjectsComponent from "./Projects/ProjectsComponent";
import ViewProjectComponent from "./Projects/ViewProjectComponent";
import VisitsComponent from "./Visits/VisitsComponent";
import BottomBarMobileComponent from "./BottomBarMobileComponent";
import HomeComponent from "./HomeComponent";
import ClientProjectsComponent from "./Projects/ClientProjectsComponent";
import ReportsComponent from "./Reports/ReportsComponent";
import PostsComponent from "./Posts/PostsComponent";

class MainComponent extends Component {
  render() {
    return (
      <React.Fragment>
        <Switch>
          {/* Home */}
          <Route path="/home" component={HomeComponent} />
          <Route path="/login" component={LoginComponent} />
          <Route path="/register" component={RegisterComponent} />
          {/* Home */}
          <Route path="/dashboard" component={DashboardComponent} />

          {/* Projects */}
          <Route path="/projects" component={ProjectsComponent} />
          <Route path="/clientprojects" component={ClientProjectsComponent} />

          <Route
            exact
            path="/project/:id"
            render={(routerProps) => (
              <ViewProjectComponent match={routerProps.match} />
            )}
          />

          <Route
            exact
            path="/report/:id"
            render={(routerProps) => (
              <ReportsComponent match={routerProps.match} />
            )}
          />

          {/* People */}
          <Route path="/people" component={PeopleComponent} />

          {/* Visits */}
          <Route path="/visits" component={VisitsComponent} />

          {/* Notes */}
          <Route path="/notes" component={NotesComponent} />

          {/* Posts */}
          <Route path="/posts" component={PostsComponent} />

          <Redirect to="/login" />
        </Switch>
      </React.Fragment>
    );
  }
}

export default MainComponent;
