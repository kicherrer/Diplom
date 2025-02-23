import React, { useState } from 'react';
import {
  Box,
  Rating,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography
} from '@mui/material';
import { api } from '../../api/client';

interface ContentRatingProps {
  contentId: number;
  contentType: 'movie' | 'series' | 'video';
  initialRating?: number;
  onRatingSubmit?: (rating: number, review?: string) => void;
}

export const ContentRating: React.FC<ContentRatingProps> = ({
  contentId,
  contentType,
  initialRating,
  onRatingSubmit
}) => {
  const [rating, setRating] = useState<number | null>(initialRating || null);
  const [openReview, setOpenReview] = useState(false);
  const [review, setReview] = useState('');

  const handleRatingSubmit = async () => {
    if (!rating) return;

    try {
      await api.ratings.submit({
        contentId,
        contentType,
        rating,
        review: review.trim() || undefined
      });
      onRatingSubmit?.(rating, review);
      setOpenReview(false);
    } catch (error) {
      console.error('Error submitting rating:', error);
    }
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
      <Rating
        value={rating}
        onChange={(_, newValue) => {
          setRating(newValue);
          setOpenReview(true);
        }}
        precision={0.5}
        size="large"
      />

      <Dialog open={openReview} onClose={() => setOpenReview(false)}>
        <DialogTitle>Rate this {contentType}</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <Rating value={rating} readOnly size="large" />
          </Box>
          <TextField
            multiline
            rows={4}
            fullWidth
            placeholder="Write your review (optional)"
            value={review}
            onChange={(e) => setReview(e.target.value)}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenReview(false)}>Cancel</Button>
          <Button onClick={handleRatingSubmit} variant="contained">
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
