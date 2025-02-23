import React, { useState } from 'react';
import {
  Box,
  Tabs,
  Tab,
  Paper,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  IconButton,
  TextField,
  InputAdornment,
  Menu,
  MenuItem,
  Button,
  Dialog,
  Chip,
  Stack,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Edit, Delete, Add, CloudUpload } from '@mui/icons-material';

interface ContentItem {
  id: string;
  title: string;
  type: 'movie' | 'series' | 'video';
  thumbnail: string;
  status: 'published' | 'draft' | 'processing';
  views: number;
  rating: number;
}

export const ContentManagement: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedContent, setSelectedContent] = useState<any>(null);
  const [contentType, setContentType] = useState<'movie' | 'series' | 'video'>('movie');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ContentItem | null>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, content: any) => {
    setAnchorEl(event.currentTarget);
    setSelectedContent(content);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedContent(null);
  };

  const handleEdit = () => {
    // Implement edit logic
    handleMenuClose();
  };

  const handleDelete = () => {
    // Implement delete logic
    handleMenuClose();
  };

  const handleAddContent = () => {
    setSelectedItem(null);
    setDialogOpen(true);
  };

  const handleEditContent = (item: ContentItem) => {
    setSelectedItem(item);
    setDialogOpen(true);
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Content Management
      </Typography>
      <Box sx={{ mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs>
            <TextField
              fullWidth
              placeholder="Search content..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                )
              }}
            />
          </Grid>
          <Grid item>
            <IconButton>
              <FilterListIcon />
            </IconButton>
          </Grid>
        </Grid>
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Tabs value={contentType} onChange={(_, v) => setContentType(v)}>
          <Tab label="Movies" value="movie" />
          <Tab label="Series" value="series" />
          <Tab label="Videos" value="video" />
        </Tabs>
        <Button 
          variant="contained" 
          startIcon={<Add />}
          onClick={handleAddContent}
        >
          Add Content
        </Button>
      </Box>

      <Grid container spacing={3}>
        {/* Content Cards */}
        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardMedia
              component="img"
              height="200"
              image="https://via.placeholder.com/300"
              alt="Content thumbnail"
            />
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="h6" noWrap>
                  Content Title
                </Typography>
                <Box>
                  <IconButton size="small" onClick={() => handleEditContent}>
                    <Edit />
                  </IconButton>
                  <IconButton size="small" color="error">
                    <Delete />
                  </IconButton>
                </Box>
              </Box>
              <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                <Chip label="Published" color="success" size="small" />
                <Chip label="Views: 1.2K" size="small" />
                <Chip label="Rating: 4.5" size="small" />
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <Box sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            {selectedItem ? 'Edit Content' : 'Add New Content'}
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Title"
                defaultValue={selectedItem?.title}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Description"
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                variant="outlined"
                startIcon={<CloudUpload />}
                fullWidth
              >
                Upload Media
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Dialog>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleEdit}>
          <EditIcon sx={{ mr: 1 }} /> Edit
        </MenuItem>
        <MenuItem onClick={handleDelete}>
          <DeleteIcon sx={{ mr: 1 }} /> Delete
        </MenuItem>
      </Menu>
    </Box>
  );
};
