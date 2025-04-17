import { app } from 'electron';
import express from 'express';
import ffmpeg from 'fluent-ffmpeg';
import fs from 'fs';
import path from 'path';

const server = express();
let serverInstance: any = null;
let videoDirectory: string = path.join(app.getPath('home'), 'Downloads', 'replay');
let thumbnailsDirectory = path.join(videoDirectory, 'thumbnails');

export function startServer(directory: string, port = 3000) {
  if (serverInstance) {
    return serverInstance;
  }

  videoDirectory = directory;
  thumbnailsDirectory = path.join(videoDirectory, 'thumbnails');

  // Ensure thumbnails directory exists
  if (!fs.existsSync(thumbnailsDirectory)) {
    console.log('thumbnails directory does not exist.  creating...');
    fs.mkdirSync(thumbnailsDirectory, { recursive: true });
  }

  serverInstance = server.listen(port, () => {
    console.log(`Video server running on port ${port}`);
  });

  server.use('/videos', express.static(videoDirectory));
  server.use('/thumbnails', express.static(thumbnailsDirectory));

  // Thumbnail generation endpoint
  server.get('/thumbnail/:videoName', async (req, res) => {
    const videoName = decodeURIComponent(req.params.videoName);
    const videoPath = path.join(videoDirectory, videoName);
    const thumbnailPath = path.join(thumbnailsDirectory, `${videoName}.jpg`);

    try {
      // Check if thumbnail already exists
      if (fs.existsSync(thumbnailPath)) {
        return res.sendFile(thumbnailPath);
      }

      // Generate thumbnail
      await new Promise((resolve, reject) => {
        ffmpeg(videoPath)
          .screenshots({
            timestamps: ['10%'],
            filename: `${videoName}.jpg`,
            folder: thumbnailsDirectory,
            size: '320x180',
          })
          .on('end', resolve)
          .on('error', reject);
      });

      res.sendFile(thumbnailPath);
    } catch (error) {
      console.error('Error generating thumbnail:', error);
      res.status(500).send('Error generating thumbnail');
    }
  });

  return serverInstance;
}

export function stopServer() {
  if (serverInstance) {
    serverInstance.close();
    serverInstance = null;
  }
}

export function setVideoDirectory(directory: string) {
  console.log('video directory changed.  restarting server...');
  stopServer();
  startServer(directory);
}

export function getVideoUrl(filePath: string): string {
  const directory = path.dirname(filePath);
  if (directory !== videoDirectory) {
    setVideoDirectory(directory);
  }
  const fileName = path.basename(filePath);
  return `http://localhost:3000/videos/${encodeURIComponent(fileName)}`;
}

export function getLatestVideoUrl(): string {
  const files = fs.readdirSync(videoDirectory);
  const filesWithStats = files
    .map((file) => {
      const filePath = path.join(videoDirectory, file);
      const stats = fs.statSync(filePath);
      return {
        name: file,
        mtime: stats.mtime,
      };
    })
    .sort((a, b) => a.mtime.getTime() - b.mtime.getTime());

  const latestFile = filesWithStats.pop();

  if (!latestFile) {
    throw new Error('No video files found in the directory');
  }
  return getVideoUrl(path.join(videoDirectory, latestFile.name));
}

export function getAllVideos(): { name: string; url: string; thumbnailUrl: string }[] {
  const videoExtensions = ['.mp4', '.mov', '.avi', '.mkv', '.webm', '.wmv'];
  const files = fs.readdirSync(videoDirectory);
  return files
    .filter((file) => videoExtensions.some((ext) => file.toLowerCase().endsWith(ext)))
    .map((file) => ({
      name: file,
      url: getVideoUrl(path.join(videoDirectory, file)),
      thumbnailUrl: `http://localhost:3000/thumbnail/${encodeURIComponent(file)}`,
    }));
}
