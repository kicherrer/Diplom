import axios from 'axios';
import { API_KEYS, API_URLS } from '../config/api';

interface TMDBMovie {
  id: number;
  title: string;
  original_title: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  release_date: string;
  vote_average: number;
  vote_count: number;
  runtime?: number;
  genres: Array<{ id: number; name: string; }>;
}

interface KinopoiskMovie {
  kinopoiskId: number;
  nameRu: string;
  nameEn: string;
  description: string;
  year: number;
  posterUrl: string;
  genres: Array<{ genre: string }>;
  rating: number;
}

export const externalApi = {
  tmdb: {
    searchMovies: async (query: string, page = 1) => {
      const response = await axios.get(`${API_URLS.TMDB.BASE}/search/movie`, {
        params: {
          api_key: API_KEYS.TMDB,
          query,
          page,
          language: 'ru-RU'
        }
      });
      return response.data;
    },

    getMovieDetails: async (movieId: number): Promise<TMDBMovie> => {
      const response = await axios.get(
        `${API_URLS.TMDB.BASE}/movie/${movieId}`,
        {
          params: {
            api_key: API_KEYS.TMDB,
            language: 'ru-RU',
            append_to_response: 'videos,credits,similar'
          }
        }
      );
      return response.data;
    },

    getTopRated: async (page = 1) => {
      const response = await axios.get(`${API_URLS.TMDB.BASE}/movie/top_rated`, {
        params: {
          api_key: API_KEYS.TMDB,
          language: 'ru-RU',
          page
        }
      });
      return response.data;
    },

    getTrending: async (timeWindow: 'day' | 'week' = 'week') => {
      const response = await axios.get(
        `${API_URLS.TMDB.BASE}/trending/movie/${timeWindow}`,
        {
          params: {
            api_key: API_KEYS.TMDB,
            language: 'ru-RU'
          }
        }
      );
      return response.data;
    }
  },

  kinopoisk: {
    searchMovies: async (keyword: string, page = 1) => {
      const response = await axios.get(
        `${API_URLS.KINOPOISK.BASE}/v2.1/films/search-by-keyword`,
        {
          headers: {
            'X-API-KEY': API_KEYS.KINOPOISK
          },
          params: {
            keyword,
            page
          }
        }
      );
      return response.data;
    },

    getMovieDetails: async (movieId: number): Promise<KinopoiskMovie> => {
      const response = await axios.get(
        `${API_URLS.KINOPOISK.BASE}/v2.2/films/${movieId}`,
        {
          headers: {
            'X-API-KEY': API_KEYS.KINOPOISK
          }
        }
      );
      return response.data;
    },

    getStaff: async (movieId: number) => {
      const response = await axios.get(
        `${API_URLS.KINOPOISK.BASE}/v1/staff`,
        {
          headers: {
            'X-API-KEY': API_KEYS.KINOPOISK
          },
          params: {
            filmId: movieId
          }
        }
      );
      return response.data;
    }
  },

  youtube: {
    searchTrailers: async (query: string, maxResults = 5) => {
      const response = await axios.get(`${API_URLS.YOUTUBE.BASE}/search`, {
        params: {
          key: API_KEYS.YOUTUBE,
          q: `${query} трейлер`,
          part: 'snippet',
          type: 'video',
          maxResults,
          relevanceLanguage: 'ru'
        }
      });
      return response.data;
    }
  },

  omdb: {
    getMovieDetails: async (imdbId: string) => {
      const response = await axios.get(API_URLS.OMDB.BASE, {
        params: {
          apikey: API_KEYS.OMDB,
          i: imdbId,
          plot: 'full'
        }
      });
      return response.data;
    }
  }
};
