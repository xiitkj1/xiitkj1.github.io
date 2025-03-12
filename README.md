<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>SMAN 1 LENGKONG</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        margin: 0;
        padding: 0;
        background-color: #d9f1f1;
        color: #333;
      }

      .header {
        text-align: center;
        padding: 20px;
        width: 100vw;
        background-image: url("smaile.jpeg"); /* Ganti dengan nama gambar background rageman*/
        background-size: cover;
        background-position: center;
        background-repeat: no-repeat;
        height: 600px;
      }

      .logo-container {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 15px;
        margin-bottom: 10px;
      }

      .logo-container img {
        width: 60px;
        height: 60px;
        object-fit: contain;
      }

      .logo-container img[alt="Logo OSIS"] {
        width: 80px;
        height: 80px;
      }

      .content {
        text-align: center;
        padding: 20px;
      }

      .button {
        display: block;
        margin: 10px auto;
        padding: 15px 20px;
        width: 80%;
        max-width: 400px;
        text-decoration: none;
        color: white;
        background-color: #007b7b;
        border-radius: 5px;
        text-align: center;
      }

      .button:hover {
        background-color: #005959;
      }

      .ekskul-list {
        margin-top: 20px;
      }

      .ekskul-item {
        background-color: #57c9c9;
        margin: 10px auto;
        padding: 15px;
        width: 80%;
        max-width: 400px;
        border-radius: 5px;
        color: white;
      }

      .sman1lengkong,
      .official {
        color: white;
      }

      @media (max-width: 1023px) {
        .header {
          height: 400px;
        }

        .logo-container img {
          width: 50px;
          height: 50px;
        }

        .logo-container img[alt="Logo OSIS"] {
          width: 70px;
          height: 70px;
        }
      }

      @media (max-width: 767px) {
        .header {
          height: 250px;
          padding: 10px;
        }

        .logo-container {
          gap: 10px;
        }

        .logo-container img {
          width: 40px;
          height: 40px;
        }

        .logo-container img[alt="Logo OSIS"] {
          width: 60px;
          height: 60px;
        }

        h1 {
          font-size: 18px;
        }

        p {
          font-size: 14px;
        }
      }
    </style>
  </head>
  <body>
    <div class="header">
      <div class="logo-container">
        <img
          src="WhatsApp_Image_2025-03-12_at_13.56.48-removebg-preview.png"
          alt="Logo SMAN 1 LENGKONG"
        />
        <!-- Ganti dengan nama gambar logo smaile -->
        <img src="logo_osis-removebg-preview.png" alt="Logo OSIS" />
        <!-- Ganti dengan nama gambar logo osis smaile -->
      </div>
      <h1 class="sman1lengkong">SMAN 1 LENGKONG</h1>
      <p class="official">Official</p>
    </div>

    <div class="content">
      <a href="#" class="button">WEBSITE</a>
      <a href="#" class="button">INSTAGRAM</a>
      <h2>PENGURUS OSIS SMAN 1 LENGKONG</h2>
      <div class="ekskul-list">
        <div class="ekskul-item">SEKBID 1</div>
        <div class="ekskul-item">SEKBID 2</div>
        <div class="ekskul-item">SEKBID 3</div>
        <div class="ekskul-item">SEKBID 4</div>
        <div class="ekskul-item">SEKBID 5</div>
        <div class="ekskul-item">SEKBID 6</div>
        <div class="ekskul-item">SEKBID 7</div>
        <div class="ekskul-item">SEKBID 8</div>
        <div class="ekskul-item">SEKBID 9</div>
        <div class="ekskul-item">SEKBID 10</div>
      </div>
    </div>
  </body>
</html>
