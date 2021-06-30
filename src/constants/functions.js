import Cookies from "universal-cookie/es6";

export const logOutUser = () => {
  // Sign-out successful.
  new Cookies().remove("userDetails");
  new Cookies().remove("userToken");
  window.location.href = "/login";
};

export const validateLogin = new Promise((resolve, reject) => {
  var userInfo = new Cookies().get("userDetails");
  if (userInfo === undefined) {
    reject("Error");
  } else {
    resolve("Success");
  }
});

// Return random color
var colors = [
  "#FFCDD2",
  "#F8BBD0",
  "#E1BEE7",
  "#D1C4E9",
  "#C5CAE9",
  "#BBDEFB",
  "#B3E5FC",
  "#B2EBF2",
  "#B2DFDB",
  "#C8E6C9",
  "#DCEDC8",
];
export const generateRandomColor = () => {
  var item = colors[Math.floor(Math.random() * colors.length)];
  return item;
};
