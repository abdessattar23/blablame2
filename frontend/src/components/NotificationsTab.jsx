import React from "react";
import { Box, Typography, Alert } from "@mui/material";

const NotificationsTab = () => (
  <Box>
    <Typography variant="h5" sx={{ fontWeight: "bold", mb: 2 }}>
      Notifications
    </Typography>
    <Alert severity="info">Notifications will appear here.</Alert>
  </Box>
);

export default NotificationsTab;
