# Compress3D

## Overview
This software provides efficient compression algorithms for 3D objects, significantly reducing their storage size while preserving essential geometric details. It is designed for use in applications such as gaming, virtual reality, augmented reality, and any other domain where 3D models are prevalent.

## Features
- **High Compression Ratio**: Achieves significant reduction in file size without compromising on quality.
- **Lossless and Lossy Compression**: Supports both lossless and lossy compression methods, giving users the flexibility to choose based on their needs.
- **Multi-Format Support**: Compatible with common 3D object file formats like OBJ, GLTF and GLB.
- **DRACO Compression**: Utilizes Google's DRACO compression library to ensure state-of-the-art compression performance.
- **Fast Processing**: Optimized algorithms ensure quick compression and decompression times.

## Installation
To install the software, clone the repository and install the required dependencies:
```sh
git clone https://github.com/gpSWE/compress3d.git
cd compress3d
npm install
npm run dev
