import React, { useEffect, useState } from "react";
import {
  Box,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Avatar,
  Card,
  CardContent,
  CardMedia,
  Grid,
  CircularProgress,
  Alert,
  Button,
  Badge,
  useMediaQuery,
  useTheme,
  Chip,
  Paper,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Message as MessageIcon,
  Notifications as NotificationsIcon,
  Home as HomeIcon,
  Person as PersonIcon,
  Logout as LogoutIcon,
  Star as StarIcon,
  Email as EmailIcon,
  School as SchoolIcon,
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import { useParams, useNavigate } from "react-router-dom";
import { initializeApp, getApp, getApps } from "firebase/app";
import { getDatabase, ref, push, set, get } from "firebase/database";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

// Styled components (copied from DashboardPage)
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

const Banner = styled(Box)(({ theme }) => ({
  width: "100%",
  minHeight: 160,
  background: "linear-gradient(90deg, #4F8DFD 0%, #235390 100%)",
  borderRadius: theme.spacing(2),
  marginBottom: theme.spacing(6),
  position: "relative",
  display: "flex",
  alignItems: "flex-end",
  justifyContent: "flex-start",
  overflow: "hidden",
}));

const ProfileAvatar = styled(Avatar)(({ theme }) => ({
  width: 120,
  height: 120,
  border: "5px solid #fff",
  boxShadow: "0 4px 24px rgba(0,0,0,0.12)",
  position: "absolute",
  left: theme.spacing(5),
  bottom: -60,
  backgroundColor: "#fff",
}));

const InfoPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: theme.spacing(2),
  marginTop: theme.spacing(8),
  marginBottom: theme.spacing(4),
  boxShadow: "0 2px 16px rgba(0,0,0,0.06)",
  background: "#fff",
}));

const StatChip = styled(Chip)(({ theme }) => ({
  marginRight: theme.spacing(1.5),
  fontWeight: 600,
  fontSize: "1rem",
  background: "var(--color-base-200)",
}));

// Firebase configuration (update databaseURL to the correct region)
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

// Initialize Firebase app
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getDatabase(app);

// Add getYoutubeThumbnailFromNoembed function
const getYoutubeThumbnailFromNoembed = async (youtubeUrl) => {
  try {
    const response = await fetch(
      `https://noembed.com/embed?url=${encodeURIComponent(youtubeUrl)}`
    );
    if (!response.ok) return null;
    const data = await response.json();
    return data.thumbnail_url || null;
  } catch (err) {
    return null;
  }
};

const TeacherProfile = () => {
  const { teacherId } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [drawerOpen, setDrawerOpen] = useState(!isMobile);

  const [teacher, setTeacher] = useState(null);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [profile, setProfile] = useState(null);
  const [thumbnailMap, setThumbnailMap] = useState({}); // videoId -> thumbnail url
  const [msgError, setMsgError] = useState("");
  const [msgLoading, setMsgLoading] = useState(false);
  const [msgSuccess, setMsgSuccess] = useState(false);

  // Fetch logged-in user profile for sidebar
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch("http://localhost:8000/api/profile/me", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (!res.ok) return;
        const data = await res.json();
        setProfile(data.data);
      } catch (e) {
        setProfile(null);
      }
    };
    fetchProfile();
  }, []);

  // Fetch teacher and videos
  useEffect(() => {
    const fetchTeacher = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(
          `http://localhost:8000/api/teachers/${teacherId}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        if (!res.ok) throw new Error("Failed to fetch teacher");
        const data = await res.json();
        setTeacher(data.data);

        // Fetch videos by this teacher (assuming user_id is the teacher's id)
        const vres = await fetch(
          `http://localhost:8000/api/videos?user_id=${teacherId}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        const vdata = await vres.json();
        setVideos(vdata.data?.data || []);
      } catch (err) {
        setError("Failed to load teacher profile.");
      }
      setLoading(false);
    };
    fetchTeacher();
  }, [teacherId]);

  // Fetch thumbnails for YouTube videos after videos are loaded
  useEffect(() => {
    const fetchThumbnails = async () => {
      const newMap = {};
      await Promise.all(
        videos.map(async (video) => {
          let youtubeUrl = null;
          if (video.link && video.link.includes("youtube.com/watch")) {
            youtubeUrl = video.link;
          } else if (video.video_id) {
            youtubeUrl = `https://www.youtube.com/watch?v=${video.video_id}`;
          }
          if (youtubeUrl) {
            const thumb = await getYoutubeThumbnailFromNoembed(youtubeUrl);
            if (thumb) newMap[video.id] = thumb;
          }
        })
      );
      setThumbnailMap((prev) => ({ ...prev, ...newMap }));
    };
    if (videos && videos.length > 0) {
      fetchThumbnails();
    }
  }, [videos]);

  useEffect(() => {
    setDrawerOpen(!isMobile);
  }, [isMobile]);

  const sidebarTabs = [
    { text: "Home", icon: <HomeIcon />, path: "/dashboard" },
    { text: "Messages", icon: <MessageIcon />, path: "/dashboard" },
    { text: "Profile", icon: <PersonIcon />, path: "/dashboard" },
    { text: "Notifications", icon: <NotificationsIcon />, path: "/dashboard" },
  ];

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
            alt={profile?.name || "Student Name"}
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
            onClick={() => navigate(item.path)}
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
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        <ListItem button sx={{ mt: "auto" }}>
          <ListItemIcon>
            <LogoutIcon sx={{ color: "var(--color-error)" }} />
          </ListItemIcon>
          <ListItemText primary="Logout" />
        </ListItem>
      </List>
    </Box>
  );

  // Get current user ID from profile (sidebar user)
  const currentUserId = profile?.id;

  // Handler to create/find chat session
  const handleMessage = async () => {
    console.log(
      "Message button clicked, currentUserId:",
      currentUserId,
      "teacherId:",
      teacher?.id
    );
    if (!currentUserId || !teacher?.id) {
      setMsgError("User or teacher ID missing");
      return;
    }
    setMsgLoading(true);
    try {
      const chatsRef = ref(db, "chats");
      const snapshot = await get(chatsRef);
      let chatId = null;
      if (snapshot.exists()) {
        snapshot.forEach((childSnap) => {
          const chat = childSnap.val();
          const ids = Object.values(chat.participants || {});
          if (ids.includes(currentUserId) && ids.includes(teacher.id)) {
            chatId = childSnap.key;
          }
        });
      }
      if (!chatId) {
        const newChatRef = push(chatsRef);
        await set(newChatRef, {
          participants: { user1: currentUserId, user2: teacher.id },
          createdAt: Date.now(),
        });
        chatId = newChatRef.key;
      }
      console.log("Chat session ID:", chatId);
      setMsgSuccess(true);
      window.location.href = "/dashboard";
    } catch (e) {
      console.error("handleMessage error:", e);
      setMsgError(e.message);
    } finally {
      setMsgLoading(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", minHeight: "100vh" }}>
        <StyledDrawer
          variant={isMobile ? "temporary" : "permanent"}
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
        >
          {drawer}
        </StyledDrawer>
        <Box sx={{ flexGrow: 1, p: 3, mt: 8 }}>
          <CircularProgress />
        </Box>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ display: "flex", minHeight: "100vh" }}>
        <StyledDrawer
          variant={isMobile ? "temporary" : "permanent"}
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
        >
          {drawer}
        </StyledDrawer>
        <Box sx={{ flexGrow: 1, p: 3, mt: 8 }}>
          <Alert severity="error">{error}</Alert>
        </Box>
      </Box>
    );
  }

  if (!teacher) return null;

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
            onClick={() => setDrawerOpen(!drawerOpen)}
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
          <Typography variant="h6" sx={{ ml: 2, fontWeight: "bold" }}>
            Teacher Profile
          </Typography>
          <Box sx={{ flexGrow: 1 }} />
          <Box sx={{ display: "flex" }}>
            <IconButton size="large" color="inherit">
              <Badge badgeContent={4} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>
            <IconButton size="large" color="inherit">
              <Badge badgeContent={2} color="error">
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
        onClose={() => setDrawerOpen(false)}
      >
        {drawer}
      </StyledDrawer>
      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 1, sm: 3 },
          bgcolor: "var(--color-backgound-paper)",
          mt: 8,
          overflowX: "hidden",
          transition: "margin 0.2s",
          ml: isMobile ? 0 : drawerOpen ? 0 : -24,
        }}
      >
        <Banner>
          <ProfileAvatar
            src={
              teacher.avatar
                ? teacher.avatar.startsWith("http")
                  ? teacher.avatar
                  : "http://localhost:8000/" + teacher.avatar
                : undefined
            }
            alt={teacher.name}
          />
        </Banner>
        <InfoPaper elevation={0}>
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              alignItems: { xs: "flex-start", sm: "center" },
              mb: 2,
              pl: { xs: 0, sm: "160px" },
            }}
          >
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="h4" sx={{ fontWeight: "bold", mb: 1 }}>
                {teacher.name}
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                <EmailIcon
                  sx={{ fontSize: 20, mr: 1, color: "var(--color-primary)" }}
                />
                <Typography variant="body1" color="text.secondary">
                  {teacher.email}
                </Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                <SchoolIcon
                  sx={{ fontSize: 20, mr: 1, color: "var(--color-primary)" }}
                />
                <Typography variant="body1" color="text.secondary">
                  {teacher.specialization}
                </Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                <StarIcon sx={{ fontSize: 20, mr: 1, color: "#FFD700" }} />
                <Typography variant="body1" color="text.secondary">
                  {teacher.rating} ({teacher.reviews_received_count} reviews)
                </Typography>
              </Box>
              {teacher.bio && (
                <Typography
                  variant="body1"
                  sx={{ mt: 2, color: "var(--color-base-content)" }}
                >
                  {teacher.bio}
                </Typography>
              )}
              {/* Add Message button here */}
              <Box sx={{ mt: 2 }}>
                <Button
                  variant="contained"
                  sx={{
                    backgroundColor: "var(--color-primary)",
                    color: "var(--color-primary-content)",
                    fontWeight: "bold",
                  }}
                  onClick={handleMessage}
                  startIcon={<MessageIcon />}
                  disabled={msgLoading}
                >
                  {msgLoading ? "Opening chat..." : "Message"}
                </Button>
              </Box>
            </Box>
            <Box sx={{ mt: { xs: 2, sm: 0 }, ml: { sm: "auto" } }}>
              <StatChip
                label={`Specialization: ${teacher.specialization || "N/A"}`}
              />
              <StatChip
                icon={<StarIcon sx={{ color: "#FFD700" }} />}
                label={`Rating: ${teacher.rating || "N/A"}`}
              />
              <StatChip
                label={`${teacher.reviews_received_count || 0} Reviews`}
              />
            </Box>
          </Box>
        </InfoPaper>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Typography variant="h5" sx={{ fontWeight: "bold" }}>
            Videos by {teacher.name}
          </Typography>
          <Button onClick={() => navigate(-1)} sx={{ fontWeight: "bold" }}>
            Back
          </Button>
        </Box>
        {videos.length === 0 ? (
          <Typography>No videos posted yet.</Typography>
        ) : (
          <Grid container spacing={3}>
            {videos.map((video) => (
              <Grid item xs={12} md={6} key={video.id}>
                <Card
                  sx={{
                    borderRadius: 3,
                    boxShadow: "0 2px 12px rgba(0,0,0,0.07)",
                    transition: "box-shadow 0.2s",
                    "&:hover": { boxShadow: "0 6px 24px rgba(0,0,0,0.13)" },
                  }}
                >
                  <CardMedia
                    component="img"
                    height="180"
                    image={
                      thumbnailMap[video.id] ||
                      video.thumbnail ||
                      (video.video_id
                        ? `https://img.youtube.com/vi/${video.video_id}/maxresdefault.jpg`
                        : "https://img.youtube.com/vi/WUvTyaaNkzM/maxresdefault.jpg")
                    }
                    alt={video.title}
                    sx={{
                      maxWidth: 350,
                      width: "100%",
                      objectFit: "cover",
                      mx: "auto",
                      mt: 2,
                      borderRadius: 2,
                    }}
                  />
                  <CardContent>
                    <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                      {video.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mb: 1 }}
                    >
                      {video.description}
                    </Typography>
                    <Button
                      size="small"
                      sx={{
                        color: "var(--color-primary)",
                        fontWeight: "bold",
                        mt: 1,
                      }}
                      onClick={() => {
                        const url =
                          video.link ||
                          (video.video_id
                            ? `https://www.youtube.com/watch?v=${video.video_id}`
                            : null);
                        if (url)
                          window.open(url, "_blank", "noopener,noreferrer");
                      }}
                    >
                      Watch Now
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
        {/* Debug snackbars */}
        <Snackbar
          open={Boolean(msgError)}
          autoHideDuration={3000}
          onClose={() => setMsgError("")}
        >
          <MuiAlert severity="error">{msgError}</MuiAlert>
        </Snackbar>
        <Snackbar
          open={msgSuccess}
          autoHideDuration={2000}
          onClose={() => setMsgSuccess(false)}
        >
          <MuiAlert severity="success">Chat session ready!</MuiAlert>
        </Snackbar>
      </Box>
    </Box>
  );
};

export default TeacherProfile;
