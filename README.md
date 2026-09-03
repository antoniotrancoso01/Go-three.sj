# 3D Go – Three.js Interactive Board Game

A WebGL-based 3D implementation of the classic board game Go built with **Three.js**, **JavaScript**, and **Blender**. The project features dual-camera projection systems, custom lighting setups, hierarchical object modeling, and a stack-based flood-fill algorithm for board state and capture mechanics.

Developed for the Computer Graphics course at the Universidade de Trás-os-Montes e Alto Douro (UTAD).

---

## 🎮 Live Demo & Media

![Gameplay Demo](assets/demo.gif)

* **Live Demo:** [View Project on GitHub Pages](https://) 

---

## 🚀 Key Features

### 3D Graphics & Scene Construction
* **Hierarchical Object Modeling:** Custom objects built using Three.js primitives organized in parent-child hierarchies (e.g., chairs with mounted stone bowls and cushions) alongside custom FBX meshes modeled in Blender.
* **Dynamic Lighting Engine:** Switchable scene illumination utilizing both global `AmbientLight` and targeted `SpotLight` with custom intensity settings.
* **Dual Camera Pipeline:** Toggle between an interactive, free-roaming **Perspective Camera** (first-person inspection) and a fixed top-down **Orthographic Camera** aligned with the game board.
* **Interactive Physics/Animation:** Keyframe/procedural animations triggered on-demand, featuring scattering pieces and scene component transformations.
* **Environment:** Custom cubic skybox creating a backdrop arena.

### Game Mechanics (Atari Go Engine)
* **9x9 Intersection Grid:** Mathematical coordinate mapping over board mesh vertices for piece placement.
* **Group Capture Detection:** Stack-based depth traversal (Flood Fill) evaluating liberties of adjacent group chains in real time.
* **Suicide Rule Enforcement:** Prevents illegal moves that would result in immediate loss.
* **Turn & State Management:** Automated alternating black/white turn states, occupied intersection validation, and win-condition triggers (first capture wins).

---

## ⌨️ Controls

| Action | Key / Input | Mode / Context |
| :--- | :--- | :--- |
| **Move Camera** | `W`, `A`, `S`, `D`| Perspective Camera (Free Roam) |
| **Switch View** | `Enter` | Toggle Perspective / Orthographic |
| **Move Guide Cursor** | `I` (Up), `K` (Down), `J` (Left), `L` (Right) | Orthographic Camera (Board View) |
| **Place Stone** | `Left Mouse Click` | Orthographic Camera (Board View) |
| **Toggle SpotLight** | `Left Arrow (←)` | Global Scene |
| **Toggle AmbientLight** | `Right Arrow (→)` | Global Scene |
| **Trigger Animation** | `Space` | Global Scene |

---

## 🛠️ Tech Stack & Architecture

* **Core Engine:** WebGL / [Three.js](https://threejs.org/)
* **Language:** JavaScript (ES6+), HTML5, CSS3
* **3D Assets & Texturing:** Blender (FBX format, custom UVs and textures)

```text
├── assets/
│   ├── models/       # 3D models (.fbx)[cite: 1]
│   ├── textures/     # Surface materials and images[cite: 1]
│   └── skybox/       # Cube map environment textures[cite: 1]
├── js/               # Game logic, rendering loop, and input handling
├── index.html        # Entry point canvas
└── README.md
```

## 💻 Running Locally
Because the application loads external 3D meshes (`.fbx`) and textures through JavaScript loaders, modern browsers block direct file execution (`file:///`) due to CORS policies. A local HTTP server is required.

### Option 1: VS Code Live Server (Fastest)
1. Install the **Live Server** extension in VS Code.
2. Right-click `index.html` and select **"Open with Live Server"**.

### Option 2: Node.js (npx)
```bash
# In the project root directory
npx serve .
```

### Option 3: Python 3
```bash
# In the project root directory
python3 -m http.server 8000
```
Then navigate to `http://localhost:8000` in your web browser.

---

## 👥 Authors
* **António Trancoso** - [GitHub](https://github.com/)]
* **Pedro Duarte** - [GitHub](https://github.com/ppxdpp17)]

Developed as part of the BSc in Informatics Engineering (Computer Graphics) at **Universidade de Trás-os-Montes e Alto Douro** (2023/2024).
