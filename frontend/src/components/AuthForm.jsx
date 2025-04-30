import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom/client";
import Logo from "./Logo";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import {
  TextField,
  Button,
  Card,
  CardContent,
  Typography,
  FormControl,
  FormControlLabel,
  Checkbox,
  InputLabel,
  MenuItem,
  Select,
  Tabs,
  Tab,
  Box,
  Alert,
  Stack,
} from "@mui/material";

const encryptToken = (token) => {
  return btoa(token);
};

const AuthForm = () => {
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState("SignUp");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    role: "",
    password: "",
  });
  useEffect(() => {
    if (localStorage.getItem("token")) {
      navigate("/dashboard");
    }
  }, []);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint =
      selectedTab === "SignUp"
        ? "http://localhost:8000/api/auth/register"
        : "http://localhost:8000/api/auth/login";
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (response.ok) {
        const encryptedToken = encryptToken(data.token);
        localStorage.setItem("token", data.token);
        Cookies.set("token", encryptedToken, {
          secure: true,
          sameSite: "Strict",
          expires: 7,
        });

        // Create a container for the alert
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
            Successfully authenticated!
          </Alert>
        );

        setTimeout(() => {
          document.querySelector("#alert-success").remove();
        }, 3000);
        setTimeout(() => {
          navigate("/dashboard");
        }, 1000);
      } else {
        // Create a container for the error alert
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
            {data.message || "Authentication failed"}: {data.error}
          </Alert>
        );

        setTimeout(() => {
          document.querySelector("#alert-error").remove();
        }, 3000);
      }
    } catch (error) {
      // Create a container for the network error alert
      const alertContainer = document.createElement("div");
      alertContainer.id = "alert-network-error";
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
          Network Error: Please Try Again Later ...
        </Alert>
      );
      console.error("Error:", error);

      setTimeout(() => {
        document.querySelector("#alert-network-error").remove();
      }, 3000);
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
        bgcolor: "var(--color-background-paper)",
      }}
    >
      <Logo />
      <Box sx={{ height: "1.5rem" }} />
      <Card sx={{ width: 380, boxShadow: 3, bgcolor: "#FCFCFC" }}>
        <CardContent>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              width: "100%",
              mb: 2,
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                p: 0.5,
                borderRadius: 28,
                boxShadow: 2,
                bgcolor: "#FAF7F5",
                width: "fit-content",
              }}
            >
              <Button
                onClick={() => setSelectedTab("SignUp")}
                sx={{
                  px: 3,
                  py: 0.5,
                  mx: 0.5,
                  fontWeight: 600,
                  borderRadius: 28,
                  color:
                    selectedTab === "SignUp"
                      ? "var(--color-primary-content)"
                      : "var(--color-primary)",
                  bgcolor:
                    selectedTab === "SignUp"
                      ? "var(--color-primary)"
                      : "transparent",
                  "&:hover": {
                    bgcolor:
                      selectedTab === "SignUp"
                        ? "var(--color-primary)"
                        : "rgba(0, 0, 0, 0.04)",
                  },
                }}
              >
                SignUp
              </Button>
              <Button
                onClick={() => setSelectedTab("Login")}
                sx={{
                  px: 3,
                  py: 0.5,
                  mx: 0.5,
                  fontWeight: 600,
                  borderRadius: 28,
                  color:
                    selectedTab === "Login"
                      ? "var(--color-primary-content)"
                      : "var(--color-primary)",
                  bgcolor:
                    selectedTab === "Login"
                      ? "var(--color-primary)"
                      : "transparent",
                  "&:hover": {
                    bgcolor:
                      selectedTab === "Login"
                        ? "var(--color-primary)"
                        : "rgba(0, 0, 0, 0.04)",
                  },
                }}
              >
                Login
              </Button>
            </Box>
          </Box>
          {selectedTab === "SignUp" && (
            <form onSubmit={handleSubmit}>
              <Box
                sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}
              >
                <TextField
                  fullWidth
                  label="Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  variant="outlined"
                  size="small"
                  margin="normal"
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
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  variant="outlined"
                  size="small"
                  margin="normal"
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
                <TextField
                  fullWidth
                  label="Phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  variant="outlined"
                  size="small"
                  margin="normal"
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
                <TextField
                  fullWidth
                  label="Address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  variant="outlined"
                  size="small"
                  margin="normal"
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
              </Box>

              <FormControl fullWidth margin="normal" size="small">
                <InputLabel
                  id="role-select-label"
                  sx={{
                    "&.Mui-focused": {
                      color: "var(--color-primary)",
                    },
                  }}
                >
                  Role
                </InputLabel>
                <Select
                  labelId="role-select-label"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  label="Role"
                  sx={{
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: "var(--color-base-300)",
                    },
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: "var(--color-primary)",
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: "var(--color-primary)",
                      borderWidth: 2,
                    },
                  }}
                >
                  <MenuItem value="">
                    <em>Select a role</em>
                  </MenuItem>
                  <MenuItem value="student">Student</MenuItem>
                  <MenuItem value="teacher">Teacher</MenuItem>
                </Select>
              </FormControl>

              <TextField
                fullWidth
                label="Password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                variant="outlined"
                size="small"
                margin="normal"
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

              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{
                  mt: 3,
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
                SIGNUP
              </Button>
            </form>
          )}
          {selectedTab === "Login" && (
            <form onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                variant="outlined"
                size="small"
                margin="normal"
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

              <TextField
                fullWidth
                label="Password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                variant="outlined"
                size="small"
                margin="normal"
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

              <FormControlLabel
                control={
                  <Checkbox
                    name="rememberMe"
                    sx={{
                      color: "var(--color-base-300)",
                      "&.Mui-checked": {
                        color: "var(--color-primary)",
                      },
                    }}
                  />
                }
                label="Remember Me"
                sx={{
                  mt: 2,
                  "& .MuiFormControlLabel-label": {
                    color: "var(--color-base-content)",
                  },
                }}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{
                  mt: 3,
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
                LOGIN
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default AuthForm;
