import React, { useState, useEffect } from "react";
import {
  Box,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Badge,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Divider,
  Avatar,
  Grid,
  useMediaQuery,
  useTheme,
  Tabs,
  Tab,
  Container,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
  CircularProgress,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Notifications as NotificationsIcon,
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Category as CategoryIcon,
  Email as EmailIcon,
  AdminPanelSettings as AdminPanelSettingsIcon,
  Logout as LogoutIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Add as AddIcon,
  Visibility as VisibilityIcon,
  Article as ArticleIcon,
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import { DataGrid } from "@mui/x-data-grid";

// --- Reusing Styled Components from DashboardPage.jsx ---
// (You might want to move these to a shared styles file)

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

// --- API Helpers ---
const API_BASE = "http://localhost:8000/api/admin";
const getToken = () => localStorage.getItem("token");

const fetchWithAuth = async (url, options = {}) => {
  const headers = {
    Accept: "application/json",
    "Content-Type": "application/json",
    Authorization: `Bearer ${getToken()}`,
    ...options.headers,
  };
  const res = await fetch(url, { ...options, headers });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
};

// --- Dashboard Data ---
const fetchAdminDashboardData = async () => {
  const res = await fetchWithAuth(`${API_BASE}/dashboard`);
  return res.data || {};
};

// --- Users ---
const fetchAdminUsers = async () => {
  const res = await fetchWithAuth(`${API_BASE}/users`);
  // The API returns { success, data: { data: [users], ...pagination } }
  return res.data?.data || [];
};
const updateUserStatus = async (id, status) => {
  await fetchWithAuth(`${API_BASE}/users/${id}/status`, {
    method: "PUT",
    body: JSON.stringify({ status }),
  });
};
const validateUserCIN = async (id, validated) => {
  await fetchWithAuth(`${API_BASE}/users/${id}/validate-cin`, {
    method: "PUT",
    body: JSON.stringify({ verified: validated }),
  });
};

// --- Categories ---
const fetchAdminCategories = async () => {
  const res = await fetchWithAuth(`${API_BASE}/categories`);
  return res.data || [];
};
const createCategory = async (data) => {
  const res = await fetchWithAuth(`${API_BASE}/categories`, {
    method: "POST",
    body: JSON.stringify(data),
  });
  return res.data;
};
const updateCategory = async (id, data) => {
  await fetchWithAuth(`${API_BASE}/categories/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
};
const deleteCategory = async (id) => {
  await fetchWithAuth(`${API_BASE}/categories/${id}`, {
    method: "DELETE",
  });
};

// --- Newsletter ---
const sendNewsletter = async (data) => {
  await fetchWithAuth(`${API_BASE}/newsletter`, {
    method: "POST",
    body: JSON.stringify(data),
  });
};

// --- Admin Management ---
const createAdmin = async (data) => {
  await fetchWithAuth(`${API_BASE}/create-admin`, {
    method: "POST",
    body: JSON.stringify(data),
  });
};

// --- News API Helpers ---
const fetchAdminNews = async () => {
  const res = await fetchWithAuth("http://localhost:8000/api/news/");
  return res || [];
};
const createNews = async (data) => {
  const res = await fetchWithAuth("http://localhost:8000/api/news/", {
    method: "POST",
    body: JSON.stringify(data),
  });
  return res.data;
};
const updateNews = async (id, data) => {
  await fetchWithAuth(`http://localhost:8000/api/news/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
};
const deleteNews = async (id) => {
  await fetchWithAuth(`http://localhost:8000/api/news/${id}`, {
    method: "DELETE",
  });
};

// --- Tab Content Components ---

// Dashboard Overview
const AdminDashboardContent = ({ data, loading, error }) => (
  <Paper sx={{ p: 3 }}>
    <Typography variant="h6" gutterBottom>
      Dashboard Overview
    </Typography>
    {loading ? (
      <Box sx={{ textAlign: "center", py: 4 }}>
        <CircularProgress />
      </Box>
    ) : error ? (
      <Alert severity="error">{error}</Alert>
    ) : (
      <Grid container spacing={2}>
        <Grid item xs={12} sm={4}>
          <Paper elevation={2} sx={{ p: 2, textAlign: "center" }}>
            <Typography variant="h5">{data?.users_count ?? "..."}</Typography>
            <Typography variant="body2">Total Users</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Paper elevation={2} sx={{ p: 2, textAlign: "center" }}>
            <Typography variant="h5">{data?.pending_users ?? "..."}</Typography>
            <Typography variant="body2">Pending CIN Validations</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Paper elevation={2} sx={{ p: 2, textAlign: "center" }}>
            <Typography variant="h5">
              {data?.categories_count ?? "..."}
            </Typography>
            <Typography variant="body2">Total Categories</Typography>
          </Paper>
        </Grid>
      </Grid>
    )}
  </Paper>
);

// User Management Table
const UserManagementContent = ({
  users,
  loading,
  error,
  onStatusChange,
  onValidateCIN,
}) => {
  const columns = [
    { field: "id", headerName: "ID", width: 60 },
    { field: "name", headerName: "Name", flex: 1, minWidth: 120 },
    { field: "email", headerName: "Email", flex: 1, minWidth: 180 },
    { field: "role", headerName: "Role", width: 100 },
    { field: "status", headerName: "Status", width: 120 },
    {
      field: "cin_verified",
      headerName: "CIN Verified",
      width: 120,
      renderCell: (params) =>
        params.value ? (
          <CheckCircleIcon color="success" />
        ) : (
          <CancelIcon color="error" />
        ),
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 220,
      renderCell: (params) => (
        <Box>
          <Button
            size="small"
            variant="outlined"
            color="primary"
            startIcon={<EditIcon />}
            sx={{ mr: 1, mb: 0.5 }}
            onClick={() => onStatusChange(params.row)}
          >
            Status
          </Button>
          <Button
            size="small"
            variant="outlined"
            color={params.row.cin_verified ? "success" : "warning"}
            startIcon={<CheckCircleIcon />}
            sx={{ mr: 1, mb: 0.5 }}
            onClick={() => onValidateCIN(params.row)}
          >
            CIN
          </Button>
        </Box>
      ),
    },
  ];
  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        User Management
      </Typography>
      {loading ? (
        <Box sx={{ textAlign: "center", py: 4 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : (
        <Box sx={{ height: 500, width: "100%" }}>
          <DataGrid
            rows={users}
            columns={columns}
            pageSize={8}
            rowsPerPageOptions={[8]}
            disableRowSelectionOnClick
            getRowId={(row) => row.id}
          />
        </Box>
      )}
    </Paper>
  );
};

// Category Management Table & Dialog
const CategoryManagementContent = ({
  categories,
  loading,
  error,
  onCreate,
  onEdit,
  onDelete,
}) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editCategory, setEditCategory] = useState(null);
  const [form, setForm] = useState({ name: "", description: "" });

  const handleOpen = (cat) => {
    setEditCategory(cat);
    setForm(
      cat
        ? { name: cat.name, description: cat.description }
        : { name: "", description: "" }
    );
    setDialogOpen(true);
  };
  const handleClose = () => setDialogOpen(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editCategory) {
      onEdit(editCategory.id, form);
    } else {
      onCreate(form);
    }
    setDialogOpen(false);
  };

  const columns = [
    { field: "id", headerName: "ID", width: 60 },
    { field: "name", headerName: "Name", flex: 1, minWidth: 120 },
    { field: "description", headerName: "Description", flex: 1, minWidth: 180 },
    {
      field: "actions",
      headerName: "Actions",
      width: 180,
      renderCell: (params) => (
        <Box>
          <IconButton color="primary" onClick={() => handleOpen(params.row)}>
            <EditIcon />
          </IconButton>
          <IconButton color="error" onClick={() => onDelete(params.row.id)}>
            <DeleteIcon />
          </IconButton>
        </Box>
      ),
    },
  ];

  return (
    <Paper sx={{ p: 3 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h6" gutterBottom>
          Category Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpen(null)}
          sx={{ mb: 2 }}
        >
          Add Category
        </Button>
      </Box>
      {loading ? (
        <Box sx={{ textAlign: "center", py: 4 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : (
        <Box sx={{ height: 500, width: "100%" }}>
          <DataGrid
            rows={categories}
            columns={columns}
            pageSize={8}
            rowsPerPageOptions={[8]}
            disableRowSelectionOnClick
            getRowId={(row) => row.id}
          />
        </Box>
      )}
      <Dialog open={dialogOpen} onClose={handleClose}>
        <DialogTitle>
          {editCategory ? "Edit Category" : "Add Category"}
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <TextField
              label="Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              fullWidth
              required
              sx={{ mb: 2 }}
            />
            <TextField
              label="Description"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              fullWidth
              required
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button type="submit" variant="contained">
              {editCategory ? "Update" : "Create"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Paper>
  );
};

// Newsletter Form
const NewsletterContent = ({ onSend, loading, error }) => {
  const [form, setForm] = useState({
    subject: "",
    content: "",
    recipients: "all",
  });
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await onSend(form);
    setSuccess(true);
    setForm({ subject: "", content: "", recipients: "all" });
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Send Newsletter
      </Typography>
      {error && <Alert severity="error">{error}</Alert>}
      <form onSubmit={handleSubmit}>
        <TextField
          label="Subject"
          value={form.subject}
          onChange={(e) => setForm({ ...form, subject: e.target.value })}
          fullWidth
          required
          sx={{ mb: 2 }}
        />
        <TextField
          label="Content"
          value={form.content}
          onChange={(e) => setForm({ ...form, content: e.target.value })}
          fullWidth
          required
          multiline
          rows={4}
          sx={{ mb: 2 }}
        />
        <TextField
          label="Recipients"
          value={form.recipients}
          onChange={(e) => setForm({ ...form, recipients: e.target.value })}
          fullWidth
          required
          sx={{ mb: 2 }}
          helperText='Use "all" or comma-separated emails'
        />
        <Button type="submit" variant="contained" disabled={loading}>
          {loading ? <CircularProgress size={24} /> : "Send Newsletter"}
        </Button>
      </form>
      <Snackbar
        open={success}
        autoHideDuration={3000}
        onClose={() => setSuccess(false)}
      >
        <Alert severity="success" sx={{ width: "100%" }}>
          Newsletter sent!
        </Alert>
      </Snackbar>
    </Paper>
  );
};

// Admin Creation Form
const AdminManagementContent = ({ onCreate, loading, error }) => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
  });
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await onCreate(form);
    setSuccess(true);
    setForm({ name: "", email: "", password: "", password_confirmation: "" });
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Admin Management
      </Typography>
      {error && <Alert severity="error">{error}</Alert>}
      <form onSubmit={handleSubmit}>
        <TextField
          label="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          fullWidth
          required
          sx={{ mb: 2 }}
        />
        <TextField
          label="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          fullWidth
          required
          sx={{ mb: 2 }}
        />
        <TextField
          label="Password"
          type="password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          fullWidth
          required
          sx={{ mb: 2 }}
        />
        <TextField
          label="Confirm Password"
          type="password"
          value={form.password_confirmation}
          onChange={(e) =>
            setForm({ ...form, password_confirmation: e.target.value })
          }
          fullWidth
          required
          sx={{ mb: 2 }}
        />
        <Button type="submit" variant="contained" disabled={loading}>
          {loading ? <CircularProgress size={24} /> : "Create Admin"}
        </Button>
      </form>
      <Snackbar
        open={success}
        autoHideDuration={3000}
        onClose={() => setSuccess(false)}
      >
        <Alert severity="success" sx={{ width: "100%" }}>
          Admin created!
        </Alert>
      </Snackbar>
    </Paper>
  );
};

// News Management Table & Dialog
const NewsManagementContent = ({
  news,
  loading,
  error,
  onCreate,
  onEdit,
  onDelete,
}) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editNews, setEditNews] = useState(null);
  const [form, setForm] = useState({
    title: "",
    content: "",
    category: "feature",
  });

  const handleOpen = (item) => {
    setEditNews(item);
    setForm(
      item
        ? { title: item.title, content: item.content, category: item.category }
        : { title: "", content: "", category: "feature" }
    );
    setDialogOpen(true);
  };
  const handleClose = () => setDialogOpen(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editNews) {
      onEdit(editNews.id, form);
    } else {
      onCreate(form);
    }
    setDialogOpen(false);
  };

  const columns = [
    { field: "id", headerName: "ID", width: 60 },
    { field: "title", headerName: "Title", flex: 1, minWidth: 120 },
    { field: "category", headerName: "Category", width: 100 },
    {
      field: "created_at",
      headerName: "Date",
      width: 120,
      valueGetter: (params) =>
        params.value ? new Date(params.value).toLocaleDateString() : "",
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 180,
      renderCell: (params) => (
        <Box>
          <IconButton color="primary" onClick={() => handleOpen(params.row)}>
            <EditIcon />
          </IconButton>
          <IconButton color="error" onClick={() => onDelete(params.row.id)}>
            <DeleteIcon />
          </IconButton>
        </Box>
      ),
    },
  ];

  return (
    <Paper sx={{ p: 3 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h6" gutterBottom>
          News Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpen(null)}
          sx={{ mb: 2 }}
        >
          Add News
        </Button>
      </Box>
      {loading ? (
        <Box sx={{ textAlign: "center", py: 4 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : (
        <Box sx={{ height: 500, width: "100%" }}>
          <DataGrid
            rows={news}
            columns={columns}
            pageSize={8}
            rowsPerPageOptions={[8]}
            disableRowSelectionOnClick
            getRowId={(row) => row.id}
          />
        </Box>
      )}
      <Dialog open={dialogOpen} onClose={handleClose}>
        <DialogTitle>{editNews ? "Edit News" : "Add News"}</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <TextField
              label="Title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              fullWidth
              required
              sx={{ mb: 2 }}
            />
            <TextField
              label="Content"
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              fullWidth
              required
              multiline
              rows={3}
              sx={{ mb: 2 }}
            />
            <TextField
              label="Type"
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
              select
              fullWidth
              required
              SelectProps={{ native: true }}
            >
              <option value="feature">Feature</option>
              <option value="tip">Tip</option>
              <option value="update">Update</option>
            </TextField>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button type="submit" variant="contained">
              {editNews ? "Update" : "Create"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Paper>
  );
};

// --- Main Admin Dashboard Component ---
const AdminDashboardPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [drawerOpen, setDrawerOpen] = useState(!isMobile);
  const [activeTab, setActiveTab] = useState(0);

  // State for fetched data
  const [dashboardData, setDashboardData] = useState(null);
  const [users, setUsers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [news, setNews] = useState([]);
  // Loading and error states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  // For category CRUD
  const [catLoading, setCatLoading] = useState(false);
  const [catError, setCatError] = useState("");
  // For newsletter
  const [newsletterLoading, setNewsletterLoading] = useState(false);
  const [newsletterError, setNewsletterError] = useState("");
  // For admin creation
  const [adminLoading, setAdminLoading] = useState(false);
  const [adminError, setAdminError] = useState("");
  // For news management
  const [newsLoading, setNewsLoading] = useState(false);
  const [newsError, setNewsError] = useState("");
  // Snackbar
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  useEffect(() => {
    setDrawerOpen(!isMobile);
  }, [isMobile]);

  // Fetch data based on active tab
  useEffect(() => {
    let ignore = false;
    const loadData = async () => {
      setError("");
      setLoading(true);
      try {
        if (activeTab === 0) {
          const data = await fetchAdminDashboardData();
          if (!ignore) setDashboardData(data);
        } else if (activeTab === 1) {
          const data = await fetchAdminUsers();
          if (!ignore) setUsers(data);
        } else if (activeTab === 2) {
          const data = await fetchAdminCategories();
          if (!ignore) setCategories(data);
        } else if (activeTab === 3) {
          setNewsLoading(true);
          setNewsError("");
          try {
            const data = await fetchAdminNews();
            if (!ignore) setNews(data);
          } catch (e) {
            setNewsError(e.message);
          } finally {
            setNewsLoading(false);
          }
        }
      } catch (e) {
        setError(e.message || "Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };
    loadData();
    return () => {
      ignore = true;
    };
  }, [activeTab]);

  // User actions
  const handleStatusChange = async (user) => {
    const newStatus = user.status === "active" ? "pending" : "active";
    setLoading(true);
    setError("");
    try {
      await updateUserStatus(user.id, newStatus);
      setSnackbar({
        open: true,
        message: "User status updated",
        severity: "success",
      });
      setUsers(await fetchAdminUsers());
    } catch (e) {
      setSnackbar({ open: true, message: e.message, severity: "error" });
    } finally {
      setLoading(false);
    }
  };
  const handleValidateCIN = async (user) => {
    setLoading(true);
    setError("");
    try {
      await validateUserCIN(user.id, !user.cin_verified);
      console.log(user.cin_verified);
      setSnackbar({
        open: true,
        message: "CIN validation updated",
        severity: "success",
      });
      setUsers(await fetchAdminUsers());
    } catch (e) {
      setSnackbar({ open: true, message: e.message, severity: "error" });
    } finally {
      setLoading(false);
    }
  };

  // Category actions
  const handleCreateCategory = async (data) => {
    setCatLoading(true);
    setCatError("");
    try {
      await createCategory(data);
      setSnackbar({
        open: true,
        message: "Category created",
        severity: "success",
      });
      setCategories(await fetchAdminCategories());
    } catch (e) {
      setCatError(e.message);
      setSnackbar({ open: true, message: e.message, severity: "error" });
    } finally {
      setCatLoading(false);
    }
  };
  const handleEditCategory = async (id, data) => {
    setCatLoading(true);
    setCatError("");
    try {
      await updateCategory(id, data);
      setSnackbar({
        open: true,
        message: "Category updated",
        severity: "success",
      });
      setCategories(await fetchAdminCategories());
    } catch (e) {
      setCatError(e.message);
      setSnackbar({ open: true, message: e.message, severity: "error" });
    } finally {
      setCatLoading(false);
    }
  };
  const handleDeleteCategory = async (id) => {
    setCatLoading(true);
    setCatError("");
    try {
      await deleteCategory(id);
      setSnackbar({
        open: true,
        message: "Category deleted",
        severity: "success",
      });
      setCategories(await fetchAdminCategories());
    } catch (e) {
      setCatError(e.message);
      setSnackbar({ open: true, message: e.message, severity: "error" });
    } finally {
      setCatLoading(false);
    }
  };

  // Newsletter
  const handleSendNewsletter = async (data) => {
    setNewsletterLoading(true);
    setNewsletterError("");
    try {
      await sendNewsletter(data);
      setSnackbar({
        open: true,
        message: "Newsletter sent",
        severity: "success",
      });
    } catch (e) {
      setNewsletterError(e.message);
      setSnackbar({ open: true, message: e.message, severity: "error" });
    } finally {
      setNewsletterLoading(false);
    }
  };

  // Admin creation
  const handleCreateAdmin = async (data) => {
    setAdminLoading(true);
    setAdminError("");
    try {
      await createAdmin(data);
      setSnackbar({
        open: true,
        message: "Admin created",
        severity: "success",
      });
    } catch (e) {
      setAdminError(e.message);
      setSnackbar({ open: true, message: e.message, severity: "error" });
    } finally {
      setAdminLoading(false);
    }
  };

  // News actions
  const handleCreateNews = async (data) => {
    setNewsLoading(true);
    setNewsError("");
    try {
      await createNews(data);
      setSnackbar({
        open: true,
        message: "News created",
        severity: "success",
      });
      setNews(await fetchAdminNews());
    } catch (e) {
      setNewsError(e.message);
      setSnackbar({ open: true, message: e.message, severity: "error" });
    } finally {
      setNewsLoading(false);
    }
  };
  const handleEditNews = async (id, data) => {
    setNewsLoading(true);
    setNewsError("");
    try {
      await updateNews(id, data);
      setSnackbar({
        open: true,
        message: "News updated",
        severity: "success",
      });
      setNews(await fetchAdminNews());
    } catch (e) {
      setNewsError(e.message);
      setSnackbar({ open: true, message: e.message, severity: "error" });
    } finally {
      setNewsLoading(false);
    }
  };
  const handleDeleteNews = async (id) => {
    setNewsLoading(true);
    setNewsError("");
    try {
      deleteNews(id);
      setSnackbar({
        open: true,
        message: "News deleted",
        severity: "success",
      });
      setNews(await fetchAdminNews());
    } catch (e) {
      setNewsError(e.message);
      setSnackbar({ open: true, message: e.message, severity: "error" });
    } finally {
      setNewsLoading(false);
    }
  };

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
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
        {/* Assuming you have a Logo component or use an img tag */}
        {/* <Logo /> */}
        <img src="/blablame.png" alt="BlaBlaMe Logo" style={{ height: 40 }} />
      </Box>
      <Divider />
      <Box sx={{ my: 2, px: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <Avatar
            sx={{
              width: 50,
              height: 50,
              bgcolor: "var(--color-secondary)", // Use a different color for admin?
              color: "var(--color-secondary-content)",
            }}
            alt="Admin Name"
            // src="admin-avatar.jpg" // Add admin avatar if available
          />
          <Box sx={{ ml: 1 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
              Admin User
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: "var(--color-base-content)" }}
            >
              Administrator
            </Typography>
          </Box>
        </Box>
      </Box>
      <Divider />
      <List>
        {[
          { text: "Dashboard", icon: <DashboardIcon />, index: 0 },
          { text: "User Management", icon: <PeopleIcon />, index: 1 },
          { text: "Category Management", icon: <CategoryIcon />, index: 2 },
          { text: "News Management", icon: <ArticleIcon />, index: 3 },
          { text: "Newsletter", icon: <EmailIcon />, index: 4 },
          {
            text: "Admin Management",
            icon: <AdminPanelSettingsIcon />,
            index: 5,
          },
        ].map((item) => (
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
        <ListItem button sx={{ mt: "auto" }}>
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
              display: { md: "none" }, // Only show on mobile/tablet
            }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ display: { xs: "none", sm: "block" } }}
          >
            Admin Panel
          </Typography>
          {/* Optional: Keep Search if needed for admin */}
          {/* <SearchWrapper> ... </SearchWrapper> */}
          <Box sx={{ flexGrow: 1 }} />
          <Box sx={{ display: "flex" }}>
            <IconButton size="large" color="inherit">
              <Badge badgeContent={0} color="error">
                {" "}
                {/* Placeholder */}
                <NotificationsIcon />
              </Badge>
            </IconButton>
            {/* Add other admin-specific icons if needed */}
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
          bgcolor: "var(--color-backgound-paper)", // Check typo: background-paper?
          mt: 8, // Match AppBar height
          overflowX: "hidden",
          transition: "margin 0.2s",
          ml: isMobile ? 0 : drawerOpen ? 0 : `-${240}px`, // Adjust based on drawer width
        }}
      >
        <Container maxWidth="lg">
          <Paper
            elevation={0}
            sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}
          >
            <Tabs
              value={activeTab}
              onChange={handleTabChange}
              aria-label="Admin Sections Tabs"
              variant="scrollable"
              scrollButtons="auto"
            >
              <Tab
                label="Dashboard"
                icon={<DashboardIcon />}
                iconPosition="start"
              />
              <Tab
                label="User Management"
                icon={<PeopleIcon />}
                iconPosition="start"
              />
              <Tab
                label="Category Management"
                icon={<CategoryIcon />}
                iconPosition="start"
              />
              <Tab
                label="News Management"
                icon={<ArticleIcon />}
                iconPosition="start"
              />
              <Tab
                label="Newsletter"
                icon={<EmailIcon />}
                iconPosition="start"
              />
              <Tab
                label="Admin Management"
                icon={<AdminPanelSettingsIcon />}
                iconPosition="start"
              />
            </Tabs>
          </Paper>

          {/* Tab Content */}
          {activeTab === 0 && (
            <AdminDashboardContent
              data={dashboardData}
              loading={loading}
              error={error}
            />
          )}
          {activeTab === 1 && (
            <UserManagementContent
              users={users}
              loading={loading}
              error={error}
              onStatusChange={handleStatusChange}
              onValidateCIN={handleValidateCIN}
            />
          )}
          {activeTab === 2 && (
            <CategoryManagementContent
              categories={categories}
              loading={catLoading || loading}
              error={catError || error}
              onCreate={handleCreateCategory}
              onEdit={handleEditCategory}
              onDelete={handleDeleteCategory}
            />
          )}
          {activeTab === 3 && (
            <NewsManagementContent
              news={news}
              loading={newsLoading}
              error={newsError}
              onCreate={handleCreateNews}
              onEdit={handleEditNews}
              onDelete={handleDeleteNews}
            />
          )}
          {activeTab === 4 && (
            <NewsletterContent
              onSend={handleSendNewsletter}
              loading={newsletterLoading}
              error={newsletterError}
            />
          )}
          {activeTab === 5 && (
            <AdminManagementContent
              onCreate={handleCreateAdmin}
              loading={adminLoading}
              error={adminError}
            />
          )}

          <Snackbar
            open={snackbar.open}
            autoHideDuration={3000}
            onClose={() => setSnackbar({ ...snackbar, open: false })}
          >
            <Alert severity={snackbar.severity} sx={{ width: "100%" }}>
              {snackbar.message}
            </Alert>
          </Snackbar>
        </Container>
      </Box>
    </Box>
  );
};

export default AdminDashboardPage;
