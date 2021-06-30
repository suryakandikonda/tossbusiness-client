import {
  Badge,
  Tooltip,
  Button,
  Table,
  SelectMenu,
  Dialog,
  TextInput,
  RadioGroup,
  toaster,
  Textarea,
  TrashIcon,
} from "evergreen-ui";
import { get, set } from "idb-keyval";
import moment from "moment";
import React, { Component } from "react";
import { BlockPicker, GithubPicker, SketchPicker } from "react-color";
import { IoAddOutline, IoHeartOutline, IoHeart } from "react-icons/io5";
import { Row, Col, Container } from "reactstrap";
import Cookies from "universal-cookie/es6";
import { SERVER_URL } from "../../constants/variables";
import HeaderComponent from "../HeaderComponent";
import SidebarComponent from "../SidebarComponent";
import BottomBarMobileComponent from "../BottomBarMobileComponent";

class PostsComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cookies: new Cookies(),
      userDetails: "",
      isLoading: true,
      posts: [],

      //
      create_first_clicked: false,

      //
      description: "",
      image: "",
    };
    this.handleInputChange = this.handleInputChange.bind(this);
  }

  convertImage = () => {
    const file = document.querySelector("input[type=file").files[0];
    const reader = new FileReader();

    reader.addEventListener(
      "load",
      () => {
        console.log("Base64:: " + reader.result);
        this.setState({
          image: reader.result.toString(),
        });
      },
      false
    );

    if (file) {
      reader.readAsDataURL(file);
    }
  };

  handleInputChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    this.setState({
      [name]: value,
    });
  }

  handleAddDialogOpen = () => {
    this.setState({
      create_first_clicked: true,
    });
  };

  handleAddDialogClose = () => {
    this.setState({
      description: "",
      image: "",
      create_first_clicked: false,
    });
    this.getPosts();
  };

  getPosts = () => {
    var myHeaders = new Headers();
    myHeaders.append("company", this.state.cookies.get("userDetails").company);
    myHeaders.append("Content-Type", "application/json");

    var requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    fetch(SERVER_URL + "/post/get", requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        if (result.success) {
          this.setState({
            posts: result.data,
            isLoading: false,
          });
        }
      })
      .catch((error) => console.log("error", error));
  };

  createPostAPI = () => {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
      company: this.state.cookies.get("userDetails").company,
      description: this.state.description,
      posted_by: this.state.cookies.get("userDetails")._id,
      image: this.state.image,
    });

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    fetch(SERVER_URL + "/post/create", requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        if (result.success) {
          toaster.success("Post Created Successfully");
          this.handleAddDialogClose();
        } else {
          toaster.danger("Something went wrong. Please try again.");
        }
      })
      .catch((error) => console.log("error", error));
  };

  checkIsLiked = (likedBy) => {
    if (likedBy.includes(this.state.cookies.get("userDetails")._id)) {
      return true;
    } else {
      return false;
    }
  };

  likePostAPI = (post) => {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
      post: post,
      liked_by_id: this.state.cookies.get("userDetails")._id,
    });

    var requestOptions = {
      method: "PUT",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    fetch(SERVER_URL + "/post/like", requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        if (result.success) {
          this.getPosts();
        }
      })
      .catch((error) => console.log("error", error));
  };

  componentDidMount() {
    var userDetails = this.state.cookies.get("userDetails");
    this.getPosts();

    this.setState({
      userDetails: userDetails,
    });
  }
  render() {
    if (this.state.isLoading) {
      return (
        <React.Fragment>
          <h1>Loading..</h1>
        </React.Fragment>
      );
    }
    return (
      <React.Fragment>
        <Dialog
          isShown={this.state.create_first_clicked}
          title="Create New Post"
          confirmLabel="Create"
          onCloseComplete={this.handleAddDialogClose}
          onConfirm={this.createPostAPI}
        >
          <div>
            <textarea
              placeholder="Write something.. "
              name="description"
              className="CreatePostTextArea"
              onChange={this.handleInputChange}
              value={this.state.description}
              width="100%"
              style={{
                backgroundColor: this.state.textBackgroundColor,
                color: this.state.textColor,
              }}
            />
            <br />
            <p>Upload image: </p>

            <input type="file" accept="image/*" onChange={this.convertImage} />
          </div>
        </Dialog>
        <div className="container-fluid">
          <div className="row">
            <div className="col-sm-0 nopadding">
              <SidebarComponent />
            </div>

            <div className="col-sm-12 nopadding">
              <div className="PageContentMainDiv">
                <div className="PageContentContentDiv">
                  <HeaderComponent />
                  <div className="PageMainDiv">
                    <div className="PageMainDivContent">
                      <h2>
                        <b>Posts</b>
                      </h2>
                      <Button
                        appearance="primary"
                        onClick={this.handleAddDialogOpen}
                      >
                        Create new Post
                      </Button>

                      <div className="PostsMainDiv">
                        <Container>
                          <Row>
                            <Col sm="2" className="d-none d-sm-block"></Col>
                            <Col sm xs>
                              <div className="PostsItemsMainDiv">
                                {this.state.posts.length > 0 &&
                                  this.state.posts.reverse().map((post) => (
                                    <div className="PostsItemDiv">
                                      <p>
                                        <b>
                                          Posted by: {post.posted_by.first_name}
                                        </b>
                                      </p>
                                      <p style={{ fontSize: "12px" }}>
                                        {moment(post.createdAt).format(
                                          "DD MMM, YY, h:mm A"
                                        )}
                                      </p>
                                      <hr />
                                      {post.description}
                                      {post.image !== "" && (
                                        <img
                                          src={post.image}
                                          className="img-fluid"
                                        />
                                      )}
                                      <hr />
                                      <div>
                                        <h6>
                                          <span>
                                            {this.checkIsLiked(
                                              post.liked_by
                                            ) ? (
                                              <IoHeart
                                                size={24}
                                                style={{ color: "red" }}
                                              />
                                            ) : (
                                              <IoHeartOutline
                                                size={24}
                                                onClick={() =>
                                                  this.likePostAPI(post._id)
                                                }
                                              />
                                            )}
                                          </span>
                                          <span style={{ marginLeft: "10px" }}>
                                            Liked by {post.liked_by.length}{" "}
                                            people
                                          </span>
                                        </h6>
                                      </div>
                                    </div>
                                  ))}
                              </div>
                            </Col>
                            <Col sm="2" className="d-none d-sm-block"></Col>
                          </Row>
                        </Container>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="d-block d-sm-none">
          <BottomBarMobileComponent />
        </div>
      </React.Fragment>
    );
  }
}

export default PostsComponent;
