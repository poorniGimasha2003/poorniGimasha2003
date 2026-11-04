<div align="center">

<img src="assets/header.svg" alt="Poorni Pathirage – animated neural network banner" width="100%"/>

<a href="https://git.io/typing-svg"><img src="https://readme-typing-svg.demolab.com?font=Fira+Code&size=18&pause=1200&color=7EE7FF&center=true&vCenter=true&width=620&lines=Fewer+neurons%2C+same+intelligence.;Pruning+deep+networks+for+edge+devices+%E2%9A%A1;From+research+ideas+to+working+systems.;Building+BedSense+%E2%80%94+IoT+for+patient+care." alt="Typing animation" /></a>

<br/>

<a href="mailto:poorni.pathirage@gmail.com"><img src="https://img.shields.io/badge/Email-0d1117?style=for-the-badge&logo=gmail&logoColor=7EE7FF" /></a>
<a href="https://www.linkedin.com/in/poornipathirage"><img src="https://img.shields.io/badge/LinkedIn-0d1117?style=for-the-badge&logo=linkedin&logoColor=7EE7FF" /></a>
<a href="https://github.com/poorniGimasha2003"><img src="https://img.shields.io/badge/GitHub-0d1117?style=for-the-badge&logo=github&logoColor=7EE7FF" /></a>

</div>

<img src="assets/spike-divider.svg" width="100%" alt="action potential divider"/>

## 🧠 Input Layer: About Me

```python
class Neuron:
    def __init__(self):
        self.name      = "Poorni Pathirage"
        self.role      = "Computer Engineering Undergraduate (3rd year)"
        self.campus    = "University of Sri Jayewardenepura, Sri Lanka"
        self.research  = "Structural pruning & model compression"
        self.interests = ["Deep Learning", "Edge AI", "NLP", "IoT for Healthcare"]
        self.building  = "BedSense, a smart bedsore detection system"

    def activation(self, problem):
        return "curiosity" if problem.is_hard else "let's ship it"
```

I'm fascinated by how networks of simple units can learn complex behaviour, and by how many of those units we can **remove** without losing what they learned. My current work focuses on making deep neural networks **smaller and faster** so they can run on real edge hardware.

<img src="assets/spike-divider.svg" width="100%" alt="action potential divider"/>

## ⚡ Hidden Layers: What I'm Working On

```mermaid
flowchart LR
    A["🧩 Dense model<br/>CNN · RNN · Transformer · GNN"] --> B["🔗 DepGraph<br/>dependency analysis"]
    B --> C["✂️ Structural pruning<br/>channels · neurons · heads"]
    C --> D["🧪 Test harness<br/>success · crash · silent error"]
    D --> E["📉 Compact model<br/>accuracy · size · latency"]
    E --> F["🚀 Edge device<br/>Jetson Orin Nano"]
```

> **Research question:** *Which architectures can DepGraph prune safely, where does it break, and how can we extend it to layers it doesn't support yet (like LSTM/GRU)?*

<img src="assets/spike-divider.svg" width="100%" alt="action potential divider"/>

## 🎯 Output Layer: Projects

<details open>
<summary><b>✂️ Structural Pruning of Neural Networks: Evaluating & Extending DepGraph</b> &nbsp;<code>Oct 2026 – Present</code></summary>
<br/>

- Researching **structural pruning**, which removes whole channels, neurons and attention heads to compress deep networks for edge devices.
- Evaluating **DepGraph (CVPR 2023)** and the open-source **Torch-Pruning** library across CNN, RNN/LSTM, Transformer and Graph Neural Network architectures.
- Building an **automated PyTorch test harness** that records whether pruning succeeds, crashes, or silently produces incorrect outputs.
- Aiming to add pruning support for under-supported layers and **contribute it back to Torch-Pruning**, with fair comparisons on accuracy, model size and inference latency.

`Python` `PyTorch` `Torch-Pruning` `torchvision` `Hugging Face Transformers` `PyTorch Geometric`
</details>

<details>
<summary><b>🛒 End-to-End E-Commerce ML Pipeline</b> &nbsp;<code>Jul 2026</code></summary>
<br/>

- Complete ML pipeline on **~780,000 real transactions** (UCI Online Retail II), from data cleaning to an interactive dashboard.
- Customer segmentation with **RFM analysis + clustering**, and **churn prediction** using a time-based train/test split.
- **Apriori market-basket analysis** and a **PageRank co-purchase network** to surface high-influence products, deployed with Streamlit.

`Python` `pandas` `scikit-learn` `mlxtend` `NetworkX` `Streamlit`
</details>

<details>
<summary><b>🛏️ BedSense: Smart Bedsore Detection System</b> &nbsp;<code>Jan 2026 – Present</code></summary>
<br/>

- Came up with the original idea for a **sensor-based monitoring prototype** that detects pressure-related risks in bedridden patients.
- Designed the **software architecture**, integrated the database, and built the real-time monitoring interface.
- Worked with a multidisciplinary team to connect the software to **embedded hardware and IoT communication** workflows.

`ESP32` `MQTT` `Node.js` `React` `SQLite` `IoT`
</details>

<img src="assets/spike-divider.svg" width="100%" alt="action potential divider"/>

## 🏆 Activations: Awards & Recognition

| | Achievement | Project |
|:-:|---|---|
| 🥇 | **Champions**, VERTEX 2025 Innovation Challenge (IEEE RAS, IIT) | IoT & Robotics |
| 🥈 | **1st Runner-Up**, Brainstorm 2026 (IEEE EMBS, University of Moratuwa) | BedSense |
| 🌍 | **Top 6 Finalist**, Hult Prize Sri Lanka Nationals 2026 | BedSense |
| 📡 | **Finalist**, SLIoT Challenge 2026 (University of Moratuwa, SLT-Mobitel, IESL) | BedSense |
| 💡 | **Winner**, IdeaPulse 2.0 Inter-Faculty Idea Pitching 2026 | — |
| 💻 | **Finalist**, Mobitel CodeBlast Hackathon 2025 | — |

<img src="assets/spike-divider.svg" width="100%" alt="action potential divider"/>

## 🔬 Weights & Biases: My Toolkit

**Deep Learning & Compression**
<p>
<img src="https://img.shields.io/badge/PyTorch-EE4C2C?style=flat-square&logo=pytorch&logoColor=white"/>
<img src="https://img.shields.io/badge/Torch--Pruning-0d1117?style=flat-square&logo=pytorch&logoColor=7EE7FF"/>
<img src="https://img.shields.io/badge/Hugging%20Face-FFD21E?style=flat-square&logo=huggingface&logoColor=black"/>
<img src="https://img.shields.io/badge/PyG-3C2179?style=flat-square&logo=pyg&logoColor=white"/>
</p>

**Data Science & ML**
<p>
<img src="https://img.shields.io/badge/Python-3776AB?style=flat-square&logo=python&logoColor=white"/>
<img src="https://img.shields.io/badge/pandas-150458?style=flat-square&logo=pandas&logoColor=white"/>
<img src="https://img.shields.io/badge/scikit--learn-F7931E?style=flat-square&logo=scikitlearn&logoColor=white"/>
<img src="https://img.shields.io/badge/Streamlit-FF4B4B?style=flat-square&logo=streamlit&logoColor=white"/>
<img src="https://img.shields.io/badge/Jupyter-F37626?style=flat-square&logo=jupyter&logoColor=white"/>
</p>

**Cloud, Embedded & Dev**
<p>
<img src="https://img.shields.io/badge/AWS-232F3E?style=flat-square&logo=amazonwebservices&logoColor=white"/>
<img src="https://img.shields.io/badge/ESP32-E7352C?style=flat-square&logo=espressif&logoColor=white"/>
<img src="https://img.shields.io/badge/MQTT-660066?style=flat-square&logo=mqtt&logoColor=white"/>
<img src="https://img.shields.io/badge/React-20232A?style=flat-square&logo=react&logoColor=61DAFB"/>
<img src="https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=nodedotjs&logoColor=white"/>
<img src="https://img.shields.io/badge/C++-00599C?style=flat-square&logo=cplusplus&logoColor=white"/>
<img src="https://img.shields.io/badge/Java-ED8B00?style=flat-square&logo=openjdk&logoColor=white"/>
<img src="https://img.shields.io/badge/Git-F05032?style=flat-square&logo=git&logoColor=white"/>
</p>

<details>
<summary><b>📜 Certifications</b></summary>
<br/>

- **AWS Academy Graduate – Cloud Foundations** (Jul 2026)
- SQL (Basic), HackerRank
- Java Intermediate · Intro to Java, Python & C++, Sololearn
</details>

<img src="assets/spike-divider.svg" width="100%" alt="action potential divider"/>

## 📊 Forward Pass: GitHub Activity

<div align="center">
<img src="https://github-readme-stats.vercel.app/api?username=poorniGimasha2003&show_icons=true&hide_border=true&bg_color=0d1117&title_color=7EE7FF&icon_color=7EE7FF&text_color=c9d1d9" height="165" alt="GitHub stats"/>
<img src="https://github-readme-stats.vercel.app/api/top-langs/?username=poorniGimasha2003&layout=compact&hide_border=true&bg_color=0d1117&title_color=7EE7FF&text_color=c9d1d9" height="165" alt="Top languages"/>
</div>

<img src="assets/spike-divider.svg" width="100%" alt="action potential divider"/>

<div align="center">

### 🤝 Let's connect

I'm open to **research and industry internships** in deep learning, model compression and edge AI.<br/>
If you're working on making AI more efficient, I'd love to talk.

<sub><i>"The brain prunes about half of its synapses as it matures and gets better at what it does. Neural networks can do the same."</i></sub>

</div>
