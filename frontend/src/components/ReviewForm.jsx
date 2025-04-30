import React, { useState } from 'react';
import {
  Box,
  Typography,
  Rating,
  TextField,
  Button,
  Alert,
  Paper,
} from '@mui/material';

const ReviewForm = ({ teacherId, onSuccess }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) {
      setError('Please select a rating');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:8000/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          teacher_id: teacherId,
          rating,
          comment,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit review');
      }

      setRating(0);
      setComment('');
      onSuccess && onSuccess();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper elevation={0} sx={{ p: 2, mb: 2 }}>
      <Typography variant="h6" gutterBottom>
        Write a Review
      </Typography>
      <form onSubmit={handleSubmit}>
        <Box sx={{ mb: 2 }}>
          <Typography component="legend">Rating</Typography>
          <Rating
            value={rating}
            onChange={(_, newValue) => setRating(newValue)}
            precision={0.5}
          />
        </Box>
        <TextField
          fullWidth
          multiline
          rows={3}
          label="Your Review"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          sx={{ mb: 2 }}
        />
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        <Button
          type="submit"
          variant="contained"
          disabled={loading}
          sx={{
            bgcolor: 'var(--color-primary)',
            color: 'var(--color-primary-content)',
            '&:hover': {
              bgcolor: 'var(--color-primary)',
              filter: 'brightness(0.9)',
            },
          }}
        >
          {loading ? 'Submitting...' : 'Submit Review'}
        </Button>
      </form>
    </Paper>
  );
};

export default ReviewForm;
