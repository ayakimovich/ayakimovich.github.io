## Teaching

---

### Generative AI for Bioimage Analysis (GenAI4BIA)
**Bridging Scales through Generative AI for Inverse Problems in Biomedical Computational Microscopy**

[**GitHub Repository**](https://github.com/ayakimovich/GenAI4BIA) &nbsp;|&nbsp; [**Course Slides (PDF)**](https://github.com/ayakimovich/GenAI4BIA/blob/main/slides/main.pdf) &nbsp;|&nbsp; [![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/ayakimovich/GenAI4BIA/blob/main/practical/practical_workshop.ipynb)

#### Course Overview
This course covers the mathematical foundations of generative AI, inverse problems, and distribution learning in bioimage analysis, paired with a practical hands-on benchmark reproduction of **VIRVS** (*Virus Infection Reporter Virtual Staining*).

#### Topics Covered
* **Inverse Problems in Bioimaging**: Forward modeling ($y = Ax + n$), ill-posedness, and Virtual Staining (mapping label-free brightfield micrographs to continuous fluorescence infection reporter signals).
* **Distribution Learning**: Empirical distributions $p_{\text{data}}(x)$, Maximum Likelihood Estimation (MLE), KL divergence, Jensen-Shannon divergence, and Wasserstein distance.
* **Generative Model Families**:
  * *Variational Autoencoders (VAEs)*: ELBO objective and reparameterization trick ($z = \mu + \sigma \odot \epsilon$).
  * *Generative Adversarial Networks (GANs / Pix2Pix)*: Minimax objective $\min_G \max_D V(D,G)$, conditional GAN loss, and L1 reconstruction.
  * *Diffusion Models (DDPM)*: Forward noise addition $q(x_t|x_{t-1})$, reverse process $p_\theta(x_{t-1}|x_t)$, and noise prediction MSE loss.
* **Code Implementation**: Every mathematical concept is presented alongside its Python / PyTorch code equivalent.

#### Practical Workshop & Benchmarking
The hands-on component features interactive tutorials:
1. **Data Download & Preparation**: VIRVS dataset layout and RODARE access.
2. **Autoencoders & VAEs**: ELBO objective, generative sampling ($z \sim \mathcal{N}(0, I)$), and latent space interpolation.
3. **U-Net Baseline Regression**: Predicting continuous infection fluorescence from brightfield.
4. **Pix2Pix Conditional GAN**: Generative virtual staining model with adversarial loss.
5. **Evaluation & Benchmarking**: Metric evaluation (PSNR, SSIM, PCC, MAE) and cell-level viral reporter signal quantification.

For course [slides (PDF)](https://github.com/ayakimovich/GenAI4BIA/blob/main/slides/main.pdf), notebooks, and setup instructions, visit the [GenAI4BIA GitHub repository](https://github.com/ayakimovich/GenAI4BIA).
