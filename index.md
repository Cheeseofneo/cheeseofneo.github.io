---
layout: homepage
title: Home
---

# About Me

I am a Master student in Electrical Engineering at Tsinghua University, supervised by Prof. [Xiaohao Wang](https://www.researchgate.net/profile/Xiaohao-Wang-3). I also gained research experience at The University of Tokyo supervised by Prof. [Ken Takeuchi](https://scholar.google.com/citations?user=upWbWuAAAAAJ&hl=ja) and currently collaborate with researchers from HKUST.

My research focuses on bridging Signal Processing with modern Generative AI. Unlike pure deep learning approaches, I advocate for incorporating interpretable mathematical structures, such as Wavelet Theory, Sampling Theorems, and Inverse Problem formulations, into the design of foundation models. My goal is to build generative systems that are not only high-quality but also physically consistent, theoretically interpretable, and computationally efficient.

## Research Interests

- Generative Architectures: Efficient backbones via frequency domain priors.
- Sampling Theory: Diffusion posterior sampling for inverse problems, including MRI reconstruction and blind restoration.
- AIGC Applications: Digital human generation, video synthesis, and medical imaging.

## News

- **Spring/Summer 2026:** Actively seeking research intern positions in Generative AI, Computer Vision, or Medical AI.
- **May 2026:** VIVIDTALKER accepted to ICASSP.

## Selected Publications

{% include publication-list.html %}

## Recent Posts

<ol class="compact-post-list">
{% for post in site.posts limit: 5 %}
  <li>
    <time datetime="{{ post.date | date_to_xmlschema }}">{{ post.date | date: "%Y.%m" }}</time>
    <a href="{{ post.url | relative_url }}">{{ post.title }}</a>
  </li>
{% endfor %}
</ol>
