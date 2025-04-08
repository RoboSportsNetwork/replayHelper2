import { app } from 'electron';
import express from 'express';
import fs from 'fs';
import path from 'path';
const server = express();
let serverInstance: any = null;
let videoDirectory: string = path.join(app.getPath('home'), 'Downloads', 'replay');

export function setVideoDirectory(dir: string) {
  videoDirectory = dir;
  // Update the static middleware without restarting the server
  server._router.stack = server._router.stack.filter((layer: any) => {
    return !layer.name || layer.name !== 'serveStatic';
  });
  server.use('/videos', express.static(videoDirectory));
}

export function startServer(port: number = 3000) {
  if (serverInstance) {
    return serverInstance;
  }

  // Serve static files from the configured directory
  server.use('/videos', express.static(videoDirectory));

  serverInstance = server.listen(port, () => {
    console.log(`Video server running on port ${port}`);
  });

  return serverInstance;
}

export function stopServer() {
  if (serverInstance) {
    serverInstance.close();
    serverInstance = null;
  }
}

export function getVideoUrl(filePath: string): string {
  const fileName = path.basename(filePath);
  return `http://localhost:3000/videos/${encodeURIComponent(fileName)}`;
}

export function getLatestVideoUrl(): string {
  const files = fs.readdirSync(videoDirectory);
  const latestFile = files.sort().pop();
  if (!latestFile) {
    throw new Error('No video files found in the directory');
  }
  return getVideoUrl(path.join(videoDirectory, latestFile));
}
