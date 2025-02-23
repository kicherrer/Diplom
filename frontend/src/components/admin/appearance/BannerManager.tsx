import React, { useState } from 'react';
import { API_URLS } from '../../../config/api.config';
import {
  Box,
  Paper,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Typography,
  Button,
  IconButton,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControlLabel,
  Switch,
  Select,
  MenuItem,
  InputLabel,
  FormControl
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  DragHandle,
  CloudUpload
} from '@mui/icons-material';
import { DragDropContext, Droppable, Draggable, DropResult, DroppableProvided, DraggableProvided } from 'react-beautiful-dnd';

interface Banner {
  id: string;
  title: string;
  description: string;
  image: string;
  link: string;
  active: boolean;
  position: number;
  type: 'movie' | 'series' | 'custom';
  target_id?: string;
  source?: 'tmdb' | 'custom';
  poster_path?: string;
}

export const BannerManager: React.FC = () => {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedBanner, setSelectedBanner] = useState<Banner | null>(null);
  const [newImage, setNewImage] = useState<File | null>(null);

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(banners);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // Update positions
    const updatedItems = items.map((item, index) => ({
      ...item,
      position: index
    }));

    setBanners(updatedItems);
    // Save new order to backend
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setNewImage(file);
    }
  };

  return (
    <Box>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="h5">Управление баннерами</Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => {
            setSelectedBanner(null);
            setDialogOpen(true);
          }}
        >
          Добавить баннер
        </Button>
      </Box>

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="banners">
          {(provided: DroppableProvided) => (
            <Grid
              container
              spacing={2}
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {banners.map((banner, index) => (
                <Draggable
                  key={banner.id}
                  draggableId={banner.id}
                  index={index}
                >
                  {(provided: DraggableProvided) => (
                    <Grid
                      item
                      xs={12}
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                    >
                      <Card>
                        <Box sx={{ display: 'flex' }}>
                          <CardMedia
                            component="img"
                            sx={{ width: 200 }}
                            image={
                              banner.source === 'tmdb' && banner.poster_path
                                ? `${API_URLS.TMDB.IMAGE_BASE}/${API_URLS.TMDB.POSTER_SIZE}${banner.poster_path}`
                                : banner.image
                            }
                            alt={banner.title}
                          />
                          <Box sx={{ flex: 1, display: 'flex' }}>
                            <CardContent sx={{ flex: 1 }}>
                              <Typography variant="h6">{banner.title}</Typography>
                              <Typography color="textSecondary">
                                {banner.description}
                              </Typography>
                            </CardContent>
                            <CardActions sx={{ flexDirection: 'column', p: 2 }}>
                              <IconButton
                                {...provided.dragHandleProps}
                                size="small"
                              >
                                <DragHandle />
                              </IconButton>
                              <IconButton
                                size="small"
                                onClick={() => {
                                  setSelectedBanner(banner);
                                  setDialogOpen(true);
                                }}
                              >
                                <Edit />
                              </IconButton>
                              <IconButton
                                size="small"
                                color="error"
                                onClick={() => {/* Handle delete */}}
                              >
                                <Delete />
                              </IconButton>
                            </CardActions>
                          </Box>
                        </Box>
                      </Card>
                    </Grid>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </Grid>
          )}
        </Droppable>
      </DragDropContext>

      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {selectedBanner ? 'Редактировать баннер' : 'Добавить баннер'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <Box
                sx={{
                  height: 200,
                  border: '2px dashed',
                  borderColor: 'divider',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mb: 2,
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                {(newImage || selectedBanner?.image) ? (
                  <img
                    src={newImage ? URL.createObjectURL(newImage) : selectedBanner?.image}
                    alt="Preview"
                    style={{ maxWidth: '100%', maxHeight: '100%' }}
                  />
                ) : (
                  <Button
                    component="label"
                    startIcon={<CloudUpload />}
                  >
                    Загрузить изображение
                    <input
                      type="file"
                      hidden
                      accept="image/*"
                      onChange={handleImageUpload}
                    />
                  </Button>
                )}
              </Box>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Заголовок"
                defaultValue={selectedBanner?.title}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Описание"
                defaultValue={selectedBanner?.description}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Тип</InputLabel>
                <Select
                  value={selectedBanner?.type || 'custom'}
                  label="Тип"
                >
                  <MenuItem value="movie">Фильм</MenuItem>
                  <MenuItem value="series">Сериал</MenuItem>
                  <MenuItem value="custom">Пользовательский</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Ссылка"
                defaultValue={selectedBanner?.link}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={selectedBanner?.active ?? true}
                  />
                }
                label="Активен"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>
            Отмена
          </Button>
          <Button variant="contained" onClick={() => {/* Handle save */}}>
            Сохранить
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
