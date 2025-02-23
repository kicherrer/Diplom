export const API_KEYS = {
  TMDB: process.env.VITE_TMDB_API_KEY || 'your_tmdb_key',
  YOUTUBE: process.env.VITE_YOUTUBE_API_KEY || 'your_youtube_key',
  OMDB: process.env.VITE_OMDB_API_KEY || 'your_omdb_key',
  KINOPOISK: process.env.VITE_KINOPOISK_API_KEY || 'your_kinopoisk_key'
};

export const API_URLS = {
  TMDB: {
    BASE: 'https://api.themoviedb.org/3',
    IMAGE_BASE: 'https://image.tmdb.org/t/p',
    POSTER_SIZE: 'w500',
    BACKDROP_SIZE: 'original'
  },
  YOUTUBE: {
    BASE: 'https://www.googleapis.com/youtube/v3'
  },
  OMDB: {
    BASE: 'https://www.omdbapi.com'
  },
  KINOPOISK: {
    BASE: 'https://kinopoiskapiunofficial.tech/api'
  }
};
