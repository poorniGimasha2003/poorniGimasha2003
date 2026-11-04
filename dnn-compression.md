<div align="center">

# 🧠 DNN Compression: Structural Pruning of Deep Neural Networks

![Status](https://img.shields.io/badge/Status-In%20Progress-F6C177?style=for-the-badge)
![Type](https://img.shields.io/badge/Individual%20Research-0d1117?style=for-the-badge)
![Since](https://img.shields.io/badge/Since-Oct%202026-7EE7FF?style=for-the-badge)

*Making deep learning models smaller and faster, so they can run on everyday devices.*

</div>

---

### 💡 The Problem

Modern AI models are accurate but **large and slow**. That makes them hard to run on phones, drones or embedded boards, where memory, power and speed are limited.

### 🎯 The Idea

**Structural pruning** removes whole parts of a trained network that contribute little, such as entire channels, neurons and attention heads. The model becomes genuinely smaller and faster on real hardware while keeping its accuracy as close as possible to the original.

```mermaid
flowchart LR
    A["Large trained model"] --> B["Analyse layer dependencies<br/>(DepGraph)"]
    B --> C["Remove low-importance<br/>channels / neurons / heads"]
    C --> D["Fine-tune"]
    D --> E["Smaller, faster model<br/>for edge devices"]
```

### 🔬 What I'm Working On

| | |
|---|---|
| 📚 **Study** | DepGraph (CVPR 2023) and the open-source **Torch-Pruning** library |
| 🧪 **Evaluate** | Which architectures it supports: **CNNs, RNNs/LSTMs, Transformers and Graph Neural Networks** |
| 🛠️ **Build** | An automated PyTorch test harness that detects whether pruning **succeeds, crashes, or silently breaks** a model |
| ➕ **Extend** | Add pruning support for under-supported layers such as **LSTM/GRU**, aiming to contribute it to Torch-Pruning |
| 📏 **Compare** | Pruning methods on **accuracy, model size and inference latency** |

### 🛠️ Tech

![Python](https://img.shields.io/badge/Python-3776AB?style=flat-square&logo=python&logoColor=white)
![PyTorch](https://img.shields.io/badge/PyTorch-EE4C2C?style=flat-square&logo=pytorch&logoColor=white)
![Torch-Pruning](https://img.shields.io/badge/Torch--Pruning-0d1117?style=flat-square)
![Hugging Face](https://img.shields.io/badge/Hugging%20Face-FFD21E?style=flat-square&logo=huggingface&logoColor=black)
![PyG](https://img.shields.io/badge/PyTorch%20Geometric-3C2179?style=flat-square&logo=pyg&logoColor=white)

### 👥 Supervision

Sanka Mohottala (University of Sri Jayewardenepura) · Mr. Asiri Gawesha (SLIIT) · Dr. Dinuka Sahabandu (University of Washington)

---

<div align="center">

🔒 *The code is currently private while the research is ongoing. It will be released when the work is complete.*

Interested in this work? **[Get in touch on LinkedIn](https://www.linkedin.com/in/poornipathirage)**

[← Back to profile](https://github.com/poorniGimasha2003)

</div>
