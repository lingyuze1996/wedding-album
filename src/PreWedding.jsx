import { Box, Grid, ImageList, ImageListItem, Modal, Pagination } from '@mui/material';
import { useEffect, useState } from 'react';
import { getPhotoRef, getPhotosByRange } from './dataAPIs/photoRef';

async function loadThumbnails(start, end) {
  const photos = await getPhotosByRange(start, end);
  console.debug('Photos Retrieved: ', photos);

  const photoThumbnails = await Promise.all(
    photos.map(async (p) => {
      const photoRefResult = await getPhotoRef(p.Name);
      return { ...p, url: photoRefResult };
    })
  );

  return photoThumbnails;
}

async function loadRawPhoto(key) {
  const photoResult = await getPhotoRef(key, 'raw');
  return photoResult;
}

function PreWedding() {
  const [photos, setPhotos] = useState([]);
  const [photoOnFocus, setPhotoOnFocus] = useState();
  const [photoOnFocusUrl, setPhotoOnFocusUrl] = useState();

  const [page, setPage] = useState(1);

  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(false);
  const [modelOpen, setModelOpen] = useState(false);

  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  const [screenHeight, setScreenHeight] = useState(window.innerHeight);

  useEffect(() => {
    window.addEventListener('resize', () => {
      setScreenWidth(window.innerWidth);
      setScreenHeight(window.innerHeight);
    });

    return () => {
      window.removeEventListener('resize', () => {
        setScreenWidth(window.innerWidth);
        setScreenHeight(window.innerHeight);
      });
    };
  });

  useEffect(() => {
    setPageLoading(true);
    loadThumbnails(page * 10 - 9, page * 10).then((photos) => {
      setPhotos(photos);
      setPageLoading(false);
    });
  }, [page]);

  useEffect(() => {
    if (photoOnFocus) {
      console.log('Photo On Focus: ', photoOnFocus);
      const photoName = photoOnFocus.Name;
      setLoading(true);
      loadRawPhoto(photoName).then((url) => {
        setPhotoOnFocusUrl(url);
        setLoading(false);
      });
    }
  }, [photoOnFocus]);

  return (
    <Grid container justifyContent="center">
      <Grid item xs={12} md={8}>
        <h1>Pre-Wedding Photos (点击查看原图)</h1>
        {pageLoading ? (
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: screenWidth * 0.9,
              bgcolor: 'background.paper',
              p: 2,
            }}
          >
            <h1 style={{ textAlign: 'center' }}>Page Loading...</h1>
          </Box>
        ) : (
          <ImageList gap={8} cols={screenWidth < 600 ? 1 : screenWidth < 960 ? 2 : 3}>
            {photos.map((p) => (
              <ImageListItem key={p.Name}>
                <img
                  src={p.url}
                  alt="Thumbnail_IMG"
                  style={{ cursor: 'pointer' }}
                  onClick={() => {
                    setPhotoOnFocus(p);
                    setModelOpen(true);
                  }}
                />
              </ImageListItem>
            ))}
          </ImageList>
        )}
        <Pagination
          count={68}
          page={page}
          onChange={(_, value) => {
            setPage(value);
          }}
        />
        <Modal open={modelOpen} onClose={() => setModelOpen(false)}>
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              minWidth: '30px',
              minHeight: '100px',
              maxWidth: screenWidth * 0.8,
              maxHeight: screenHeight * 0.8,
              bgcolor: 'background.paper',
              p: 2,
            }}
          >
            {photoOnFocusUrl && !loading ? (
              <img
                style={{
                  maxHeight: screenHeight * 0.8,
                  maxWidth: screenWidth * 0.8,
                }}
                src={photoOnFocusUrl}
                alt="HD_IMG"
              />
            ) : (
              <h4 style={{ textAlign: 'center' }}>Loading...</h4>
            )}
          </Box>
        </Modal>
      </Grid>
    </Grid>
  );
}

export default PreWedding;
