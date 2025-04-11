import { app } from 'electron';
import express from 'express';
import fs from 'fs';
import path from 'path';

const server = express();
let serverInstance: any = null;
let videoDirectory: string = path.join(app.getPath('home'), 'Downloads', 'replay');

export function startServer(directory: string, port = 3000) {
  if (serverInstance) {
    return serverInstance;
  }

  videoDirectory = directory;

  serverInstance = server.listen(port, () => {
    console.log(`Video server running on port ${port}`);
  });

  server.use('/videos', express.static(videoDirectory));

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
