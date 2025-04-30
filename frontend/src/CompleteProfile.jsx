import React, { useEffect, useState } from "react";
import Loader from "./components/loader";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";
import {
  Box,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  Stepper,
  Step,
  StepLabel,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Divider,
  Paper,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import ReactDOM from "react-dom/client";

const CompleteProfile = () => {
  const [formData, setFormData] = useState({});
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    if (document.cookie.includes("token")) {
      const encryptedToken = document.cookie
        .split("; ")
        .find((row) => row.startsWith("token="))
        .split("=")[1];
      const decryptedToken = atob(encryptedToken);
      localStorage.setItem("token", decryptedToken);
    }

    if (!localStorage.getItem("token")) {
      navigate("/authenticate");
      return;
    }

    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/profile/me", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const data = await response.json();
        setUserData(data);
        if (data.data.profile_completed === 1) {
          navigate("/dashboard");
          return;
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        navigate("/authenticate");
      }
    };

    fetchData();
  }, [navigate]);
  const inputTypes = {
    avatar: "file",
    cin_recto: "file",
    cin_verso: "file",
    diplomas: "file",
    city: "text",
    state: "text",
    zip: "number",
    country: "text",
    specialization: "text",
    teaching_experience: "text",
  };

  const getSteps = (userRole) => {
    const baseSteps = [
      {
        title: "Personal Information",
        fields: ["avatar"],
      },
      {
        title: "Identity Documents",
        fields: ["cin_recto", "cin_verso"],
      },
      {
        title: "Location",
        fields: ["city", "state", "zip", "country"],
      },
    ];

    if (userRole === "teacher") {
      baseSteps.splice(2, 0, {
        title: "Qualifications",
        fields: ["diplomas", "specialization", "teaching_experience"],
      });
    }

    return baseSteps;
  };

  const [steps, setSteps] = useState([]);

  const urls = {
    avatar: "http://localhost:8000/api/profile/me/avatar",
    cin: "http://localhost:8000/api/profile/me/validateCIN",
    diplomas: "http://localhost:8000/api/profile/me/diplomas",
    location: "http://localhost:8000/api/profile/me",
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/profile/me", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const data = await response.json();
        setFormData(data.data);
        setSteps(getSteps(data.data.role));
      } catch (error) {
        console.error("Error fetching profile data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);
  if (loading || !steps.length) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          bgcolor: "var(--color-background-paper)",
        }}
      >
        <Box mb={4}>
          <img src="/blablame.png" alt="Logo" />
        </Box>
        <Loader />
      </Box>
    );
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e, key) => {
    const file = e.target.files[0];
    setFormData((prev) => ({
      ...prev,
      [key]: file,
    }));
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (currentStep === steps.length - 1) {
      try {
        // Handle avatar upload
        if (formData.avatar instanceof File) {
          const avatarFormData = new FormData();
          avatarFormData.append("avatar", formData.avatar);
          const avatarResponse = await fetch(urls.avatar, {
            method: "POST",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: avatarFormData,
          });
          if (!avatarResponse.ok) {
            const errorData = await avatarResponse.json();
            throw new Error(
              `Avatar upload failed: ${errorData.error || "Unknown error"}`
            );
          }
        }

        // Handle CIN uploads
        if (
          formData.cin_recto instanceof File &&
          formData.cin_verso instanceof File
        ) {
          const cinFormData = new FormData();
          cinFormData.append("recto", formData.cin_recto);
          cinFormData.append("verso", formData.cin_verso);
          const cinResponse = await fetch(urls.cin, {
            method: "POST",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: cinFormData,
          });
          if (!cinResponse.ok) {
            const errorData = await cinResponse.json();
            throw new Error(
              `CIN upload failed: ${errorData.error || "Unknown error"}`
            );
          }
        }

        // Handle diplomas upload if user is a teacher
        if (formData.role === "teacher" && formData.diplomas instanceof File) {
          const diplomasFormData = new FormData();
          diplomasFormData.append("diplomas", formData.diplomas);
          const diplomasResponse = await fetch(urls.diplomas, {
            method: "POST",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: diplomasFormData,
          });
          if (!diplomasResponse.ok) {
            const errorData = await diplomasResponse.json();
            throw new Error(
              `Diplomas upload failed: ${errorData.error || "Unknown error"}`
            );
          }
        }

        // Handle location data
        const locationData = {
          city: formData.city,
          state: formData.state,
          zip: formData.zip,
          country: formData.country,
          _method: "PUT",
          name: formData.name,
          ...(formData.role === "teacher" && {
            teaching_experience: formData.teaching_experience,
            specialization: formData.specialization,
            diplomas: formData.diplomas,
          }),
        };

        const locationResponse = await fetch(urls.location, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(locationData),
        });

        if (!locationResponse.ok) {
          const errorData = await locationResponse.json();
          throw new Error(
            `Location update failed: ${errorData.error || "Unknown error"}`
          );
        } // Create a container for the success alert
        const alertContainer = document.createElement("div");
        alertContainer.id = "alert-success";
        document.body.appendChild(alertContainer);

        // Render the React Alert component into the container
        const root = ReactDOM.createRoot(alertContainer);
        root.render(
          <Alert
            severity="success"
            sx={{
              position: "fixed",
              top: "1rem",
              right: "1rem",
              width: "auto",
            }}
          >
            Profile updated successfully!
          </Alert>
        );

        setTimeout(() => {
          document.querySelector("#alert-success").remove();
        }, 3000);
        navigate("/dashboard");
        return;
      } catch (error) {
        console.error("Error updating profile:", error); // Create a container for the error alert
        const alertContainer = document.createElement("div");
        alertContainer.id = "alert-error";
        document.body.appendChild(alertContainer);

        // Render the React Alert component into the container
        const root = ReactDOM.createRoot(alertContainer);
        root.render(
          <Alert
            severity="error"
            sx={{
              position: "fixed",
              top: "1rem",
              right: "1rem",
              width: "auto",
            }}
          >
            {error.message || "Failed to update profile. Please try again."}
          </Alert>
        );

        setTimeout(() => {
          document.querySelector("#alert-error").remove();
        }, 3000);
      }
    } else {
      handleNext();
    }
  };
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        bgcolor: "#fcf6e5",
      }}
    >
      <Box mb={4}>
        <img src="/blablame.png" alt="Logo" />
      </Box>
      <Card sx={{ width: 380, boxShadow: 3, bgcolor: "#FCFCFC" }}>
        <CardContent>
          <Typography variant="h5" component="h2" align="center" gutterBottom>
            {steps[currentStep].title}
          </Typography>{" "}
          <Box mb={3}>
            <Stepper
              activeStep={currentStep}
              alternativeLabel
              sx={{
                "& .MuiStepIcon-root": {
                  color: "var(--color-base-300)",
                  "&.Mui-active": {
                    color: "var(--color-primary)",
                  },
                  "&.Mui-completed": {
                    color: "var(--color-primary)",
                  },
                },
                "& .MuiStepConnector-line": {
                  borderColor: "var(--color-base-300)",
                },
                "& .MuiStepLabel-label": {
                  color: "var(--color-base-content)",
                  "&.Mui-active": {
                    color: "var(--color-primary)",
                    fontWeight: "bold",
                  },
                  "&.Mui-completed": {
                    color: "var(--color-base-content)",
                  },
                },
              }}
            >
              {steps.map((step, index) => (
                <Step key={index}>
                  <StepLabel>{step.title}</StepLabel>
                </Step>
              ))}
            </Stepper>
          </Box>{" "}
          <form onSubmit={handleSubmit}>
            {steps[currentStep].fields.map((key) => {
              const type = inputTypes[key] || "text";
              return (
                <Box key={key} sx={{ mb: 2 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    {key.replace(/_/g, " ").toUpperCase()}
                  </Typography>
                  {type === "file" ? (
                    <Paper
                      variant="outlined"
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        height: 120,
                        width: "100%",
                        p: 2,
                        borderStyle: formData[key] ? "solid" : "dashed",
                        bgcolor: formData[key]
                          ? "rgba(0,0,0,0.04)"
                          : "background.paper",
                        cursor: !formData[key] ? "pointer" : "default",
                        "&:hover": {
                          bgcolor: !formData[key]
                            ? "rgba(0,0,0,0.04)"
                            : undefined,
                        },
                      }}
                      component="label"
                      htmlFor={!formData[key] ? key : undefined}
                    >
                      {formData[key] ? (
                        <Box sx={{ textAlign: "center" }}>
                          <Typography variant="body2" color="text.secondary">
                            File uploaded
                          </Typography>
                          <Typography
                            variant="caption"
                            color="text.disabled"
                            noWrap
                            sx={{ maxWidth: "100%" }}
                          >
                            {typeof formData[key] === "string"
                              ? formData[key].split("/").pop()
                              : "New file selected"}
                          </Typography>
                        </Box>
                      ) : (
                        <>
                          <CloudUploadIcon
                            sx={{
                              fontSize: 40,
                              mb: 1,
                              color: "text.secondary",
                            }}
                          />
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            align="center"
                          >
                            <Box component="span" sx={{ fontWeight: "bold" }}>
                              Click to upload
                            </Box>{" "}
                            or drag and drop
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            SVG, PNG, JPG or GIF
                          </Typography>
                        </>
                      )}
                      {!formData[key] && (
                        <input
                          type="file"
                          id={key}
                          name={key}
                          onChange={(e) => handleFileChange(e, key)}
                          style={{ display: "none" }}
                          accept="image/*"
                        />
                      )}
                    </Paper>
                  ) : (
                    <TextField
                      type={type}
                      id={key}
                      name={key}
                      value={formData[key] || ""}
                      onChange={handleChange}
                      fullWidth
                      variant="outlined"
                      size="small"
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          "& fieldset": {
                            borderColor: "var(--color-base-300)",
                          },
                          "&:hover fieldset": {
                            borderColor: "var(--color-primary)",
                          },
                          "&.Mui-focused fieldset": {
                            borderColor: "var(--color-primary)",
                            borderWidth: 2,
                          },
                        },
                        "& .MuiInputLabel-root.Mui-focused": {
                          color: "var(--color-primary)",
                        },
                      }}
                    />
                  )}
                </Box>
              );
            })}{" "}
            <Box
              sx={{ display: "flex", justifyContent: "space-between", mt: 4 }}
            >
              {" "}
              {currentStep > 0 && (
                <Button
                  type="button"
                  onClick={handlePrevious}
                  variant="outlined"
                  sx={{
                    color: "var(--color-primary)",
                    borderColor: "var(--color-primary)",
                    "&:hover": {
                      borderColor: "var(--color-primary)",
                      backgroundColor: "rgba(0, 0, 0, 0.04)",
                    },
                    fontWeight: 600,
                    borderRadius: 1,
                  }}
                >
                  Previous
                </Button>
              )}
              <Button
                type="submit"
                variant="contained"
                fullWidth={currentStep === 0}
                sx={{
                  ml: currentStep > 0 ? "auto" : 0,
                  bgcolor: "var(--color-primary)",
                  color: "var(--color-primary-content)",
                  "&:hover": {
                    bgcolor: "var(--color-primary)",
                    filter: "brightness(0.9)",
                  },
                  fontWeight: 600,
                  borderRadius: 1,
                }}
              >
                {currentStep === steps.length - 1 ? "Submit" : "Next"}
              </Button>
            </Box>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
};

export default CompleteProfile;
