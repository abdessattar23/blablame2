import React from "react";
import {
  Box,
  Typography,
  Avatar,
  Button,
  TextField,
  Alert,
  Snackbar,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Chip,
} from "@mui/material";
import MuiAlert from "@mui/material/Alert";

const ProfileTab = ({
  profile,
  loading,
  error,
  edit,
  setEdit,
  form,
  setForm,
  onInput,
  onSave,
  success,
  setSuccess,
  blablas = [],
}) => (
  <Box>
    <Typography variant="h5" sx={{ fontWeight: "bold", mb: 2 }}>
      My Profile
    </Typography>
    {loading ? (
      <Box sx={{ p: 4, textAlign: "center" }}>
        <Typography>Loading profile...</Typography>
      </Box>
    ) : error ? (
      <Alert severity="error">{error}</Alert>
    ) : profile ? (
      <>
        <Box sx={{ maxWidth: 400, mx: "auto" }}>
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
          {!edit ? (
            <Box sx={{ textAlign: "center" }}>
              <Button
                variant="contained"
                sx={{
                  backgroundColor: "var(--color-primary)",
                  color: "var(--color-primary-content)",
                  mr: 2,
                }}
                onClick={() => setEdit(true)}
              >
                Edit Profile
              </Button>
            </Box>
          ) : (
            <form onSubmit={onSave}>
              <TextField
                label="Name"
                name="name"
                value={form.name}
                onChange={onInput}
                fullWidth
                sx={{ mb: 2 }}
              />
              <TextField
                label="Email"
                name="email"
                value={form.email}
                onChange={onInput}
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
                  onChange={onInput}
                />
              </Button>
              <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                <Button
                  onClick={() => setEdit(false)}
                  sx={{ mr: 2 }}
                  disabled={loading}
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
                  disabled={loading}
                >
                  {loading ? "Saving..." : "Save"}
                </Button>
              </Box>
              {error && (
                <Alert severity="error" sx={{ mt: 2 }}>
                  {error}
                </Alert>
              )}
            </form>
          )}
          <Snackbar
            open={success}
            autoHideDuration={2500}
            onClose={() => setSuccess(false)}
          >
            <MuiAlert
              elevation={6}
              variant="filled"
              onClose={() => setSuccess(false)}
              severity="success"
              sx={{ width: "100%" }}
            >
              Profile updated successfully!
            </MuiAlert>
          </Snackbar>
        </Box>
        {/* Move the grid outside the maxWidth: 400 container and add width: 100% */}
        {blablas && blablas.length > 0 && (
          <Box
            sx={{
              mt: 6,
              width: "100%",
              maxWidth: "1200px",
              mx: "auto",
              px: { xs: 1, sm: 2, md: 3 },
            }}
          >
            <Typography variant="h5" sx={{ fontWeight: "bold", mb: 2 }}>
              My BlaBlas
            </Typography>
            <Grid container spacing={2}>
              {blablas.map((blabla) => (
                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={4}
                  key={blabla.id}
                  sx={{ display: "flex" }}
                >
                  <Card
                    sx={{
                      width: "100%",
                      display: "flex",
                      flexDirection: "row",
                      flexGrow: 1,
                    }}
                  >
                    {blabla.image && (
                      <CardMedia
                        component="img"
                        height="140"
                        image={
                          blabla.image.startsWith("http")
                            ? blabla.image
                            : "http://localhost:8000" + blabla.image
                        }
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
          </Box>
        )}
      </>
    ) : null}
  </Box>
);

export default ProfileTab;
