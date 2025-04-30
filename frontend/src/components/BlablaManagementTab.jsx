import React from "react";
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Chip,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

const BlablaManagementTab = ({ blablas, loading, onNewBlabla }) => (
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
        onClick={onNewBlabla}
      >
        New BlaBla
      </Button>
    </Box>
    {loading ? (
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

export default BlablaManagementTab;
