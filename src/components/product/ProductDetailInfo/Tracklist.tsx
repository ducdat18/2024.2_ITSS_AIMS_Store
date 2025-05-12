import React from 'react';
import { Box, Typography, Paper, Grid2 } from '@mui/material';
import { MusicNote } from '@mui/icons-material';

interface TracklistProps {
  tracks: string[];
}

const Tracklist: React.FC<TracklistProps> = ({ tracks }) => {
  if (!tracks || tracks.length === 0) {
    return (
      <Typography color="text.secondary">
        No tracklist information available.
      </Typography>
    );
  }

  return (
    <Box>
      <Typography
        variant="h6"
        gutterBottom
        sx={{
          color: 'primary.light',
          fontWeight: 'bold',
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          mb: 2,
        }}
      >
        <MusicNote fontSize="small" />
        Tracklist
      </Typography>
      <Paper
        variant="outlined"
        sx={{
          p: 2,
          borderColor: 'rgba(100, 255, 218, 0.1)',
          backgroundColor: 'rgba(13, 37, 56, 0.5)',
        }}
      >
        <Grid2 container spacing={1}>
          {tracks.map((track, index) => (
            <Grid2 size={{ xs: 12 }} key={index}>
              <Box
                sx={{
                  display: 'flex',
                  p: 1,
                  borderBottom:
                    index < tracks.length - 1
                      ? '1px solid rgba(100, 255, 218, 0.05)'
                      : 'none',
                }}
              >
                <Typography
                  variant="body2"
                  sx={{ minWidth: 30, color: 'primary.light' }}
                >
                  {index + 1}.
                </Typography>
                <Typography variant="body1" color="text.primary">
                  {track}
                </Typography>
              </Box>
            </Grid2>
          ))}
        </Grid2>
      </Paper>
    </Box>
  );
};

export default Tracklist;
