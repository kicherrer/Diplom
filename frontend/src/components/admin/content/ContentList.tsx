import React, { useState } from 'react';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TextField,
  IconButton,
  Chip,
  Menu,
  MenuItem,
  ListItemIcon,
  Typography,
  Button,
} from '@mui/material';
import {
  Edit,
  Delete,
  MoreVert,
  Visibility,
  Add,
  FilterList,
} from '@mui/icons-material';
import { useQuery } from 'react-query';
import { AxiosResponse } from 'axios';
import { api } from '../../../api/client';

interface Content {
  id: number;
  title: string;
  type: string;
  status: 'published' | 'draft' | 'pending';
  genres: string[];
  views: number;
  rating: number;
}

interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
}

export const ContentList: React.FC = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [search, setSearch] = useState('');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedContent, setSelectedContent] = useState<any>(null);

  const { data: response, isLoading, refetch } = useQuery(
    ['content', page, rowsPerPage],
    async () => {
      const response = await api.admin.getContent({ 
        page: page + 1, 
        limit: rowsPerPage, 
        search 
      });
      return response.data;
    }
  );

  const paginatedData = response as PaginatedResponse<Content>;

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>, content: any) => {
    setAnchorEl(event.currentTarget);
    setSelectedContent(content);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedContent(null);
  };

  const handleEdit = () => {
    // Implement edit
    handleMenuClose();
  };

  const handleDelete = async () => {
    try {
      await api.admin.deleteContent(selectedContent.id);
      refetch();
    } catch (error) {
      console.error('Delete failed:', error);
    }
    handleMenuClose();
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h5">
          Управление контентом
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => {/* Handle add */}}
        >
          Добавить контент
        </Button>
      </Box>

      <Paper sx={{ width: '100%', mb: 2 }}>
        <Box sx={{ p: 2, display: 'flex', gap: 2 }}>
          <TextField
            placeholder="Поиск..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            size="small"
            sx={{ width: 300 }}
          />
          <IconButton>
            <FilterList />
          </IconButton>
        </Box>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Название</TableCell>
                <TableCell>Тип</TableCell>
                <TableCell>Жанры</TableCell>
                <TableCell>Статус</TableCell>
                <TableCell>Просмотры</TableCell>
                <TableCell>Рейтинг</TableCell>
                <TableCell align="right">Действия</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedData?.items.map((content: Content) => (
                <TableRow key={content.id}>
                  <TableCell>{content.title}</TableCell>
                  <TableCell>{content.type}</TableCell>
                  <TableCell>
                    {content.genres.map((genre: string) => (
                      <Chip 
                        key={genre} 
                        label={genre} 
                        size="small" 
                        sx={{ mr: 0.5 }} 
                      />
                    ))}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={content.status}
                      color={
                        content.status === 'published' ? 'success' :
                        content.status === 'draft' ? 'default' : 'warning'
                      }
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{content.views}</TableCell>
                  <TableCell>{content.rating}</TableCell>
                  <TableCell align="right">
                    <IconButton onClick={(e) => handleMenuClick(e, content)}>
                      <MoreVert />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          component="div"
          count={paginatedData?.total || 0}
          page={page}
          onPageChange={(_, newPage) => setPage(newPage)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(e) => setRowsPerPage(parseInt(e.target.value, 10))}
          labelRowsPerPage="Строк на странице:"
        />
      </Paper>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => {
          handleMenuClose();
          // Handle preview
        }}>
          <ListItemIcon>
            <Visibility fontSize="small" />
          </ListItemIcon>
          Просмотр
        </MenuItem>
        <MenuItem onClick={handleEdit}>
          <ListItemIcon>
            <Edit fontSize="small" />
          </ListItemIcon>
          Редактировать
        </MenuItem>
        <MenuItem onClick={handleDelete}>
          <ListItemIcon>
            <Delete fontSize="small" />
          </ListItemIcon>
          Удалить
        </MenuItem>
      </Menu>
    </Box>
  );
};
