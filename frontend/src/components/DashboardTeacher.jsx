import React, { useEffect, useState } from "react";
import {
  Box,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  InputBase,
  Badge,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Card,
  CardContent,
  CardMedia,
  Button,
  Divider,
  Avatar,
  TextField,
  Grid,
  Chip,
  Alert,
  useMediaQuery,
  useTheme,
  Snackbar,
  CircularProgress,
  Modal,
  Fade,
  Backdrop,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Search as SearchIcon,
  Notifications as NotificationsIcon,
  Message as MessageIcon,
  Person as PersonIcon,
  School as SchoolIcon,
  Logout as LogoutIcon,
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import MuiAlert from "@mui/material/Alert";
import MessagesTab from "./MessagesTab";
import { useNavigate } from "react-router-dom";
import { initializeApp, getApp, getApps } from "firebase/app";
import {
  getDatabase,
  ref,
  onChildAdded,
  onValue,
  off,
  push,
} from "firebase/database";
import DeleteIcon from "@mui/icons-material/Delete";

const firebaseConfig = {
  apiKey: "AIzaSyC7g76v78SwcyY1REaNsnQzEhgYdrbcZto",
  authDomain: "blablame-project.firebaseapp.com",
  projectId: "blablame-project",
  storageBucket: "blablame-project.firebasestorage.app",
  messagingSenderId: "177550990108",
  appId: "1:177550990108:web:66647c67876f4d7c3478d9",
  measurementId: "G-8HN0DSS4Z8",
  databaseURL:
    "https://blablame-project-default-rtdb.europe-west1.firebasedatabase.app", // Corrected URL
};
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getDatabase(app);

// Styled components (reuse from DashboardPage)
const StyledAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: "#FCFCFC",
  color: "var(--color-base-content)",
  boxShadow: "0px 2px 4px -1px rgba(0,0,0,0.05)",
}));
const StyledDrawer = styled(Drawer)(({ theme }) => ({
  width: 240,
  flexShrink: 0,
  "& .MuiDrawer-paper": {
    width: 240,
    boxSizing: "border-box",
    backgroundColor: "#FCFCFC",
    borderRight: "1px solid var(--color-base-300)",
  },
}));
const SearchWrapper = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: 20,
  backgroundColor: "var(--color-base-200)",
  "&:hover": {
    backgroundColor: "var(--color-base-300)",
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(3),
    width: "auto",
  },
}));
const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "var(--color-base-content)",
}));
const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "var(--color-base-content)",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "20ch",
    },
  },
}));

const StyledCard = styled(Card)(({ theme }) => ({
  maxWidth: 280,
  margin: theme.spacing(1),
  transition: "transform 0.3s ease-in-out",
  "&:hover": {
    transform: "translateY(-4px)",
    boxShadow: "0 6px 12px rgba(0,0,0,0.1)",
  },
  borderRadius: 8,
}));

const DashboardTeacher = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [drawerOpen, setDrawerOpen] = useState(!isMobile);
  const [activeTab, setActiveTab] = useState(0);

  const [profile, setProfile] = useState(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileEdit, setProfileEdit] = useState(false);
  const [profileForm, setProfileForm] = useState({
    name: "",
    email: "",
    avatar: null,
  });
  const [profileError, setProfileError] = useState("");
  const [profileSuccess, setProfileSuccess] = useState(false);

  const [blablas, setBlablas] = useState([]);
  const [blablasLoading, setBlablasLoading] = useState(false);
  const [applyLoading, setApplyLoading] = useState({});
  const [applyStatus, setApplyStatus] = useState({});
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [applyModalOpen, setApplyModalOpen] = useState(false);
  const [applyMessage, setApplyMessage] = useState("");
  const [applyTargetBlabla, setApplyTargetBlabla] = useState(null);

  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [realtimeNotif, setRealtimeNotif] = useState(null);
  const [unreadMessagesCount, setUnreadMessagesCount] = useState(0);

  const [logoutModalOpen, setLogoutModalOpen] = useState(false);

  const navigate = useNavigate();

  // Sidebar tabs for teacher
  const sidebarTabs = [
    { text: "BlaBlas", icon: <SchoolIcon />, index: 0 },
    { text: "Messages", icon: <MessageIcon />, index: 1 },
    { text: "Notifications", icon: <NotificationsIcon />, index: 2 },
    { text: "Profile", icon: <PersonIcon />, index: 3 },
  ];

  // Fetch profile info
  useEffect(() => {
    const fetchProfile = async () => {
      setProfileLoading(true);
      setProfileError("");
      try {
        const res = await fetch("http://localhost:8000/api/profile/me", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (!res.ok) throw new Error("Failed to fetch profile");
        const data = await res.json();
        setProfile(data.data || {});
        setProfileForm({
          name: data.data?.name || "",
          email: data.data?.email || "",
          avatar: null,
        });
      } catch (e) {
        setProfileError(e.message);
      } finally {
        setProfileLoading(false);
      }
    };
    fetchProfile();
  }, []);

  // Fetch all blablas (refactored for reuse)
  const fetchBlablas = async () => {
    setBlablasLoading(true);
    try {
      const res = await fetch("http://localhost:8000/api/blablas", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await res.json();
      setBlablas(data.data.data || []);
    } catch (e) {
      setBlablas([]);
    } finally {
      setBlablasLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab !== 0) return;
    fetchBlablas();
  }, [activeTab]);

  // Open modal for apply
  const handleOpenApplyModal = (blabla) => {
    setApplyTargetBlabla(blabla);
    setApplyMessage("");
    setApplyModalOpen(true);
  };

  // Submit apply with message
  const handleApply = async () => {
    if (!applyTargetBlabla) return;
    setApplyLoading((prev) => ({ ...prev, [applyTargetBlabla.id]: true }));
    try {
      // 1. Send to backend (optional, for your API)
      const res = await fetch(
        `http://localhost:8000/api/blablas/${applyTargetBlabla.id}/apply`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ message: applyMessage }),
        }
      );
      if (!res.ok) throw new Error("Failed to apply");

      // 2. Write to Firebase Realtime Database for real-time student dashboard
      if (profile?.id && profile?.name) {
        const appRef = ref(db, `applications/${applyTargetBlabla.id}`);
        await push(appRef, {
          teacherId: profile.id,
          teacherName: profile.name,
          message: applyMessage,
          status: "pending",
          timestamp: Date.now(),
        });
      }

      setApplyStatus((prev) => ({
        ...prev,
        [applyTargetBlabla.id]: "pending",
      }));
      setSnackbar({
        open: true,
        message: "Applied successfully!",
        severity: "success",
      });
      setApplyModalOpen(false);
      setApplyMessage("");
      setApplyTargetBlabla(null);
      // Re-fetch blablas to update status
      fetchBlablas();
    } catch (e) {
      setSnackbar({
        open: true,
        message: "Failed to apply.",
        severity: "error",
      });
    } finally {
      setApplyLoading((prev) => ({
        ...prev,
        [applyTargetBlabla.id]: false,
      }));
    }
  };

  // Handle profile form changes
  const handleProfileInput = (e) => {
    const { name, value, files } = e.target;
    setProfileForm((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  // Save profile changes
  const handleProfileSave = async (e) => {
    e.preventDefault();
    setProfileLoading(true);
    setProfileError("");
    try {
      const formData = new FormData();
      formData.append("name", profileForm.name);
      formData.append("email", profileForm.email);
      if (profileForm.avatar) formData.append("avatar", profileForm.avatar);

      const res = await fetch("http://localhost:8000/api/user", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formData,
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Failed to update profile");
      }
      setProfileEdit(false);
      setProfileSuccess(true);
      // Refresh profile
      const updated = await res.json();
      setProfile((prev) => ({
        ...prev,
        ...updated.data,
        avatar: updated.data.avatar || prev.avatar,
      }));
    } catch (e) {
      setProfileError(e.message);
    } finally {
      setProfileLoading(false);
    }
  };

  // Delete notification by key (index in notifications array)
  const handleDeleteNotification = async (notifIdx) => {
    if (!profile?.id || !notifications[notifIdx]) return;
    // Find the Firebase key for this notification
    // We need to get the key from the snapshot, so let's store keys with notifications
    // We'll update the notification fetching logic to include keys
    const notifKey = notifications[notifIdx].__key;
    if (!notifKey) return;
    const notifRef = ref(db, `notifications/${profile.id}/${notifKey}`);
    try {
      await import("firebase/database").then(({ remove }) => remove(notifRef));
    } catch (e) {
      // fallback if dynamic import fails
      // eslint-disable-next-line no-console
      console.error("Failed to delete notification:", e);
    }
  };

  // Real-time notifications from Firebase (with keys)
  useEffect(() => {
    if (!profile?.id) return;
    const notifRef = ref(db, `notifications/${profile.id}`);

    // Listen for all notifications to set unread count and store keys
    const handleAllNotifs = (snapshot) => {
      const data = snapshot.val() || {};
      // Store the Firebase key as __key for each notification
      const notifArr = Object.entries(data)
        .map(([key, notif]) => ({ ...notif, __key: key }))
        .reverse();
      setNotifications(notifArr);
      setUnreadCount(notifArr.filter((n) => !n.read).length);
    };
    onValue(notifRef, handleAllNotifs);

    // Listen for new notifications (for real-time snackbar)
    const handleNewNotif = (snapshot) => {
      const notif = snapshot.val();
      setNotifications((prev) => [{ ...notif, __key: snapshot.key }, ...prev]);
      setUnreadCount((prev) => prev + 1);
      setRealtimeNotif(notif);
    };
    onChildAdded(notifRef, handleNewNotif);

    return () => {
      off(notifRef, "child_added", handleNewNotif);
      off(notifRef, "value", handleAllNotifs);
    };
  }, [profile?.id]);

  useEffect(() => {
    if (activeTab === 2 && profile?.id) {
      // Mark all as read (not updating Firebase here)
      setUnreadCount(0);
    }
  }, [activeTab, profile?.id, notifications]);

  // Listen for unread messages count for the current user
  useEffect(() => {
    if (!profile?.id) return;
    const chatsRef = ref(db, "chats");
    const handleChats = (snapshot) => {
      const data = snapshot.val() || {};
      let count = 0;
      Object.values(data).forEach((chat) => {
        if (
          chat.participants &&
          Object.values(chat.participants).includes(profile.id)
        ) {
          const messages = chat.messages || {};
          Object.values(messages).forEach((msg) => {
            if (msg.senderId !== profile.id && !msg.read) {
              count += 1;
            }
          });
        }
      });
      setUnreadMessagesCount(count);
    };
    onValue(chatsRef, handleChats);
    return () => off(chatsRef, "value", handleChats);
  }, [profile?.id]);

  useEffect(() => {
    setDrawerOpen(!isMobile);
  }, [isMobile]);

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  // Logout handler
  const handleLogout = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/auth/logout", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (res.ok) {
        localStorage.removeItem("token");
        navigate("/login");
      } else {
        throw new Error("Failed to logout");
      }
    } catch (e) {
      console.error("Logout error:", e);
    }
  };

  // Sidebar Drawer
  const drawer = (
    <Box sx={{ overflow: "auto" }}>
      <Box
        sx={{
          p: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <img src="/blablame.png" alt="BlaBlaMe Logo" style={{ height: 40 }} />
      </Box>
      <Divider />
      <Box sx={{ my: 2, px: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <Avatar
            sx={{
              width: 50,
              height: 50,
              bgcolor: "var(--color-primary)",
              color: "var(--color-primary-content)",
            }}
            alt={profile?.name || "Teacher Name"}
            src={
              profile?.avatar
                ? profile.avatar.startsWith("http")
                  ? profile.avatar
                  : "http://localhost:8000/" + profile.avatar
                : undefined
            }
          />
          <Box sx={{ ml: 1 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
              {profile?.name || ""}
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: "var(--color-base-content)" }}
            >
              {profile?.role || ""}
            </Typography>
          </Box>
        </Box>
      </Box>
      <Divider />
      <List>
        {sidebarTabs.map((item) => (
          <ListItem
            button
            key={item.text}
            selected={activeTab === item.index}
            onClick={() => setActiveTab(item.index)}
            sx={{
              "&.Mui-selected": {
                backgroundColor: "var(--color-base-200)",
                borderRight: "3px solid var(--color-primary)",
                "&:hover": {
                  backgroundColor: "var(--color-base-200)",
                },
                "& .MuiListItemIcon-root, & .MuiListItemText-primary": {
                  color: "var(--color-primary)",
                  fontWeight: "bold",
                },
              },
            }}
          >
            <ListItemIcon
              sx={{
                color:
                  activeTab === item.index ? "var(--color-primary)" : "inherit",
              }}
            >
              {item.icon}
            </ListItemIcon>
            <ListItemText
              primary={item.text}
              primaryTypographyProps={{
                sx: {
                  fontWeight: activeTab === item.index ? "bold" : "normal",
                },
              }}
            />
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        <ListItem
          button
          sx={{ mt: "auto" }}
          onClick={() => setLogoutModalOpen(true)}
        >
          <ListItemIcon>
            <LogoutIcon sx={{ color: "var(--color-error)" }} />
          </ListItemIcon>
          <ListItemText primary="Logout" />
        </ListItem>
      </List>
    </Box>
  );

  // Tab content
  const renderTabContent = () => {
    if (activeTab === 0) {
      // BlaBlas tab: show all blablas with apply
      return (
        <Box>
          <Typography variant="h5" sx={{ fontWeight: "bold", mb: 2 }}>
            All BlaBlas
          </Typography>
          {blablasLoading ? (
            <Box sx={{ textAlign: "center", mt: 6 }}>
              <CircularProgress />
            </Box>
          ) : blablas.length === 0 ? (
            <Box sx={{ p: 4, textAlign: "center" }}>
              <Typography>No BlaBlas found.</Typography>
            </Box>
          ) : (
            <Grid container spacing={2}>
              {blablas.map((blabla) => (
                <Grid item xs={12} md={6} lg={4} key={blabla.id}>
                  <StyledCard>
                    {blabla.image && (
                      <CardMedia
                        component="img"
                        height="140"
                        image={"http://localhost:8000" + blabla.image}
                        alt={blabla.title}
                        sx={{
                          width: "100%",
                          maxWidth: 320,
                          objectFit: "cover",
                          mx: "auto",
                          borderRadius: 2,
                          mt: 2,
                        }}
                      />
                    )}
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Box
                        sx={{ display: "flex", alignItems: "center", mb: 1 }}
                      >
                        <Avatar
                          src={
                            blabla.user?.avatar
                              ? blabla.user.avatar.startsWith("http")
                                ? blabla.user.avatar
                                : "http://localhost:8000/" + blabla.user.avatar
                              : undefined
                          }
                          alt={blabla.user?.name || ""}
                          sx={{ width: 32, height: 32, mr: 1 }}
                        />
                        <Typography variant="subtitle2">
                          {blabla.user?.name || "Student"}
                        </Typography>
                      </Box>
                      <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                        {blabla.title}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mb: 1 }}
                      >
                        {blabla.description}
                      </Typography>
                      <Chip
                        label={blabla.category?.name || "No Category"}
                        size="small"
                        sx={{
                          bgcolor: "var(--color-primary)",
                          color: "var(--color-primary-content)",
                          mb: 1,
                        }}
                      />
                      <Typography variant="body2" sx={{ mt: 1 }}>
                        <strong>Budget:</strong> ${blabla.budget}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {blabla.created_at
                          ? new Date(blabla.created_at).toLocaleDateString()
                          : ""}
                        {console.log(blabla.applications)}
                      </Typography>
                      <Box sx={{ mt: 2 }}>
                        {(() => {
                          const app =
                            blabla.applications &&
                            blabla.applications.length > 0
                              ? blabla.applications[0]
                              : null;
                          if (app && app.status === "pending") {
                            return <Chip label="Pending" color="warning" />;
                          } else if (app && app.status === "accepted") {
                            return <Chip label="Accepted" color="success" />;
                          } else {
                            return (
                              <Button
                                variant="contained"
                                color="primary"
                                disabled={applyLoading[blabla.id]}
                                onClick={() => handleOpenApplyModal(blabla)}
                              >
                                {applyLoading[blabla.id]
                                  ? "Applying..."
                                  : "Apply"}
                              </Button>
                            );
                          }
                        })()}
                      </Box>
                    </CardContent>
                  </StyledCard>
                </Grid>
              ))}
            </Grid>
          )}
          {/* Apply Modal */}
          <Modal
            open={applyModalOpen}
            onClose={() => setApplyModalOpen(false)}
            closeAfterTransition
            slots={{ backdrop: Backdrop }}
            slotProps={{
              backdrop: {
                timeout: 500,
              },
            }}
          >
            <Fade in={applyModalOpen}>
              <Box
                sx={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  width: { xs: "90%", sm: 400 },
                  bgcolor: "background.paper",
                  boxShadow: 24,
                  p: 3,
                  borderRadius: 2,
                }}
              >
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Send a message with your application
                </Typography>
                <TextField
                  label="Message"
                  multiline
                  minRows={3}
                  fullWidth
                  value={applyMessage}
                  onChange={(e) => setApplyMessage(e.target.value)}
                  placeholder="Write a message to the student..."
                  sx={{ mb: 2 }}
                />
                <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                  <Button
                    onClick={() => setApplyModalOpen(false)}
                    sx={{ mr: 2 }}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="contained"
                    onClick={handleApply}
                    disabled={
                      !applyMessage.trim() ||
                      applyLoading[applyTargetBlabla?.id]
                    }
                  >
                    {applyLoading[applyTargetBlabla?.id]
                      ? "Applying..."
                      : "Apply"}
                  </Button>
                </Box>
              </Box>
            </Fade>
          </Modal>
        </Box>
      );
    }
    if (activeTab === 1) {
      // Messages
      return <MessagesTab />;
    }
    if (activeTab === 2) {
      // Notifications
      return (
        <Box>
          <Typography variant="h5" sx={{ fontWeight: "bold", mb: 2 }}>
            Notifications
          </Typography>
          {notifications.length === 0 ? (
            <Alert severity="info">No notifications yet.</Alert>
          ) : (
            <List>
              {notifications.map((notif, idx) => (
                <ListItem
                  key={notif.__key || idx}
                  sx={{
                    bgcolor: notif.read ? "inherit" : "var(--color-base-200)",
                  }}
                  secondaryAction={
                    <IconButton
                      edge="end"
                      aria-label="delete"
                      onClick={() => handleDeleteNotification(idx)}
                      size="small"
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  }
                >
                  <ListItemText
                    primary={notif.title || notif.message}
                    secondary={
                      notif.timestamp
                        ? new Date(notif.timestamp).toLocaleString()
                        : ""
                    }
                  />
                </ListItem>
              ))}
            </List>
          )}
        </Box>
      );
    }
    if (activeTab === 3) {
      // Profile
      return (
        <Box>
          <Typography variant="h5" sx={{ fontWeight: "bold", mb: 2 }}>
            My Profile
          </Typography>
          {profileLoading ? (
            <Box sx={{ p: 4, textAlign: "center" }}>
              <Typography>Loading profile...</Typography>
            </Box>
          ) : profileError ? (
            <Alert severity="error">{profileError}</Alert>
          ) : profile ? (
            <Box sx={{ maxWidth: 600, mx: "auto" }}>
              {/* Profile Info/Edit */}
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  mb: 3,
                }}
              >
                <Avatar
                  src={
                    profile.avatar
                      ? profile.avatar.startsWith("http")
                        ? profile.avatar
                        : "http://localhost:8000/" + profile.avatar
                      : undefined
                  }
                  sx={{ width: 80, height: 80, mb: 1 }}
                />
                <Typography variant="h6">{profile.name}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {profile.email}
                </Typography>
              </Box>
              {!profileEdit ? (
                <Box sx={{ textAlign: "center" }}>
                  <Button
                    variant="contained"
                    sx={{
                      backgroundColor: "var(--color-primary)",
                      color: "var(--color-primary-content)",
                      mr: 2,
                    }}
                    onClick={() => setProfileEdit(true)}
                  >
                    Edit Profile
                  </Button>
                </Box>
              ) : (
                <form onSubmit={handleProfileSave}>
                  <TextField
                    label="Name"
                    name="name"
                    value={profileForm.name}
                    onChange={handleProfileInput}
                    fullWidth
                    sx={{ mb: 2 }}
                  />
                  <TextField
                    label="Email"
                    name="email"
                    value={profileForm.email}
                    onChange={handleProfileInput}
                    fullWidth
                    sx={{ mb: 2 }}
                  />
                  <Button
                    variant="outlined"
                    component="label"
                    fullWidth
                    sx={{ mb: 2 }}
                  >
                    Upload Avatar
                    <input
                      type="file"
                      name="avatar"
                      accept="image/*"
                      hidden
                      onChange={handleProfileInput}
                    />
                  </Button>
                  <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                    <Button
                      onClick={() => setProfileEdit(false)}
                      sx={{ mr: 2 }}
                      disabled={profileLoading}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      variant="contained"
                      sx={{
                        backgroundColor: "var(--color-primary)",
                        color: "var(--color-primary-content)",
                      }}
                      disabled={profileLoading}
                    >
                      {profileLoading ? "Saving..." : "Save"}
                    </Button>
                  </Box>
                  {profileError && (
                    <Alert severity="error" sx={{ mt: 2 }}>
                      {profileError}
                    </Alert>
                  )}
                </form>
              )}
              <Snackbar
                open={profileSuccess}
                autoHideDuration={2500}
                onClose={() => setProfileSuccess(false)}
              >
                <MuiAlert
                  elevation={6}
                  variant="filled"
                  onClose={() => setProfileSuccess(false)}
                  severity="success"
                  sx={{ width: "100%" }}
                >
                  Profile updated successfully!
                </MuiAlert>
              </Snackbar>
            </Box>
          ) : null}
        </Box>
      );
    }
    return null;
  };

  return (
    <Box
      sx={{
        display: "flex",
        bgcolor: "var(--color-background-paper)",
        minHeight: "100vh",
      }}
    >
      {/* App Bar */}
      <StyledAppBar
        position="fixed"
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={handleDrawerToggle}
            sx={{
              mr: 2,
              display: { xs: "flex", md: "none" },
            }}
          >
            <MenuIcon />
          </IconButton>
          <Box
            sx={{
              display: { xs: "none", md: "flex" },
            }}
          >
            <img src="/blablame.png" className="h-8" alt="Logo" />
          </Box>
          <SearchWrapper>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search…"
              inputProps={{ "aria-label": "search" }}
            />
          </SearchWrapper>
          <Box sx={{ flexGrow: 1 }} />
          <Box sx={{ display: "flex" }}>
            <IconButton
              size="large"
              color="inherit"
              onClick={() => setActiveTab(2)}
            >
              <Badge badgeContent={unreadCount} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>
            <IconButton
              size="large"
              color="inherit"
              onClick={() => setActiveTab(1)}
            >
              <Badge badgeContent={unreadMessagesCount} color="error">
                <MessageIcon />
              </Badge>
            </IconButton>
          </Box>
        </Toolbar>
      </StyledAppBar>
      {/* Sidebar Drawer */}
      <StyledDrawer
        variant={isMobile ? "temporary" : "permanent"}
        open={drawerOpen}
        onClose={handleDrawerToggle}
      >
        {drawer}
      </StyledDrawer>
      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          bgcolor: "var(--color-backgound-paper)",
          mt: 8,
          overflowX: "hidden",
          transition: "margin 0.2s",
          ml: isMobile ? 0 : drawerOpen ? 0 : -24,
        }}
      >
        {renderTabContent()}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={2500}
          onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
        >
          <Alert
            onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
            severity={snackbar.severity}
            sx={{ width: "100%" }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
        <Snackbar
          open={!!realtimeNotif}
          autoHideDuration={3000}
          onClose={() => setRealtimeNotif(null)}
        >
          <MuiAlert
            elevation={6}
            variant="filled"
            onClose={() => setRealtimeNotif(null)}
            severity="info"
            sx={{ width: "100%" }}
          >
            {realtimeNotif?.title ||
              realtimeNotif?.message ||
              "New notification"}
          </MuiAlert>
        </Snackbar>
        <Modal
          open={logoutModalOpen}
          onClose={() => setLogoutModalOpen(false)}
          closeAfterTransition
          slots={{ backdrop: Backdrop }}
          slotProps={{
            backdrop: {
              timeout: 500,
            },
          }}
        >
          <Fade in={logoutModalOpen}>
            <Box
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: 300,
                bgcolor: "background.paper",
                boxShadow: 24,
                p: 3,
                borderRadius: 2,
              }}
            >
              <Typography variant="h6" sx={{ mb: 2 }}>
                Confirm Logout
              </Typography>
              <Typography variant="body2" sx={{ mb: 3 }}>
                Are you sure you want to logout?
              </Typography>
              <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                <Button
                  onClick={() => setLogoutModalOpen(false)}
                  sx={{ mr: 2 }}
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              </Box>
            </Box>
          </Fade>
        </Modal>
      </Box>
    </Box>
  );
};

export default DashboardTeacher;
