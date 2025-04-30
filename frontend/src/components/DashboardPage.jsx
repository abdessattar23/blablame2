import React, { useState, useEffect } from "react";
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
  Paper,
  Divider,
  Avatar,
  TextField,
  Grid,
  Chip,
  Stack,
  Alert,
  useMediaQuery,
  useTheme,
  Tabs,
  Tab,
  Tooltip,
  SpeedDial,
  SpeedDialIcon,
  Modal,
  Backdrop,
  Fade,
  Snackbar,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Search as SearchIcon,
  Notifications as NotificationsIcon,
  Message as MessageIcon,
  Home as HomeIcon,
  Person as PersonIcon,
  School as SchoolIcon,
  Bookmark as BookmarkIcon,
  Settings as SettingsIcon,
  CalendarMonth as CalendarIcon,
  Logout as LogoutIcon,
  ArrowForward as ArrowForwardIcon,
  Add as AddIcon,
  ChevronRight as ChevronRightIcon,
  ChevronLeft as ChevronLeftIcon,
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import MuiAlert from "@mui/material/Alert";
import Logo from "./Logo";
import MessagesTab from "./MessagesTab";
import { useNavigate } from "react-router-dom";
import { initializeApp, getApp, getApps } from "firebase/app";
import {
  getDatabase,
  ref,
  onValue,
  off,
  onChildAdded,
  set,
  update,
  get, // <-- make sure this is imported
  push,
} from "firebase/database";
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
      window.location.href = "/authenticate"; // Redirect to login page
    } else {
      throw new Error("Failed to logout");
    }
  } catch (e) {
    console.error("Logout error:", e);
  }
};

// Custom styled components using the theme variables
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

/* Add the LinkedIn-style post input */
const PostInput = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  borderRadius: theme.spacing(1),
  backgroundColor: "#FCFCFC",
  marginBottom: theme.spacing(3),
  cursor: "pointer",
  border: "1px solid var(--color-base-300)",
  "&:hover": {
    borderColor: "var(--color-primary)",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
  },
}));

const SliderControl = styled(IconButton)(({ theme }) => ({
  backgroundColor: "var(--color-primary)",
  color: "var(--color-primary-content)",
  "&:hover": {
    backgroundColor: "var(--color-primary)",
    filter: "brightness(0.9)",
  },
  position: "absolute",
  zIndex: 2,
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

const ViewAllButton = styled(Button)(({ theme }) => ({
  color: "var(--color-primary)",
  fontWeight: 600,
  "&:hover": {
    backgroundColor: "transparent",
    textDecoration: "underline",
  },
}));

const CreateBlablaButton = styled(Button)(({ theme }) => ({
  backgroundColor: "var(--color-primary)",
  color: "var(--color-primary-content)",
  fontWeight: 600,
  padding: theme.spacing(1, 3),
  borderRadius: theme.spacing(1),
  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
  "&:hover": {
    backgroundColor: "var(--color-primary)",
    filter: "brightness(0.9)",
  },
}));

const BlablaForm = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: theme.spacing(1),
  backgroundColor: "#FCFCFC",
  marginBottom: theme.spacing(3),
}));

const fetchTeachers = async () => {
  const response = await fetch("http://localhost:8000/api/teachers", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
  const data = await response.json();
  return data.data;
};

// Add a new fetchVideos function
const fetchVideos = async () => {
  const response = await fetch("http://localhost:8000/api/videos/", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
  const data = await response.json();
  return data.data.data;
};

// Remove the static newsUpdates array
// const newsUpdates = [ ... ];

// Add fetchNews function
const fetchNews = async () => {
  const response = await fetch("http://localhost:8000/api/news/", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
  const data = await response.json();
  // Adjust if your API response structure is different
  return data || [];
};

// Fetches the thumbnail URL for a YouTube video using the noembed API.
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

const Dashboard = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const isTablet = useMediaQuery(theme.breakpoints.down("lg"));

  // Add sidebarTabs definition
  const sidebarTabs = [
    { text: "BlaBla Management", icon: <SchoolIcon />, index: 0 },
    { text: "Messages", icon: <MessageIcon />, index: 1 },
    { text: "Applications", icon: <BookmarkIcon />, index: 2 },
    { text: "Profile", icon: <PersonIcon />, index: 3 },
    { text: "Notifications", icon: <NotificationsIcon />, index: 4 },
  ];

  // Rest of state declarations
  const [drawerOpen, setDrawerOpen] = useState(!isMobile);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentTeacherSlide, setCurrentTeacherSlide] = useState(0);
  const [blablaText, setBlablaText] = useState("");
  const [subjectFilter, setSubjectFilter] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [blablaFormModalOpen, setBlablaFormModalOpen] = useState(false);
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);
  // Add state for teacher profiles
  const [teacherProfiles, setTeacherProfiles] = useState([]);
  // Add state for video lessons
  const [videoData, setVideoData] = useState([]);
  const [thumbnailMap, setThumbnailMap] = useState({}); // videoId -> thumbnail url
  // Add state for news
  const [newsUpdates, setNewsUpdates] = useState([]);
  const [newsLoading, setNewsLoading] = useState(true);
  // Add state for all form fields
  const [blablaTitle, setBlablaTitle] = useState("");
  const [blablaBudget, setBlablaBudget] = useState("");
  const [blablaImage, setBlablaImage] = useState(null);
  const [blablaLoading, setBlablaLoading] = useState(false);
  const [blablaError, setBlablaError] = useState("");
  const [blablaSuccess, setBlablaSuccess] = useState(false);
  const [categories, setCategories] = useState([]);
  const [activeTab, setActiveTab] = useState(0);
  const [blablas, setBlablas] = useState([]);
  const [blablasLoading, setBlablasLoading] = useState(false);
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
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [realtimeNotif, setRealtimeNotif] = useState(null);
  const [unreadMessagesCount, setUnreadMessagesCount] = useState(0);
  const [applications, setApplications] = useState([]);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [teacherReviews, setTeacherReviews] = useState([]);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const navigate = useNavigate();

  // Calculate items per slide based on screen width
  const itemsPerSlide = isMobile ? 1 : isTablet ? 2 : 3;

  useEffect(() => {
    // Fetch teacher profiles when component mounts
    const getTeachers = async () => {
      try {
        const teachers = await fetchTeachers();
        setTeacherProfiles(teachers || []);
      } catch (error) {
        console.error("Error fetching teachers:", error);
        setTeacherProfiles([]);
      }
    };

    // Fetch video lessons when component mounts
    const getVideos = async () => {
      try {
        const videos = await fetchVideos();
        setVideoData(videos || []);
      } catch (error) {
        console.error("Error fetching videos:", error);
        setVideoData([]); // Use empty array as fallback
      }
    };

    // Fetch news updates
    const getNews = async () => {
      try {
        setNewsLoading(true);
        const news = await fetchNews();
        setNewsUpdates(news || []);
      } catch (error) {
        setNewsUpdates([]);
      } finally {
        setNewsLoading(false);
      }
    };

    // Fetch categories for the BlaBla form
    const getCategories = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/categories", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const data = await response.json();
        setCategories(data.data || []);
      } catch (error) {
        setCategories([]);
      }
    };

    getTeachers();
    getVideos();
    getNews();
    getCategories();
  }, []);

  // Fetch thumbnails for YouTube videos after videoData is loaded
  useEffect(() => {
    const fetchThumbnails = async () => {
      const newMap = {};
      await Promise.all(
        videoData.map(async (video) => {
          // Try to get a YouTube link from video.link or video.video_id
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
    if (videoData && videoData.length > 0) {
      fetchThumbnails();
    }
  }, [videoData]);

  useEffect(() => {
    setDrawerOpen(!isMobile);
  }, [isMobile]);

  useEffect(() => {
    // Reset slide positions when screen size changes
    setCurrentSlide(0);
    setCurrentTeacherSlide(0);
  }, [isMobile, isTablet]);

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleNextSlide = (type) => {
    if (type === "video") {
      const maxSlides = Math.ceil((videoData.length || 1) / itemsPerSlide);
      setCurrentSlide((prev) => (prev + 1 >= maxSlides ? 0 : prev + 1));
    } else {
      const maxSlides = Math.ceil(teacherProfiles.length / itemsPerSlide);
      setCurrentTeacherSlide((prev) => (prev + 1 >= maxSlides ? 0 : prev + 1));
    }
  };

  const handlePrevSlide = (type) => {
    if (type === "video") {
      const maxSlides = Math.ceil((videoData.length || 1) / itemsPerSlide);
      setCurrentSlide((prev) => (prev === 0 ? maxSlides - 1 : prev - 1));
    } else {
      const maxSlides = Math.ceil(teacherProfiles.length / itemsPerSlide);
      setCurrentTeacherSlide((prev) => (prev === 0 ? maxSlides - 1 : prev - 1));
    }
  };

  const handleBlablaSubmit = async (e) => {
    e.preventDefault();
    setBlablaLoading(true);
    setBlablaError("");
    try {
      const formData = new FormData();
      formData.append("title", blablaTitle);
      formData.append("description", blablaText);
      formData.append("category_id", subjectFilter);
      formData.append("budget", blablaBudget);
      if (blablaImage) {
        formData.append("image", blablaImage);
      }
      const response = await fetch("http://localhost:8000/api/blablas", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formData,
      });
      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || "Failed to create BlaBla");
      }
      setBlablaSuccess(true);
      setBlablaText("");
      setSubjectFilter("");
      setBlablaTitle("");
      setBlablaBudget("");
      setBlablaImage(null);
      setBlablaFormModalOpen(false);
    } catch (error) {
      setBlablaError(error.message);
    } finally {
      setBlablaLoading(false);
    }
  };

  // Fetch user's blablas for management tab (now for profile tab)
  useEffect(() => {
    const fetchBlablas = async () => {
      setBlablasLoading(true);
      try {
        const response = await fetch("http://localhost:8000/api/blablas", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const data = await response.json();
        console.log("Raw blablas data:", data);

        const blablasData = data.data.data || [];
        console.log("Processed blablas:", blablasData);
        setBlablas(blablasData);

        // Extract applications from blablas and flatten them
        const allApplications = blablasData.reduce((acc, blabla) => {
          console.log(
            "Processing blabla:",
            blabla.id,
            "applications:",
            blabla.applications
          );
          const blablaApplications = (blabla.applications || []).map((app) => ({
            ...app,
            blablaId: blabla.id,
            __key: app.id, // Use backend id as key
          }));
          return [...acc, ...blablaApplications];
        }, []);

        console.log("Final applications array:", allApplications);
        setApplications(allApplications);
      } catch (e) {
        console.error("Error fetching blablas:", e);
        setBlablas([]);
        setApplications([]);
      } finally {
        setBlablasLoading(false);
      }
    };
    fetchBlablas();
  }, [activeTab, blablaSuccess]);

  // Fetch profile info
  useEffect(() => {
    const fetchProfile = async () => {
      setProfileLoading(true);
      setProfileError && setProfileError(""); // Only if setProfileError exists
      try {
        const res = await fetch("http://localhost:8000/api/profile/me", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (!res.ok) throw new Error("Failed to fetch profile");
        const data = await res.json();
        setProfile(data.data || {});
        setProfileForm &&
          setProfileForm({
            name: data.data?.name || "",
            email: data.data?.email || "",
            avatar: null,
          });
      } catch (e) {
        setProfileError && setProfileError(e.message);
      } finally {
        setProfileLoading(false);
      }
    };
    fetchProfile();
  }, []);

  // Fetch categories for the BlaBla form
  const getCategories = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/categories", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await response.json();
      setCategories(data.data || []);
    } catch (error) {
      setCategories([]);
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

  // Real-time notifications from Firebase
  useEffect(() => {
    if (!profile?.id) return;
    const notifRef = ref(db, `notifications/${profile.id}`);
    const handleNewNotif = (snapshot) => {
      const notif = snapshot.val();
      setNotifications((prev) => [notif, ...prev]);
      setUnreadCount((prev) => prev + 1);
      setRealtimeNotif(notif);
    };
    // Listen for new notifications
    onChildAdded(notifRef, handleNewNotif);

    // Listen for all notifications to set unread count
    const handleAllNotifs = (snapshot) => {
      const data = snapshot.val() || {};
      const notifArr = Object.values(data).reverse();
      setNotifications(notifArr);
      setUnreadCount(notifArr.filter((n) => !n.read).length);
    };
    onValue(notifRef, handleAllNotifs);

    return () => {
      off(notifRef, "child_added", handleNewNotif);
      off(notifRef, "value", handleAllNotifs);
    };
  }, [profile?.id]);

  // Mark all notifications as read when opening Notifications tab
  useEffect(() => {
    if (activeTab === 3 && profile?.id) {
      const notifRef = ref(db, `notifications/${profile.id}`);
      // Mark all as read in Firebase
      notifications.forEach((notif, idx) => {
        if (!notif.read) {
          // Mark as read (for demo, not updating Firebase here)
          // In production, update the 'read' property in Firebase
        }
      });
      setUnreadCount(0);
    }
  }, [activeTab, profile?.id, notifications]);

  // Listen for unread messages count for the current user
  useEffect(() => {
    if (!profile?.id) return;
    const db = getDatabase(); // or use your existing db instance
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

  // Accept/Deny Applications
  const handleAcceptApplication = async (blablaId, appId) => {
    try {
      const response = await fetch(
        `http://localhost:8000/api/blablas/application/${appId}/accept`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to accept application");
      }

      // Update local state to reflect changes
      setApplications((prevApps) =>
        prevApps.map((app) => ({
          ...app,
          status:
            app.id === appId
              ? "accepted"
              : app.blablaId === blablaId
              ? "denied"
              : app.status,
        }))
      );

      // Show success message
      setBlablaSuccess(true);

      // --- Create a new messaging session with the applicant (teacher) ---
      // Find the application object
      const acceptedApp = applications.find(
        (app) => app.id === appId || app.__key === appId
      );
      console.log("Accepted application object:", acceptedApp);
      console.log("Current profile:", profile);
      if (acceptedApp && acceptedApp.user_id && profile?.id) {
        // Fetch teacher profile for name
        let teacherName = "Teacher";
        try {
          const res = await fetch(
            `http://localhost:8000/api/users/${acceptedApp.user_id}`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );
          if (res.ok) {
            const data = await res.json();
            teacherName = data.data?.name || teacherName;
          }
        } catch (err) {
          console.log("Error fetching teacher profile:", err);
        }

        const dbInstance = getDatabase();
        const chatsRef = ref(dbInstance, "chats");

        // Check if a chat already exists between these two users
        const chatsSnap = await get(chatsRef);
        let chatExists = false;
        if (chatsSnap.exists()) {
          const chatsData = chatsSnap.val();
          console.log("Existing chats data:", chatsData);
          for (const chatId in chatsData) {
            const chat = chatsData[chatId];
            const participants = Object.values(chat.participants || {});
            console.log(
              "Checking chat:",
              chatId,
              "participants:",
              participants
            );
            if (
              participants.length === 2 &&
              participants.includes(profile.id) &&
              participants.includes(acceptedApp.user_id)
            ) {
              chatExists = true;
              console.log(
                "Chat already exists between users:",
                profile.id,
                acceptedApp.user_id
              );
              break;
            }
          }
        }
        if (!chatExists) {
          // Create a new chat
          const newChatRef = push(chatsRef);
          console.log("Creating new chat with:", {
            user1: profile.id,
            user2: acceptedApp.user_id,
            participantNames: {
              [profile.id]: profile.name,
              [acceptedApp.user_id]: teacherName,
            },
          });
          await set(newChatRef, {
            participants: {
              user1: profile.id,
              user2: acceptedApp.user_id,
            },
            participantNames: {
              [profile.id]: profile.name,
              [acceptedApp.user_id]: teacherName,
            },
            createdAt: Date.now(),
            lastMessage: null,
          });
          console.log("New chat created successfully.");
        }
      } else {
        // More detailed logging for debugging
        console.log(
          "Cannot create chat: missing acceptedApp, user_id, or profile id."
        );
        console.log("acceptedApp:", acceptedApp);
        if (acceptedApp) {
          console.log("acceptedApp.user_id:", acceptedApp.user_id);
        }
        console.log("profile:", profile);
        if (profile) {
          console.log("profile.id:", profile.id);
        }
      }
      // --- end create chat ---
    } catch (error) {
      console.error("Error accepting application:", error);
      alert("Failed to accept application");
    }
  };

  const handleDenyApplication = async (blablaId, appId) => {
    try {
      const response = await fetch(
        `http://localhost:8000/api/blablas/application/${appId}/deny`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to deny application");
      }

      // Update local state
      setApplications((prevApps) =>
        prevApps.map((app) => ({
          ...app,
          status: app.id === appId ? "denied" : app.status,
        }))
      );
    } catch (error) {
      console.error("Error denying application:", error);
      alert("Failed to deny application");
    }
  };

  const renderTabContent = () => {
    if (activeTab === 0) {
      // BlaBla Management
      return (
        <Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Typography
              variant="h5"
              sx={{ fontWeight: "bold", color: "var(--color-base-content)" }}
            >
              My BlaBlas
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              sx={{
                backgroundColor: "var(--color-primary)",
                color: "var(--color-primary-content)",
              }}
              onClick={() => setBlablaFormModalOpen(true)}
            >
              New BlaBla
            </Button>
          </Box>
          {blablasLoading ? (
            <Box sx={{ p: 4, textAlign: "center" }}>
              <Typography variant="body1" color="text.secondary">
                Loading your BlaBlas...
              </Typography>
            </Box>
          ) : blablas.length === 0 ? (
            <Box sx={{ p: 4, textAlign: "center" }}>
              <Typography variant="body1" color="text.secondary">
                You have not posted any BlaBlas yet.
              </Typography>
            </Box>
          ) : (
            <Grid container spacing={2}>
              {blablas.map((blabla) => (
                <Grid item xs={12} md={6} lg={4} key={blabla.id}>
                  <Card
                    sx={{
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
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
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </Box>
      );
    }
    if (activeTab === 1) {
      // Messages
      return (
        <MessagesTab
          sendNotification={sendFirebaseNotification}
          currentUser={profile}
        />
      );
    }
    if (activeTab === 2) {
      // Applications tab
      return (
        <Box>
          <Typography variant="h5" sx={{ fontWeight: "bold", mb: 2 }}>
            Applications to Your BlaBlas
          </Typography>
          {applications.length === 0 ? (
            <Alert severity="info">No applications yet.</Alert>
          ) : (
            <List>
              {applications.map((app) => (
                <ListItem
                  key={app.__key}
                  sx={{
                    bgcolor:
                      app.status === "accepted"
                        ? "var(--color-success-light)"
                        : app.status === "denied"
                        ? "var(--color-error-light)"
                        : "var(--color-base-200)",
                    mb: 1,
                    borderRadius: 2,
                  }}
                  secondaryAction={
                    app.status === "pending" && (
                      <Box>
                        <Button
                          color="success"
                          variant="contained"
                          size="small"
                          sx={{ mr: 1 }}
                          onClick={() =>
                            handleAcceptApplication(app.blablaId, app.__key)
                          }
                        >
                          Accept
                        </Button>
                        <Button
                          color="error"
                          variant="outlined"
                          size="small"
                          onClick={() =>
                            handleDenyApplication(app.blablaId, app.__key)
                          }
                        >
                          Deny
                        </Button>
                      </Box>
                    )
                  }
                >
                  <ListItemIcon>
                    <Avatar
                      src={
                        app.teacher?.avatar
                          ? app.teacher.avatar.startsWith("http")
                            ? app.teacher.avatar
                            : "http://localhost:8000/" + app.teacher.avatar
                          : undefined
                      }
                    />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Box>
                        <Typography sx={{ fontWeight: "bold" }}>
                          {app.teacher?.name || "Teacher"}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {app.message}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Status:{" "}
                          {app.status === "accepted"
                            ? "Accepted"
                            : app.status === "denied"
                            ? "Denied"
                            : "Pending"}
                        </Typography>
                      </Box>
                    }
                    secondary={
                      <Typography variant="caption" color="text.secondary">
                        BlaBla:{" "}
                        {blablas.find((b) => b.id === app.blablaId)?.title ||
                          ""}
                      </Typography>
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
      // Profile: show profile info/edit and My BlaBla
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
              {/* My BlaBlas Section */}
              <Box sx={{ mt: 6 }}>
                <Typography variant="h5" sx={{ fontWeight: "bold", mb: 2 }}>
                  My BlaBlas
                </Typography>
                {blablasLoading ? (
                  <Box sx={{ p: 4, textAlign: "center" }}>
                    <Typography variant="body1" color="text.secondary">
                      Loading your BlaBlas...
                    </Typography>
                  </Box>
                ) : blablas.length === 0 ? (
                  <Box sx={{ p: 4, textAlign: "center" }}>
                    <Typography variant="body1" color="text.secondary">
                      You have not posted any BlaBlas yet.
                    </Typography>
                  </Box>
                ) : (
                  <Grid container spacing={2}>
                    {blablas.map((blabla) => (
                      <Grid item xs={12} md={6} lg={4} key={blabla.id}>
                        <Card
                          sx={{
                            height: "100%",
                            display: "flex",
                            flexDirection: "column",
                          }}
                        >
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
                            <Typography
                              variant="h6"
                              sx={{ fontWeight: "bold" }}
                            >
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
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              {blabla.created_at
                                ? new Date(
                                    blabla.created_at
                                  ).toLocaleDateString()
                                : ""}
                            </Typography>
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                )}
              </Box>
            </Box>
          ) : null}
        </Box>
      );
    }
    if (activeTab === 3) {
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
                  key={idx}
                  sx={{
                    bgcolor: notif.read ? "inherit" : "var(--color-base-200)",
                  }}
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
    return null;
  };

  // Helper to send notification to Firebase
  const sendFirebaseNotification = async ({
    toUserId,
    fromUserName,
    message,
  }) => {
    if (!toUserId) return;
    const notifRef = ref(db, `notifications/${toUserId}`);
    await push(notifRef, {
      title: `New message from ${fromUserName}`,
      message: message || "You have a new message.",
      timestamp: Date.now(),
      read: false,
      type: "message",
    });
  };

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

  return (
    <Box
      sx={{
        display: "flex",
        bgcolor: "var(--color-background-paper)",
        minHeight: "100vh",
      }}
    >
      {/* App Bar */}{" "}
      <StyledAppBar
        position="fixed"
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <Toolbar>
          {" "}
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={handleDrawerToggle}
            sx={{
              mr: 2,
              display: { xs: "flex", md: "none" }, // Only show on mobile (xs, sm), hide on md and up
            }}
          >
            <MenuIcon />{" "}
          </IconButton>
          <Box
            sx={{
              display: { xs: "none", md: "flex" }, // Hide on mobile (xs, sm), show on md and up
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
              onClick={() => setActiveTab(3)}
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
        {/* Only show the welcome/post/news/teachers/videos if on tab 0 */}
        {activeTab === 0 && (
          <>
            {/* Welcome Section */}
            <Box
              sx={{
                mb: 4,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Box>
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: "bold",
                    color: "var(--color-base-content)",
                  }}
                >
                  {profile?.name
                    ? `Welcome back, ${profile.name}!`
                    : "Welcome!"}
                </Typography>
                <Typography
                  variant="body1"
                  sx={{ color: "var(--color-base-content)", opacity: 0.8 }}
                >
                  What would you like to learn today?
                </Typography>
              </Box>
              <Box>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: "bold",
                    color: "var(--color-base-content)",
                  }}
                >
                  {new Date().toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </Typography>
              </Box>
            </Box>{" "}
            {/* LinkedIn-style Post Input - Shown on desktop */}
            <Box sx={{ display: { xs: "none", md: "block" }, mb: 4 }}>
              <PostInput
                elevation={1}
                onClick={() => setBlablaFormModalOpen(true)}
              >
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Avatar
                    sx={{ width: 40, height: 40, mr: 2 }}
                    alt={profile?.name || "Student Name"}
                    src={
                      profile?.avatar
                        ? profile.avatar.startsWith("http")
                          ? profile.avatar
                          : "http://localhost:8000/" + profile.avatar
                        : undefined
                    }
                  />
                  <TextField
                    fullWidth
                    placeholder="What do you want to learn today?"
                    variant="outlined"
                    InputProps={{
                      readOnly: true,
                      sx: {
                        borderRadius: 4,
                        backgroundColor: "var(--color-base-100)",
                        cursor: "pointer",
                      },
                    }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        "& fieldset": { borderColor: "var(--color-base-300)" },
                        "&:hover fieldset": {
                          borderColor: "var(--color-primary)",
                        },
                      },
                    }}
                    onClick={() => setBlablaFormModalOpen(true)}
                  />
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mt: 2,
                    pt: 2,
                    borderTop: "1px solid var(--color-base-200)",
                  }}
                >
                  <Button
                    startIcon={<SchoolIcon />}
                    sx={{
                      color: "var(--color-primary)",
                      textTransform: "none",
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setBlablaFormModalOpen(true);
                    }}
                  >
                    Create a BlaBla
                  </Button>
                  <Button
                    startIcon={<AddIcon />}
                    sx={{
                      color: "var(--color-primary)",
                      textTransform: "none",
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setBlablaFormModalOpen(true);
                    }}
                  >
                    Upload Image
                  </Button>
                </Box>
              </PostInput>
            </Box>
            {/* BlaBlaForm Modal - For desktop and mobile */}
            <Modal
              aria-labelledby="blabla-form-modal-title"
              aria-describedby="blabla-form-modal-description"
              open={blablaFormModalOpen}
              onClose={() => setBlablaFormModalOpen(false)}
              closeAfterTransition
              slots={{ backdrop: Backdrop }}
              slotProps={{
                backdrop: {
                  timeout: 500,
                },
              }}
            >
              <Fade in={blablaFormModalOpen}>
                <Box
                  sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: { xs: "90%", sm: "80%", md: "70%" },
                    maxHeight: "90vh",
                    overflowY: "auto",
                    bgcolor: "background.paper",
                    boxShadow: 24,
                    p: 3,
                    borderRadius: 2,
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                    <SchoolIcon
                      sx={{
                        mr: 1.5,
                        color: "var(--color-primary)",
                        fontSize: 28,
                      }}
                    />
                    <Typography
                      variant="h5"
                      sx={{
                        fontWeight: "600",
                        color: "var(--color-base-content)",
                      }}
                    >
                      Create a BlaBla
                    </Typography>
                  </Box>
                  <Typography
                    variant="body1"
                    sx={{
                      mb: 3,
                      color: "var(--color-base-content)",
                      opacity: 0.7,
                    }}
                  >
                    Post your learning request and get matched with the perfect
                    teacher
                  </Typography>
                  <form onSubmit={handleBlablaSubmit}>
                    <Grid container spacing={3}>
                      <Grid item xs={12} md={6}>
                        <Typography
                          variant="subtitle2"
                          sx={{
                            mb: 1,
                            fontWeight: 500,
                            color: "var(--color-base-content)",
                          }}
                        >
                          What do you want to learn?
                        </Typography>
                        <TextField
                          fullWidth
                          multiline
                          rows={4}
                          value={blablaText}
                          onChange={(e) => setBlablaText(e.target.value)}
                          placeholder="Describe what you're looking for help with in detail..."
                          required
                          variant="outlined"
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
                        <Typography
                          variant="caption"
                          sx={{
                            mt: 1,
                            display: "block",
                            color: "var(--color-base-content)",
                            opacity: 0.6,
                          }}
                        >
                          Be specific about your learning goals to get better
                          matches
                        </Typography>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Typography
                          variant="subtitle2"
                          sx={{
                            mb: 1,
                            fontWeight: 500,
                            color: "var(--color-base-content)",
                          }}
                        >
                          Subject Details
                        </Typography>
                        <TextField
                          select
                          fullWidth
                          value={subjectFilter}
                          onChange={(e) => setSubjectFilter(e.target.value)}
                          SelectProps={{
                            native: true,
                          }}
                          placeholder="Select subject area"
                          variant="outlined"
                          InputProps={{
                            sx: {
                              borderRadius: 2,
                              backgroundColor: "var(--color-base-100)",
                            },
                          }}
                          sx={{
                            mb: 3,
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
                        >
                          <option value="">Select a category</option>
                          {categories.map((cat) => (
                            <option key={cat.id} value={cat.id}>
                              {cat.name}
                            </option>
                          ))}
                        </TextField>

                        <Typography
                          variant="subtitle2"
                          sx={{
                            mt: 2,
                            mb: 1,
                            fontWeight: 500,
                            color: "var(--color-base-content)",
                          }}
                        >
                          Title
                        </Typography>
                        <TextField
                          fullWidth
                          required
                          placeholder="Enter a clear title for your request"
                          variant="outlined"
                          value={blablaTitle}
                          onChange={(e) => setBlablaTitle(e.target.value)}
                          InputProps={{
                            sx: {
                              borderRadius: 2,
                              backgroundColor: "var(--color-base-100)",
                            },
                          }}
                          sx={{
                            mb: 3,
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
                          }}
                        />

                        <Typography
                          variant="subtitle2"
                          sx={{
                            mb: 1,
                            fontWeight: 500,
                            color: "var(--color-base-content)",
                          }}
                        >
                          Budget
                        </Typography>
                        <TextField
                          fullWidth
                          required
                          type="number"
                          placeholder="Your budget in $"
                          variant="outlined"
                          value={blablaBudget}
                          onChange={(e) => setBlablaBudget(e.target.value)}
                          InputProps={{
                            sx: {
                              borderRadius: 2,
                              backgroundColor: "var(--color-base-100)",
                            },
                          }}
                          sx={{
                            mb: 3,
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
                          }}
                        />

                        <Typography
                          variant="subtitle2"
                          sx={{
                            mb: 1,
                            fontWeight: 500,
                            color: "var(--color-base-content)",
                          }}
                        >
                          Upload Image (Optional)
                        </Typography>
                        <TextField
                          fullWidth
                          type="file"
                          variant="outlined"
                          inputProps={{ accept: "image/*" }}
                          onChange={(e) => setBlablaImage(e.target.files[0])}
                          InputProps={{
                            sx: {
                              borderRadius: 2,
                              backgroundColor: "var(--color-base-100)",
                            },
                          }}
                          sx={{
                            mb: 1,
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
                          }}
                        />
                        <Typography
                          variant="caption"
                          sx={{
                            mb: 3,
                            display: "block",
                            color: "var(--color-base-content)",
                            opacity: 0.6,
                          }}
                        >
                          Upload an image related to your learning request (max
                          5MB)
                        </Typography>

                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "flex-end",
                            mt: 3,
                          }}
                        >
                          <Button
                            onClick={() => setBlablaFormModalOpen(false)}
                            sx={{
                              mr: 2,
                              color: "var(--color-base-content)",
                              fontWeight: 500,
                            }}
                          >
                            Cancel
                          </Button>
                          <CreateBlablaButton
                            type="submit"
                            variant="contained"
                            startIcon={<AddIcon />}
                            size="large"
                            sx={{
                              py: 1.5,
                              px: 4,
                              borderRadius: 2,
                              textTransform: "none",
                              fontSize: "1rem",
                              boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                            }}
                            disabled={blablaLoading}
                          >
                            {blablaLoading ? "Posting..." : "Post BlaBla"}
                          </CreateBlablaButton>
                        </Box>
                        {blablaError && (
                          <Alert severity="error" sx={{ mt: 2 }}>
                            {blablaError}
                          </Alert>
                        )}
                      </Grid>
                    </Grid>
                  </form>
                </Box>
              </Fade>
            </Modal>
            {/* Speed Dial for mobile - Only visible on mobile */}
            <Box
              sx={{
                display: { xs: "block", md: "none" },
                position: "fixed",
                bottom: 30,
                right: 30,
                zIndex: 1000,
              }}
            >
              <SpeedDial
                ariaLabel="Create BlaBla SpeedDial"
                icon={<SpeedDialIcon />}
                onClick={() => setBlablaFormModalOpen(true)}
                sx={{
                  "& .MuiFab-primary": {
                    backgroundColor: "var(--color-primary)",
                    "&:hover": {
                      backgroundColor: "var(--color-primary)",
                      filter: "brightness(0.9)",
                    },
                  },
                }}
              />
            </Box>
            {/* Video Lessons Section */}
            <Box sx={{ mb: 4 }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 2,
                }}
              >
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: "bold",
                    color: "var(--color-base-content)",
                  }}
                >
                  Latest Video Lessons
                </Typography>
                <ViewAllButton endIcon={<ArrowForwardIcon />}>
                  View All
                </ViewAllButton>
              </Box>

              <Box sx={{ position: "relative" }}>
                <SliderControl
                  onClick={() => handlePrevSlide("video")}
                  sx={{ left: 8, top: "50%", transform: "translateY(-50%)" }}
                >
                  <ChevronLeftIcon />
                </SliderControl>

                <Box
                  sx={{
                    display: "flex",
                    overflowX: "hidden",
                    px: 6,
                    py: 1,
                  }}
                >
                  {videoData.length > 0 ? (
                    <Box
                      sx={{
                        display: "flex",
                        transition: "transform 0.5s ease-in-out",
                        transform: `translateX(calc(-${
                          currentSlide * 100
                        }% / ${itemsPerSlide}))`,
                        gap: 2,
                        width: `calc(${
                          100 * (videoData.length / itemsPerSlide)
                        }%)`,
                      }}
                    >
                      {videoData.map((video) => (
                        <Box
                          key={video.id}
                          sx={{
                            flex: `0 0 calc(${
                              (100 / videoData.length) * itemsPerSlide
                            }% - ${theme.spacing(2)})`,
                            maxWidth: 280,
                            padding: 1,
                          }}
                        >
                          <StyledCard>
                            <CardMedia
                              component="img"
                              height="140"
                              image={
                                thumbnailMap[video.id] ||
                                video.thumbnail ||
                                (video.video_id
                                  ? `https://img.youtube.com/vi/${video.video_id}/maxresdefault.jpg`
                                  : "https://img.youtube.com/vi/WUvTyaaNkzM/maxresdefault.jpg")
                              }
                              alt={video.title}
                            />

                            <CardContent>
                              <Typography variant="h6" component="div" noWrap>
                                {video.title}
                              </Typography>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{ mb: 1 }}
                              >
                                By {video.user.name || "Unknown Teacher"}
                              </Typography>
                              <Button
                                size="small"
                                sx={{
                                  color: "var(--color-primary)",
                                  fontWeight: "bold",
                                }}
                                onClick={() => {
                                  const url =
                                    video.link ||
                                    (video.video_id
                                      ? `https://www.youtube.com/watch?v=${video.video_id}`
                                      : null);
                                  if (url)
                                    window.open(
                                      url,
                                      "_blank",
                                      "noopener,noreferrer"
                                    );
                                }}
                              >
                                Watch Now
                              </Button>
                            </CardContent>
                          </StyledCard>
                        </Box>
                      ))}
                    </Box>
                  ) : (
                    <Box
                      sx={{
                        p: 4,
                        textAlign: "center",
                        width: "100%",
                        bgcolor: "var(--color-base-200)",
                        borderRadius: 2,
                        py: 6,
                      }}
                    >
                      {videoData === null ? (
                        <Typography variant="body1" color="text.secondary">
                          Loading video lessons...
                        </Typography>
                      ) : (
                        <>
                          <Typography
                            variant="h6"
                            sx={{ mb: 1, fontWeight: "medium" }}
                          >
                            No videos posted yet
                          </Typography>
                          <Typography variant="body1" color="text.secondary">
                            Check back later for new content or explore other
                            learning resources
                          </Typography>
                        </>
                      )}
                    </Box>
                  )}
                </Box>

                <SliderControl
                  onClick={() => handleNextSlide("video")}
                  sx={{ right: 8, top: "50%", transform: "translateY(-50%)" }}
                >
                  <ChevronRightIcon />
                </SliderControl>
              </Box>
            </Box>
            {/* Teacher Profiles Section */}
            <Box sx={{ mb: 4 }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 2,
                }}
              >
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: "bold",
                    color: "var(--color-base-content)",
                  }}
                >
                  Top Teachers
                </Typography>
                <ViewAllButton endIcon={<ArrowForwardIcon />}>
                  View All
                </ViewAllButton>
              </Box>

              <Box sx={{ position: "relative" }}>
                <SliderControl
                  onClick={() => handlePrevSlide("teacher")}
                  sx={{ left: 8, top: "50%", transform: "translateY(-50%)" }}
                >
                  <ChevronLeftIcon />
                </SliderControl>

                <Box
                  sx={{
                    display: "flex",
                    overflowX: "hidden",
                    px: 6,
                    py: 1,
                  }}
                >
                  {teacherProfiles.length > 0 ? (
                    <Box
                      sx={{
                        display: "flex",
                        transition: "transform 0.5s ease-in-out",
                        transform: `translateX(calc(-${
                          currentTeacherSlide * 100
                        }% / ${itemsPerSlide}))`,
                        gap: 2, // Add gap between items
                        width: `calc(${
                          100 * (teacherProfiles.length / itemsPerSlide)
                        }%)`,
                      }}
                    >
                      {teacherProfiles.map((teacher) => (
                        <Box
                          key={teacher.id}
                          sx={{
                            flex: `0 0 calc(${
                              (100 / teacherProfiles.length) * itemsPerSlide
                            }% - ${theme.spacing(2)})`,
                            maxWidth: 280,
                            padding: 1,
                          }}
                        >
                          <StyledCard>
                            <Box sx={{ display: "flex", p: 2 }}>
                              <Avatar
                                src={"http://localhost:8000/" + teacher.avatar}
                                alt={teacher.name}
                                sx={{ width: 80, height: 80 }}
                              />
                              <Box sx={{ ml: 2 }}>
                                <Typography variant="h6" component="div">
                                  {teacher.name}
                                </Typography>
                                <Box
                                  sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    mt: 0.5,
                                  }}
                                >
                                  <Box
                                    sx={{
                                      bgcolor: "var(--color-primary)",
                                      color: "var(--color-primary-content)",
                                      px: 1,
                                      borderRadius: 1,
                                      mr: 1,
                                      fontSize: "0.875rem",
                                      fontWeight: "bold",
                                    }}
                                  >
                                    {teacher.rating}
                                  </Box>
                                  <Typography
                                    variant="body2"
                                    color="text.secondary"
                                  >
                                    ({teacher.reviews_received_count} reviews)
                                  </Typography>
                                </Box>
                              </Box>
                            </Box>
                            <Divider />
                            <CardContent>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{ mb: 1 }}
                              >
                                <strong>Specialization:</strong>{" "}
                                {teacher.specialization}
                              </Typography>
                              <Button
                                variant="outlined"
                                fullWidth
                                sx={{
                                  borderColor: "var(--color-primary)",
                                  color: "var(--color-primary)",
                                  fontWeight: "bold",
                                  "&:hover": {
                                    borderColor: "var(--color-primary)",
                                    backgroundColor: "rgba(0,0,0,0.04)",
                                  },
                                }}
                                onClick={() =>
                                  navigate(`/teacher/${teacher.id}`)
                                }
                              >
                                View Profile
                              </Button>
                            </CardContent>
                          </StyledCard>
                        </Box>
                      ))}
                    </Box>
                  ) : (
                    <Box sx={{ p: 4, textAlign: "center", width: "100%" }}>
                      <Typography variant="body1" color="text.secondary">
                        Loading teacher profiles...
                      </Typography>
                    </Box>
                  )}
                </Box>

                <SliderControl
                  onClick={() => handleNextSlide("teacher")}
                  sx={{ right: 8, top: "50%", transform: "translateY(-50%)" }}
                >
                  <ChevronRightIcon />
                </SliderControl>
              </Box>
            </Box>
            {/* News & Updates Section */}
            <Box sx={{ mb: 4 }}>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: "bold",
                  color: "var(--color-base-content)",
                  mb: 2,
                }}
              >
                News & Updates
              </Typography>

              <Grid container spacing={2}>
                {newsLoading ? (
                  <Grid item xs={12}>
                    <Box sx={{ p: 4, textAlign: "center" }}>
                      <Typography variant="body1" color="text.secondary">
                        Loading news...
                      </Typography>
                    </Box>
                  </Grid>
                ) : newsUpdates.length === 0 ? (
                  <Grid item xs={12}>
                    <Box sx={{ p: 4, textAlign: "center" }}>
                      <Typography variant="body1" color="text.secondary">
                        No news updates available.
                      </Typography>
                    </Box>
                  </Grid>
                ) : (
                  newsUpdates.map((news) => (
                    <Grid item xs={12} md={4} key={news.id}>
                      <Card
                        sx={{
                          height: "100%",
                          borderTop:
                            news.category === "feature"
                              ? "3px solid var(--color-primary)"
                              : "3px solid var(--color-secondary)",
                        }}
                      >
                        <CardContent>
                          <Typography
                            gutterBottom
                            variant="subtitle1"
                            component="div"
                            sx={{ fontWeight: "bold" }}
                          >
                            {news.title}
                          </Typography>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ mb: 2 }}
                          >
                            {news.content}
                          </Typography>
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              mt: 1,
                            }}
                          >
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              {/* Format date if available */}
                              {news.date ||
                                (news.created_at
                                  ? new Date(
                                      news.created_at
                                    ).toLocaleDateString()
                                  : "")}
                            </Typography>
                            <Chip
                              label={
                                news.category === "feature"
                                  ? "New Feature"
                                 
                                  : news.category === "tip"
                                  ? "Study Tip"
                                  : news.category || "Update"
                              }
                              size="small"
                              sx={{
                                bgcolor:
                                  news.category === "feature"
                                    ? "var(--color-primary)"
                                    : "var(--color-secondary)",
                                color:
                                  news.category === "feature"
                                    ? "var(--color-primary-content)"
                                    : "var(--color-secondary-content)",
                              }}
                            />
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))
                )}
              </Grid>
            </Box>
            <Snackbar
              open={blablaSuccess}
              autoHideDuration={3000}
              onClose={() => setBlablaSuccess(false)}
            >
              <MuiAlert
                elevation={6}
                variant="filled"
                onClose={() => setBlablaSuccess(false)}
                severity="success"
                sx={{ width: "100%" }}
              >
                BlaBla created successfully!
              </MuiAlert>
            </Snackbar>
          </>
        )}
        {/* Tab Content */}
        {renderTabContent()}
        {/* Snackbar for real-time notification */}
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
        {/* Logout Confirmation Modal */}
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
        {/* Review Modal */}
        <Modal
          open={reviewModalOpen}
          onClose={() => setReviewModalOpen(false)}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500,
          }}
        >
          <Fade in={reviewModalOpen}>
            <Box
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: { xs: "90%", sm: 600 },
                bgcolor: "background.paper",
                boxShadow: 24,
                p: 4,
                borderRadius: 2,
                maxHeight: "90vh",
                overflowY: "auto",
              }}
            >
              <Typography variant="h5" sx={{ mb: 3 }}>
                Review {selectedTeacher?.name}
              </Typography>
              <ReviewForm
                teacherId={selectedTeacher?.id}
                onSuccess={() => {
                  setReviewModalOpen(false);
                  // Refresh teacher profiles to update ratings
                  fetchTeachers().then(teachers => setTeacherProfiles(teachers || []));
                }}
              />
              <Typography variant="h6" sx={{ mt: 4, mb: 2 }}>
                Previous Reviews
              </Typography>
              {teacherReviews.length > 0 ? (
                teacherReviews.map((review) => (
                  <Box key={review.id} sx={{ mb: 2, p: 2, bgcolor: 'var(--color-base-200)', borderRadius: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Rating value={review.rating} readOnly size="small" />
                      <Typography variant="caption" sx={{ ml: 1 }}>
                        {new Date(review.created_at).toLocaleDateString()}
                      </Typography>
                    </Box>
                    <Typography variant="body2">{review.comment}</Typography>
                  </Box>
                ))
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No reviews yet
                </Typography>
              )}
            </Box>
          </Fade>
        </Modal>
      </Box>
    </Box>
  );
};

export default Dashboard;
