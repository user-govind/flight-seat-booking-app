import axios from "axios";
import { useState, useEffect } from "react";
import SweetAlert from "react-bootstrap-sweetalert/dist/components/SweetAlert";

import Swal from "sweetalert2";
import { Link, Navigate, useNavigate } from "react-router-dom";
import Navbars from "./navbar";
import Captcha from "./captch";

function Register() {
  let navigate = useNavigate();
  const initialValues = {
    fName: "",
    lName: "",
    email: "",
    mobNo: "",
    password: "",
  };
  const [formValues, setFormValues] = useState(initialValues);
  const [formErrors, setFormErrors] = useState({});
  const [isSubmit, setIsSubmit] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let c = JSON.stringify(sessionStorage.getItem("ok"));
    console.log(c);
    setFormErrors(validate(formValues));

    console.log(formErrors);

    if (
      formErrors.email != null ||
      formErrors.fName != null ||
      formErrors.lname != null ||
      formErrors.mobNo != null ||
      formErrors.password != null
    ) {
      console.log("set is false");
      setIsSubmit(false);
    } else {
      setIsSubmit(true);
    }

    let inpu = document.getElementById("inputType");
    if (inpu.value == "") {
      console.log("workinggggggggggggg");
      alert("Enter a valid captcha");
      setIsSubmit(false);
    }
    if (isSubmit) {
      const url = "http://localhost:8080/add-user";
      const body = {
        userFirstName: formValues.fName,
        userLastName: formValues.lName,
        email: formValues.email,
        mobileNumber: formValues.mobNo,
        userPassword: formValues.password,
      };
      console.log(body);
      if (await axios.post(url, body)) {
        console.log("working");
        Swal.fire({
          icon: "success",
          title: "Registered",
          text: "You have Succesfully been registered",
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Try again",
          text: "Enter valid details",
        });
      }
    }
  };

  const upload = async (e) => {
    e.preventDefault();
    console.log(selectedFile);
    let loginData = {
      email: formValues.email,
      userPassword: formValues.password,
    };
    console.log(selectedFile);
    const url = "http://localhost:8080/get-logindetails";

    let userData = await axios.post(url, loginData);
    let user = userData.data;
    console.log(user);
    const formData = new FormData();
    formData.append("customerId", user.userId);
    formData.append("profilePic", selectedFile);
    console.log(formData);
    let status = await axios.post(
      "http://localhost:8080/upload-profile-pic",
      formData
    );
    console.log(status);
    if (status.data) {
      Swal.fire({
        icon: "success",
        title: "Pic Uploaded",
        text: "You have Succesfully uploaded pic",
      });
      navigate("/login");
    } else {
      Swal.fire({
        icon: "error",
        title: "Sorry!!! Try again",
        text: "Pic Not uploaded",
      });
    }
  };

  useEffect(() => {
    console.log(formErrors);
    if (Object.keys(formErrors).length === 0 && isSubmit) {
      console.log(formValues);
    }
  }, []);

  const validate = (values) => {
    const errors = {};
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
    const regex1 = /[3-9]/;
    const regex3 = /^[a-zA-Z\\s]*$/i;
    const regex2 = /^((\+)?(\d{2}[-]))?(\d{10}){1}?$/i;

    if (!values.fName) {
      errors.fName = "First name is required!";
    } else if (!regex3.test(values.fName)) {
      errors.fName = "This is not a valid email format!";
    }

    if (!values.lName) {
      errors.lName = "Last name is required!";
    } else if (!regex3.test(values.lName)) {
      errors.lName = "This is not a valid email format!";
    }

    if (!values.email) {
      errors.email = "Email is required!";
    } else if (!regex.test(values.email)) {
      errors.email = "This is not a valid email format!";
    }

    if (!values.mobNo) {
      errors.mobNo = "Contact number is required!";
    } else if (!regex2.test(values.mobNo)) {
      errors.mobNo = "This is not a valid mobNo format!";
    }

    if (!values.password) {
      errors.password = "Password is required!";
    } else if (!regex1.test(values.password)) {
      errors.password =
        "your password should have more than 3 digits and less than 9 digits";
    }
    return errors;
  };
  const getFile = (e) => {
    console.log("pring");
    console.log(e.target.files[0]);
    console.log(selectedFile);

    console.log(setSelectedFile(e.target.files[0]));
    console.log(selectedFile);
  };

  return (
    // <div className="container-fluid ">
    //   {Object.keys(formErrors).length === 0 && isSubmit ? (
    //     <div className="ui message success">Registered in successfully</div>
    //   ) : (
    //     "ok"
    //   )}
    <>
      <Navbars></Navbars>

      <div className="container-fluid">
        <div
          className="row justify-content-center align-items-center  backgroundImg"
          style={{ height: "100vh" }}
        >
          {" "}
          <div
            className="col-12 col-md-5 p-4 border rounded-3"
            style={{ background: "#EDEFF4" }}
          >
            {" "}
            <div className="alert text-center alert-primary display-3">
              Register
            </div>
            <form onSubmit={handleSubmit}>
              <div className="ui divider"></div>
              <div className="ui form">
                <div className="field">
                  <label className="mt-2 fs-2">First name</label>
                  <input
                    className="form-control form-control-lg"
                    type="text"
                    name="fName"
                    placeholder="First name"
                    value={formValues.fName}
                    onChange={handleChange}
                  />
                </div>
                <p className="text-danger fs-3">{formErrors.fName}</p>
                <div className="field">
                  <label className="mt-2 fs-2">Last name</label>
                  <input
                    className="form-control form-control-lg"
                    type="text"
                    name="lName"
                    placeholder="Last name"
                    value={formValues.lName}
                    onChange={handleChange}
                  />
                </div>
                <p className="text-danger fs-3">{formErrors.lName}</p>
                <div className="field">
                  <label className="mt-2 fs-2">Email</label>
                  <input
                    className="form-control form-control-lg"
                    type="text"
                    name="email"
                    placeholder="Email"
                    value={formValues.email}
                    onChange={handleChange}
                  />
                </div>
                <p className="text-danger fs-3">{formErrors.email}</p>
                <div className="field">
                  <label className="mt-2 fs-2">Mobile</label>
                  <input
                    className="form-control form-control-lg"
                    type="number"
                    name="mobNo"
                    placeholder="Mobile number"
                    value={formValues.mobNo}
                    onChange={handleChange}
                  />
                </div>
                <p className="text-danger fs-3">{formErrors.mobNo}</p>
                <div className="field">
                  <label className="mt-2 fs-2">Password</label>
                  <input
                    className="form-control form-control-lg"
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={formValues.password}
                    onChange={handleChange}
                  />
                </div>
                <p className="text-danger fs-3">{formErrors.password}</p>
                <div className="text-center">
                  <Captcha></Captcha>
                </div>
                <div className="text-center">
                  {/* <Link to="/login" className="text-info "> */}
                  <button className="btn btn-success mb-1 mt-2 form-control form-control-lg ">
                    Register
                  </button>
                  {/* </Link> */}
                </div>
              </div>
            </form>
            <form onSubmit={upload}>
              <label htmlFor="" className=" mt-3 fs-2">
                Upload your profile pic
              </label>
              <br></br>
              <input type="file" onChange={getFile} />
              <input
                type="submit"
                value="Submit"
                className="form-control my-1 bg-primary text-light"
              />
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default Register;
