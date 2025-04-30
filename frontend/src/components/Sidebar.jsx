import React from "react";
import {
  Box,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Avatar,
  Typography,
} from "@mui/material";
import {
  School as SchoolIcon,
  Message as MessageIcon,
  Person as PersonIcon,
  Notifications as NotificationsIcon,
  Logout as LogoutIcon,
} from "@mui/icons-material";

const sidebarTabs = [
  { text: "BlaBla Management", icon: <SchoolIcon />, index: 0 },
  { text: "Messages", icon: <MessageIcon />, index: 1 },
  { text: "Profile", icon: <PersonIcon />, index: 2 },
  { text: "Notifications", icon: <NotificationsIcon />, index: 3 },
];

const Sidebar = ({ activeTab, setActiveTab }) => (
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
          alt="Student Name"
          src="https://randomuser.me/api/portraits/women/90.jpg"
        />
        <Box sx={{ ml: 1 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
            Leila Amrani
          </Typography>
          <Typography
            variant="body2"
            sx={{ color: "var(--color-base-content)" }}
          >
            Student
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
              color: activeTab === item.index ? "var(--color-primary)" : "inherit",
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

export default Sidebar;
