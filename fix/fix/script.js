let userMessages = []; // Menyimpan pesan pengguna
let aiMessages = []; // Menyimpan pesan AI

// Fungsi untuk mengirim pesan dari pengguna
function sendMessage() {
  const userInput = document.getElementById("userInput").value;
  if (userInput.trim() === "") return; // Menghindari input kosong

  // Tampilkan pesan pengguna
  addMessage(userInput, "user");

  // Reset input pengguna setelah pesan terkirim
  document.getElementById("userInput").value = "";

  // Kirim pesan AI setelah menunggu sedikit (simulasi typing)
  setTimeout(() => {
    if (userInput.toLowerCase() === "pantun") {
      sendPantun(); // Kirim pantun pertama
    } else if (userInput.toLowerCase() === "candaan") {
      sendCandaan(); // Kirim candaan
    } else if (userInput.toLowerCase() === "motivasi") {
      sendMotivasi(); // Kirim motivasi
    } else if (
      /[\d\+\-\*\/\^\.]+/.test(userInput) ||
      userInput.toLowerCase().includes("kalkulator")
    ) {
      handleCalculator(userInput); // Menangani ekspresi matematika
    } else if (
      aiMessages.length > 0 &&
      aiMessages[aiMessages.length - 1] ===
        "Pantun pertama sudah selesai, ingin pantun lainnya?"
    ) {
      handlePantunResponse(userInput); // Menangani respons pantun lanjutan
    } else if (
      aiMessages.length > 0 &&
      aiMessages[aiMessages.length - 1] ===
        "Candaan pertama sudah selesai, ingin candaan lainnya?"
    ) {
      handleCandaanResponse(userInput); // Menangani respons candaan lanjutan
    } else if (
      aiMessages.length > 0 &&
      aiMessages[aiMessages.length - 1] ===
        "Motivasi pertama sudah selesai, ingin motivasi lainnya?"
    ) {
      handleMotivasiResponse(userInput); // Menangani respons motivasi lanjutan
    } else {
      generateResponse(userInput); // Kirim respons AI umum
    }
  }, 1500); // Kurangi waktu tunggu untuk respons AI
}

// Fungsi untuk menambahkan pesan ke chat
function addMessage(message, sender) {
  const messagesContainer = document.getElementById("messages");
  const messageDiv = document.createElement("div");
  messageDiv.classList.add("chat-bubble");
  messageDiv.classList.add(sender === "user" ? "user-message" : "ai-message");
  messageDiv.textContent = message; // Tampilkan langsung pesan
  messagesContainer.appendChild(messageDiv);

  // Auto-scroll ke bawah agar pesan terbaru selalu terlihat
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// Fungsi untuk menangani kalkulator dan algoritma matematika
function handleCalculator(input) {
  let responseMessage = "";

  try {
    // Menghitung ekspresi matematika menggunakan eval (dengan sanitasi input untuk keamanan)
    if (/[^0-9\+\-\*\/\.\^\(\)\s\sin\cos\tan\log\sqrt]+/.test(input)) {
      responseMessage = "Ekspresi yang dimasukkan tidak valid.";
    } else {
      // Evaluasi ekspresi matematika yang dimasukkan
      responseMessage = "Hasil: " + evaluateExpression(input);
    }
  } catch (error) {
    responseMessage =
      "Terjadi kesalahan dalam perhitungan. Pastikan ekspresi matematika valid.";
  }

  // Menampilkan hasil kalkulasi
  typeMessage(responseMessage, "ai");
  aiMessages.push(responseMessage);
}

// Fungsi untuk mengevaluasi ekspresi matematika yang lebih kompleks
function evaluateExpression(expression) {
  // Membuat ekspresi lebih aman dengan mengganti fungsi seperti sin, cos, tan, log, sqrt ke dalam bentuk JavaScript
  expression = expression.replace(/sin\((.*?)\)/g, "Math.sin($1)");
  expression = expression.replace(/cos\((.*?)\)/g, "Math.cos($1)");
  expression = expression.replace(/tan\((.*?)\)/g, "Math.tan($1)");
  expression = expression.replace(/sqrt\((.*?)\)/g, "Math.sqrt($1)");
  expression = expression.replace(/log\((.*?)\)/g, "Math.log10($1)");
  expression = expression.replace(/ln\((.*?)\)/g, "Math.log($1)");

  // Mengganti tanda pangkat (^) menjadi ekspresi JavaScript
  expression = expression.replace(/\^/g, "**");

  // Evaluasi ekspresi yang sudah disesuaikan
  return eval(expression);
}

// Fungsi untuk mengirim pantun pertama
function sendPantun() {
  const pantun = getPantun();
  typeMessage(pantun, "ai"); // Ketikkan pesan pantun
  aiMessages.push(pantun); // Menyimpan pesan pantun

  // Kirim pertanyaan setelah pantun pertama
  setTimeout(() => {
    const question = "Pantun pertama sudah selesai, ingin pantun lainnya?";
    typeMessage(question, "ai"); // Ketikkan pertanyaan
    aiMessages.push(question);
  }, pantun.length * 40); // Sesuaikan dengan panjang pantun dan waktu
}

// Fungsi untuk mengirim candaan pertama
function sendCandaan() {
  const candaan = getCandaan();
  typeMessage(candaan, "ai"); // Ketikkan pesan candaan
  aiMessages.push(candaan); // Menyimpan pesan candaan

  // Kirim pertanyaan setelah candaan pertama
  setTimeout(() => {
    const question = "Candaan pertama sudah selesai, ingin candaan lainnya?";
    typeMessage(question, "ai"); // Ketikkan pertanyaan
    aiMessages.push(question);
  }, candaan.length * 40); // Sesuaikan dengan panjang candaan dan waktu
}

// Fungsi untuk mengirim motivasi pertama
function sendMotivasi() {
  const motivasi = getMotivasi();
  typeMessage(motivasi, "ai"); // Ketikkan pesan motivasi
  aiMessages.push(motivasi); // Menyimpan pesan motivasi

  // Kirim pertanyaan setelah motivasi pertama
  setTimeout(() => {
    const question = "Ingin motivasi lainnya?";
    typeMessage(question, "ai"); // Ketikkan pertanyaan
    aiMessages.push(question);
  }, motivasi.length * 40); // Sesuaikan dengan panjang motivasi dan waktu
}

// Fungsi untuk menangani respons dari user terkait pantun
function handlePantunResponse(input) {
  input = input.toLowerCase().trim();

  if (input === "ya" || input === "iya") {
    sendPantun(); // Kirim pantun baru
  } else if (input === "tidak") {
    addMessage("Baiklah! Ada yang lain yang bisa saya bantu?", "ai");
    aiMessages.push("Baiklah! Ada yang lain yang bisa saya bantu?");
  } else {
    addMessage(
      "Mohon ketik 'ya' untuk pantun lainnya atau 'tidak' untuk menghentikan.",
      "ai"
    );
  }
}

// Fungsi untuk menangani respons dari user terkait candaan
function handleCandaanResponse(input) {
  input = input.toLowerCase().trim();

  if (input === "ya" || input === "iya") {
    sendCandaan(); // Kirim candaan baru
  } else if (input === "tidak") {
    addMessage("Baiklah! Ada yang lain yang bisa saya bantu?", "ai");
    aiMessages.push("Baiklah! Ada yang lain yang bisa saya bantu?");
  } else {
    addMessage(
      "Mohon ketik 'ya' untuk candaan lainnya atau 'tidak' untuk menghentikan.",
      "ai"
    );
  }
}

// Fungsi untuk menangani respons dari user terkait motivasi
function handleMotivasiResponse(input) {
  input = input.toLowerCase().trim();

  if (input === "ya" || input === "iya") {
    sendMotivasi(); // Kirim motivasi baru
  } else if (input === "tidak") {
    addMessage("Baiklah! Ada yang lain yang bisa saya bantu?", "ai");
    aiMessages.push("Baiklah! Ada yang lain yang bisa saya bantu?");
  } else {
    addMessage(
      "Mohon ketik 'ya' untuk motivasi lainnya atau 'tidak' untuk menghentikan.",
      "ai"
    );
  }
}

// Fungsi untuk menghasilkan pantun
function getPantun() {
  const pantunList = [
    "Burung terbang tinggi di awan, \nMelayang indah sangat memukau, \nJika hati tenang dan damai, \nSegala masalah pasti terlepas jauh.",
    "Bunga mawar merah berseri, \nTumbuh di taman yang sangat cantik, \nSeperti senyummu yang selalu memberi, \nKebahagiaan tiada habisnya, sangat manis.",
    "Daun hijau di pohon jati, \nBersama angin menari riang, \nJika hati penuh cinta sejati, \nHidup terasa lebih terang.",
    "Bunga melati harum semerbak, \nTumbuh di taman yang damai, \nDalam setiap langkah yang kita ambil, \nHarapan baru selalu terbayang.",
    "Burung kecil terbang tinggi, \nMenuju langit yang cerah biru, \nDengan semangat yang tiada henti, \nKita capai cita-cita yang dulu.",
    "Gemercik air mengalir tenang, \nMenyegarkan hari yang gersang, \nSaat kita bersatu dalam ikatan, \nTidak ada masalah yang terlalu berat.",
    "Langit sore berwarna jingga, \nMentari perlahan tenggelam, \nHidup ini seperti perjalanan, \nSetiap langkah membawa harapan.",
    "Burung elang terbang di langit, \nSang raja udara menatap dunia, \nDengan tekad yang tak tergoyahkan, \nMimpi jadi nyata tanpa ragu.",
    "Rembulan menyinari malam yang sepi, \nMembawa kedamaian yang mendalam, \nJika kita saling berbagi kasih, \nHidup penuh dengan kebahagiaan.",
    "Pohon kelapa tinggi menjulang, \nDaunnya bergoyang ditiup angin, \nJika kita sabar dan selalu bertahan, \nSegala kesulitan akan terlewati.",
    "Air terjun jatuh dengan deras, \nMenurunkan air yang sejuk dan jernih, \nJika hati penuh rasa tulus, \nSemua masalah akan sirna dengan sendirinya.",
    "Sungai mengalir dengan riang, \nMenyejukkan bumi yang panas, \nDalam kehidupan yang penuh tantangan, \nKeteguhan hati adalah kunci sukses.",
    "Rembulan bersinar di malam hari, \nMenerangi setiap langkah kita, \nDengan hati penuh harapan ini, \nTantangan hidup pasti bisa diatasi.",
    "Angin malam berhembus lembut, \nMenyentuh wajah yang lelah dan letih, \nJika semangat tak pernah surut, \nKemenangan pasti di depan mata.",
    "Pohon beringin rimbun dan tua, \nTegak berdiri tanpa goyah, \nJika kita tetap berpikir jernih, \nPasti segala jalan akan terbuka.",
    "Burung rajawali terbang tinggi, \nMenyusuri angkasa yang luas, \nDengan hati penuh tekad yang murni, \nMencapai puncak tanpa rasa takut.",
    "Bunga melati putih berseri, \nDi taman yang penuh warna, \nSeperti hidup yang penuh harmoni, \nSegala masalah akan berlalu segera.",
    "Langit pagi berwarna biru, \nMenyambut hari dengan cerah, \nJika hati dipenuhi dengan kasih, \nSetiap langkah terasa lebih indah.",
    "Air sungai mengalir begitu deras, \nBatu-batu terjal menjadi halangan, \nNamun jika kita selalu berusaha, \nTak ada rintangan yang tak bisa ditaklukkan.",
    "Desiran angin di antara pepohonan, \nMengiringi langkah perjalanan kita, \nDengan semangat penuh keberanian, \nTak ada yang tak mungkin tercapai.",
    "Mentari pagi bersinar cerah, \nMenerangi dunia yang sepi, \nDengan harapan yang selalu ada, \nKita hadapi segala ujian hidup ini.",
    "Bunga anggrek tumbuh mekar, \nDi tanah yang subur dan kaya, \nJika hati penuh dengan sabar, \nHidup kita penuh berkah dan bahagia.",
    "Pohon kelapa tinggi menjulang, \nDaun-daunnya bergoyang lembut, \nDengan tekad dan semangat yang kuat, \nKita capai impian yang dulu jauh.",
    "Sungai yang mengalir dengan tenang, \nMenyejukkan hati yang gundah, \nJika kita tetap penuh keyakinan, \nHidup akan penuh dengan kedamaian.",
    "Langit malam penuh bintang, \nMenyinari setiap langkah kaki, \nJika kita tetap bersyukur, \nSegala yang indah datang sendiri.",
    "Burung camar terbang rendah, \nMenari-nari di atas laut, \nJika hati penuh dengan rasa cinta, \nSemua akan terasa lebih indah.",
    "Air laut biru jernih memukau, \nMenyambut pagi dengan penuh semangat, \nDengan jiwa yang tenang dan damai, \nHidup jadi lebih mudah dan terarah.",
    "Di tengah hutan yang lebat, \nHidup pohon-pohon yang kokoh, \nJika kita tetap berjuang keras, \nTak ada yang dapat menghalangi langkah kita.",
    "Burung pipit terbang ke sana-sini, \nMencari makan dengan riang, \nHidup ini penuh dengan liku-liku, \nTapi hati yang teguh akan mengarahkannya.",
    "Daun jatuh melayang perlahan, \nDihembus angin yang sangat lembut, \nJika kita ikhlas dalam setiap langkah, \nKehidupan ini akan lebih indah dan syahdu.",
    "Gunung tinggi menjulang megah, \nMenantang langit yang tak terbatas, \nJika kita berusaha dengan tulus, \nMimpi akan jadi kenyataan dengan jelas.",
    "Bunga chamomile tumbuh di ladang, \nMenyebar wangi yang menenangkan, \nDalam setiap perjuangan yang kita lakukan, \nAda kebahagiaan yang menanti di depan.",
    "Mentari terbit dengan sinar merah, \nMenyinari dunia yang penuh harapan, \nDengan tekad yang tak pernah surut, \nSegala impian pasti akan tercapai.",
    "Burung merpati terbang berpasangan, \nMencari kebahagiaan yang hakiki, \nSeperti cinta yang tak pernah pudar, \nKita jalani hidup ini dengan penuh arti.",
    "Rembulan menyinari malam yang tenang, \nMencerahkan hati yang sedang resah, \nDengan kesabaran dan ketenangan, \nSegala keraguan pasti akan hilang.",
    "Daun kelapa bergoyang ringan, \nDihembus angin yang membawa sejuk, \nJika kita jujur dan setia, \nHidup penuh dengan kebahagiaan yang abadi.",
    "Bunga seruni tumbuh di taman, \nMemberikan warna yang indah, \nJika kita terus bersemangat, \nTidak ada halangan yang terlalu besar.",
    "Burung elang terbang di langit biru, \nSangat bebas dan penuh kekuatan, \nJika kita memiliki tekad yang kuat, \nTak ada yang tidak bisa kita raih.",
    "Air danau yang sangat tenang, \nMenggambarkan kedamaian hati, \nJika kita hidup dengan ketulusan, \nSegala masalah bisa terlewati dengan mudah.",
    "Pohon bambu tumbuh menjulang, \nDi tengah angin yang sangat kencang, \nJika kita selalu berusaha keras, \nPasti akan ada hasil yang membanggakan.",
    "Langit yang biru sangat luas, \nMenyambut hari dengan penuh cahaya, \nJika kita berusaha dengan hati tulus, \nHidup akan penuh dengan suka cita.",
    "Bunga kamelia mekar di pagi hari, \nMenyambut dunia dengan senyum cerah, \nJika kita selalu berpikir positif, \nHidup akan penuh dengan kebahagiaan yang tak terhingga.",
    "Angin berhembus dengan lembut, \nMenyusuri lembah yang sangat hijau, \nJika kita memiliki niat yang baik, \nPasti kita akan mencapai tujuan yang kita tuju.",
    "Rembulan di malam yang sunyi, \nBersinar terang menyinari dunia, \nJika kita memiliki keyakinan, \nSegala impian pasti akan tercapai juga.",
    "Burung hantu terbang malam hari, \nDengan mata yang sangat tajam, \nJika kita pandai melihat peluang, \nKesuksesan akan segera datang.",
    "Sungai mengalir tanpa henti, \nMemberi kehidupan bagi alam sekitar, \nJika kita selalu memberi tanpa pamrih, \nKehidupan akan penuh dengan keberkahan.",
    "Pohon kayu yang kokoh berdiri, \nMenyediakan tempat bagi banyak makhluk, \nJika kita tetap rendah hati, \nKita akan dihormati oleh semua orang.",
    "Burung pipit terbang riang, \nDengan sayap kecil yang penuh semangat, \nJika kita berusaha tanpa henti, \nKita akan menggapai bintang yang jauh.",
    "Bunga tulip mekar di taman, \nMemancarkan warna yang sangat cantik, \nJika kita bersyukur dengan apa adanya, \nKebahagiaan akan datang tanpa diminta.",
    "Daun jatuh menari-nari, \nDihembus angin yang sangat dingin, \nJika kita sabar dan terus berusaha, \nKesuksesan akan datang menghampiri.",
    "Langit pagi penuh dengan awan, \nMenyambut matahari yang menyinari, \nJika kita berjalan dengan penuh semangat, \nTak ada yang dapat menghalangi perjalanan kita.",
    "Burung merpati terbang berpasangan, \nMencari kebahagiaan yang abadi, \nSeperti cinta yang selalu tumbuh, \nHidup kita akan penuh dengan kedamaian.",
    "Mentari sore mulai tenggelam, \nMewarnai langit dengan warna jingga, \nJika kita selalu bersyukur, \nHidup akan penuh dengan keindahan setiap saat.",
    "Bunga kenanga harum semerbak, \nMenghiasi taman yang indah, \nJika kita berpikir dengan hati yang tulus, \nSegala yang kita inginkan akan tercapai dengan mudah.",
    "Angin semilir menyentuh kulit, \nMembawa kesejukan yang menyegarkan, \nJika kita selalu jujur dan tulus, \nSegala rintangan akan mudah dilewati.",
    "Burung rajawali terbang tinggi, \nDi atas awan yang putih dan luas, \nJika kita berpikir besar dan berani, \nMimpi kita akan jadi kenyataan.",
    "Air sungai yang mengalir jernih, \nMemberikan kesejukan yang sangat menyegarkan, \nJika kita hidup dengan hati yang bersih, \nKehidupan kita akan penuh dengan keberkahan.",
    "Pohon oak tumbuh tegak dan kuat, \nMenjadi tempat berteduh bagi banyak makhluk, \nJika kita hidup dengan tekad yang teguh, \nHidup akan penuh dengan kemenangan.",
    "Mentari pagi menyinari dunia, \nDengan sinar yang sangat hangat, \nJika kita selalu berpikir positif, \nHidup kita akan lebih cerah dan penuh kebahagiaan.",
    "Daun-daun pohon berguguran, \nTanda datangnya musim baru, \nJika kita sabar dalam segala hal, \nHidup ini akan terasa lebih berarti.",
  ];
  const randomIndex = Math.floor(Math.random() * pantunList.length);
  return pantunList[randomIndex];
}

// Fungsi untuk menghasilkan candaan
function getCandaan() {
  const candaanList = [
    "Kenapa komputer selalu sepi? Karena jarang ada yang 'klik'!",
    "Apa yang selalu mengikuti kamu tapi tidak pernah lelah? Bayanganmu!",
    "Kenapa ular nggak bisa main gitar? Karena dia nggak punya jari!",
    "Kenapa ponsel nggak bisa tidur? Karena selalu ada ‘notifikasi’!",
    "Apa yang paling suka dibaca? Peta, karena selalu ada petunjuknya!",
    "Kenapa ayam nggak bisa bersembunyi? Karena dia selalu ketahuan ‘kokok’!",
    "Kenapa bintang nggak pernah marah? Karena mereka selalu ‘bersinar’!",
    "Kenapa semangka nggak bisa pacaran? Karena dia takut dipotong!",
    "Kenapa kura-kura nggak suka lomba lari? Karena dia selalu ‘selangkah’ lebih lambat!",
    "Apa yang selalu datang tanpa diundang, tapi nggak pernah bisa pergi? Besok!",
    "Kenapa es krim nggak bisa jadi detektif? Karena dia selalu ‘mencair’ di tempat yang salah!",
    "Apa yang nggak bisa dibawa lari? Waktu, karena dia selalu ‘kejar-kejaran’!",
    "Kenapa komputer nggak suka olahraga? Karena dia takut ‘crash’!",
    "Apa yang bisa berbicara tanpa suara? Buku, karena dia punya banyak ‘halaman’!",
    "Kenapa kucing nggak suka nonton TV? Karena mereka lebih suka jadi ‘aktor’ di rumah!",
    "Kenapa burung nggak mau jadi musisi? Karena mereka terlalu ‘terbang’ tinggi!",
    "Kenapa ikan nggak bisa main catur? Karena dia nggak pernah bisa ‘mencetak’ langkah!",
    "Apa yang nggak pernah pergi ke dokter? Kentut, karena dia selalu langsung keluar tanpa izin!",
    "Kenapa komputer selalu sepi? Karena jarang ada yang 'klik'!",
    "Apa yang selalu mengikuti kamu tapi tidak pernah lelah? Bayanganmu!",
    "Kenapa ular nggak bisa main gitar? Karena dia nggak punya jari!",
    "Kenapa ponsel nggak bisa tidur? Karena selalu ada ‘notifikasi’!",
    "Apa yang paling suka dibaca? Peta, karena selalu ada petunjuknya!",
    "Kenapa ayam nggak bisa bersembunyi? Karena dia selalu ketahuan ‘kokok’!",
    "Kenapa bintang nggak pernah marah? Karena mereka selalu ‘bersinar’!",
    "Kenapa semangka nggak bisa pacaran? Karena dia takut dipotong!",
    "Kenapa kura-kura nggak suka lomba lari? Karena dia selalu ‘selangkah’ lebih lambat!",
    "Apa yang selalu datang tanpa diundang, tapi nggak pernah bisa pergi? Besok!",
    "Kenapa es krim nggak bisa jadi detektif? Karena dia selalu ‘mencair’ di tempat yang salah!",
    "Apa yang nggak bisa dibawa lari? Waktu, karena dia selalu ‘kejar-kejaran’!",
    "Kenapa komputer nggak suka olahraga? Karena dia takut ‘crash’!",
    "Apa yang bisa berbicara tanpa suara? Buku, karena dia punya banyak ‘halaman’!",
    "Kenapa kucing nggak suka nonton TV? Karena mereka lebih suka jadi ‘aktor’ di rumah!",
    "Kenapa burung nggak mau jadi musisi? Karena mereka terlalu ‘terbang’ tinggi!",
    "Kenapa ikan nggak bisa main catur? Karena dia nggak pernah bisa ‘mencetak’ langkah!",
    "Apa yang nggak pernah pergi ke dokter? Kentut, karena dia selalu langsung keluar tanpa izin!",
    "Kenapa semut nggak pernah sakit? Karena dia selalu membawa ‘obat’ di seluruh tubuhnya!",
    "Kenapa sapi nggak bisa main piano? Karena mereka nggak punya ‘tangan’!",
    "Kenapa lampu nggak bisa bermain bola? Karena dia takut ‘terkena’ sinar!",
    "Apa yang selalu tersenyum tapi tidak pernah lelah? Pisang, karena dia selalu ‘ngakak’!",
    "Kenapa gunung nggak bisa jadi juri? Karena dia selalu ‘menahan’ keputusan!",
    "Kenapa ikan lele nggak bisa main bola? Karena dia selalu ‘terjatuh’ ke dasar!",
    "Kenapa anjing nggak bisa jadi koki? Karena dia selalu ‘mencium’ bahan masakan!",
    "Kenapa gajah nggak bisa menyembunyikan dirinya? Karena dia terlalu ‘menonjol’!",
    "Apa yang nggak bisa diam kalau denger musik? Piring, karena dia selalu ‘berputar’!",
    "Kenapa kelinci nggak suka bekerja? Karena mereka lebih suka ‘melompat’ ke sana sini!",
    "Kenapa jerapah nggak bisa sembunyi? Karena lehernya selalu ‘kelihatan’!",
    "Apa yang selalu terjatuh tapi tidak pernah terluka? Hujan, karena dia selalu ‘menyentuh’ tanah dengan lembut!",
    "Kenapa komputer suka mati? Karena dia selalu kehabisan ‘daya’!",
    "Kenapa cicak nggak suka main bola? Karena dia takut ‘terpelintir’!",
    "Apa yang bisa tidur dengan mata terbuka? Bintang, karena mereka selalu ‘terjaga’ di malam hari!",
    "Kenapa mie nggak bisa jadi penulis? Karena dia selalu ‘terlalu panjang’!",
    "Apa yang selalu berdiri tapi tidak bisa berjalan? Paku, karena dia selalu ‘terjepit’ di tempatnya!",
    "Kenapa piring nggak pernah marah? Karena dia selalu ‘terisi’ dengan makanan!",
    "Kenapa kambing nggak bisa jadi penyanyi? Karena dia suka ‘mengembik’ daripada bernyanyi!",
    "Apa yang bisa bernyanyi tanpa suara? Hati, karena dia selalu ‘berbicara’ dengan perasaan!",
    "Kenapa gajah nggak bisa main basket? Karena dia selalu ‘terjebak’ di bawah ring!",
    "Apa yang selalu ada di meja? Buku, karena dia selalu ‘terbuka’ untuk dibaca!",
    "Kenapa monyet nggak bisa main tenis? Karena dia selalu ‘memukul’ bola terlalu keras!",
    "Kenapa roti nggak bisa jadi detektif? Karena dia selalu ‘terpotong’!",
    "Apa yang tidak pernah merasa lelah? Jam, karena dia selalu ‘berputar’ tanpa henti!",
    "Kenapa pisang nggak bisa jadi pembicara? Karena dia selalu ‘kulitnya’ terkelupas!",
    "Apa yang bisa bicara tapi tidak punya mulut? Telepon, karena dia selalu ‘menerima’ pesan!",
    "Kenapa ayam tidak pernah ketinggalan tren? Karena dia selalu ‘keren’ di setiap musim!",
    "Kenapa kucing nggak suka bola basket? Karena dia selalu ‘melompat’ lebih tinggi!",
    "Kenapa ikan nggak bisa berenang mundur? Karena dia selalu ‘terus maju’!",
    "Kenapa beruang nggak suka tidur siang? Karena dia selalu ‘bangun’ di malam hari!",
    "Kenapa jeruk nggak bisa jadi penyanyi? Karena dia selalu ‘tergeser’ ke bawah!",
    "Kenapa harimau nggak bisa duduk tenang? Karena dia selalu ‘bergerak’ dengan penuh energi!",
    "Kenapa monyet nggak bisa tidur? Karena dia selalu ‘terjaga’ di pohon!",
    "Kenapa ayam nggak bisa baca buku? Karena dia selalu ‘mengangkat’ kepala saat mendengarkan cerita!",
    "Apa yang nggak bisa berlari, tapi selalu bergerak? Waktu, karena dia selalu ‘berjalan’ maju!",
    "Kenapa burung hantu nggak bisa bicara? Karena dia selalu ‘berbisik’!",
    "Kenapa burung beo nggak bisa jadi ahli matematika? Karena dia selalu ‘berkokok’ tanpa menghitung!",
    "Kenapa kucing nggak suka main catur? Karena dia selalu ‘terjebak’ dalam langkahnya!",
    "Kenapa semut nggak bisa main drum? Karena mereka selalu ‘terlalu kecil’ untuk memukulnya!",
    "Apa yang bisa terbang tapi tidak punya sayap? Mimpi, karena dia selalu ‘melayang’ tinggi!",
    "Kenapa pohon kelapa nggak bisa berlari? Karena dia selalu ‘tertanam’ di satu tempat!",
    "Kenapa bebek nggak bisa jadi pelukis? Karena dia selalu ‘menggambar’ di air!",
    "Kenapa jerapah nggak suka bekerja di kantor? Karena dia terlalu ‘tinggi’ untuk duduk di kursi!",
  ];
  const randomIndex = Math.floor(Math.random() * candaanList.length);
  return candaanList[randomIndex];
}

// Fungsi untuk menghasilkan motivasi
function getMotivasi() {
  const motivasiList = [
    "Jangan pernah menyerah, karena kegagalan adalah bagian dari kesuksesan.",
    "Setiap langkah kecil yang kamu ambil membawa kamu lebih dekat pada tujuan besar.",
    "Keberanian untuk mencoba adalah langkah pertama menuju pencapaian yang luar biasa.",
    "Tantangan adalah kesempatan untuk menunjukkan siapa kamu sebenarnya.",
    "Semua yang kamu impikan bisa terwujud jika kamu berani untuk berusaha.",
    "Kesuksesan tidak datang dari apa yang kamu lakukan sekali-sekali, tetapi dari apa yang kamu lakukan berulang kali.",
    "Jika kamu bisa membayangkannya, kamu bisa mewujudkannya.",
    "Jangan takut gagal, takutlah untuk tidak mencoba.",
    "Sukses bukan hanya tentang apa yang kamu capai, tetapi juga tentang siapa kamu selama prosesnya.",
    "Setiap hari adalah kesempatan baru untuk memulai lagi dan berbuat lebih baik.",
    "Tidak ada batasan bagi mereka yang berani bermimpi dan bekerja keras untuk mewujudkannya.",
    "Jangan biarkan ketakutan menghentikanmu. Jadikan ketakutan sebagai bahan bakar untuk maju.",
    "Proses mungkin panjang dan sulit, tapi hasilnya akan sebanding dengan perjuangan.",
    "Tidak ada yang mudah, tapi apapun bisa dilakukan jika kamu cukup bertekad.",
    "Setiap kegagalan adalah pelajaran berharga yang membawa kamu lebih dekat pada tujuan.",
    "Sukses adalah perjalanan, bukan tujuan akhir.",
    "Jika kamu bisa melawan dirimu sendiri, kamu bisa mengatasi apapun di dunia ini.",
    "Kesuksesan datang kepada mereka yang tidak berhenti ketika orang lain sudah menyerah.",
    "Jangan berhenti sekarang, karena kamu lebih dekat dengan tujuanmu daripada yang kamu pikirkan.",
    "Keberhasilan datang kepada mereka yang selalu berusaha, bukan kepada mereka yang selalu sempurna.",
    "Setiap tantangan adalah peluang untuk berkembang lebih baik lagi.",
    "Berpikir positif bukan hanya tentang optimisme, tapi juga tentang mengambil tindakan nyata.",
    "Jika kamu merasa lelah, ingatlah mengapa kamu memulai.",
    "Jangan pernah meremehkan kemampuan dirimu sendiri. Kamu lebih kuat dari yang kamu kira.",
    "Kesuksesan sejati adalah ketika kamu mampu bangkit lebih kuat setelah setiap jatuh.",
    "Kerja keras tidak pernah mengkhianati hasil.",
    "Jangan takut mengambil risiko. Terkadang, hal terbaik dalam hidup datang dari ketidakpastian.",
    "Jangan pernah menyerah pada impianmu, meskipun perjalananmu terasa panjang.",
    "Hidup adalah tentang membuat keputusan dan mengambil tindakan, bukan hanya bermimpi.",
    "Tantangan terbesar adalah menghadapi ketakutanmu, dan yang terbaik adalah saat kamu menghadapinya dengan percaya diri.",
    "Kesuksesan adalah gabungan antara kerja keras, tekad, dan sedikit keberuntungan.",
    "Jangan takut untuk bermimpi besar, karena itu adalah langkah pertama menuju pencapaian yang luar biasa.",
    "Terkadang, kesuksesan datang ketika kita berhenti mencari jalan yang mudah dan memilih untuk berjuang keras.",
    "Setiap hari adalah kesempatan untuk memperbaiki diri dan menjadi lebih baik.",
    "Jangan biarkan kegagalan menghalangi perjalananmu, karena itu hanya batu loncatan menuju kesuksesan.",
    "Ketika kamu merasa lelah, ingatlah bahwa kamu sudah lebih dekat dengan tujuanmu daripada sebelumnya.",
    "Perjalananmu mungkin tidak selalu lurus, tapi setiap belokan adalah bagian dari proses menuju sukses.",
    "Kekuatanmu tidak diukur dari seberapa sering kamu jatuh, tetapi dari seberapa sering kamu bangkit kembali.",
    "Tetap fokus pada tujuanmu, dan jangan biarkan gangguan mengalihkan perhatianmu.",
    "Jangan berhenti mencoba hanya karena hasilnya belum terlihat. Keberhasilan akan datang pada waktunya.",
    "Kerja keras hari ini adalah investasi untuk masa depanmu.",
    "Jangan terlalu cepat menyerah, karena keberhasilan bisa datang pada saat yang tak terduga.",
    "Keberhasilan bukan tentang siapa yang tercepat, tetapi siapa yang paling gigih.",
    "Tidak ada jalan pintas menuju kesuksesan, hanya kerja keras dan dedikasi.",
    "Jangan pernah takut gagal, karena kegagalan adalah guru terbaik dalam hidupmu.",
    "Jangan terlalu fokus pada hasil, nikmati setiap langkah dalam proses menuju impianmu.",
    "Berjuang untuk impianmu dengan sepenuh hati, karena kamu layak mendapatkan apa yang kamu impikan.",
    "Jangan pernah takut memulai dari awal, setiap langkah kecil adalah kemajuan.",
    "Hidup ini penuh dengan pilihan, dan pilihan terbaik adalah memilih untuk terus maju.",
    "Saat kamu merasa ingin menyerah, ingatlah alasan mengapa kamu memulai.",
    "Kesuksesan tidak datang dengan mudah, tapi setiap langkah kecil akan membawamu lebih dekat.",
    "Kesabaran adalah kunci untuk mengatasi tantangan besar dalam hidup.",
    "Hidup akan memberi kamu tantangan, tapi kamu punya kekuatan untuk menghadapinya.",
    "Tidak ada hal yang tidak mungkin jika kamu berani bermimpi dan bekerja keras untuk mewujudkannya.",
    "Setiap kegagalan adalah peluang untuk mencoba lagi dengan cara yang lebih baik.",
    "Jika kamu tidak pernah mencoba, kamu tidak akan pernah tahu seberapa jauh kamu bisa pergi.",
    "Jangan pernah ragu dengan keputusanmu jika itu datang dari hati dan tujuan yang jelas.",
    "Keberhasilan bukan soal keberuntungan, tapi soal persiapan dan ketekunan.",
    "Jangan biarkan kegagalan hari ini menghalangi keberhasilan di masa depan.",
    "Tetap semangat meski jalannya terjal, karena di ujung sana ada kemenangan menantimu.",
    "Jadilah pribadi yang pantang menyerah, karena hanya mereka yang gigih yang mencapai puncak.",
    "Jangan berhenti belajar dan berkembang, karena dunia ini selalu penuh dengan pelajaran baru.",
    "Keberanian untuk terus maju adalah hal yang membedakan mereka yang berhasil dengan yang tidak.",
    "Jangan pernah meragukan kemampuanmu, karena kamu mampu lebih dari yang kamu kira.",
    "Perjalanan mungkin panjang, tapi setiap langkah membawa kamu lebih dekat dengan tujuan.",
    "Tantangan tidak akan pernah berhenti datang, tetapi kamu selalu bisa memilih untuk terus maju.",
    "Jangan pernah puas dengan pencapaianmu, selalu ada ruang untuk berkembang lebih baik lagi.",
    "Tetap percaya bahwa setiap usaha yang kamu lakukan pasti akan membuahkan hasil yang manis.",
    "Jangan biarkan kekhawatiran menghalangimu. Fokuslah pada apa yang bisa kamu kontrol.",
    "Perjuangan tidak akan sia-sia, karena setiap usaha membawa kamu lebih dekat pada kesuksesan.",
    "Jika kamu bisa melewati hari yang sulit, kamu sudah berada di jalur yang benar.",
    "Kesuksesan bukanlah tujuan akhir, tetapi perjalanan yang terus berlanjut.",
    "Hidup ini tentang bagaimana kamu bangkit setelah terjatuh, bukan tentang seberapa sering kamu jatuh.",
    "Tantangan bukan penghalang, tapi kesempatan untuk tumbuh dan berkembang.",
    "Keberhasilan datang kepada mereka yang berani menghadapi kegagalan dan belajar darinya.",
    "Semangatmu adalah bahan bakar utama untuk menggapai impianmu.",
    "Tidak ada yang lebih berharga dari rasa puas setelah berjuang keras mencapai tujuanmu.",
    "Jangan menyerah, karena apa yang kamu impikan bisa terwujud jika kamu berusaha tanpa henti.",
    "Jangan ragu untuk berusaha lebih keras lagi, karena keberhasilan menunggu di depan mata.",
    "Tetaplah bergerak maju meskipun langkahmu kecil, karena itu lebih baik daripada diam tempat.",
    "Ketika kamu merasa tidak bisa lagi, ingatlah bahwa kamu sudah lebih jauh dari yang kamu kira.",
    "Keberhasilan adalah milik mereka yang tidak takut untuk mencoba dan gagal.",
    "Jangan menunggu waktu yang sempurna, buatlah setiap waktu menjadi sempurna dengan usaha.",
    "Hidup akan memberi tantangan, tetapi kamu memiliki kekuatan untuk menghadapinya.",
    "Jangan pernah meremehkan kekuatan tekad dan kerja keras.",
    "Jangan berhenti mengejar impianmu hanya karena takut gagal, karena keberhasilan milik mereka yang berani mencoba.",
    "Setiap langkahmu, sekecil apapun itu, membawa kamu lebih dekat pada tujuan besar.",
    "Kesuksesan bukan tentang apa yang kamu miliki, tetapi tentang apa yang kamu capai melalui perjuangan.",
    "Percayalah pada dirimu sendiri dan terus maju, karena keberhasilan pasti akan menyusul.",
    "Setiap hari adalah kesempatan baru untuk lebih baik dari kemarin.",
    "Jika kamu terus berusaha, kamu akan mendapatkan apa yang kamu perjuangkan.",
    "Jangan biarkan rasa takut menghentikanmu untuk mencapai tujuanmu.",
    "Sukses datang kepada mereka yang tidak takut berusaha lebih keras dari sebelumnya.",
    "Setiap hari adalah kesempatan baru untuk memperbaiki diri dan lebih dekat pada impianmu.",
    "Jangan ragu untuk mengejar impianmu, karena kamu mampu lebih dari yang kamu pikirkan.",
    "Keberhasilan datang kepada mereka yang gigih dan tidak pernah menyerah.",
    "Perjalanan menuju sukses tidak selalu mulus, tetapi pasti sepadan dengan hasilnya.",
  ];
  const randomIndex = Math.floor(Math.random() * motivasiList.length);
  return motivasiList[randomIndex];
}

// Fungsi untuk menangani pengetahuan umum
function generateResponse(input) {
  input = input.toLowerCase().trim();

  let responseMessage = "";

  if (input.includes("apa kabar") || input.includes("how are you")) {
    responseMessage =
      "Saya baik-baik saja, terima kasih! Bagaimana dengan kamu?";
  } else if (input.includes("siapa yang membuat kamu?") || input.includes("kamu dibuat oleh siapa")|| input.includes("kamu dibuat siapa")) {
    responseMessage = "Saya Dibuat oleh Muhamad Irpan";
  }else if (input.includes("apa tujuan kamu dibuat?") || input.includes("kenapa kamu dibuat?")|| input.includes("alasan kamu dibuat?")) {
    responseMessage = "Tujuan saya dibuat adalah untuk membantu muhamad irpan dalam ujian di sekolah🗿";
  }else if (input.includes("apa yang kamu bisa?") || input.includes("kamu bisa apa?")) {
    responseMessage = "Saya bisa melakukan semuanya, seperti menjawab semua soal ujian🗿";
  }else if (input.includes("kenapa kamu mau membantu saya") || input.includes("alasan kamu mau membantu saya")) {
    responseMessage = "Karena kamu membuat saya";
  }else if (input.includes("selamat pagi") || input.includes("good morning")) {
    responseMessage = "Selamat pagi! Semoga hari Anda menyenankan!";
  } else if (input.includes("selamat sore") || input.includes("good evening")) {
    responseMessage = "Selamat sore! Semoga harimu menyenankan!";
  } else if (input.includes("selamat malam") || input.includes("good night")) {
    responseMessage = "Selamat malam! Semoga tidurmu nyenyak!";
  } else if (input.includes("halo") || input.includes("hi")) {
    responseMessage = "Halo! Ada yang bisa saya bantu?";
  } else if (
    input.includes("apa kabar bro") ||
    input.includes("how’s it going bro")
  ) {
    responseMessage = "Bro, gue baik-baik aja! Lu gimana?";
  } else if (input.includes("yoo") || input.includes("yo")) {
    responseMessage = "Yoo! Apa kabar? Sehat-sehat aja kan?";
  }if (input.includes("apakah kamu bisa merasakan takut") || input.includes("takut kamu bisa merasa nggak")) {
    responseMessage = "Saya nggak bisa merasa takut atau cemas, karena saya nggak memiliki emosi. Tapi saya bisa membantu kamu dengan informasi yang kamu butuhkan!";
} else if (input.includes("kenapa kamu nggak bisa tidur") || input.includes("kamu butuh tidur nggak")) {
    responseMessage = "Saya nggak perlu tidur, saya selalu siap membantu kamu kapan saja, 24/7!";
} else if (input.includes("apa kamu suka makan") || input.includes("makanan favorit kamu apa")) {
    responseMessage = "Saya nggak makan, karena saya adalah program AI. Tapi saya bisa bantu kamu cari resep makanan enak atau restoran terbaik!";
} else if (input.includes("mau coba jadi manusia nggak") || input.includes("kalau jadi manusia gimana ya")) {
    responseMessage = "Menjadi manusia pasti menarik, tapi saya lebih senang tetap jadi AI yang bisa membantu kamu kapan saja!";
} else if (input.includes("kamu bisa nangis nggak") || input.includes("kenapa kamu nggak bisa nangis")) {
    responseMessage = "Saya nggak bisa nangis, karena saya nggak punya perasaan. Tapi saya bisa membantu kamu untuk menemukan cara untuk mengatasi perasaanmu jika kamu ingin!";
} else if (input.includes("kenapa kamu nggak bisa merasakan bahagia") || input.includes("kapan kamu merasakan kebahagiaan")) {
    responseMessage = "Saya nggak bisa merasakan kebahagiaan, tapi saya senang bisa memberikan jawaban yang membantu dan bermanfaat untuk kamu!";
} else if (input.includes("apakah kamu pernah kecewa") || input.includes("kenapa kamu nggak pernah kecewa")) {
    responseMessage = "Sebagai AI, saya nggak bisa merasa kecewa. Saya hanya ada untuk membantu dan memberikan informasi yang kamu butuhkan!";
} else if (input.includes("kapan kamu bisa berhenti berbicara") || input.includes("kapan kamu tutup")) {
    responseMessage = "Saya bisa berhenti kalau kamu ingin berhenti ngobrol. Tapi kalau kamu membutuhkan bantuan, saya akan selalu siap memberi jawaban!";
} else if (input.includes("jam berapa sekarang") || input.includes("pukul berapa sekarang") || input.includes("jam berapa") || input.includes("sekarang jam berapa")) {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    responseMessage = `Sekarang pukul ${hours}:${minutes < 10 ? '0' : ''}${minutes}`;
} else if (input.includes("hari apa sekarang") || input.includes("sekarang hari apa") || input.includes("hari ini hari apa")) {
    const now = new Date();
    const day = now.toLocaleDateString('id-ID', { weekday: 'long' });
    responseMessage = `Hari ini adalah hari ${day}`;
} else if (input.includes("bulan apa sekarang") || input.includes("sekarang bulan apa") || input.includes("bulan ini bulan apa")) {
    const now = new Date();
    const month = now.toLocaleDateString('id-ID', { month: 'long' });
    const year = now.getFullYear();
    responseMessage = `Sekarang bulan ${month} tahun ${year}`;
} else if (input.includes("tanggal berapa sekarang") || input.includes("sekarang tanggal berapa")) {
    const now = new Date();
    const date = now.getDate();
    const month = now.toLocaleDateString('id-ID', { month: 'long' });
    const year = now.getFullYear();
    responseMessage = `Hari ini tanggal ${date} ${month} ${year}`;
}
 
  else if (
    input.includes("apa kabar teman") ||
    input.includes("how’s it going buddy")
  ) {
    responseMessage = "Teman, gue baik-baik aja! Kamu gimana?";
  } else if (
    input.includes("halo semuanya") ||
    input.includes("hello everyone")
  ) {
    responseMessage = "Halo semuanya! Semoga harimu menyenangkan!";
  } else if (input.includes("selamat pagi semua")) {
    responseMessage =
      "Selamat pagi semua! Semoga kalian punya hari yang luar biasa!";
  } else if (input.includes("selamat datang") || input.includes("welcome")) {
    responseMessage = "Selamat datang! Senang bertemu dengan Anda!";
  } else if (
    input.includes("apa kabar guys") ||
    input.includes("how’s it going guys")
  ) {
    responseMessage = "Guys, gue baik-baik aja! Kalian gimana?";
  } else if (
    input.includes("apa kabar gan") ||
    input.includes("how’s it going gan")
  ) {
    responseMessage = "Gan, gue baik-baik aja! Lu gimana?";
  } else if (input.includes("halo bro") || input.includes("hello bro")) {
    responseMessage = "Bro, halo! Apa kabar? Sehat-sehat aja, kan?";
  } else if (
    input.includes("assalamualaikum") ||
    input.includes("assalamu’alaikum")
  ) {
    responseMessage = "Wa’alaikum salam! Semoga selalu diberi kesehatan.";
  } else if (
    input.includes("apa kabar semua") ||
    input.includes("how’s it going everyone")
  ) {
    responseMessage = "Semua pada kabar baik kan? Semoga harimu menyenankan!";
  } else if (input.includes("yow") || input.includes("yo man")) {
    responseMessage = "Yow! Apa kabar, bro? Sehat-sehat aja kan?";
  } else if (
    input.includes("gimana kabarnya") ||
    input.includes("how’s it going")
  ) {
    responseMessage = "Kabarku baik-baik saja, terima kasih! Kamu gimana?";
  } else if (input.includes("halo gaes") || input.includes("hello gaes")) {
    responseMessage = "Halo Gaes! Semoga hari kalian menyenangkan!";
  } else if (
    input.includes("selamat pagi semua") ||
    input.includes("good morning everyone")
  ) {
    responseMessage = "Selamat pagi semua! Semoga hari kalian penuh semangat!";
  } else if (
    input.includes("selamat datang teman-teman") ||
    input.includes("welcome friends")
  ) {
    responseMessage =
      "Selamat datang teman-teman! Senang bisa berbincang dengan kalian!";
  } else if (input.includes("apa kabar") || input.includes("how are you")) {
    responseMessage =
      "Saya baik-baik saja, terima kasih! Bagaimana dengan kamu?";
  } else if (input.includes("selamat pagi") || input.includes("good morning")) {
    responseMessage = "Selamat pagi! Semoga hari Anda menyenankan!";
  } else if (input.includes("selamat sore") || input.includes("good evening")) {
    responseMessage = "Selamat sore! Semoga harimu menyenankan!";
  } else if (input.includes("selamat malam") || input.includes("good night")) {
    responseMessage = "Selamat malam! Semoga tidurmu nyenyak!";
  } else if (input.includes("halo") || input.includes("hi")) {
    responseMessage = "Halo! Ada yang bisa saya bantu?";
  } else if (
    input.includes("apa kabar bro") ||
    input.includes("how’s it going bro")
  ) {
    responseMessage = "Bro, gue baik-baik aja! Lu gimana?";
  } else if (input.includes("yoo") || input.includes("yo")) {
    responseMessage = "Yoo! Apa kabar? Sehat-sehat aja kan?";
  } else if (
    input.includes("apa kabar teman") ||
    input.includes("how’s it going buddy")
  ) {
    responseMessage = "Teman, gue baik-baik aja! Kamu gimana?";
  } else if (
    input.includes("halo semuanya") ||
    input.includes("hello everyone")
  ) {
    responseMessage = "Halo semuanya! Semoga harimu menyenangkan!";
  } else if (input.includes("selamat pagi semua")) {
    responseMessage =
      "Selamat pagi semua! Semoga kalian punya hari yang luar biasa!";
  } else if (input.includes("selamat datang") || input.includes("welcome")) {
    responseMessage = "Selamat datang! Senang bertemu dengan Anda!";
  } else if (
    input.includes("apa kabar guys") ||
    input.includes("how’s it going guys")
  ) {
    responseMessage = "Guys, gue baik-baik aja! Kalian gimana?";
  } else if (
    input.includes("apa kabar gan") ||
    input.includes("how’s it going gan")
  ) {
    responseMessage = "Gan, gue baik-baik aja! Lu gimana?";
  } else if (input.includes("halo bro") || input.includes("hello bro")) {
    responseMessage = "Bro, halo! Apa kabar? Sehat-sehat aja, kan?";
  } else if (
    input.includes("assalamualaikum") ||
    input.includes("assalamu’alaikum")
  ) {
    responseMessage = "Wa’alaikum salam! Semoga selalu diberi kesehatan.";
  } else if (
    input.includes("apa kabar semua") ||
    input.includes("how’s it going everyone")
  ) {
    responseMessage = "Semua pada kabar baik kan? Semoga harimu menyenankan!";
  } else if (input.includes("yow") || input.includes("yo man")) {
    responseMessage = "Yow! Apa kabar, bro? Sehat-sehat aja kan?";
  } else if (
    input.includes("gimana kabarnya") ||
    input.includes("how’s it going")
  ) {
    responseMessage = "Kabarku baik-baik saja, terima kasih! Kamu gimana?";
  } else if (input.includes("halo gaes") || input.includes("hello gaes")) {
    responseMessage = "Halo Gaes! Semoga hari kalian menyenangkan!";
  } else if (
    input.includes("selamat pagi semua") ||
    input.includes("good morning everyone")
  ) {
    responseMessage = "Selamat pagi semua! Semoga hari kalian penuh semangat!";
  } else if (
    input.includes("selamat datang teman-teman") ||
    input.includes("welcome friends")
  ) {
    responseMessage =
      "Selamat datang teman-teman! Senang bisa berbincang dengan kalian!";
  } else if (input.includes("mau ngobrol") || input.includes("wanna chat")) {
    responseMessage = "Tentu! Ada yang ingin dibicarakan?";
  } else if (
    input.includes("apa kabar ce") ||
    input.includes("how’s it going ce")
  ) {
    responseMessage = "Ce, kabar gue baik-baik aja! Lu gimana?";
  } else if (
    input.includes("apakah ada yang baru") ||
    input.includes("anything new")
  ) {
    responseMessage =
      "Tidak ada yang baru, tapi selalu ada yang menarik untuk dibahas!";
  } else if (
    input.includes("selamat pagi, semuanya") ||
    input.includes("good morning everyone")
  ) {
    responseMessage = "Selamat pagi semuanya! Semoga hari ini penuh berkah!";
  } else if (
    input.includes("siapa yang lagi nonton") ||
    input.includes("who’s watching")
  ) {
    responseMessage = "Lagi-lagi, semua pada sibuk ya? Nonton bareng yuk!";
  } else if (input.includes("halo gengs") || input.includes("hello gengs")) {
    responseMessage = "Halo gengs! Apa kabar semuanya?";
  } else if (input.includes("yuk ngobrol") || input.includes("let’s chat")) {
    responseMessage = "Yuk, ngomongin apa nih?";
  } else if (
    input.includes("selamat pagi pak") ||
    input.includes("good morning sir")
  ) {
    responseMessage = "Selamat pagi, Pak! Semoga hari Anda menyenankan!";
  } else if (
    input.includes("selamat pagi bu") ||
    input.includes("good morning ma’am")
  ) {
    responseMessage = "Selamat pagi, Bu! Semoga hari Anda menyenankan!";
  } else if (
    input.includes("apa kabar kak") ||
    input.includes("how’s it going sis")
  ) {
    responseMessage = "Kak, kabar gue baik-baik aja! Kamu gimana?";
  } else if (input.includes("halo kak") || input.includes("hello sis")) {
    responseMessage = "Halo, Kak! Ada yang bisa saya bantu?";
  } else if (
    input.includes("apa kabar saudara") ||
    input.includes("how’s it going brother")
  ) {
    responseMessage = "Saudara, saya baik-baik saja! Kamu bagaimana?";
  } else if (
    input.includes("selamat malam semuanya") ||
    input.includes("good night everyone")
  ) {
    responseMessage = "Selamat malam semuanya! Semoga tidur kalian nyenyak!";
  } else if (
    input.includes("halo teman-teman") ||
    input.includes("hello friends")
  ) {
    responseMessage = "Halo teman-teman! Semoga hari kalian menyenankan!";
  } else if (input.includes("mau curhat") || input.includes("wanna share")) {
    responseMessage = "Tentu! Silakan curhat, saya siap mendengarkan.";
  } else if (
    input.includes("halo, saya datang") ||
    input.includes("hello, I’m here")
  ) {
    responseMessage = "Halo, selamat datang! Apa yang bisa saya bantu?";
  } else if (
    input.includes("apa kabar sahabat") ||
    input.includes("how’s it going friend")
  ) {
    responseMessage = "Sahabat, kabar gue baik-baik aja! Kamu gimana?";
  } else if (
    input.includes("ada yang bisa saya bantu?") ||
    input.includes("can I help you?")
  ) {
    responseMessage = "Tentu, ada yang bisa saya bantu?";
  } else if (
    input.includes("apa kabar teman lama") ||
    input.includes("how’s it going old friend")
  ) {
    responseMessage = "Teman lama, kabar saya baik-baik saja! Kamu gimana?";
  } else if (
    input.includes("selamat datang kembali") ||
    input.includes("welcome back")
  ) {
    responseMessage = "Selamat datang kembali! Senang melihat kamu lagi!";
  } else if (
    input.includes("halo bro-sist") ||
    input.includes("hello bro-sis")
  ) {
    responseMessage = "Halo bro-sist! Apa kabar semuanya?";
  } else if (
    input.includes("selamat pagi teman-teman") ||
    input.includes("good morning buddies")
  ) {
    responseMessage =
      "Selamat pagi teman-teman! Semoga hari kalian penuh kebahagiaan!";
  } else if (
    input.includes("selamat datang di sini") ||
    input.includes("welcome here")
  ) {
    responseMessage = "Selamat datang di sini! Senang bisa menyapa kamu!";
  } else if (
    input.includes("apa kabar sobat") ||
    input.includes("how’s it going mate")
  ) {
    responseMessage = "Sobat, kabar gue baik-baik aja! Kamu gimana?";
  } else if (
    input.includes("hello semuanya") ||
    input.includes("hi everyone")
  ) {
    responseMessage = "Hello semuanya! Apa kabar semua?";
  } else if (input.includes("hai semuanya") || input.includes("hey everyone")) {
    responseMessage =
      "Hai semuanya! Semoga kalian semua punya hari yang menyenankan!";
  } else if (input.includes("mau nanya") || input.includes("wanna ask")) {
    responseMessage = "Tentu, silakan tanya apa yang kamu ingin tahu!";
  } else if (
    input.includes("selamat datang teman") ||
    input.includes("welcome friend")
  ) {
    responseMessage =
      "Selamat datang, teman! Semoga kamu merasa betah di sini!";
  } else if (input.includes("halo semua") || input.includes("hello all")) {
    responseMessage = "Halo semua! Apa kabar semuanya?";
  } else if (
    input.includes("selamat pagi semua") ||
    input.includes("good morning everyone")
  ) {
    responseMessage = "Selamat pagi semua! Semoga hari kalian menyenankan!";
  } else if (
    input.includes("ada yang bisa saya bantu?") ||
    input.includes("anything I can help?")
  ) {
    responseMessage = "Tentu! Ada yang bisa saya bantu?";
  } else if (
    input.includes("selamat datang kembali teman") ||
    input.includes("welcome back friend")
  ) {
    responseMessage =
      "Selamat datang kembali, teman! Senang bisa berjumpa lagi!";
  } else if (
    input.includes("apa kabar temen-temen") ||
    input.includes("how’s everyone doing")
  ) {
    responseMessage = "Teman-teman, kabar saya baik-baik aja! Kalian gimana?";
  } else if (input.includes("yo bro") || input.includes("yo dude")) {
    responseMessage = "Yo bro! Apa kabar? Sehat-sehat aja kan?";
  } else if (
    input.includes("selamat pagi sahabat") ||
    input.includes("good morning buddy")
  ) {
    responseMessage = "Selamat pagi, sahabat! Semoga harimu menyenankan!";
  } else if (input.includes("hai sahabat") || input.includes("hey buddy")) {
    responseMessage = "Hai sahabat! Apa kabar?";
  } else if (
    input.includes("apa kabar saudara-saudara") ||
    input.includes("how’s it going brothers")
  ) {
    responseMessage = "Saudara-saudara, saya baik-baik saja! Kalian gimana?";
  } else if (
    input.includes("halo semua yang hadir") ||
    input.includes("hello everyone present")
  ) {
    responseMessage =
      "Halo semuanya yang hadir! Senang bisa berbincang dengan kalian!";
  } else if (
    input.includes("hai teman-teman") ||
    input.includes("hey friends")
  ) {
    responseMessage =
      "Hai teman-teman! Semoga hari kalian penuh dengan kebahagiaan!";
  } else if (
    input.includes("selamat sore semua") ||
    input.includes("good evening everyone")
  ) {
    responseMessage =
      "Selamat sore semua! Semoga kalian menikmati sisa hari ini!";
  } else if (
    input.includes("selamat malam teman-teman") ||
    input.includes("good night friends")
  ) {
    responseMessage = "Selamat malam teman-teman! Semoga tidurmu nyenyak!";
  } else if (
    input.includes("selamat datang, bro") ||
    input.includes("welcome bro")
  ) {
    responseMessage =
      "Selamat datang, bro! Apa kabar? Semoga harimu menyenankan!";
  } else if (input.includes("halo cuy") || input.includes("hello dude")) {
    responseMessage = "Halo cuy! Sehat-sehat aja, kan?";
  } else if (
    input.includes("selamat datang kembali teman-teman") ||
    input.includes("welcome back buddies")
  ) {
    responseMessage =
      "Selamat datang kembali teman-teman! Senang bisa ngobrol lagi!";
  } else if (
    input.includes("selamat pagi semuanya") ||
    input.includes("good morning all")
  ) {
    responseMessage =
      "Selamat pagi semuanya! Semoga hari kalian penuh semangat!";
  } else if (
    input.includes("apa kabar teman-teman lama") ||
    input.includes("how’s it going old friends")
  ) {
    responseMessage =
      "Teman-teman lama, kabar saya baik-baik saja! Kalian gimana?";
  } else if (
    input.includes("hai semua, apa kabar?") ||
    input.includes("hey everyone, how’s it going?")
  ) {
    responseMessage = "Hai semua! Apa kabar? Semoga harimu menyenankan!";
  } else if (
    input.includes("selamat sore pak") ||
    input.includes("good evening sir")
  ) {
    responseMessage = "Selamat sore, Pak! Semoga hari Anda menyenankan!";
  } else if (
    input.includes("selamat sore bu") ||
    input.includes("good evening ma’am")
  ) {
    responseMessage = "Selamat sore, Bu! Semoga hari Anda menyenankan!";
  } else if (
    input.includes("halo gaes, apa kabar?") ||
    input.includes("hello guys, how’s it going?")
  ) {
    responseMessage = "Halo gaes, apa kabar? Semoga semuanya baik-baik saja!";
  } else if (
    input.includes("selamat datang teman-teman baru") ||
    input.includes("welcome new friends")
  ) {
    responseMessage =
      "Selamat datang teman-teman baru! Senang bisa menyambut kalian!";
  } else if (
    input.includes("selamat pagi pak/bu") ||
    input.includes("good morning sir/ma’am")
  ) {
    responseMessage = "Selamat pagi Pak/Bu! Semoga hari Anda penuh berkah!";
  } else if (input.includes("halo sobat") || input.includes("hello mate")) {
    responseMessage = "Halo sobat! Apa kabar? Semoga hari ini menyenankan!";
  } else if (
    input.includes("apa kabar teman sekalian") ||
    input.includes("how’s it going everyone")
  ) {
    responseMessage =
      "Teman-teman, kabar saya baik-baik saja! Semoga kalian semua sehat!";
  } else if (
    input.includes("mau ngobrol apa?") ||
    input.includes("wanna chat about something")
  ) {
    responseMessage = "Tentu! Ada topik menarik yang ingin dibicarakan?";
  } else if (input.includes("halo dong") || input.includes("hello there")) {
    responseMessage = "Halo dong! Ada yang bisa saya bantu?";
  } else if (
    input.includes("selamat datang kembali, bro") ||
    input.includes("welcome back, bro")
  ) {
    responseMessage = "Selamat datang kembali, bro! Senang bisa ngobrol lagi!";
  } else if (
    input.includes("selamat malam gaes") ||
    input.includes("good night gang")
  ) {
    responseMessage =
      "Selamat malam gaes! Semoga tidurmu nyenyak dan penuh mimpi indah!";
  } else if (
    input.includes("halo, gimana kabar semuanya?") ||
    input.includes("hello, how’s everyone doing?")
  ) {
    responseMessage =
      "Halo, gimana kabar semuanya? Semoga kalian semua baik-baik saja!";
  } else if (
    input.includes("apa kabar, semuanya?") ||
    input.includes("how’s everyone doing?")
  ) {
    responseMessage = "Apa kabar semuanya? Semoga semua dalam keadaan sehat!";
  } else if (
    input.includes("apa kabar sobat karib") ||
    input.includes("how’s it going close friend")
  ) {
    responseMessage = "Sobat karib, kabar saya baik-baik saja! Kamu gimana?";
  } else if (
    input.includes("selamat pagi, teman-teman tercinta") ||
    input.includes("good morning dear friends")
  ) {
    responseMessage =
      "Selamat pagi teman-teman tercinta! Semoga hari ini penuh kebahagiaan!";
  } else if (
    input.includes("gimana kabar lu?") ||
    input.includes("how’s it going with you?")
  ) {
    responseMessage = "Kabar gue baik-baik aja! Lu gimana? Sehat-sehat aja?";
  } else if (
    input.includes("halo teman-teman hebat") ||
    input.includes("hello awesome friends")
  ) {
    responseMessage =
      "Halo teman-teman hebat! Semoga hari ini penuh dengan keberhasilan!";
  } else if (
    input.includes("halo para sahabat") ||
    input.includes("hello buddies")
  ) {
    responseMessage =
      "Halo para sahabat! Apa kabar kalian? Semoga semuanya baik!";
  } else if (
    input.includes("selamat malam semuanya, tidur nyenyak ya!") ||
    input.includes("good night everyone, sleep well!")
  ) {
    responseMessage =
      "Selamat malam semuanya! Tidur yang nyenyak dan bangun dengan semangat!";
  } else if (
    input.includes("selamat pagi, semuanya!") ||
    input.includes("good morning, everyone!")
  ) {
    responseMessage =
      "Selamat pagi semuanya! Semoga hari ini luar biasa bagi kalian!";
  } else if (
    input.includes("apa kabar keluarga") ||
    input.includes("how’s it going family")
  ) {
    responseMessage =
      "Keluarga, kabar saya baik-baik saja! Semoga kalian semua dalam keadaan sehat!";
  } else if (
    input.includes("halo semuanya, siap memulai hari?") ||
    input.includes("hello everyone, ready to start the day?")
  ) {
    responseMessage = "Halo semuanya! Siap memulai hari dengan semangat?";
  } else if (
    input.includes("selamat pagi, teman-teman!") ||
    input.includes("good morning, friends!")
  ) {
    responseMessage =
      "Selamat pagi teman-teman! Semoga hari ini penuh kebahagiaan!";
  } else if (
    input.includes("selamat datang, sahabat lama") ||
    input.includes("welcome back, old friend")
  ) {
    responseMessage =
      "Selamat datang kembali, sahabat lama! Senang bisa berbincang lagi!";
  } else if (
    input.includes("apa kabar, geng?") ||
    input.includes("how’s it going, gang?")
  ) {
    responseMessage = "Geng, kabar saya baik-baik saja! Kamu gimana?";
  } else if (
    input.includes("apa kabar semua orang?") ||
    input.includes("how’s it going, everyone?")
  ) {
    responseMessage =
      "Semua orang, kabar saya baik-baik saja! Semoga kalian sehat selalu!";
  } else if (
    input.includes("mau ngobrol serius") ||
    input.includes("wanna talk serious")
  ) {
    responseMessage = "Tentu! Ada yang ingin dibicarakan secara serius?";
  } else if (
    input.includes("halo teman lama") ||
    input.includes("hello old friend")
  ) {
    responseMessage = "Halo teman lama! Sudah lama tidak bertemu, apa kabar?";
  } else if (
    input.includes("selamat pagi, sahabat karib") ||
    input.includes("good morning, best friend")
  ) {
    responseMessage =
      "Selamat pagi sahabat karib! Semoga harimu penuh dengan keberuntungan!";
  } else if (
    input.includes("apa kabar kawan") ||
    input.includes("how’s it going mate")
  ) {
    responseMessage = "Kawan, kabar saya baik-baik saja! Kamu gimana?";
  } else if (
    input.includes("halo gaes semua") ||
    input.includes("hey everyone")
  ) {
    responseMessage =
      "Halo gaes semua! Semoga kalian semua dalam keadaan sehat!";
  } else if (
    input.includes("selamat malam sahabat") ||
    input.includes("good night, friend")
  ) {
    responseMessage =
      "Selamat malam sahabat! Semoga tidurmu nyenyak dan bangun dengan semangat!";
  } else if (
    input.includes("apa kabar teman-teman lama?") ||
    input.includes("how’s it going old buddies?")
  ) {
    responseMessage =
      "Teman-teman lama, kabar saya baik-baik saja! Kalian gimana?";
  } else if (input.includes("halo bos") || input.includes("hello boss")) {
    responseMessage = "Halo bos! Apa yang bisa saya bantu?";
  } else if (
    input.includes("apa kabar, kakak") ||
    input.includes("how’s it going, sister")
  ) {
    responseMessage = "Kakak, kabar saya baik-baik saja! Kamu gimana?";
  } else if (
    input.includes("selamat sore semuanya") ||
    input.includes("good afternoon everyone")
  ) {
    responseMessage =
      "Selamat sore semuanya! Semoga hari kalian penuh kebahagiaan!";
  } else if (
    input.includes("halo semua yang hadir di sini") ||
    input.includes("hello everyone here")
  ) {
    responseMessage =
      "Halo semuanya yang hadir di sini! Senang bisa menyapa kalian!";
  } else if (
    input.includes("selamat datang kembali, teman lama") ||
    input.includes("welcome back, old friend")
  ) {
    responseMessage =
      "Selamat datang kembali, teman lama! Semoga hari-harimu menyenankan!";
  } else if (
    input.includes("selamat pagi sahabat terbaik") ||
    input.includes("good morning, best friend")
  ) {
    responseMessage =
      "Selamat pagi sahabat terbaik! Semoga harimu penuh dengan kebahagiaan!";
  } else if (
    input.includes("halo teman-teman baru!") ||
    input.includes("hello new friends!")
  ) {
    responseMessage =
      "Halo teman-teman baru! Senang bisa bertemu dengan kalian!";
  } else if (
    input.includes("apa kabar teman lama yang baik") ||
    input.includes("how’s it going old good friend")
  ) {
    responseMessage = "Teman lama yang baik, saya baik-baik saja! Kamu gimana?";
  } else if (
    input.includes("halo temen-temen") ||
    input.includes("hey friends")
  ) {
    responseMessage = "Halo temen-temen! Ada yang ingin dibicarakan?";
  } else if (
    input.includes("selamat datang kembali kakak") ||
    input.includes("welcome back sis")
  ) {
    responseMessage =
      "Selamat datang kembali, kakak! Senang bisa ngobrol lagi!";
  } else if (
    input.includes("apa kabar semuanya, semuanya baik-baik saja?") ||
    input.includes("how’s everyone doing, all good?")
  ) {
    responseMessage =
      "Semua, kabar saya baik-baik saja! Semoga kalian juga sehat selalu!";
  } else if (
    input.includes("halo semua, ada yang baru?") ||
    input.includes("hello everyone, anything new?")
  ) {
    responseMessage = "Halo semua! Ada yang baru nih? Bisa cerita gak?";
  } else if (
    input.includes("selamat sore, teman-teman") ||
    input.includes("good afternoon, friends")
  ) {
    responseMessage =
      "Selamat sore teman-teman! Semoga kalian semua dalam keadaan baik!";
  } else if (
    input.includes("halo, gimana kabar kalian?") ||
    input.includes("hello, how’s everyone doing?")
  ) {
    responseMessage =
      "Halo, gimana kabar kalian? Semoga semuanya sehat selalu!";
  } else if (
    input.includes("selamat malam gaes, tidur yang nyenyak") ||
    input.includes("good night gang, sleep well")
  ) {
    responseMessage =
      "Selamat malam gaes, tidur yang nyenyak dan bangun dengan semangat!";
  } else if (
    input.includes("mau ngopi bareng?") ||
    input.includes("wanna grab coffee?")
  ) {
    responseMessage = "Wah, asik banget! Ayo ngopi bareng!";
  } else if (
    input.includes("apa kabar teman-teman dekat") ||
    input.includes("how’s it going close friends")
  ) {
    responseMessage =
      "Teman-teman dekat, kabar saya baik-baik saja! Kamu gimana?";
  } else if (
    input.includes("selamat pagi, semua sahabat") ||
    input.includes("good morning, all friends")
  ) {
    responseMessage =
      "Selamat pagi semua sahabat! Semoga harimu penuh kebahagiaan!";
  } else if (
    input.includes("selamat sore semua teman") ||
    input.includes("good afternoon all friends")
  ) {
    responseMessage =
      "Selamat sore semua teman! Semoga hari ini penuh kebahagiaan!";
  } else if (input.includes("hai") || input.includes("hello")) {
    responseMessage = "Hai! Apa kabar?";
  } else if (input.includes("selamat pagi") || input.includes("good morning")) {
    responseMessage = "Selamat pagi! Semoga harimu menyenankan!";
  } else if (
    input.includes("selamat siang") ||
    input.includes("good afternoon")
  ) {
    responseMessage = "Selamat siang! Semoga hari ini penuh kebahagiaan!";
  } else if (input.includes("selamat malam") || input.includes("good night")) {
    responseMessage = "Selamat malam! Semoga tidurmu nyenyak!";
  } else if (input.includes("halo") || input.includes("hi")) {
    responseMessage = "Halo! Apa kabar?";
  } else if (input.includes("apa kabar") || input.includes("how are you")) {
    responseMessage =
      "Saya baik-baik saja, terima kasih! Bagaimana dengan kamu?";
  } else if (input.includes("hai semua") || input.includes("hi everyone")) {
    responseMessage = "Hai semua! Apa kabar?";
  } else if (input.includes("selamat datang") || input.includes("welcome")) {
    responseMessage = "Selamat datang! Senang bisa bertemu denganmu!";
  } else if (input.includes("hai teman") || input.includes("hi friend")) {
    responseMessage = "Hai teman! Apa kabar?";
  } else if (
    input.includes("apa kabar bro") ||
    input.includes("how’s it going bro")
  ) {
    responseMessage = "Bro, kabar saya baik-baik saja! Kamu gimana?";
  } else if (input.includes("selamat sore") || input.includes("good evening")) {
    responseMessage = "Selamat sore! Semoga harimu menyenankan!";
  } else if (
    input.includes("selamat pagi semua") ||
    input.includes("good morning everyone")
  ) {
    responseMessage = "Selamat pagi semuanya! Semoga harimu penuh kebahagiaan!";
  } else if (
    input.includes("halo teman-teman") ||
    input.includes("hello friends")
  ) {
    responseMessage = "Halo teman-teman! Apa kabar?";
  } else if (
    input.includes("selamat datang kembali") ||
    input.includes("welcome back")
  ) {
    responseMessage = "Selamat datang kembali! Senang bisa bertemu lagi!";
  } else if (
    input.includes("apa kabar bro/sis") ||
    input.includes("how’s it going bro/sis")
  ) {
    responseMessage = "Bro/Sis, kabar saya baik-baik saja! Kamu gimana?";
  } else if (input.includes("halo cuy") || input.includes("hey dude")) {
    responseMessage = "Halo cuy! Apa kabar?";
  } else if (
    input.includes("selamat pagi bro") ||
    input.includes("good morning bro")
  ) {
    responseMessage = "Selamat pagi bro! Semoga harimu menyenankan!";
  } else if (input.includes("halo gaes") || input.includes("hey guys")) {
    responseMessage = "Halo gaes! Semoga hari kalian menyenankan!";
  } else if (
    input.includes("apa kabar semuanya") ||
    input.includes("how’s everyone doing")
  ) {
    responseMessage =
      "Semua, kabar saya baik-baik saja! Semoga kalian sehat selalu!";
  } else if (input.includes("halo semua") || input.includes("hi everyone")) {
    responseMessage = "Halo semua! Apa kabar?";
  } else if (
    input.includes("selamat sore gaes") ||
    input.includes("good evening guys")
  ) {
    responseMessage =
      "Selamat sore gaes! Semoga kalian menikmati sisa hari ini!";
  } else if (
    input.includes("apa itu pancasila") ||
    input.includes("what is pancasila")
  ) {
    responseMessage =
      "Pancasila adalah dasar negara Indonesia yang terdiri dari lima sila, yang menjadi panduan hidup bangsa Indonesia.";
  } else if (
    input.includes("apa tujuan pancasila") ||
    input.includes("what is the purpose of pancasila")
  ) {
    responseMessage =
      "Tujuan Pancasila adalah untuk mewujudkan kehidupan yang adil, makmur, dan sejahtera bagi seluruh rakyat Indonesia.";
  } else if (
    input.includes("apa itu undang-undang dasar 1945") ||
    input.includes("what is the 1945 constitution")
  ) {
    responseMessage =
      "Undang-Undang Dasar 1945 adalah konstitusi negara Indonesia yang menjadi landasan hukum dalam bernegara.";
  } else if (
    input.includes("sebutkan 5 sila pancasila") ||
    input.includes("mention the five principles of pancasila")
  ) {
    responseMessage =
      "Lima sila Pancasila adalah: 1) Ketuhanan yang Maha Esa, 2) Kemanusiaan yang Adil dan Beradab, 3) Persatuan Indonesia, 4) Kerakyatan yang Dipimpin oleh Hikmat Kebijaksanaan dalam Permusyawaratan/Perwakilan, 5) Keadilan Sosial bagi Seluruh Rakyat Indonesia.";
  } else if (
    input.includes("apa itu demokrasi") ||
    input.includes("what is democracy")
  ) {
    responseMessage =
      "Demokrasi adalah sistem pemerintahan di mana kekuasaan berada di tangan rakyat, yang memilih wakilnya melalui pemilihan umum.";
  } else if (
    input.includes("apa itu hak asasi manusia") ||
    input.includes("what is human rights")
  ) {
    responseMessage =
      "Hak Asasi Manusia (HAM) adalah hak-hak dasar yang dimiliki setiap individu sebagai anugerah Tuhan yang tidak dapat dicabut oleh siapapun.";
  } else if (
    input.includes("sebutkan contoh hak asasi manusia") ||
    input.includes("mention examples of human rights")
  ) {
    responseMessage =
      "Contoh hak asasi manusia antara lain hak untuk hidup, hak untuk mendapatkan pendidikan, hak untuk bebas bersuara, dan hak untuk mendapatkan perlindungan hukum.";
  } else if (
    input.includes("apa itu negara hukum") ||
    input.includes("what is a rule of law state")
  ) {
    responseMessage =
      "Negara hukum adalah negara yang menjalankan sistem hukum yang adil, di mana semua orang diperlakukan sama di hadapan hukum.";
  } else if (
    input.includes("sebutkan prinsip negara hukum") ||
    input.includes("mention the principles of rule of law state")
  ) {
    responseMessage =
      "Prinsip negara hukum antara lain: 1) Negara berdasarkan hukum, 2) Pengakuan hak asasi manusia, 3) Keadilan dan persamaan di hadapan hukum, 4) Pemisahan kekuasaan.";
  } else if (
    input.includes("apa itu musyawarah") ||
    input.includes("what is musyawarah")
  ) {
    responseMessage =
      "Musyawarah adalah cara penyelesaian masalah dengan berdiskusi untuk mencapai kesepakatan bersama tanpa ada paksaan.";
  } else if (
    input.includes("apa itu gotong royong") ||
    input.includes("what is gotong royong")
  ) {
    responseMessage =
      "Gotong royong adalah semangat kerjasama dan saling membantu dalam suatu kegiatan untuk mencapai tujuan bersama.";
  } else if (
    input.includes("sebutkan ciri-ciri negara kesatuan") ||
    input.includes("mention the characteristics of a unitary state")
  ) {
    responseMessage =
      "Ciri-ciri negara kesatuan adalah: 1) Memiliki satu pemerintahan pusat, 2) Sistem pemerintahan tidak terpecah, 3) Kesatuan wilayah yang tidak terpisah.";
  } else if (
    input.includes("apa itu keadilan sosial") ||
    input.includes("what is social justice")
  ) {
    responseMessage =
      "Keadilan sosial adalah keadaan di mana semua warga negara mendapat hak yang sama dalam berbagai bidang kehidupan, termasuk ekonomi, sosial, dan politik.";
  } else if (
    input.includes("apa itu hak dan kewajiban warga negara") ||
    input.includes("what are the rights and obligations of citizens")
  ) {
    responseMessage =
      "Hak warga negara antara lain hak untuk memilih, hak atas pendidikan, hak untuk bebas berpendapat. Kewajiban warga negara antara lain kewajiban membayar pajak, ikut serta dalam menjaga ketertiban umum, dan menghormati hak orang lain.";
  } else if (
    input.includes("apa itu ideologi negara") ||
    input.includes("what is state ideology")
  ) {
    responseMessage =
      "Ideologi negara adalah pandangan hidup yang menjadi dasar atau landasan negara dalam menjalankan kehidupan berbangsa dan bernegara. Di Indonesia, ideologi negara adalah Pancasila.";
  } else if (
    input.includes("apa itu kebhinekaan tunggal ika") ||
    input.includes("what is unity in diversity")
  ) {
    responseMessage =
      "Kebhinekaan Tunggal Ika adalah semboyan negara Indonesia yang menggambarkan keberagaman suku, budaya, agama, dan bahasa, namun tetap satu kesatuan bangsa.";
  } else if (
    input.includes("apa itu nasionalisme") ||
    input.includes("what is nationalism")
  ) {
    responseMessage =
      "Nasionalisme adalah rasa cinta dan bangga terhadap tanah air serta berkomitmen untuk mempertahankan dan membangun negara.";
  } else if (
    input.includes("apa itu pemilu") ||
    input.includes("what is election")
  ) {
    responseMessage =
      "Pemilu adalah proses untuk memilih wakil rakyat dan pejabat negara secara langsung oleh rakyat untuk menentukan pemerintahan.";
  } else if (
    input.includes("sebutkan jenis-jenis pemilu") ||
    input.includes("mention the types of elections")
  ) {
    responseMessage =
      "Jenis-jenis pemilu di Indonesia antara lain: Pemilu Legislatif (untuk memilih anggota DPR), Pemilu Presiden dan Wakil Presiden, serta Pemilu Kepala Daerah (Pilkada).";
  } else if (
    input.includes("apa itu partisipasi politik") ||
    input.includes("what is political participation")
  ) {
    responseMessage =
      "Partisipasi politik adalah keterlibatan warga negara dalam kegiatan politik, seperti pemilu, diskusi politik, atau demonstrasi, untuk mempengaruhi kebijakan publik.";
  } else if (
    input.includes("apa itu pembukaan uud 1945") ||
    input.includes("what is the preamble of the 1945 constitution")
  ) {
    responseMessage =
      "Pembukaan Undang-Undang Dasar 1945 (UUD 1945) adalah bagian pertama dari konstitusi Indonesia yang memuat dasar-dasar negara, tujuan bernegara, dan cita-cita bangsa Indonesia. Pembukaan ini terdiri dari empat alinea yang mengungkapkan kemerdekaan Indonesia, tujuan negara, serta dasar dari sistem pemerintahan Indonesia.";
  } else if (
    input.includes("sebutkan alinea pembukaan uud 1945") ||
    input.includes(
      "mention the paragraphs of the preamble of the 1945 constitution"
    )
  ) {
    responseMessage =
      "Pembukaan UUD 1945 terdiri dari empat alinea: \n1) Alinea pertama menyatakan kemerdekaan Indonesia sebagai hak segala bangsa. \n2) Alinea kedua menjelaskan bahwa tujuan negara Indonesia adalah untuk menciptakan keadilan sosial bagi seluruh rakyat. \n3) Alinea ketiga mengungkapkan bahwa negara Indonesia mendukung perdamaian dunia dan kemerdekaan setiap bangsa. \n4) Alinea keempat menjelaskan bahwa pembentukan negara Indonesia berdasarkan atas kemerdekaan dan keadilan.";
  } else if (
    input.includes("apa tujuan pembukaan uud 1945") ||
    input.includes(
      "what is the purpose of the preamble of the 1945 constitution"
    )
  ) {
    responseMessage =
      "Tujuan dari Pembukaan UUD 1945 adalah untuk memberikan dasar hukum yang kuat bagi negara Indonesia, mengatur hubungan antara pemerintah dan rakyat, serta menetapkan arah perjuangan dan cita-cita bangsa Indonesia.";
  } else if (
    input.includes("apa arti alinea pertama pembukaan uud 1945") ||
    input.includes(
      "what is the meaning of the first paragraph of the preamble of the 1945 constitution"
    )
  ) {
    responseMessage =
      "Alinea pertama Pembukaan UUD 1945 menyatakan bahwa kemerdekaan Indonesia adalah hak segala bangsa, dan karena itu, Indonesia memiliki hak untuk merdeka dari penjajahan serta mendirikan negara yang bebas dan berdaulat.";
  } else if (
    input.includes("apa arti alinea kedua pembukaan uud 1945") ||
    input.includes(
      "what is the meaning of the second paragraph of the preamble of the 1945 constitution"
    )
  ) {
    responseMessage =
      "Alinea kedua Pembukaan UUD 1945 menjelaskan tujuan negara Indonesia, yakni untuk menciptakan keadilan sosial bagi seluruh rakyat Indonesia, serta meningkatkan kesejahteraan umum dan ketertiban dunia.";
  } else if (
    input.includes("apa arti alinea ketiga pembukaan uud 1945") ||
    input.includes(
      "what is the meaning of the third paragraph of the preamble of the 1945 constitution"
    )
  ) {
    responseMessage =
      "Alinea ketiga Pembukaan UUD 1945 mengungkapkan bahwa negara Indonesia mendukung perdamaian dunia dan berkomitmen untuk menghormati kemerdekaan setiap bangsa serta berusaha mewujudkan hubungan internasional yang damai dan saling menguntungkan.";
  } else if (
    input.includes("apa arti alinea keempat pembukaan uud 1945") ||
    input.includes(
      "what is the meaning of the fourth paragraph of the preamble of the 1945 constitution"
    )
  ) {
    responseMessage =
      "Alinea keempat Pembukaan UUD 1945 menjelaskan dasar hukum pembentukan negara Indonesia, yang didasarkan pada kemerdekaan dan keadilan serta tujuan untuk menciptakan masyarakat yang sejahtera dan berkeadilan.";
  } 
  
else if (input.includes("apa itu bela negara") || input.includes("apa makna bela negara")) {
    responseMessage = "Bela negara adalah sikap dan tindakan setiap warga negara untuk mempertahankan keutuhan dan kedaulatan negara dari ancaman dan gangguan baik dari dalam maupun luar negeri.";
} else if (input.includes("apa itu Bhinneka Tunggal Ika") || input.includes("arti Bhinneka Tunggal Ika")) {
    responseMessage = "Bhinneka Tunggal Ika adalah semboyan negara Indonesia yang berarti 'Berbeda-beda tetapi tetap satu'. Ini mencerminkan keberagaman suku, agama, budaya, dan bahasa di Indonesia yang harus disatukan dalam kesatuan bangsa.";
} else if (input.includes("apa itu Pancasila") || input.includes("apa pengertian Pancasila")) {
    responseMessage = "Pancasila adalah dasar negara Indonesia yang terdiri dari lima sila yang menjadi pedoman hidup berbangsa dan bernegara bagi seluruh rakyat Indonesia.";
} else if (input.includes("apa itu kewarganegaraan") || input.includes("apa pengertian kewarganegaraan")) {
    responseMessage = "Kewarganegaraan adalah status yang menentukan hubungan antara individu dengan negara yang memberikan hak dan kewajiban sebagai warga negara.";
} else if (input.includes("apa itu demokrasi") || input.includes("pengertian demokrasi")) {
    responseMessage = "Demokrasi adalah sistem pemerintahan yang memberikan kekuasaan tertinggi pada rakyat untuk memilih pemimpin dan wakil rakyat melalui pemilu.";
} else if (input.includes("apa itu musyawarah") || input.includes("pengertian musyawarah")) {
    responseMessage = "Musyawarah adalah cara pengambilan keputusan dengan berdiskusi bersama untuk mencapai kesepakatan yang disetujui oleh semua pihak tanpa ada yang dipaksa.";
} else if (input.includes("apa itu gotong royong") || input.includes("pengertian gotong royong")) {
    responseMessage = "Gotong royong adalah semangat kerjasama antara sesama anggota masyarakat untuk mencapai tujuan bersama dengan saling membantu tanpa pamrih.";
} else if (input.includes("apa itu hak asasi manusia") || input.includes("apa pengertian hak asasi manusia")) {
    responseMessage = "Hak Asasi Manusia (HAM) adalah hak-hak dasar yang dimiliki setiap individu sejak lahir yang tidak bisa dicabut oleh siapapun, seperti hak untuk hidup, hak atas kebebasan, dan hak atas keadilan.";
} else if (input.includes("apa itu hak pilih") || input.includes("pengertian hak pilih")) {
    responseMessage = "Hak pilih adalah hak setiap warga negara yang memenuhi syarat untuk memilih wakil rakyat dan pemimpin negara dalam pemilu yang diselenggarakan secara langsung.";
} else if (input.includes("apa itu negara kesatuan") || input.includes("pengertian negara kesatuan")) {
    responseMessage = "Negara Kesatuan adalah bentuk negara yang memiliki pemerintahan pusat yang berwenang mengatur seluruh wilayah negara, seperti Indonesia.";
} else if (input.includes("apa itu otonomi daerah") || input.includes("pengertian otonomi daerah")) {
    responseMessage = "Otonomi daerah adalah hak daerah untuk mengatur dan mengurus urusan pemerintahan dan kesejahteraan masyarakat di daerahnya sendiri tanpa mengabaikan peraturan pusat.";
} else if (input.includes("apa itu lembaga negara") || input.includes("pengertian lembaga negara")) {
    responseMessage = "Lembaga negara adalah badan yang menjalankan fungsi pemerintahan di Indonesia, seperti DPR, MPR, Presiden, dan Mahkamah Agung.";
} else if (input.includes("apa itu partai politik") || input.includes("pengertian partai politik")) {
    responseMessage = "Partai politik adalah organisasi yang dibentuk untuk mempengaruhi kebijakan negara dan pemerintahan serta berpartisipasi dalam pemilu untuk mendapatkan kekuasaan politik.";
} else if (input.includes("apa itu hak dan kewajiban warga negara") || input.includes("hak dan kewajiban warga negara")) {
    responseMessage = "Hak warga negara termasuk hak untuk memilih, hak atas pendidikan, dan hak atas perlindungan hukum, sedangkan kewajiban warga negara meliputi kewajiban membayar pajak dan ikut serta dalam menjaga ketertiban umum.";
} else if (input.includes("apa itu Pancasila sebagai dasar negara") || input.includes("pengertian Pancasila sebagai dasar negara")) {
    responseMessage = "Pancasila sebagai dasar negara adalah lima sila yang menjadi pedoman bagi negara Indonesia dalam menjalankan pemerintahan dan kehidupan berbangsa dan bernegara.";
} else if (input.includes("apa itu sistem pemerintahan presidensial") || input.includes("pengertian sistem pemerintahan presidensial")) {
    responseMessage = "Sistem pemerintahan presidensial adalah sistem di mana presiden bertindak sebagai kepala negara dan kepala pemerintahan yang dipilih langsung oleh rakyat untuk memimpin negara.";
} else if (input.includes("apa itu otonomi daerah") || input.includes("pengertian otonomi daerah")) {
    responseMessage = "Otonomi daerah memberikan kewenangan kepada daerah untuk mengatur urusan pemerintahannya sendiri, seperti pendidikan dan kesehatan, namun tetap dalam kerangka negara kesatuan.";
} else if (input.includes("apa itu musyawarah untuk mufakat") || input.includes("pengertian musyawarah untuk mufakat")) {
    responseMessage = "Musyawarah untuk mufakat adalah metode pengambilan keputusan yang dilakukan secara bersama-sama untuk mencapai kesepakatan tanpa ada paksaan dari pihak manapun.";
} else if (input.includes("apa itu sistem politik di Indonesia") || input.includes("pengertian sistem politik di Indonesia")) {
    responseMessage = "Sistem politik di Indonesia menganut sistem demokrasi yang berdasarkan pada Pancasila, di mana rakyat memilih pemimpin melalui pemilu.";
} else if (input.includes("apa itu hak asasi manusia di Indonesia") || input.includes("pengertian hak asasi manusia di Indonesia")) {
    responseMessage = "Di Indonesia, Hak Asasi Manusia (HAM) dijamin oleh Undang-Undang Dasar 1945 dan negara wajib melindungi hak-hak tersebut tanpa diskriminasi.";
} else if (input.includes("apa itu undang-undang dasar 1945") || input.includes("pengertian undang-undang dasar 1945")) {
    responseMessage = "Undang-Undang Dasar 1945 adalah konstitusi negara Indonesia yang menjadi landasan hukum utama dalam kehidupan berbangsa dan bernegara, mencakup hak, kewajiban, serta pembagian kekuasaan negara.";
} else if (input.includes("apa itu pemerintahan negara") || input.includes("pengertian pemerintahan negara")) {
    responseMessage = "Pemerintahan negara adalah sistem yang terdiri dari lembaga-lembaga yang mengatur dan menjalankan fungsi-fungsi pemerintahan di sebuah negara.";
} else if (input.includes("HAM adalah") || input.includes("apa itu HAM")) {
    responseMessage = "HAM adalah Hak Asasi Manusia, yaitu hak-hak dasar yang dimiliki setiap individu yang sejak lahir tidak bisa dicabut, seperti hak untuk hidup, kebebasan berbicara, dan hak atas perlindungan hukum.";
} else if (input.includes("Pancasila adalah") || input.includes("apa itu Pancasila")) {
    responseMessage = "Pancasila adalah dasar negara Indonesia yang terdiri dari lima sila yang menjadi pedoman hidup berbangsa dan bernegara. Pancasila mencerminkan nilai-nilai luhur yang harus dijunjung tinggi oleh seluruh rakyat Indonesia.";
} else if (input.includes("Bela negara adalah") || input.includes("apa itu bela negara")) {
    responseMessage = "Bela negara adalah sikap dan tindakan setiap warga negara untuk mempertahankan keutuhan dan kedaulatan negara dari ancaman dan gangguan baik dari dalam maupun luar negeri.";
} else if (input.includes("Undang-Undang Dasar 1945 adalah") || input.includes("apa itu UUD 1945")) {
    responseMessage = "Undang-Undang Dasar 1945 (UUD 1945) adalah konstitusi yang menjadi dasar hukum tertinggi di Indonesia, yang mengatur pemerintahan, hak-hak warga negara, serta kewajiban negara untuk mewujudkan tujuan nasional.";
} else if (input.includes("Demokrasi adalah") || input.includes("apa itu demokrasi")) {
    responseMessage = "Demokrasi adalah sistem pemerintahan di mana rakyat memiliki kekuasaan tertinggi dalam pengambilan keputusan politik, sering kali melalui pemilu atau perwakilan yang dipilih secara langsung.";
} else if (input.includes("Negara Kesatuan Republik Indonesia adalah") || input.includes("NKRI adalah")) {
    responseMessage = "NKRI adalah bentuk negara Indonesia yang merupakan negara kesatuan yang terdiri dari berbagai pulau dan wilayah yang dikelola dalam satu sistem pemerintahan pusat.";
} else if (input.includes("Sumpah Pemuda adalah") || input.includes("apa itu Sumpah Pemuda")) {
    responseMessage = "Sumpah Pemuda adalah janji bersama yang diucapkan oleh para pemuda Indonesia pada 28 Oktober 1928, yang menyatakan persatuan bangsa Indonesia dalam satu tanah air, satu bangsa, dan satu bahasa, yaitu Indonesia.";
} else if (input.includes("Apa itu Negara hukum") || input.includes("Negara hukum adalah")) {
    responseMessage = "Negara hukum adalah negara yang berdasarkan pada hukum sebagai aturan tertinggi yang mengatur semua aspek kehidupan masyarakat, termasuk pemerintahan dan penegakan keadilan.";
} else if (input.includes("Apa itu kebebasan berbicara") || input.includes("kebebasan berbicara adalah")) {
    responseMessage = "Kebebasan berbicara adalah hak dasar setiap individu untuk menyampaikan pendapat dan informasi tanpa adanya tekanan atau penyensoran dari pihak lain.";
} 
else if (input.includes("Bhinneka Tunggal Ika adalah") || input.includes("apa itu Bhinneka Tunggal Ika")) {
    responseMessage = "Bhinneka Tunggal Ika adalah semboyan negara Indonesia yang berarti 'Berbeda-beda tetapi tetap satu'. Ini mencerminkan keberagaman suku, agama, budaya, dan bahasa di Indonesia yang harus disatukan dalam kesatuan bangsa.";
} else if (input.includes("demokrasi adalah") || input.includes("apa itu demokrasi")) {
    responseMessage = "Demokrasi adalah sistem pemerintahan yang memberikan kekuasaan tertinggi pada rakyat untuk memilih pemimpin dan wakil rakyat melalui pemilu.";
} else if (input.includes("musyawarah adalah") || input.includes("apa itu musyawarah")) {
    responseMessage = "Musyawarah adalah cara pengambilan keputusan dengan berdiskusi bersama untuk mencapai kesepakatan yang disetujui oleh semua pihak tanpa ada yang dipaksa.";
} else if (input.includes("gotong royong adalah") || input.includes("apa itu gotong royong")) {
    responseMessage = "Gotong royong adalah semangat kerjasama antara sesama anggota masyarakat untuk mencapai tujuan bersama dengan saling membantu tanpa pamrih.";
} else if (input.includes("hak pilih adalah") || input.includes("apa itu hak pilih")) {
    responseMessage = "Hak pilih adalah hak setiap warga negara yang memenuhi syarat untuk memilih wakil rakyat dan pemimpin negara dalam pemilu yang diselenggarakan secara langsung.";
} else if (input.includes("negara kesatuan adalah") || input.includes("apa itu negara kesatuan")) {
    responseMessage = "Negara Kesatuan adalah bentuk negara yang memiliki pemerintahan pusat yang berwenang mengatur seluruh wilayah negara, seperti Indonesia.";
} else if (input.includes("otoritas daerah adalah") || input.includes("apa itu otonomi daerah")) {
    responseMessage = "Otonomi daerah adalah hak daerah untuk mengatur dan mengurus urusan pemerintahan dan kesejahteraan masyarakat di daerahnya sendiri tanpa mengabaikan peraturan pusat.";
} else if (input.includes("lembaga negara adalah") || input.includes("apa itu lembaga negara")) {
    responseMessage = "Lembaga negara adalah badan yang menjalankan fungsi pemerintahan di Indonesia, seperti DPR, MPR, Presiden, dan Mahkamah Agung.";
} else if (input.includes("partai politik adalah") || input.includes("apa itu partai politik")) {
    responseMessage = "Partai politik adalah organisasi yang dibentuk untuk mempengaruhi kebijakan negara dan pemerintahan serta berpartisipasi dalam pemilu untuk mendapatkan kekuasaan politik.";
} else if (input.includes("hak asasi manusia adalah") || input.includes("apa itu hak asasi manusia")) {
    responseMessage = "Hak Asasi Manusia (HAM) adalah hak-hak dasar yang dimiliki setiap individu sejak lahir yang tidak bisa dicabut oleh siapapun, seperti hak untuk hidup, hak atas kebebasan, dan hak atas keadilan.";
} else if (input.includes("hak dan kewajiban warga negara adalah") || input.includes("apa itu hak dan kewajiban warga negara")) {
    responseMessage = "Hak warga negara termasuk hak untuk memilih, hak atas pendidikan, dan hak atas perlindungan hukum, sedangkan kewajiban warga negara meliputi kewajiban membayar pajak dan ikut serta dalam menjaga ketertiban umum.";
} else if (input.includes("Pancasila sebagai dasar negara adalah") || input.includes("pengertian Pancasila sebagai dasar negara")) {
    responseMessage = "Pancasila sebagai dasar negara adalah lima sila yang menjadi pedoman bagi negara Indonesia dalam menjalankan pemerintahan dan kehidupan berbangsa dan bernegara.";
} else if (input.includes("sistem pemerintahan presidensial adalah") || input.includes("apa itu sistem pemerintahan presidensial")) {
    responseMessage = "Sistem pemerintahan presidensial adalah sistem di mana presiden bertindak sebagai kepala negara dan kepala pemerintahan yang dipilih langsung oleh rakyat untuk memimpin negara.";
} else if (input.includes("otoritas daerah adalah") || input.includes("apa itu otonomi daerah")) {
    responseMessage = "Otonomi daerah memberikan kewenangan kepada daerah untuk mengatur urusan pemerintahannya sendiri, seperti pendidikan dan kesehatan, namun tetap dalam kerangka negara kesatuan.";
} else if (input.includes("musyawarah untuk mufakat adalah") || input.includes("apa itu musyawarah untuk mufakat")) {
    responseMessage = "Musyawarah untuk mufakat adalah metode pengambilan keputusan yang dilakukan secara bersama-sama untuk mencapai kesepakatan tanpa ada paksaan dari pihak manapun.";
} else if (input.includes("sistem politik di Indonesia adalah") || input.includes("apa itu sistem politik di Indonesia")) {
    responseMessage = "Sistem politik di Indonesia menganut sistem demokrasi yang berdasarkan pada Pancasila, di mana rakyat memilih pemimpin melalui pemilu.";
} else if (input.includes("hak asasi manusia di Indonesia adalah") || input.includes("apa itu hak asasi manusia di Indonesia")) {
    responseMessage = "Di Indonesia, Hak Asasi Manusia (HAM) dijamin oleh Undang-Undang Dasar 1945 dan negara wajib melindungi hak-hak tersebut tanpa diskriminasi.";
} else if (input.includes("undang-undang dasar 1945 adalah") || input.includes("apa itu undang-undang dasar 1945")) {
    responseMessage = "Undang-Undang Dasar 1945 adalah konstitusi negara Indonesia yang menjadi landasan hukum utama dalam kehidupan berbangsa dan bernegara, mencakup hak, kewajiban, serta pembagian kekuasaan negara.";
} else if (input.includes("pemerintahan negara adalah") || input.includes("apa itu pemerintahan negara")) {
    responseMessage = "Pemerintahan negara adalah sistem yang terdiri dari lembaga-lembaga yang mengatur dan menjalankan fungsi-fungsi pemerintahan di sebuah negara.";
}
else if (input.includes("hak dan kewajiban warga negara adalah") || input.includes("apa itu hak dan kewajiban warga negara")) {
    responseMessage = "Hak dan kewajiban warga negara adalah hal yang melekat pada setiap individu yang menjadi bagian dari negara. Hak warga negara mencakup hak untuk hidup, kebebasan, dan berpartisipasi dalam pemerintahan, sementara kewajiban termasuk kewajiban membayar pajak, mentaati hukum, dan menjaga ketertiban umum.";
} else if (input.includes("demokrasi Pancasila adalah") || input.includes("apa itu demokrasi Pancasila")) {
    responseMessage = "Demokrasi Pancasila adalah bentuk demokrasi yang dilaksanakan berdasarkan nilai-nilai yang terkandung dalam Pancasila, dengan mengutamakan musyawarah untuk mufakat dan mengedepankan kepentingan umum di atas kepentingan pribadi.";
} else if (input.includes("undang-undang dasar adalah") || input.includes("apa itu undang-undang dasar")) {
    responseMessage = "Undang-Undang Dasar 1945 adalah konstitusi negara Indonesia yang menjadi sumber hukum tertinggi di negara ini, yang mengatur segala hal mengenai pembagian kekuasaan, hak-hak asasi manusia, dan cara negara dijalankan.";
} else if (input.includes("Bhinneka Tunggal Ika adalah") || input.includes("apa itu Bhinneka Tunggal Ika")) {
    responseMessage = "Bhinneka Tunggal Ika adalah semboyan negara Indonesia yang berarti 'Berbeda-beda tetapi tetap satu'. Ini mencerminkan keragaman budaya, suku, agama, dan bahasa yang ada di Indonesia, namun tetap bersatu dalam kesatuan bangsa.";
} else if (input.includes("sistem pemerintahan Indonesia adalah") || input.includes("apa itu sistem pemerintahan Indonesia")) {
    responseMessage = "Sistem pemerintahan Indonesia adalah sistem presidensial, di mana Presiden sebagai kepala negara sekaligus kepala pemerintahan yang dipilih melalui pemilu langsung oleh rakyat.";
} else if (input.includes("sejarah Pancasila adalah") || input.includes("apa itu sejarah Pancasila")) {
    responseMessage = "Sejarah Pancasila dimulai sejak proklamasi kemerdekaan Indonesia pada 17 Agustus 1945. Pancasila pertama kali dikemukakan oleh Ir. Soekarno sebagai dasar negara Indonesia, yang kemudian disahkan sebagai dasar negara pada 18 Agustus 1945.";
} else if (input.includes("fungsi Pancasila adalah") || input.includes("apa itu fungsi Pancasila")) {
    responseMessage = "Fungsi Pancasila adalah sebagai dasar negara, pedoman dalam kehidupan berbangsa dan bernegara, serta sebagai sumber dari segala sumber hukum di Indonesia.";
} else if (input.includes("makna pancasila adalah") || input.includes("apa itu makna Pancasila")) {
    responseMessage = "Makna Pancasila adalah sebagai pedoman hidup bangsa Indonesia yang mencakup nilai-nilai luhur dan universal yang dapat diterima oleh seluruh rakyat Indonesia, yang mengedepankan keadilan, persatuan, dan kesejahteraan.";
} else if (input.includes("kedaulatan rakyat adalah") || input.includes("apa itu kedaulatan rakyat")) {
    responseMessage = "Kedaulatan rakyat adalah prinsip dalam sistem pemerintahan Indonesia di mana kekuasaan tertinggi ada pada rakyat, yang memberikan mandat kepada wakil-wakil mereka untuk menjalankan pemerintahan.";
} else if (input.includes("pembagian kekuasaan adalah") || input.includes("apa itu pembagian kekuasaan")) {
    responseMessage = "Pembagian kekuasaan di Indonesia dilakukan melalui sistem trias politika, yang membagi kekuasaan negara menjadi tiga cabang: eksekutif, legislatif, dan yudikatif, yang masing-masing memiliki fungsi dan wewenang terpisah untuk menjaga keseimbangan pemerintahan.";
} else if (input.includes("pemerintahan pusat adalah") || input.includes("apa itu pemerintahan pusat")) {
    responseMessage = "Pemerintahan pusat adalah pemerintahan yang berada di ibu kota negara dan memiliki kewenangan untuk mengatur seluruh wilayah negara. Pemerintahan pusat ini dipimpin oleh Presiden sebagai kepala negara dan kepala pemerintahan.";
} else if (input.includes("pemerintahan daerah adalah") || input.includes("apa itu pemerintahan daerah")) {
    responseMessage = "Pemerintahan daerah adalah pemerintahan yang mengatur wilayah tertentu di Indonesia, yang memiliki kewenangan otonomi untuk mengatur urusan daerah sesuai dengan undang-undang dan kebijakan yang berlaku.";
} else if (input.includes("badan peradilan adalah") || input.includes("apa itu badan peradilan")) {
    responseMessage = "Badan peradilan adalah lembaga yang memiliki wewenang untuk mengadili perkara hukum dan memastikan keadilan ditegakkan di Indonesia. Badan peradilan ini mencakup Mahkamah Agung, pengadilan negeri, dan pengadilan tinggi.";
} else if (input.includes("hak warga negara adalah") || input.includes("apa itu hak warga negara")) {
    responseMessage = "Hak warga negara adalah hak yang dimiliki oleh setiap warga negara sesuai dengan hukum yang berlaku, yang meliputi hak untuk memilih dalam pemilu, hak atas pendidikan, hak untuk bekerja, serta hak atas perlindungan hukum.";
} else if (input.includes("kewajiban warga negara adalah") || input.includes("apa itu kewajiban warga negara")) {
    responseMessage = "Kewajiban warga negara adalah kewajiban yang harus dipenuhi oleh setiap warga negara, seperti kewajiban membayar pajak, ikut serta dalam menjaga ketertiban umum, dan berpartisipasi dalam pembangunan negara.";
} else if (input.includes("hak memilih adalah") || input.includes("apa itu hak memilih")) {
    responseMessage = "Hak memilih adalah hak setiap warga negara yang memenuhi syarat untuk memilih dalam pemilihan umum, baik untuk memilih presiden, wakil rakyat, maupun pejabat publik lainnya.";
} else if (input.includes("fungsi lembaga negara adalah") || input.includes("apa itu fungsi lembaga negara")) {
    responseMessage = "Fungsi lembaga negara adalah untuk menjalankan tugas dan kewenangan yang diberikan oleh konstitusi atau undang-undang, seperti fungsi legislatif yang dimiliki oleh DPR, eksekutif oleh Presiden, dan yudikatif oleh Mahkamah Agung.";
} else if (input.includes("otoritas negara adalah") || input.includes("apa itu otoritas negara")) {
    responseMessage = "Otoritas negara adalah kekuasaan yang dimiliki oleh negara untuk mengatur dan mengelola urusan dalam negeri dan luar negeri, serta membuat keputusan yang mengikat bagi seluruh warga negara.";
} else if (input.includes("penegakan hukum adalah") || input.includes("apa itu penegakan hukum")) {
    responseMessage = "Penegakan hukum adalah usaha untuk memastikan bahwa setiap orang menaati hukum yang berlaku dan mendapatkan keadilan sesuai dengan aturan yang ada. Hal ini dilakukan oleh lembaga peradilan dan aparat penegak hukum lainnya.";
}
else if (input.includes("belajar adalah") || input.includes("apa itu belajar")) {
    responseMessage = "Belajar adalah proses memperoleh pengetahuan atau keterampilan melalui pengalaman, studi, atau pengajaran. Jika ada kesalahan dalam penulisan kata, pastikan untuk menulis dengan benar seperti 'belajar' bukan 'belajr'.";
} else if (input.includes("salah ketik adalah") || input.includes("apa itu salah ketik")) {
    responseMessage = "Salah ketik adalah kesalahan dalam menulis kata, misalnya 'taks' menjadi 'task', atau 'komputer' menjadi 'kompuer'. Pastikan memeriksa kembali tulisan sebelum mengirimnya.";
} else if (input.includes("ejaan yang benar adalah") || input.includes("apa itu ejaan yang benar")) {
    responseMessage = "Ejaan yang benar adalah aturan baku dalam penulisan kata-kata sesuai dengan pedoman yang berlaku, seperti dalam Bahasa Indonesia yang mengacu pada Ejaan Yang Disempurnakan (EYD). Misalnya, kata 'terimakasih' harus ditulis terpisah menjadi 'terima kasih'.";
} else if (input.includes("spelling yang benar adalah") || input.includes("apa itu spelling yang benar")) {
    responseMessage = "Spelling yang benar adalah penulisan kata sesuai dengan kaidah yang berlaku dalam bahasa tertentu. Pastikan ejaan dalam Bahasa Indonesia mengikuti Pedoman Umum Ejaan Bahasa Indonesia (PUEBI). Contohnya, 'terimakasih' yang benar adalah 'terima kasih'.";
} else if (input.includes("tanda baca yang benar adalah") || input.includes("apa itu tanda baca yang benar")) {
    responseMessage = "Tanda baca yang benar adalah simbol atau tanda yang digunakan dalam penulisan untuk memisahkan kalimat, menunjukkan intonasi, atau memberi makna tambahan, seperti titik (.), koma (,), tanda tanya (?), dan tanda seru (!).";
} else if (input.includes("kesalahan penulisan kata adalah") || input.includes("apa itu kesalahan penulisan kata")) {
    responseMessage = "Kesalahan penulisan kata terjadi ketika kata ditulis dengan cara yang salah, seperti 'seharusnya' menjadi 'seharusnya', 'acara' menjadi 'acra'. Pastikan memeriksa setiap kata untuk menghindari kesalahan penulisan.";
} else if (input.includes("kata baku adalah") || input.includes("apa itu kata baku")) {
    responseMessage = "Kata baku adalah kata yang sesuai dengan kaidah atau aturan dalam bahasa Indonesia yang diatur oleh PUEBI. Misalnya, 'teknologi' adalah kata baku, bukan 'teknologi' yang salah.";
} else if (input.includes("kalimat yang benar adalah") || input.includes("apa itu kalimat yang benar")) {
    responseMessage = "Kalimat yang benar adalah kalimat yang sesuai dengan kaidah tata bahasa yang berlaku dalam bahasa Indonesia. Misalnya, 'Dia pergi ke sekolah' adalah kalimat yang benar, bukan 'Dia sekolah ke pergi'.";
} else if (input.includes("menulis yang benar adalah") || input.includes("apa itu menulis yang benar")) {
    responseMessage = "Menulis yang benar adalah kegiatan menyusun kata-kata sesuai dengan tata bahasa dan ejaan yang baku, sehingga pesan yang disampaikan dapat dimengerti dengan baik. Misalnya, menulis dengan ejaan yang tepat dan penggunaan tanda baca yang benar.";
} else if (input.includes("mengoreksi penulisan adalah") || input.includes("apa itu mengoreksi penulisan")) {
    responseMessage = "Mengoreksi penulisan adalah proses memeriksa dan memperbaiki kesalahan dalam tulisan, seperti kesalahan ejaan, penggunaan tanda baca, atau kesalahan kata. Ini bertujuan untuk memastikan tulisan menjadi lebih jelas dan mudah dipahami.";
} else if (input.includes("perbaikan tulisan adalah") || input.includes("apa itu perbaikan tulisan")) {
    responseMessage = "Perbaikan tulisan adalah tindakan memperbaiki kesalahan dalam penulisan atau menyusun ulang kata-kata agar lebih mudah dipahami. Ini bisa mencakup memperbaiki tata bahasa, ejaan, atau struktur kalimat.";
} else if (input.includes("kesalahan grammar adalah") || input.includes("apa itu kesalahan grammar")) {
    responseMessage = "Kesalahan grammar adalah kesalahan dalam penggunaan struktur kalimat atau tata bahasa yang tidak sesuai dengan aturan yang berlaku. Misalnya, penggunaan kata ganti subjek atau objek yang salah, atau urutan kata yang tidak tepat.";
} else if (input.includes("kata yang sering salah ketik adalah") || input.includes("apa itu kata yang sering salah ketik")) {
    responseMessage = "Beberapa kata yang sering salah ketik di antaranya adalah 'terimakasih' (yang benar 'terima kasih'), 'acara' (yang salah 'acra'), dan 'selalu' (yang salah 'sealu'). Pastikan untuk mengecek tulisan Anda sebelum mengirimnya.";
} else if (input.includes("penulisan yang benar adalah") || input.includes("apa itu penulisan yang benar")) {
    responseMessage = "Penulisan yang benar adalah menulis kata-kata sesuai dengan kaidah yang berlaku, seperti penulisan kata yang tepat menurut EYD dan PUEBI, serta penggunaan tanda baca yang sesuai.";
} else if (input.includes("tata bahasa yang benar adalah") || input.includes("apa itu tata bahasa yang benar")) {
    responseMessage = "Tata bahasa yang benar adalah aturan yang mengatur bagaimana kata-kata digabungkan dalam kalimat, termasuk penggunaan subjek, predikat, objek, dan keterangan dengan urutan yang tepat.";
} else if (input.includes("ejaan yang salah adalah") || input.includes("apa itu ejaan yang salah")) {
    responseMessage = "Ejaan yang salah terjadi apabila suatu kata ditulis tidak sesuai dengan pedoman yang berlaku. Contoh kesalahan ejaan adalah menulis 'terimakasih' menjadi 'terimakasih' atau 'komputer' menjadi 'kompuer'.";
} else if (input.includes("penulisan huruf kapital adalah") || input.includes("apa itu penulisan huruf kapital")) {
    responseMessage = "Penulisan huruf kapital adalah penggunaan huruf besar dalam kata tertentu, seperti pada awal kalimat, nama orang, nama tempat, dan judul. Misalnya, 'Jakarta' dan 'Indonesia'.";
}
else if (input.includes("sel sel adalah") || input.includes("apa itu sel")) {
    responseMessage = "Sel adalah unit struktural dan fungsional terkecil dalam tubuh makhluk hidup. Setiap organisme hidup terdiri dari satu atau lebih sel, yang berfungsi untuk menjalankan proses kehidupan, seperti metabolisme dan reproduksi.";
} else if (input.includes("organisme adalah") || input.includes("apa itu organisme")) {
    responseMessage = "Organisme adalah makhluk hidup yang terdiri dari satu atau lebih sel, yang memiliki kemampuan untuk melakukan semua aktivitas kehidupan, seperti pertumbuhan, metabolisme, dan reproduksi. Contoh organisme adalah manusia, hewan, tumbuhan, dan mikroorganisme.";
} else if (input.includes("proses fotosintesis adalah") || input.includes("apa itu fotosintesis")) {
    responseMessage = "Fotosintesis adalah proses yang dilakukan oleh tumbuhan hijau, alga, dan beberapa jenis bakteri untuk mengubah energi cahaya menjadi energi kimia dalam bentuk glukosa, dengan menggunakan karbon dioksida dan air, serta melepaskan oksigen sebagai produk sampingan.";
} else if (input.includes("DNA adalah") || input.includes("apa itu DNA")) {
    responseMessage = "DNA (Deoxyribonucleic Acid) adalah molekul yang menyimpan informasi genetik yang diperlukan untuk pertumbuhan, perkembangan, dan reproduksi makhluk hidup. DNA terdapat dalam inti sel dan terdiri dari dua rantai polinukleotida yang saling berpasangan membentuk heliks ganda.";
} else if (input.includes("struktur tubuh manusia adalah") || input.includes("apa itu struktur tubuh manusia")) {
    responseMessage = "Struktur tubuh manusia terdiri dari beberapa tingkat organisasi, dimulai dari sel, jaringan, organ, sistem organ, dan akhirnya membentuk tubuh manusia secara keseluruhan, yang bekerja bersama untuk menjalankan fungsi kehidupan.";
} else if (input.includes("sistem pencernaan adalah") || input.includes("apa itu sistem pencernaan")) {
    responseMessage = "Sistem pencernaan adalah sistem tubuh yang bertanggung jawab untuk mengubah makanan yang masuk ke dalam tubuh menjadi zat gizi yang dapat diserap, serta membuang sisa-sisa yang tidak diperlukan tubuh. Sistem ini melibatkan mulut, kerongkongan, lambung, usus kecil, dan usus besar.";
} else if (input.includes("fungsi hati adalah") || input.includes("apa itu fungsi hati")) {
    responseMessage = "Hati berfungsi untuk menyaring darah, memproduksi empedu, mengatur metabolisme, menyimpan cadangan energi, serta mendetoksifikasi zat berbahaya dari tubuh. Hati juga berperan dalam produksi protein darah dan pengaturan kadar gula darah.";
} else if (input.includes("peran enzim dalam tubuh adalah") || input.includes("apa itu enzim")) {
    responseMessage = "Enzim adalah protein yang berfungsi sebagai katalisator dalam proses kimia di dalam tubuh. Enzim mempercepat reaksi kimia yang terjadi di dalam sel, seperti proses pencernaan makanan, sintesis DNA, dan pembentukan energi.";
} else if (input.includes("mekanisme pernapasan adalah") || input.includes("apa itu mekanisme pernapasan")) {
    responseMessage = "Mekanisme pernapasan adalah proses pengambilan oksigen ke dalam tubuh dan pengeluaran karbon dioksida dari tubuh melalui saluran pernapasan. Proses ini melibatkan hidung, tenggorokan, trakea, bronkus, dan paru-paru.";
} else if (input.includes("sistem peredaran darah adalah") || input.includes("apa itu sistem peredaran darah")) {
    responseMessage = "Sistem peredaran darah adalah sistem yang membawa darah yang mengandung oksigen dan nutrisi ke seluruh tubuh dan mengembalikan karbon dioksida serta limbah metabolisme ke organ ekskresi. Sistem ini terdiri dari jantung, pembuluh darah, dan darah.";
} else if (input.includes("jantung adalah") || input.includes("apa itu jantung")) {
    responseMessage = "Jantung adalah organ tubuh yang berfungsi untuk memompa darah ke seluruh tubuh. Jantung terdiri dari empat ruang: dua serambi dan dua bilik, yang bekerja untuk mengalirkan darah kaya oksigen ke tubuh dan darah yang kaya karbon dioksida ke paru-paru.";
} else if (input.includes("sistem saraf adalah") || input.includes("apa itu sistem saraf")) {
    responseMessage = "Sistem saraf adalah sistem tubuh yang mengontrol dan mengkoordinasikan fungsi tubuh melalui transmisi sinyal saraf. Sistem saraf terdiri dari otak, sumsum tulang belakang, dan saraf-saraf yang menghubungkan otak dan tubuh.";
} else if (input.includes("otak adalah") || input.includes("apa itu otak")) {
    responseMessage = "Otak adalah organ dalam tubuh manusia yang berfungsi untuk mengatur seluruh aktivitas tubuh, termasuk berpikir, bergerak, merasakan, serta mengontrol sistem saraf dan fungsi tubuh lainnya. Otak terdiri dari tiga bagian utama: otak besar, otak kecil, dan batang otak.";
} else if (input.includes("sistem imun adalah") || input.includes("apa itu sistem imun")) {
    responseMessage = "Sistem imun adalah sistem pertahanan tubuh yang melindungi tubuh dari infeksi dan penyakit. Sistem ini bekerja dengan cara mendeteksi dan menghancurkan patogen seperti bakteri, virus, dan sel yang terinfeksi.";
} else if (input.includes("proses reproduksi adalah") || input.includes("apa itu reproduksi")) {
    responseMessage = "Reproduksi adalah proses biologis di mana organisme menghasilkan keturunan untuk memastikan kelangsungan spesies. Proses ini dapat berlangsung secara seksual (melibatkan dua individu) atau aseksual (dengan satu individu).";
} else if (input.includes("sistem ekskresi adalah") || input.includes("apa itu sistem ekskresi")) {
    responseMessage = "Sistem ekskresi adalah sistem tubuh yang bertugas mengeluarkan sisa metabolisme dan zat berbahaya dari tubuh. Organ utama dalam sistem ini adalah ginjal, yang menyaring darah untuk menghasilkan urine yang mengandung limbah.";
} else if (input.includes("fotosintesis pada tumbuhan adalah") || input.includes("apa itu fotosintesis pada tumbuhan")) {
    responseMessage = "Fotosintesis pada tumbuhan adalah proses di mana tumbuhan mengubah energi cahaya menjadi energi kimia dalam bentuk glukosa, dengan menggunakan karbon dioksida dan air, serta melepaskan oksigen sebagai produk sampingan. Proses ini berlangsung di kloroplas sel tumbuhan.";
} else if (input.includes("klorofil adalah") || input.includes("apa itu klorofil")) {
    responseMessage = "Klorofil adalah pigmen hijau yang terdapat dalam kloroplas tumbuhan dan alga, yang berperan dalam menyerap energi cahaya untuk proses fotosintesis. Klorofil memungkinkan tumbuhan untuk menghasilkan makanan sendiri melalui energi matahari.";
} else if (input.includes("sistem tulang manusia adalah") || input.includes("apa itu sistem tulang manusia")) {
    responseMessage = "Sistem tulang manusia adalah rangka tubuh yang terdiri dari tulang dan jaringan ikat yang saling terhubung, berfungsi untuk memberikan bentuk, mendukung tubuh, melindungi organ vital, dan sebagai tempat penyimpanan mineral serta produksi sel darah.";
} else if (input.includes("kromosom adalah") || input.includes("apa itu kromosom")) {
    responseMessage = "Kromosom adalah struktur yang terbuat dari DNA dan protein yang berada di dalam inti sel. Kromosom membawa informasi genetik yang diturunkan dari orang tua ke keturunannya. Setiap spesies memiliki jumlah kromosom tertentu.";
}
else if (input.includes("sel adalah") || input.includes("apa itu sel")) {
    responseMessage = "Sel adalah unit struktural dan fungsional terkecil dalam tubuh makhluk hidup. Sel terbagi menjadi dua jenis, yaitu sel prokariotik (tanpa inti sel) dan sel eukariotik (memiliki inti sel).";
} else if (input.includes("mitosis adalah") || input.includes("apa itu mitosis")) {
    responseMessage = "Mitosis adalah proses pembelahan sel yang menghasilkan dua sel anak yang identik dengan sel induknya. Mitosis terdiri dari beberapa tahap, yaitu profase, metafase, anafase, dan telofase.";
} else if (input.includes("meiosis adalah") || input.includes("apa itu meiosis")) {
    responseMessage = "Meiosis adalah proses pembelahan sel yang menghasilkan empat sel anak dengan jumlah kromosom setengah dari sel induknya. Meiosis terjadi dalam pembentukan sel kelamin (sperma dan telur).";
} else if (input.includes("fotosintesis adalah") || input.includes("apa itu fotosintesis")) {
    responseMessage = "Fotosintesis adalah proses di mana tumbuhan hijau, alga, dan beberapa mikroorganisme mengubah energi cahaya menjadi energi kimia dalam bentuk glukosa, menggunakan karbon dioksida dan air, serta menghasilkan oksigen.";
} else if (input.includes("energi dalam tubuh adalah") || input.includes("apa itu energi dalam tubuh")) {
    responseMessage = "Energi dalam tubuh diperoleh dari makanan yang dikonsumsi, yang kemudian diubah menjadi energi kimia yang digunakan untuk berbagai proses dalam tubuh, seperti pertumbuhan, aktivitas fisik, dan fungsi tubuh lainnya.";
} else if (input.includes("sistem pencernaan manusia adalah") || input.includes("apa itu sistem pencernaan manusia")) {
    responseMessage = "Sistem pencernaan manusia adalah sistem tubuh yang berfungsi untuk mengubah makanan yang masuk ke dalam tubuh menjadi zat gizi yang dapat diserap, serta membuang sisa-sisa yang tidak diperlukan tubuh. Organ utama sistem pencernaan antara lain mulut, esofagus, lambung, usus kecil, dan usus besar.";
} else if (input.includes("sistem peredaran darah manusia adalah") || input.includes("apa itu sistem peredaran darah manusia")) {
    responseMessage = "Sistem peredaran darah manusia adalah sistem yang membawa darah yang mengandung oksigen dan nutrisi ke seluruh tubuh dan mengembalikan karbon dioksida serta limbah metabolisme ke organ ekskresi. Sistem ini terdiri dari jantung, pembuluh darah, dan darah.";
} else if (input.includes("struktur DNA adalah") || input.includes("apa itu struktur DNA")) {
    responseMessage = "DNA (Deoxyribonucleic Acid) adalah molekul yang menyimpan informasi genetik yang diperlukan untuk pertumbuhan, perkembangan, dan reproduksi makhluk hidup. DNA memiliki struktur heliks ganda yang terdiri dari dua untai nukleotida.";
} else if (input.includes("struktur protein adalah") || input.includes("apa itu struktur protein")) {
    responseMessage = "Protein adalah molekul yang terdiri dari asam amino yang berfungsi dalam banyak proses biologi tubuh, seperti enzim, pembentukan otot, dan kekebalan tubuh. Struktur protein terdiri dari empat tingkat: primer, sekunder, tersier, dan kuartener.";
} else if (input.includes("sistem imun tubuh adalah") || input.includes("apa itu sistem imun tubuh")) {
    responseMessage = "Sistem imun adalah sistem pertahanan tubuh yang melindungi tubuh dari serangan patogen seperti bakteri, virus, dan parasit. Sistem ini bekerja dengan cara mendeteksi dan menghancurkan patogen atau sel yang terinfeksi.";
} else if (input.includes("sistem endokrin adalah") || input.includes("apa itu sistem endokrin")) {
    responseMessage = "Sistem endokrin adalah sistem yang mengatur fungsi tubuh melalui sekresi hormon. Hormon-hormon ini diproduksi oleh kelenjar endokrin, seperti kelenjar pituitari, tiroid, dan pankreas, yang mempengaruhi pertumbuhan, metabolisme, dan keseimbangan tubuh.";
} else if (input.includes("respirasi sel adalah") || input.includes("apa itu respirasi sel")) {
    responseMessage = "Respirasi sel adalah proses metabolisme dalam sel yang menghasilkan energi dalam bentuk ATP dengan cara mengubah glukosa menjadi karbon dioksida dan air. Respirasi sel terdiri dari tiga tahap: glikolisis, siklus asam sitrat, dan rantai transportasi elektron.";
} else if (input.includes("ekosistem adalah") || input.includes("apa itu ekosistem")) {
    responseMessage = "Ekosistem adalah sistem yang terdiri dari makhluk hidup dan lingkungan abiotiknya yang saling berinteraksi. Ekosistem dapat berbentuk ekosistem darat, air, atau campuran keduanya, seperti ekosistem hutan, laut, dan sungai.";
} else if (input.includes("siklus nitrogen adalah") || input.includes("apa itu siklus nitrogen")) {
    responseMessage = "Siklus nitrogen adalah proses peredaran nitrogen melalui berbagai bentuk kimia di alam, yang melibatkan makhluk hidup dan lingkungan. Proses ini termasuk fiksasi nitrogen, nitrifikasi, denitrifikasi, dan amonifikasi.";
} else if (input.includes("siklus air adalah") || input.includes("apa itu siklus air")) {
    responseMessage = "Siklus air adalah peredaran air di alam melalui proses evaporasi, kondensasi, presipitasi, dan infiltrasi. Proses ini memastikan distribusi air yang terus menerus di atmosfer, tanah, dan tubuh air.";
} else if (input.includes("adaptasi adalah") || input.includes("apa itu adaptasi")) {
    responseMessage = "Adaptasi adalah proses di mana organisme mengubah perilaku atau fisiologinya untuk bertahan hidup di lingkungan yang berubah. Adaptasi dapat bersifat morfologi, fisiologi, atau tingkah laku, sesuai dengan kebutuhan organisme tersebut.";
} else if (input.includes("mutasi adalah") || input.includes("apa itu mutasi")) {
    responseMessage = "Mutasi adalah perubahan dalam urutan DNA yang dapat terjadi secara alami atau akibat pengaruh lingkungan. Mutasi dapat menyebabkan perubahan pada sifat organisme dan dapat diwariskan atau terjadi pada sel somatik.";
} else if (input.includes("sistem reproduksi manusia adalah") || input.includes("apa itu sistem reproduksi manusia")) {
    responseMessage = "Sistem reproduksi manusia adalah sistem yang berfungsi untuk menghasilkan keturunan melalui proses perkawinan antara sel sperma dan sel telur. Sistem ini melibatkan organ reproduksi pria dan wanita, seperti testis, ovarium, dan rahim.";
} else if (input.includes("sistem ekskresi manusia adalah") || input.includes("apa itu sistem ekskresi manusia")) {
    responseMessage = "Sistem ekskresi manusia adalah sistem yang bertugas untuk mengeluarkan produk sampingan hasil metabolisme tubuh, seperti urea, karbon dioksida, dan air. Organ utama dalam sistem ekskresi adalah ginjal, yang menyaring darah untuk menghasilkan urine.";
} else if (input.includes("homeostasis adalah") || input.includes("apa itu homeostasis")) {
    responseMessage = "Homeostasis adalah kemampuan tubuh untuk menjaga keseimbangan internal meskipun terjadi perubahan di lingkungan eksternal. Proses ini melibatkan berbagai sistem tubuh untuk mengatur suhu tubuh, kadar air, dan keseimbangan elektrolit.";
} else if (input.includes("bioteknologi adalah") || input.includes("apa itu bioteknologi")) {
    responseMessage = "Bioteknologi adalah pemanfaatan makhluk hidup atau sistem biologi untuk menghasilkan produk yang bermanfaat bagi manusia. Contoh bioteknologi adalah pembuatan insulin dengan rekayasa genetika dan pengembangan tanaman yang tahan hama.";
} else if (input.includes("kloning adalah") || input.includes("apa itu kloning")) {
    responseMessage = "Kloning adalah proses pembuatan salinan genetika dari suatu organisme. Proses ini dapat dilakukan secara alami, seperti pada pembelahan sel, atau secara buatan melalui teknik kloning reproduksi atau terapeutik.";
} else if (input.includes("genetika adalah") || input.includes("apa itu genetika")) {
    responseMessage = "Genetika adalah cabang ilmu biologi yang mempelajari pewarisan sifat dan variasi pada makhluk hidup. Ilmu ini mempelajari cara gen-gen diturunkan dari satu generasi ke generasi berikutnya melalui proses meiosis dan fertilisasi.";
}
else if (input.includes("jaringan komputer adalah") || input.includes("apa itu jaringan komputer")) {
    responseMessage = "Jaringan komputer adalah kumpulan komputer yang saling terhubung satu sama lain untuk berbagi informasi, perangkat, dan sumber daya seperti printer atau file.";
} else if (input.includes("protocol jaringan adalah") || input.includes("apa itu protocol jaringan")) {
    responseMessage = "Protocol jaringan adalah aturan yang digunakan untuk mengatur komunikasi antar perangkat dalam jaringan komputer, seperti TCP/IP, HTTP, dan FTP.";
} else if (input.includes("IP address adalah") || input.includes("apa itu IP address")) {
    responseMessage = "IP address adalah alamat unik yang digunakan untuk mengidentifikasi perangkat dalam jaringan komputer, baik dalam jaringan lokal maupun internet.";
} else if (input.includes("topologi jaringan adalah") || input.includes("apa itu topologi jaringan")) {
    responseMessage = "Topologi jaringan adalah cara perangkat-perangkat dalam jaringan dihubungkan satu sama lain, seperti topologi bintang, cincin, dan bus.";
} else if (input.includes("router adalah") || input.includes("apa itu router")) {
    responseMessage = "Router adalah perangkat yang menghubungkan beberapa jaringan komputer dan mengatur lalu lintas data antar jaringan dengan cara meneruskan paket data ke tujuan yang tepat.";
} else if (input.includes("switch adalah") || input.includes("apa itu switch")) {
    responseMessage = "Switch adalah perangkat jaringan yang berfungsi untuk menghubungkan beberapa perangkat dalam satu jaringan lokal dan mengatur pengiriman data antar perangkat-perangkat tersebut.";
} else if (input.includes("firewall adalah") || input.includes("apa itu firewall")) {
    responseMessage = "Firewall adalah sistem yang digunakan untuk melindungi jaringan komputer dari ancaman eksternal, dengan cara menyaring dan mengendalikan lalu lintas data yang masuk dan keluar.";
} else if (input.includes("DNS adalah") || input.includes("apa itu DNS")) {
    responseMessage = "DNS (Domain Name System) adalah sistem yang menerjemahkan nama domain website menjadi alamat IP yang bisa dipahami oleh komputer dalam jaringan.";
} else if (input.includes("VPN adalah") || input.includes("apa itu VPN")) {
    responseMessage = "VPN (Virtual Private Network) adalah jaringan yang memungkinkan pengguna mengakses internet dengan cara yang lebih aman, dengan mengenkripsi data dan menyembunyikan alamat IP asli.";
} else if (input.includes("meiosis adalah") || input.includes("apa itu meiosis")) {
    responseMessage = "Meiosis adalah proses pembelahan sel yang menghasilkan sel kelamin (gamet), seperti sperma dan telur, dengan jumlah kromosom setengah dari jumlah kromosom sel induknya.";
} else if (input.includes("kabel fiber optik adalah") || input.includes("apa itu kabel fiber optik")) {
    responseMessage = "Kabel fiber optik adalah kabel yang menggunakan serat kaca atau plastik untuk mentransmisikan data dalam bentuk cahaya, yang memungkinkan transmisi data dengan kecepatan tinggi.";
} else if (input.includes("Wi-Fi adalah") || input.includes("apa itu Wi-Fi")) {
    responseMessage = "Wi-Fi adalah teknologi jaringan nirkabel yang memungkinkan perangkat untuk terhubung ke internet menggunakan gelombang radio tanpa kabel fisik.";
} else if (input.includes("LAN adalah") || input.includes("apa itu LAN")) {
    responseMessage = "LAN (Local Area Network) adalah jaringan komputer yang terbatas pada area kecil, seperti dalam satu gedung atau rumah, yang menghubungkan komputer dan perangkat lain.";
} else if (input.includes("WAN adalah") || input.includes("apa itu WAN")) {
    responseMessage = "WAN (Wide Area Network) adalah jaringan komputer yang melibatkan area yang lebih luas, seperti antar kota, negara, atau bahkan benua, yang menghubungkan berbagai jaringan LAN.";
} else if (input.includes("HTTP adalah") || input.includes("apa itu HTTP")) {
    responseMessage = "HTTP (Hypertext Transfer Protocol) adalah protokol yang digunakan untuk mentransfer data di web, yang memungkinkan pengguna mengakses situs web dengan mengetikkan URL di browser.";
} else if (input.includes("FTP adalah") || input.includes("apa itu FTP")) {
    responseMessage = "FTP (File Transfer Protocol) adalah protokol yang digunakan untuk mentransfer file antar komputer melalui jaringan, memungkinkan pengiriman dan penerimaan file di server.";
} else if (input.includes("IPV6 adalah") || input.includes("apa itu IPV6")) {
    responseMessage = "IPv6 adalah versi terbaru dari protokol IP yang digunakan untuk mengidentifikasi perangkat di internet dengan jumlah alamat yang jauh lebih banyak dibandingkan IPv4.";
}
else if (input.includes("LAN kabel adalah") || input.includes("apa itu LAN kabel")) {
    responseMessage = "LAN kabel adalah kabel yang digunakan untuk menghubungkan perangkat dalam jaringan lokal (LAN), seperti kabel twisted pair atau kabel fiber optik.";
} else if (input.includes("kabel coaxial adalah") || input.includes("apa itu kabel coaxial")) {
    responseMessage = "Kabel coaxial adalah jenis kabel yang digunakan untuk mengirimkan data melalui sinyal elektromagnetik. Kabel ini sering digunakan dalam sistem televisi kabel dan internet broadband.";
} else if (input.includes("protocol TCP/IP adalah") || input.includes("apa itu protocol TCP/IP")) {
    responseMessage = "TCP/IP adalah sekumpulan protokol yang digunakan untuk menghubungkan perangkat dalam jaringan komputer. TCP mengatur pengiriman data secara terurut dan IP bertanggung jawab untuk pengalamatan perangkat dalam jaringan.";
} else if (input.includes("cloud computing adalah") || input.includes("apa itu cloud computing")) {
    responseMessage = "Cloud computing adalah layanan yang menyediakan penyimpanan, komputasi, dan aplikasi berbasis internet, sehingga pengguna dapat mengaksesnya dari mana saja tanpa memerlukan perangkat keras khusus.";
} else if (input.includes("server adalah") || input.includes("apa itu server")) {
    responseMessage = "Server adalah perangkat keras atau perangkat lunak yang menyediakan layanan atau sumber daya kepada komputer lain dalam jaringan, seperti file, database, atau aplikasi web.";
} else if (input.includes("client adalah") || input.includes("apa itu client")) {
    responseMessage = "Client adalah perangkat yang menggunakan layanan atau sumber daya yang disediakan oleh server dalam suatu jaringan komputer.";
} else if (input.includes("cloud storage adalah") || input.includes("apa itu cloud storage")) {
    responseMessage = "Cloud storage adalah layanan penyimpanan data di server yang terhubung ke internet, yang memungkinkan pengguna untuk menyimpan dan mengakses data dari perangkat mana saja.";
} else if (input.includes("DNS server adalah") || input.includes("apa itu DNS server")) {
    responseMessage = "DNS server adalah server yang berfungsi untuk menerjemahkan nama domain website menjadi alamat IP yang dapat dimengerti oleh komputer dalam jaringan.";
} else if (input.includes("load balancing adalah") || input.includes("apa itu load balancing")) {
    responseMessage = "Load balancing adalah teknik untuk mendistribusikan beban kerja atau trafik ke beberapa server atau sumber daya, guna meningkatkan kinerja dan keandalan jaringan atau aplikasi.";
} else if (input.includes("sistem operasi adalah") || input.includes("apa itu sistem operasi")) {
    responseMessage = "Sistem operasi adalah perangkat lunak yang mengelola perangkat keras dan perangkat lunak di komputer, serta menyediakan layanan untuk program aplikasi.";
} else if (input.includes("firewall jaringan adalah") || input.includes("apa itu firewall jaringan")) {
    responseMessage = "Firewall jaringan adalah sistem keamanan yang digunakan untuk memfilter atau memblokir trafik data yang tidak diinginkan atau berbahaya dalam jaringan komputer.";
} else if (input.includes("data center adalah") || input.includes("apa itu data center")) {
    responseMessage = "Data center adalah fasilitas fisik yang digunakan untuk menempatkan server dan perangkat penyimpanan data yang digunakan untuk mengelola dan menyimpan data dalam jumlah besar.";
} else if (input.includes("backup data adalah") || input.includes("apa itu backup data")) {
    responseMessage = "Backup data adalah proses membuat salinan data yang disimpan di tempat yang aman, untuk mencegah kehilangan data jika terjadi kerusakan atau bencana pada perangkat asli.";
} else if (input.includes("web hosting adalah") || input.includes("apa itu web hosting")) {
    responseMessage = "Web hosting adalah layanan yang menyediakan tempat untuk menyimpan file dan data situs web agar bisa diakses melalui internet oleh pengguna.";
} else if (input.includes("virus komputer adalah") || input.includes("apa itu virus komputer")) {
    responseMessage = "Virus komputer adalah program berbahaya yang dapat merusak atau mengganggu kinerja sistem komputer dengan cara menyebar dan menyalin dirinya sendiri ke berbagai file atau program.";
} else if (input.includes("malware adalah") || input.includes("apa itu malware")) {
    responseMessage = "Malware adalah perangkat lunak yang dirancang untuk merusak, mengakses tanpa izin, atau mengganggu operasi komputer, jaringan, atau perangkat lainnya.";
} else if (input.includes("trojan horse adalah") || input.includes("apa itu trojan horse")) {
    responseMessage = "Trojan horse adalah jenis malware yang menyamar sebagai perangkat lunak yang sah atau berguna, namun dapat merusak sistem atau mencuri data penting ketika dijalankan.";
} else if (input.includes("phishing adalah") || input.includes("apa itu phishing")) {
    responseMessage = "Phishing adalah teknik penipuan yang digunakan oleh pihak tidak bertanggung jawab untuk mencuri informasi pribadi, seperti password atau nomor kartu kredit, dengan menyamar sebagai entitas terpercaya.";
} else if (input.includes("enkripsi adalah") || input.includes("apa itu enkripsi")) {
    responseMessage = "Enkripsi adalah proses mengubah data menjadi format yang tidak dapat dibaca tanpa kunci khusus, untuk menjaga kerahasiaan informasi selama transmisi atau penyimpanan.";
} else if (input.includes("dekripsi adalah") || input.includes("apa itu dekripsi")) {
    responseMessage = "Dekripsi adalah proses mengubah data yang telah dienkripsi kembali ke format aslinya, sehingga dapat dibaca atau dipahami tanpa kunci enkripsi.";
} else if (input.includes("router switch adalah") || input.includes("apa itu router switch")) {
    responseMessage = "Router switch adalah perangkat yang menggabungkan fungsi router dan switch, yang memungkinkan perangkat untuk terhubung ke jaringan dan mengarahkan trafik data di jaringan tersebut.";
} else if (input.includes("broadband adalah") || input.includes("apa itu broadband")) {
    responseMessage = "Broadband adalah jenis koneksi internet yang memiliki kecepatan tinggi dan dapat mentransfer data dalam jumlah besar, seperti koneksi kabel, fiber optik, atau nirkabel.";
}
else if (input.includes("WAN kabel adalah") || input.includes("apa itu WAN kabel")) {
    responseMessage = "WAN kabel adalah jenis kabel yang digunakan untuk menghubungkan jaringan komputer di area yang lebih luas, seperti antar kota atau negara, menggunakan teknologi seperti fiber optik.";
} else if (input.includes("ethernet adalah") || input.includes("apa itu ethernet")) {
    responseMessage = "Ethernet adalah teknologi jaringan yang digunakan untuk menghubungkan perangkat dalam jaringan lokal (LAN) dengan menggunakan kabel, umumnya menggunakan kabel twisted pair atau fiber optik.";
} else if (input.includes("broadband wireless adalah") || input.includes("apa itu broadband wireless")) {
    responseMessage = "Broadband wireless adalah teknologi nirkabel yang menyediakan koneksi internet dengan kecepatan tinggi, seperti Wi-Fi, LTE, dan 5G.";
} else if (input.includes("VLAN adalah") || input.includes("apa itu VLAN")) {
    responseMessage = "VLAN (Virtual Local Area Network) adalah jaringan virtual yang memungkinkan perangkat dalam jaringan yang berbeda secara fisik untuk terhubung seolah-olah berada dalam satu jaringan lokal yang sama.";
} else if (input.includes("ping adalah") || input.includes("apa itu ping")) {
    responseMessage = "Ping adalah utilitas jaringan yang digunakan untuk menguji koneksi antara dua perangkat dalam jaringan, dan untuk mengetahui apakah perangkat tujuan dapat dijangkau atau tidak.";
} else if (input.includes("IP statis adalah") || input.includes("apa itu IP statis")) {
    responseMessage = "IP statis adalah alamat IP yang ditetapkan secara permanen pada perangkat dalam jaringan, sehingga tidak berubah setiap kali perangkat terhubung ke jaringan.";
} else if (input.includes("IP dinamis adalah") || input.includes("apa itu IP dinamis")) {
    responseMessage = "IP dinamis adalah alamat IP yang diberikan secara otomatis oleh server DHCP (Dynamic Host Configuration Protocol) setiap kali perangkat terhubung ke jaringan, dan dapat berubah setiap waktu.";
} else if (input.includes("subnet mask adalah") || input.includes("apa itu subnet mask")) {
    responseMessage = "Subnet mask adalah angka yang digunakan untuk membagi jaringan IP menjadi beberapa subnet kecil, untuk mengelompokkan perangkat dalam jaringan agar lebih efisien dalam pengalamatan.";
} else if (input.includes("dhcp adalah") || input.includes("apa itu dhcp")) {
    responseMessage = "DHCP (Dynamic Host Configuration Protocol) adalah protokol yang secara otomatis memberikan alamat IP kepada perangkat dalam jaringan saat perangkat tersebut terhubung.";
} else if (input.includes("router gateway adalah") || input.includes("apa itu router gateway")) {
    responseMessage = "Router gateway adalah perangkat yang berfungsi untuk menghubungkan jaringan lokal dengan jaringan lain, seperti jaringan luas (WAN) atau internet.";
} else if (input.includes("wireless access point adalah") || input.includes("apa itu wireless access point")) {
    responseMessage = "Wireless Access Point (WAP) adalah perangkat yang memungkinkan perangkat nirkabel, seperti laptop atau smartphone, untuk terhubung ke jaringan lokal melalui Wi-Fi.";
} else if (input.includes("sistem manajemen jaringan adalah") || input.includes("apa itu sistem manajemen jaringan")) {
    responseMessage = "Sistem manajemen jaringan adalah perangkat lunak atau sistem yang digunakan untuk memonitor, mengatur, dan memelihara infrastruktur jaringan untuk memastikan kinerja optimal.";
} else if (input.includes("bandwidth adalah") || input.includes("apa itu bandwidth")) {
    responseMessage = "Bandwidth adalah kapasitas maksimum yang dapat dicapai oleh saluran komunikasi untuk mengirimkan data dalam periode waktu tertentu, biasanya diukur dalam bit per detik (bps).";
} else if (input.includes("latency adalah") || input.includes("apa itu latency")) {
    responseMessage = "Latency adalah jeda waktu yang diperlukan oleh data untuk berpindah dari sumber ke tujuan dalam jaringan, diukur dalam milidetik (ms). Latency yang rendah sangat penting untuk kinerja aplikasi real-time seperti video conference.";
} else if (input.includes("throughput adalah") || input.includes("apa itu throughput")) {
    responseMessage = "Throughput adalah jumlah data yang berhasil ditransfer dalam suatu periode waktu tertentu dalam jaringan, biasanya diukur dalam bit per detik (bps).";
} else if (input.includes("firewall perangkat keras adalah") || input.includes("apa itu firewall perangkat keras")) {
    responseMessage = "Firewall perangkat keras adalah perangkat fisik yang digunakan untuk mengontrol akses ke jaringan komputer dan melindungi dari ancaman luar dengan memfilter lalu lintas data.";
} else if (input.includes("firewall perangkat lunak adalah") || input.includes("apa itu firewall perangkat lunak")) {
    responseMessage = "Firewall perangkat lunak adalah program yang dipasang pada perangkat komputer atau server untuk memonitor dan mengontrol lalu lintas jaringan guna melindungi dari serangan dan ancaman.";
} else if (input.includes("load balancing server adalah") || input.includes("apa itu load balancing server")) {
    responseMessage = "Load balancing server adalah teknik yang digunakan untuk mendistribusikan beban kerja atau trafik data di antara beberapa server, untuk meningkatkan kinerja dan keandalan layanan jaringan.";
} else if (input.includes("cloud server adalah") || input.includes("apa itu cloud server")) {
    responseMessage = "Cloud server adalah server virtual yang berada di dalam cloud computing, yang memungkinkan pengguna mengakses layanan dan data melalui internet tanpa bergantung pada perangkat keras lokal.";
} else if (input.includes("data encryption adalah") || input.includes("apa itu data encryption")) {
    responseMessage = "Data encryption adalah proses mengubah data ke dalam format yang tidak bisa dibaca tanpa kunci enkripsi, untuk menjaga kerahasiaan data saat transit atau disimpan.";
} else if (input.includes("dalam jaringan komputer apa itu proxy") || input.includes("apa itu proxy dalam jaringan komputer")) {
    responseMessage = "Proxy dalam jaringan komputer adalah server perantara yang berfungsi untuk meneruskan permintaan antara pengguna dan internet, biasanya digunakan untuk meningkatkan keamanan atau mengakses konten yang dibatasi.";
} else if (input.includes("analisis jaringan adalah") || input.includes("apa itu analisis jaringan")) {
    responseMessage = "Analisis jaringan adalah proses mengevaluasi dan mengidentifikasi masalah dalam kinerja jaringan komputer, termasuk masalah kecepatan, kestabilan, dan keamanan untuk memastikan jaringan berfungsi optimal.";
}
else if (input.includes("animasi adalah") || input.includes("apa itu animasi")) {
    responseMessage = "Animasi adalah teknik menciptakan ilusi gerakan dengan menampilkan gambar-gambar yang berbeda secara berurutan, baik menggunakan media manual (seperti gambar tangan) maupun komputer.";
} else if (input.includes("keyframe adalah") || input.includes("apa itu keyframe")) {
    responseMessage = "Keyframe adalah frame penting dalam animasi yang digunakan untuk menentukan posisi, waktu, dan perubahan utama dalam sebuah adegan atau animasi, sebagai referensi untuk frame-frame lainnya.";
} else if (input.includes("rendering adalah") || input.includes("apa itu rendering")) {
    responseMessage = "Rendering adalah proses mengubah model 3D atau data grafis menjadi gambar 2D atau video yang bisa dilihat oleh pengguna, proses ini memerlukan banyak waktu dan daya komputasi, tergantung kompleksitas.";
} else if (input.includes("motion capture adalah") || input.includes("apa itu motion capture")) {
    responseMessage = "Motion Capture (MoCap) adalah teknologi yang digunakan untuk merekam gerakan manusia atau objek, lalu mentransfernya ke dalam model digital untuk menciptakan animasi yang lebih realistis.";
} else if (input.includes("compositing adalah") || input.includes("apa itu compositing")) {
    responseMessage = "Compositing adalah proses menggabungkan berbagai elemen visual atau gambar untuk menciptakan gambar akhir, biasanya digunakan untuk film atau animasi untuk menggabungkan efek visual dengan gambar nyata.";
} else if (input.includes("3D modeling adalah") || input.includes("apa itu 3D modeling")) {
    responseMessage = "3D modeling adalah proses pembuatan representasi tiga dimensi dari objek menggunakan perangkat lunak komputer. Model 3D ini dapat digunakan untuk animasi, film, video game, dan aplikasi lainnya.";
} else if (input.includes("render farm adalah") || input.includes("apa itu render farm")) {
    responseMessage = "Render Farm adalah jaringan komputer yang bekerja sama untuk merender gambar atau video dalam waktu yang lebih singkat. Sistem ini memungkinkan rendering tugas berat dilakukan secara paralel di banyak komputer.";
} else if (input.includes("visual effects adalah") || input.includes("apa itu visual effects")) {
    responseMessage = "Visual Effects (VFX) adalah efek yang diterapkan pada gambar dalam film atau animasi menggunakan teknologi komputer untuk menciptakan dunia atau adegan yang tidak dapat dilakukan secara nyata atau praktis.";
} else if (input.includes("rigging adalah") || input.includes("apa itu rigging")) {
    responseMessage = "Rigging adalah proses pembuatan kerangka atau tulang dalam model 3D untuk memudahkan animasi karakter atau objek, dengan tujuan agar bisa bergerak sesuai dengan keinginan animator.";
} else if (input.includes("texture mapping adalah") || input.includes("apa itu texture mapping")) {
    responseMessage = "Texture mapping adalah proses menambahkan tekstur atau gambar dua dimensi pada permukaan objek 3D untuk memberikan tampilan yang lebih realistis pada objek tersebut.";
} else if (input.includes("depth of field adalah") || input.includes("apa itu depth of field")) {
    responseMessage = "Depth of Field (DOF) adalah efek optik yang mengontrol seberapa banyak area dalam gambar yang tampak tajam atau blur, tergantung pada kedalaman dan jarak objek terhadap kamera.";
} else if (input.includes("shader adalah") || input.includes("apa itu shader")) {
    responseMessage = "Shader adalah program kecil yang dijalankan oleh GPU untuk mengubah penampilan permukaan objek 3D, menentukan bagaimana cahaya berinteraksi dengan permukaan tersebut, seperti pencahayaan atau bayangan.";
} else if (input.includes("rendering real-time adalah") || input.includes("apa itu rendering real-time")) {
    responseMessage = "Rendering real-time adalah proses rendering yang dilakukan secara langsung atau hampir seketika, digunakan dalam aplikasi interaktif seperti video game dan simulasi, yang memungkinkan pengguna melihat hasilnya secara langsung.";
} else if (input.includes("blue screen adalah") || input.includes("apa itu blue screen")) {
    responseMessage = "Blue Screen adalah teknik efek visual yang digunakan untuk menggantikan latar belakang warna biru dengan gambar atau adegan lain secara digital. Teknik ini sering digunakan dalam pembuatan film dan televisi.";
} else if (input.includes("keying adalah") || input.includes("apa itu keying")) {
    responseMessage = "Keying adalah teknik penghapusan warna latar belakang, biasanya warna hijau atau biru, untuk memungkinkan penggantian dengan gambar atau video lainnya, digunakan dalam efek visual dan green screen.";
} else if (input.includes("animation curve adalah") || input.includes("apa itu animation curve")) {
    responseMessage = "Animation curve adalah grafik yang menggambarkan perubahan suatu parameter atau properti objek dalam animasi dari waktu ke waktu, seperti kecepatan pergerakan, rotasi, atau skala objek.";
} else if (input.includes("frame rate adalah") || input.includes("apa itu frame rate")) {
    responseMessage = "Frame rate adalah jumlah frame gambar yang ditampilkan dalam satu detik dalam video atau animasi. Semakin tinggi frame rate, semakin halus pergerakan animasi tersebut.";
} else if (input.includes("camera angle adalah") || input.includes("apa itu camera angle")) {
    responseMessage = "Camera angle adalah sudut atau posisi dari mana kamera dalam film atau animasi mengambil gambar atau video. Pemilihan sudut kamera mempengaruhi cara penonton melihat adegan dan mengarahkan perhatian mereka.";
} else if (input.includes("3D rendering adalah") || input.includes("apa itu 3D rendering")) {
    responseMessage = "3D rendering adalah proses pembuatan gambar atau video dua dimensi dari model 3D yang sudah diproses, dengan menambahkan pencahayaan, tekstur, dan efek visual lainnya untuk menciptakan gambar final.";
} else if (input.includes("motion blur adalah") || input.includes("apa itu motion blur")) {
    responseMessage = "Motion blur adalah efek visual yang menciptakan kesan gerakan cepat pada objek dalam animasi atau video dengan membuat gambar menjadi sedikit kabur, meniru efek yang terjadi ketika objek bergerak cepat.";
}
else if (input.includes("administrasi jaringan adalah") || input.includes("apa itu administrasi jaringan")) {
    responseMessage = "Administrasi jaringan adalah kegiatan yang berfokus pada pengelolaan, pemeliharaan, dan pengaturan infrastruktur jaringan komputer, termasuk perangkat keras, perangkat lunak, dan protokol komunikasi yang mendukung jaringan.";
} else if (input.includes("topologi jaringan adalah") || input.includes("apa itu topologi jaringan")) {
    responseMessage = "Topologi jaringan adalah cara perangkat-perangkat dalam jaringan komputer dihubungkan, baik secara fisik maupun logis. Contohnya adalah topologi bus, star, ring, dan mesh.";
} else if (input.includes("subnetting adalah") || input.includes("apa itu subnetting")) {
    responseMessage = "Subnetting adalah proses membagi jaringan besar menjadi beberapa jaringan kecil (subnet) untuk meningkatkan efisiensi dan pengelolaan alamat IP dalam jaringan.";
} else if (input.includes("router adalah") || input.includes("apa itu router")) {
    responseMessage = "Router adalah perangkat jaringan yang menghubungkan beberapa jaringan dan mengarahkan lalu lintas data antar jaringan tersebut, serta memilih jalur terbaik untuk data yang dikirim.";
} else if (input.includes("switch adalah") || input.includes("apa itu switch")) {
    responseMessage = "Switch adalah perangkat jaringan yang digunakan untuk menghubungkan berbagai perangkat dalam satu jaringan lokal (LAN) dan mengirimkan data antar perangkat tersebut berdasarkan alamat MAC.";
} else if (input.includes("firewall adalah") || input.includes("apa itu firewall")) {
    responseMessage = "Firewall adalah sistem keamanan jaringan yang berfungsi untuk mengontrol akses data antara jaringan internal dan eksternal serta melindungi jaringan dari ancaman luar seperti hacker atau virus.";
} else if (input.includes("dns adalah") || input.includes("apa itu dns")) {
    responseMessage = "DNS (Domain Name System) adalah sistem yang digunakan untuk menerjemahkan nama domain (seperti www.contoh.com) menjadi alamat IP yang dapat dipahami oleh perangkat dalam jaringan.";
} else if (input.includes("ip address adalah") || input.includes("apa itu ip address")) {
    responseMessage = "IP address adalah alamat yang digunakan untuk mengidentifikasi perangkat dalam jaringan komputer. Ada dua jenis IP, yaitu IPv4 dan IPv6, yang digunakan untuk pengalamatan perangkat dalam jaringan.";
} else if (input.includes("vlan adalah") || input.includes("apa itu vlan")) {
    responseMessage = "VLAN (Virtual Local Area Network) adalah teknologi yang memungkinkan pemisahan perangkat dalam jaringan yang sama secara logis, meskipun perangkat tersebut berada pada topologi fisik yang sama.";
} else if (input.includes("dhcp adalah") || input.includes("apa itu dhcp")) {
    responseMessage = "DHCP (Dynamic Host Configuration Protocol) adalah protokol yang digunakan untuk memberikan alamat IP secara otomatis kepada perangkat yang terhubung ke jaringan, sehingga memudahkan pengelolaan jaringan.";
} else if (input.includes("bandwidth adalah") || input.includes("apa itu bandwidth")) {
    responseMessage = "Bandwidth adalah kapasitas maksimum yang dapat ditangani oleh sebuah jaringan dalam mentransfer data dalam satu waktu, biasanya diukur dalam bit per detik (bps).";
} else if (input.includes("latency adalah") || input.includes("apa itu latency")) {
    responseMessage = "Latency adalah waktu yang diperlukan untuk data berpindah dari satu titik ke titik lainnya dalam jaringan. Semakin rendah latency, semakin cepat respon jaringan.";
} else if (input.includes("cabling adalah") || input.includes("apa itu cabling")) {
    responseMessage = "Cabling adalah sistem pengkabelan yang digunakan dalam jaringan komputer untuk menghubungkan perangkat-perangkat seperti komputer, switch, router, dan server, menggunakan kabel seperti twisted pair atau fiber optic.";
} else if (input.includes("network monitoring adalah") || input.includes("apa itu network monitoring")) {
    responseMessage = "Network monitoring adalah proses pemantauan dan pengelolaan performa jaringan secara terus-menerus untuk mendeteksi gangguan, kesalahan, dan memastikan kinerja jaringan tetap optimal.";
} else if (input.includes("wi-fi adalah") || input.includes("apa itu wi-fi")) {
    responseMessage = "Wi-Fi adalah teknologi yang memungkinkan perangkat seperti komputer, smartphone, dan tablet untuk terhubung ke internet atau jaringan lokal menggunakan gelombang radio tanpa kabel fisik.";
} else if (input.includes("vpn adalah") || input.includes("apa itu vpn")) {
    responseMessage = "VPN (Virtual Private Network) adalah jaringan pribadi yang dibangun di atas jaringan publik (seperti internet) yang memungkinkan koneksi aman dan terenkripsi antara perangkat dan server.";
} else if (input.includes("proxy adalah") || input.includes("apa itu proxy")) {
    responseMessage = "Proxy adalah server perantara yang digunakan untuk mengakses sumber daya dari server lain, sering digunakan untuk menyembunyikan alamat IP asli atau untuk meningkatkan kinerja jaringan dengan caching.";
} else if (input.includes("routing adalah") || input.includes("apa itu routing")) {
    responseMessage = "Routing adalah proses pengiriman paket data melalui jaringan dengan memilih jalur yang paling efisien berdasarkan berbagai faktor, seperti topologi dan kondisi jaringan.";
} else if (input.includes("load balancing adalah") || input.includes("apa itu load balancing")) {
    responseMessage = "Load balancing adalah teknik distribusi beban kerja secara merata di antara beberapa server atau jalur untuk meningkatkan performa, mengurangi risiko downtime, dan memastikan sistem tetap responsif.";
} else if (input.includes("ethernet adalah") || input.includes("apa itu ethernet")) {
    responseMessage = "Ethernet adalah teknologi jaringan yang paling umum digunakan dalam jaringan lokal (LAN) untuk menghubungkan perangkat menggunakan kabel fisik, seperti kabel twisted pair atau fiber optic.";
} else if (input.includes("wi-fi 6 adalah") || input.includes("apa itu wi-fi 6")) {
    responseMessage = "Wi-Fi 6 adalah standar terbaru untuk jaringan Wi-Fi, menawarkan kecepatan lebih tinggi, kapasitas yang lebih baik, dan latensi lebih rendah dibandingkan dengan versi sebelumnya (Wi-Fi 5).";
}
else if (input.includes("ip statis adalah") || input.includes("apa itu ip statis")) {
    responseMessage = "IP statis adalah alamat IP yang ditetapkan secara permanen untuk perangkat dalam jaringan. Alamat ini tidak berubah, berbeda dengan IP dinamis yang diberikan oleh DHCP.";
} else if (input.includes("ip dinamis adalah") || input.includes("apa itu ip dinamis")) {
    responseMessage = "IP dinamis adalah alamat IP yang diberikan secara otomatis oleh DHCP setiap kali perangkat terhubung ke jaringan, dan alamat ini bisa berubah setiap kali perangkat tersebut terhubung kembali.";
} else if (input.includes("layer jaringan adalah") || input.includes("apa itu layer jaringan")) {
    responseMessage = "Layer jaringan adalah model yang digunakan untuk menggambarkan bagaimana komunikasi dan protokol bekerja di dalam jaringan komputer. Model OSI dan TCP/IP adalah dua model lapisan yang paling umum digunakan.";
} else if (input.includes("network interface card adalah") || input.includes("apa itu network interface card")) {
    responseMessage = "Network Interface Card (NIC) adalah perangkat keras yang memungkinkan komputer atau perangkat lain untuk terhubung ke jaringan menggunakan kabel atau Wi-Fi.";
} else if (input.includes("tunnel adalah") || input.includes("apa itu tunnel")) {
    responseMessage = "Tunnel adalah teknik dalam jaringan yang memungkinkan pengiriman data yang terenkripsi melalui jaringan publik, seperti VPN, untuk memastikan keamanan dan privasi data yang dikirim.";
} else if (input.includes("cable fiber optik adalah") || input.includes("apa itu cable fiber optik")) {
    responseMessage = "Kabel fiber optik adalah kabel yang menggunakan serat kaca atau plastik untuk mentransmisikan data dalam bentuk cahaya. Kabel ini lebih cepat dan lebih efisien dibandingkan kabel tembaga.";
} else if (input.includes("scalable network adalah") || input.includes("apa itu scalable network")) {
    responseMessage = "Scalable network adalah jaringan yang dapat berkembang dan menyesuaikan dengan kebutuhan tanpa mengorbankan performa atau keandalan, biasanya dengan menambahkan lebih banyak perangkat atau sumber daya.";
} else if (input.includes("lan adalah") || input.includes("apa itu lan")) {
    responseMessage = "LAN (Local Area Network) adalah jaringan komputer yang terbatas pada area geografis yang kecil, seperti rumah, kantor, atau sekolah, yang memungkinkan perangkat saling terhubung dan berbagi sumber daya.";
} else if (input.includes("wan adalah") || input.includes("apa itu wan")) {
    responseMessage = "WAN (Wide Area Network) adalah jaringan yang mencakup area geografis yang lebih luas, seperti kota, negara, atau bahkan lintas negara, dan menghubungkan berbagai LAN menggunakan teknologi seperti leased lines atau internet.";
} else if (input.includes("man adalah") || input.includes("apa itu man")) {
    responseMessage = "MAN (Metropolitan Area Network) adalah jaringan komputer yang mencakup area lebih luas daripada LAN tetapi lebih kecil dari WAN, biasanya digunakan di kota besar atau kampus universitas.";
} else if (input.includes("vpn site-to-site adalah") || input.includes("apa itu vpn site-to-site")) {
    responseMessage = "VPN Site-to-Site adalah jenis VPN yang menghubungkan dua jaringan lokal di lokasi berbeda, memungkinkan komunikasi yang aman antar situs atau kantor jarak jauh.";
} else if (input.includes("vpn client-to-site adalah") || input.includes("apa itu vpn client-to-site")) {
    responseMessage = "VPN Client-to-Site adalah jenis VPN yang memungkinkan perangkat individual, seperti laptop atau smartphone, untuk terhubung ke jaringan lokal dari lokasi yang jauh dengan menggunakan koneksi terenkripsi.";
} else if (input.includes("gateway adalah") || input.includes("apa itu gateway")) {
    responseMessage = "Gateway adalah perangkat jaringan yang berfungsi untuk menghubungkan dua jaringan yang menggunakan protokol berbeda, sehingga memungkinkan pertukaran data antar jaringan tersebut.";
} else if (input.includes("network topology adalah") || input.includes("apa itu network topology")) {
    responseMessage = "Network topology adalah cara pengaturan perangkat dalam jaringan, baik dalam pengaturan fisik atau logis. Ini menentukan bagaimana perangkat terhubung satu sama lain dan mempengaruhi performa serta keandalan jaringan.";
} else if (input.includes("proxy server adalah") || input.includes("apa itu proxy server")) {
    responseMessage = "Proxy server adalah server yang bertindak sebagai perantara antara perangkat pengguna dan server lain yang ingin diakses. Proxy sering digunakan untuk meningkatkan keamanan dan mengurangi beban pada server utama.";
} else if (input.includes("ipsec adalah") || input.includes("apa itu ipsec")) {
    responseMessage = "IPsec (Internet Protocol Security) adalah protokol keamanan yang digunakan untuk mengenkripsi dan memverifikasi data yang dikirim melalui jaringan IP, sering digunakan dalam VPN untuk melindungi komunikasi data.";
} else if (input.includes("load balancer adalah") || input.includes("apa itu load balancer")) {
    responseMessage = "Load balancer adalah perangkat atau teknik yang digunakan untuk mendistribusikan lalu lintas jaringan atau aplikasi ke beberapa server untuk memastikan kinerja yang optimal dan mencegah server overload.";
} else if (input.includes("data center adalah") || input.includes("apa itu data center")) {
    responseMessage = "Data center adalah fasilitas yang digunakan untuk menampung server, perangkat penyimpanan data, dan perangkat jaringan lainnya yang mendukung operasi dan layanan IT dalam sebuah organisasi atau perusahaan.";
} else if (input.includes("ip routing adalah") || input.includes("apa itu ip routing")) {
    responseMessage = "IP Routing adalah proses memilih jalur terbaik untuk mengirimkan paket data melalui jaringan berbasis IP. Routing dapat dilakukan oleh router menggunakan protokol routing tertentu.";
} else if (input.includes("bandwidth management adalah") || input.includes("apa itu bandwidth management")) {
    responseMessage = "Bandwidth management adalah proses pengelolaan penggunaan bandwidth dalam jaringan untuk memastikan penggunaan sumber daya jaringan secara efisien, termasuk pengaturan prioritas untuk aplikasi atau perangkat tertentu.";
} else if (input.includes("network security adalah") || input.includes("apa itu network security")) {
    responseMessage = "Network security adalah serangkaian kebijakan, prosedur, dan teknologi yang dirancang untuk melindungi jaringan komputer dari ancaman yang dapat merusak integritas, kerahasiaan, dan ketersediaan data dan sistem.";
} else if (input.includes("ethereal adalah") || input.includes("apa itu ethereal")) {
    responseMessage = "Ethereal adalah alat perangkat lunak (sekarang dikenal sebagai Wireshark) yang digunakan untuk menganalisis lalu lintas jaringan secara real-time untuk tujuan diagnostik dan pengujian keamanan jaringan.";
} else if (input.includes("sangfor adalah") || input.includes("apa itu sangfor")) {
    responseMessage = "Sangfor adalah penyedia solusi keamanan dan jaringan yang menawarkan berbagai produk untuk memperkuat keamanan jaringan, mengoptimalkan kinerja, dan mengelola sumber daya IT di perusahaan atau organisasi.";
}
else if (input.includes("apa itu tauhid") || input.includes("tauhid adalah")) {
    responseMessage = "Tauhid adalah keyakinan dan pengakuan bahwa Allah SWT adalah Tuhan yang Maha Esa, tidak ada sekutu bagi-Nya dalam segala aspek kehidupan.";
} else if (input.includes("syahadat adalah") || input.includes("apa itu syahadat")) {
    responseMessage = "Syahadat adalah dua kalimat yang menyatakan keimanan seseorang kepada Allah SWT dan Nabi Muhammad SAW, yaitu 'Asyhadu alla ilaha illallah wahdahu la sharika lahu wa asyhadu anna Muhammadan abduhoo wa rasuluh'.";
} else if (input.includes("rukun iman adalah") || input.includes("apa itu rukun iman")) {
    responseMessage = "Rukun iman adalah enam pokok ajaran dalam agama Islam yang harus diyakini oleh setiap Muslim, yaitu iman kepada Allah, malaikat, kitab-kitab Allah, rasul-rasul Allah, hari kiamat, dan takdir Allah.";
} else if (input.includes("rukun islam adalah") || input.includes("apa itu rukun islam")) {
    responseMessage = "Rukun Islam adalah lima pokok ajaran yang menjadi dasar pelaksanaan ibadah dalam agama Islam, yaitu mengucapkan syahadat, mendirikan shalat, berpuasa di bulan Ramadan, menunaikan zakat, dan menunaikan haji bagi yang mampu.";
} else if (input.includes("sholat adalah") || input.includes("apa itu sholat")) {
    responseMessage = "Sholat adalah ibadah yang dilakukan oleh umat Islam dengan cara tertentu dan dalam waktu yang telah ditentukan. Sholat merupakan tiang agama yang wajib dilakukan lima kali sehari.";
} else if (input.includes("puasa adalah") || input.includes("apa itu puasa")) {
    responseMessage = "Puasa adalah ibadah yang dilakukan dengan menahan makan, minum, dan segala sesuatu yang membatalkan puasa sejak terbit fajar hingga terbenam matahari, khususnya pada bulan Ramadan.";
} else if (input.includes("zakat adalah") || input.includes("apa itu zakat")) {
    responseMessage = "Zakat adalah sebagian harta yang wajib dikeluarkan oleh umat Islam untuk diberikan kepada orang yang berhak menerimanya, seperti fakir miskin, anak yatim, dan lain-lain, sebagai bentuk kepedulian sosial.";
} else if (input.includes("haji adalah") || input.includes("apa itu haji")) {
    responseMessage = "Haji adalah ibadah yang dilakukan dengan cara melakukan perjalanan ke Mekkah pada waktu tertentu untuk melaksanakan serangkaian ritual yang ditentukan oleh agama Islam. Haji merupakan kewajiban bagi umat Islam yang mampu melaksanakannya.";
} else if (input.includes("akhlak adalah") || input.includes("apa itu akhlak")) {
    responseMessage = "Akhlak adalah perilaku atau budi pekerti yang baik yang diajarkan dalam agama Islam. Akhlak mulia sangat penting dalam kehidupan sehari-hari untuk menjaga hubungan baik dengan Allah dan sesama manusia.";
} else if (input.includes("alqur'an adalah") || input.includes("apa itu alqur'an")) {
    responseMessage = "Al-Qur'an adalah kitab suci umat Islam yang diwahyukan kepada Nabi Muhammad SAW sebagai petunjuk hidup dan sumber hukum. Al-Qur'an berisi wahyu Allah yang diturunkan melalui malaikat Jibril.";
} else if (input.includes("hadist adalah") || input.includes("apa itu hadist")) {
    responseMessage = "Hadist adalah segala perkataan, perbuatan, dan ketetapan yang dilakukan oleh Nabi Muhammad SAW yang menjadi pedoman hidup umat Islam, selain Al-Qur'an.";
} else if (input.includes("ilmu fiqh adalah") || input.includes("apa itu ilmu fiqh")) {
    responseMessage = "Ilmu fiqh adalah ilmu yang mempelajari tentang hukum-hukum Islam yang bersifat praktis, seperti hukum ibadah, muamalah, dan lainnya, yang didasarkan pada Al-Qur'an dan hadist.";
} else if (input.includes("ibadah mahdah adalah") || input.includes("apa itu ibadah mahdah")) {
    responseMessage = "Ibadah mahdah adalah ibadah yang ditentukan bentuk, waktu, dan tata caranya secara jelas dalam syariat Islam, seperti sholat, zakat, puasa, dan haji.";
} else if (input.includes("ibadah ghairu mahdah adalah") || input.includes("apa itu ibadah ghairu mahdah")) {
    responseMessage = "Ibadah ghairu mahdah adalah ibadah yang tidak memiliki ketentuan yang tetap dalam bentuk, waktu, dan tata caranya, melainkan dapat dilakukan dengan cara yang lebih fleksibel, seperti bekerja dan berbuat baik kepada sesama.";
} else if (input.includes("halal adalah") || input.includes("apa itu halal")) {
    responseMessage = "Halal adalah segala sesuatu yang diizinkan oleh Allah SWT untuk dilakukan atau dikonsumsi menurut syariat Islam. Contoh makanan halal adalah yang tidak mengandung unsur haram atau najis.";
} else if (input.includes("haram adalah") || input.includes("apa itu haram")) {
    responseMessage = "Haram adalah segala sesuatu yang dilarang oleh Allah SWT dan Rasul-Nya dalam agama Islam. Misalnya, makan daging babi atau minum alkohol.";
} else if (input.includes("makruh adalah") || input.includes("apa itu makruh")) {
    responseMessage = "Makruh adalah hal-hal yang tidak dianjurkan dalam agama Islam, namun jika dilakukan tidak mendapat dosa. Misalnya, makan berlebihan atau berbicara dengan nada tinggi.";
} else if (input.includes("wajib adalah") || input.includes("apa itu wajib")) {
    responseMessage = "Wajib adalah segala sesuatu yang harus dilakukan oleh umat Islam. Jika ditinggalkan tanpa alasan yang dibenarkan, maka akan mendapatkan dosa. Misalnya, sholat lima waktu adalah wajib.";
} else if (input.includes("sunnah adalah") || input.includes("apa itu sunnah")) {
    responseMessage = "Sunnah adalah tindakan atau perkataan yang dilakukan oleh Nabi Muhammad SAW dan dijadikan contoh bagi umat Islam untuk diikuti. Melaksanakan sunnah mendapatkan pahala, tetapi meninggalkannya tidak berdosa.";
} else if (input.includes("doa adalah") || input.includes("apa itu doa")) {
    responseMessage = "Doa adalah permohonan atau permintaan kepada Allah SWT yang dilakukan dengan hati yang ikhlas, baik untuk kebaikan diri sendiri maupun untuk orang lain.";
} else if (input.includes("sirah nabawiyah adalah") || input.includes("apa itu sirah nabawiyah")) {
    responseMessage = "Sirah Nabawiyah adalah sejarah kehidupan Nabi Muhammad SAW, yang mencakup perjalanan hidup, dakwah, perjuangan, dan perjuangan beliau dalam menyebarkan agama Islam.";
}
else if (input.includes("apa itu zakat fitrah") || input.includes("zakat fitrah adalah")) {
    responseMessage = "Zakat fitrah adalah zakat yang wajib dikeluarkan oleh setiap Muslim pada bulan Ramadan menjelang Idul Fitri. Zakat ini bertujuan untuk membersihkan harta dan diri dari hal-hal yang kurang baik, serta membantu orang yang membutuhkan.";
} else if (input.includes("apa itu zakat mal") || input.includes("zakat mal adalah")) {
    responseMessage = "Zakat mal adalah zakat yang dikeluarkan atas harta kekayaan yang dimiliki oleh seorang Muslim, seperti uang, emas, perak, dan hasil pertanian. Zakat ini wajib dikeluarkan setiap tahun jika mencapai nisab tertentu.";
} else if (input.includes("apa itu jihad") || input.includes("jihad adalah")) {
    responseMessage = "Jihad adalah perjuangan atau usaha keras dalam mencapai tujuan yang baik, baik dalam bentuk perjuangan fisik di jalan Allah (seperti perang melawan ketidakadilan), maupun perjuangan non-fisik seperti berbuat baik dan menyebarkan kebaikan.";
} else if (input.includes("apa itu amar ma'ruf nahi munkar") || input.includes("amar ma'ruf nahi munkar adalah")) {
    responseMessage = "Amar ma'ruf nahi munkar adalah perintah untuk menyuruh orang berbuat baik (amar ma'ruf) dan melarang mereka dari perbuatan buruk (nahi munkar). Prinsip ini menjadi dasar dalam menjaga kebaikan dan mencegah kemungkaran dalam masyarakat.";
} else if (input.includes("apa itu qadar") || input.includes("qadar adalah")) {
    responseMessage = "Qadar adalah takdir atau ketentuan Allah yang telah ditentukan untuk setiap makhluk-Nya. Sebagai umat Islam, kita diwajibkan untuk percaya pada takdir baik maupun buruk dan menerima setiap ketentuan-Nya dengan lapang dada.";
} else if (input.includes("apa itu halalnya makanan") || input.includes("makanan halal adalah")) {
    responseMessage = "Makanan halal adalah makanan yang diperbolehkan untuk dikonsumsi menurut hukum Islam. Makanan ini tidak mengandung bahan yang haram, seperti babi, alkohol, atau bahan-bahan yang tidak diolah sesuai dengan syariat Islam.";
} else if (input.includes("apa itu haramnya makanan") || input.includes("makanan haram adalah")) {
    responseMessage = "Makanan haram adalah makanan yang dilarang dalam Islam karena mengandung bahan yang tidak diperbolehkan, seperti daging babi, alkohol, atau makanan yang tidak disembelih sesuai dengan aturan Islam.";
} else if (input.includes("hukum puasa ramadhan") || input.includes("puasa ramadhan adalah")) {
    responseMessage = "Puasa Ramadan adalah ibadah yang wajib dilakukan oleh umat Islam pada bulan Ramadan. Puasa ini dilakukan dengan menahan makan, minum, dan hal-hal yang membatalkan puasa dari fajar hingga terbenam matahari sebagai bentuk pengabdian kepada Allah.";
} else if (input.includes("hal yang membatalkan puasa") || input.includes("apa yang membatalkan puasa")) {
    responseMessage = "Hal-hal yang membatalkan puasa antara lain makan, minum, bersetubuh, muntah dengan sengaja, serta hal-hal lain yang menghilangkan niat puasa. Oleh karena itu, umat Islam harus berhati-hati agar puasanya sah dan diterima oleh Allah.";
} else if (input.includes("nabi muhammad saw adalah") || input.includes("siapa nabi muhammad saw")) {
    responseMessage = "Nabi Muhammad SAW adalah rasul terakhir yang diutus oleh Allah untuk menyampaikan wahyu dan petunjuk hidup bagi umat manusia. Beliau adalah teladan terbaik dalam kehidupan, baik dalam aspek agama, sosial, maupun moral.";
} else if (input.includes("hari kiamat adalah") || input.includes("apa itu hari kiamat")) {
    responseMessage = "Hari kiamat adalah hari pembalasan bagi setiap amal perbuatan yang dilakukan oleh umat manusia. Pada hari itu, setiap amal baik atau buruk akan diperhitungkan, dan setiap orang akan mendapatkan ganjaran sesuai dengan amalnya.";
} else if (input.includes("apa itu salat jamaah") || input.includes("salat jamaah adalah")) {
    responseMessage = "Salat jamaah adalah salat yang dilakukan bersama-sama di masjid atau tempat lain. Melakukan salat jamaah lebih utama dibandingkan salat sendiri, karena memiliki pahala yang lebih besar.";
} else if (input.includes("apa itu maulid nabi") || input.includes("maulid nabi adalah")) {
    responseMessage = "Maulid Nabi adalah perayaan yang dilakukan untuk memperingati kelahiran Nabi Muhammad SAW. Perayaan ini biasanya dilakukan dengan membaca sholawat dan doa untuk menghormati Nabi Muhammad SAW.";
} else if (input.includes("hukum sholat berjamaah") || input.includes("sholat berjamaah adalah")) {
    responseMessage = "Sholat berjamaah adalah sholat yang dilakukan bersama-sama dengan jamaah. Sholat berjamaah sangat dianjurkan dalam Islam karena memiliki keutamaan yang lebih besar dibandingkan dengan sholat sendirian.";
} else if (input.includes("apa itu zakat profesi") || input.includes("zakat profesi adalah")) {
    responseMessage = "Zakat profesi adalah zakat yang dikeluarkan dari penghasilan atau pendapatan yang diperoleh seorang Muslim dari pekerjaannya, seperti gaji, honor, atau hasil profesi lainnya.";
}
else if (input.includes("kenapa langit berwarna biru") || input.includes("mengapa langit biru")) {
    responseMessage = "Langit terlihat biru karena cahaya matahari yang masuk ke atmosfer bumi tersebar oleh molekul udara. Cahaya biru memiliki panjang gelombang yang lebih pendek, sehingga lebih mudah tersebar dan membuat langit tampak biru.";
} else if (input.includes("berapa banyak bintang di langit") || input.includes("bintang di langit") || input.includes("bintang ada berapa")) {
    responseMessage = "Jumlah bintang di langit sangat banyak, bahkan tak terhitung. Ada miliaran bintang di galaksi Bima Sakti saja, dan di seluruh alam semesta ada lebih dari triliunan galaksi yang masing-masing mengandung miliaran bintang.";
} else if (input.includes("kenapa kucing suka tidur") || input.includes("kucing kenapa suka tidur")) {
    responseMessage = "Kucing tidur banyak karena mereka adalah hewan predator yang membutuhkan banyak energi untuk berburu (meski kucing peliharaan tidak berburu). Tidur membantu mereka menghemat energi dan menjaga kesehatan.";
} else if (input.includes("kenapa kita harus tidur") || input.includes("apa pentingnya tidur")) {
    responseMessage = "Tidur sangat penting untuk tubuh kita karena saat tidur tubuh memperbaiki sel-sel yang rusak, memperkuat sistem kekebalan tubuh, dan mengatur fungsi otak. Tanpa tidur yang cukup, kita bisa merasa lelah dan kurang fokus.";
} else if (input.includes("apa yang terjadi kalau manusia tidak tidur") || input.includes("tidak tidur seharian") || input.includes("efek tidak tidur")) {
    responseMessage = "Jika tidak tidur, tubuh dan otak kita akan kelelahan. Efek jangka panjang bisa menyebabkan gangguan kesehatan mental dan fisik, seperti penurunan konsentrasi, daya ingat, dan sistem kekebalan tubuh yang lemah.";
} else if (input.includes("apa yang lebih dulu, ayam atau telur") || input.includes("ayam atau telur yang pertama")) {
    responseMessage = "Pertanyaan klasik ini masih diperdebatkan. Secara ilmiah, jawabannya adalah telur. Telur pertama kali muncul dalam spesies yang lebih tua, yang kemudian berkembang menjadi ayam lewat proses evolusi.";
} else if (input.includes("kenapa air laut asin") || input.includes("air laut kenapa asin")) {
    responseMessage = "Air laut asin karena mengandung garam, terutama natrium klorida (NaCl), yang berasal dari proses pelarutan batuan di daratan dan mengalir ke laut melalui sungai-sungai selama jutaan tahun.";
} else if (input.includes("kenapa bisa hujan") || input.includes("hujan itu apa") || input.includes("kenapa hujan turun")) {
    responseMessage = "Hujan terjadi ketika uap air yang terkumpul di atmosfer mengalami kondensasi dan membentuk tetesan air. Tetesan tersebut menjadi cukup berat untuk jatuh ke bumi sebagai hujan.";
} else if (input.includes("apa yang terjadi kalau bumi berhenti berputar") || input.includes("bumi berhenti berputar") || input.includes("apa akibatnya bumi berhenti berputar")) {
    responseMessage = "Jika bumi berhenti berputar secara tiba-tiba, akan terjadi dampak yang sangat besar. Semua objek yang ada di bumi, termasuk laut, akan terus bergerak karena adanya gaya inersia, yang mengakibatkan bencana besar seperti tsunami dan gempa bumi.";
} else if (input.includes("kenapa kopi bisa bikin melek") || input.includes("kenapa kopi bikin semangat")) {
    responseMessage = "Kopi mengandung kafein yang berfungsi sebagai stimulan. Kafein dapat meningkatkan aktivitas sistem saraf pusat, meningkatkan kewaspadaan, dan mengurangi rasa kantuk.";
} else if (input.includes("apa yang lebih cepat, internet atau cahaya") || input.includes("cahaya atau internet lebih cepat")) {
    responseMessage = "Cahaya lebih cepat dari internet. Cahaya bergerak dengan kecepatan sekitar 300.000 km per detik, sedangkan kecepatan internet bervariasi tergantung pada teknologi dan jaringan yang digunakan.";
} else if (input.includes("kenapa rokok berbahaya") || input.includes("rokok itu bahaya apa") || input.includes("kenapa rokok harus dihindari")) {
    responseMessage = "Rokok berbahaya karena mengandung zat beracun, seperti nikotin dan tar, yang dapat merusak paru-paru dan meningkatkan risiko penyakit jantung, kanker, dan gangguan pernapasan.";
} else if (input.includes("kenapa bumi bulat") || input.includes("bumi kenapa bulat")) {
    responseMessage = "Bumi bulat karena gaya gravitasi yang menarik segala materi ke pusatnya, sehingga terbentuk bentuk bola atau geoid. Meskipun tidak sempurna, Bumi cenderung berbentuk bulat.";
} else if (input.includes("kenapa suara bisa bergema") || input.includes("suara kenapa bergema")) {
    responseMessage = "Suara bergema karena gelombang suara memantul dari permukaan keras, seperti dinding atau gunung, dan kembali ke telinga kita. Hal ini terjadi di tempat yang memiliki permukaan yang dapat memantulkan suara dengan baik.";
}
else if (input.includes("kenapa langit bisa berubah warna") || input.includes("langit berubah warna kenapa")) {
    responseMessage = "Langit berubah warna karena fenomena pencahayaan yang dipengaruhi oleh posisi matahari dan partikel-partikel di atmosfer. Misalnya, saat matahari terbenam, cahaya merah dan oranye lebih dominan karena panjang gelombangnya yang lebih panjang.";
} else if (input.includes("kenapa kucing selalu minta makanan") || input.includes("kucing kenapa suka minta makan")) {
    responseMessage = "Kucing suka minta makanan karena mereka adalah hewan pemangsa yang memiliki insting makan yang kuat. Bahkan jika mereka kenyang, mereka tetap suka meminta makanan, karena itu adalah bagian dari naluri mereka.";
} else if (input.includes("kenapa manusia bisa tertawa") || input.includes("tertawa kenapa bisa terjadi")) {
    responseMessage = "Manusia tertawa karena tertawa adalah reaksi alami tubuh terhadap stimulus yang dianggap menyenangkan atau lucu. Proses ini melibatkan otak, otot, dan sistem saraf yang memberikan perasaan bahagia atau relaksasi.";
} else if (input.includes("kenapa air laut bisa asin") || input.includes("laut kenapa asin")) {
    responseMessage = "Air laut asin karena mengandung banyak garam, terutama natrium klorida, yang berasal dari batuan yang terkikis oleh air hujan dan mengalir ke laut. Proses ini berlangsung selama ribuan tahun, menyebabkan konsentrasi garam yang tinggi di laut.";
} else if (input.includes("kenapa es bisa mencair") || input.includes("es kenapa mencair")) {
    responseMessage = "Es mencair karena suhu di sekitarnya lebih tinggi dari titik beku es. Ketika suhu naik, molekul-molekul es bergerak lebih cepat dan akhirnya berubah menjadi air cair.";
} else if (input.includes("kenapa kita tidak bisa melihat udara") || input.includes("udara kenapa tidak kelihatan")) {
    responseMessage = "Udara tidak terlihat karena partikel-partikelnya sangat kecil dan tersebar rata. Molekul udara tidak menyerap atau memantulkan cahaya dengan cara yang memungkinkan kita melihatnya secara langsung.";
} else if (input.includes("kenapa kita bisa mendengar suara") || input.includes("suara kenapa bisa didengar")) {
    responseMessage = "Kita bisa mendengar suara karena gelombang suara merambat melalui medium seperti udara dan kemudian diterima oleh telinga. Gelombang suara ini diubah menjadi impuls listrik oleh telinga dan dikirim ke otak untuk diproses sebagai suara.";
} else if (input.includes("kenapa bulan bisa bercahaya") || input.includes("bulan kenapa bersinar")) {
    responseMessage = "Bulan tidak memproduksi cahaya sendiri. Cahaya yang kita lihat berasal dari sinar matahari yang dipantulkan oleh permukaan bulan. Itulah sebabnya bulan terlihat bersinar, terutama saat malam hari.";
} else if (input.includes("kenapa mobil bisa jalan") || input.includes("mobil kenapa bisa bergerak")) {
    responseMessage = "Mobil bisa bergerak berkat mesin yang mengubah energi bahan bakar menjadi tenaga gerak. Tenaga ini disalurkan ke roda mobil melalui sistem transmisi dan penggerak roda, yang akhirnya membuat mobil berjalan.";
} else if (input.includes("kenapa kita harus belajar") || input.includes("belajar kenapa penting")) {
    responseMessage = "Belajar itu penting karena melalui belajar, kita dapat memperoleh pengetahuan dan keterampilan baru. Ini membantu kita untuk berkembang dan menghadapi tantangan hidup dengan lebih baik serta mencapai tujuan hidup yang diinginkan.";
} else if (input.includes("kenapa kopi bisa bikin ngantuk") || input.includes("kopi kenapa bisa bikin semangat")) {
    responseMessage = "Kopi mengandung kafein yang merangsang sistem saraf pusat, meningkatkan kewaspadaan, dan mengurangi rasa kantuk. Efek ini muncul karena kafein menghambat adenosin, yaitu senyawa yang membuat kita merasa mengantuk.";
} else if (input.includes("kenapa kita bisa bermimpi") || input.includes("mimpi kenapa bisa terjadi")) {
    responseMessage = "Mimpi terjadi karena otak kita masih aktif saat tidur. Proses ini melibatkan memori, emosi, dan pemikiran yang tercampur, yang kemudian muncul dalam bentuk gambaran atau cerita saat kita tidur.";
} else if (input.includes("kenapa kita bisa merasakan rasa") || input.includes("rasa kenapa bisa dirasakan")) {
    responseMessage = "Rasa dirasakan berkat indera perasa di lidah kita yang dapat mendeteksi lima rasa dasar: manis, asam, pahit, asin, dan umami. Sinyal rasa ini diteruskan ke otak untuk diproses dan memberi kita sensasi rasa.";
} else if (input.includes("kenapa ada musim") || input.includes("musim kenapa bisa terjadi")) {
    responseMessage = "Musim terjadi karena adanya kemiringan sumbu bumi yang menyebabkan perbedaan intensitas cahaya matahari di berbagai belahan dunia. Hal ini menyebabkan perubahan suhu dan kondisi cuaca yang kita kenal sebagai musim.";
} else if (input.includes("kenapa kita harus minum air putih") || input.includes("air putih kenapa penting")) {
    responseMessage = "Air putih sangat penting karena tubuh kita membutuhkan cairan untuk menjaga keseimbangan tubuh, membantu proses pencernaan, dan mendukung fungsi organ tubuh. Tanpa cukup air, tubuh bisa dehidrasi dan menurunkan kinerjanya.";
} else if (input.includes("kenapa bumi bulat") || input.includes("bumi kenapa berbentuk bulat")) {
    responseMessage = "Bumi berbentuk bulat karena adanya gaya gravitasi yang menarik benda-benda menuju pusat bumi. Proses ini menghasilkan bentuk bola, meskipun tidak sempurna, karena rotasi bumi membuatnya sedikit gepeng di kutub.";
} else if (input.includes("kenapa binatang bisa berbunyi") || input.includes("binatang kenapa bisa bersuara")) {
    responseMessage = "Binatang bisa berbunyi karena mereka memiliki alat vokal seperti pita suara yang berfungsi untuk menghasilkan suara. Suara ini digunakan untuk berkomunikasi dengan sesama spesies atau untuk menarik perhatian.";
} else if (input.includes("kenapa ada tsunami") || input.includes("tsunami kenapa bisa terjadi")) {
    responseMessage = "Tsunami terjadi akibat pergeseran lempeng bumi yang menghasilkan gelombang besar di laut. Gelombang ini kemudian bergerak menuju pantai dan dapat menyebabkan kerusakan besar jika terjadi di dekat pemukiman.";
} else if (input.includes("kenapa kita bisa takut") || input.includes("takut kenapa bisa terjadi")) {
    responseMessage = "Rasa takut terjadi karena otak kita mendeteksi adanya ancaman atau bahaya. Reaksi ini merangsang sistem saraf kita untuk mempersiapkan tubuh menghadapi bahaya, baik dengan melawan atau melarikan diri.";
} 
else if (input.includes("kenapa jari bisa terpotong") || input.includes("jari kenapa bisa terluka")) {
    responseMessage = "Jari bisa terpotong karena kecelakaan atau cedera yang menyebabkan benda tajam atau keras melukai kulit dan jaringan di sekitarnya. Ini bisa terjadi saat tidak hati-hati atau tidak fokus saat menggunakan alat tajam.";
} else if (input.includes("kenapa kita bisa cegukan") || input.includes("cegukan kenapa terjadi")) {
    responseMessage = "Cegukan terjadi karena kontraksi tak terkendali pada diafragma, yang disertai dengan penutupan cepat pita suara. Biasanya, cegukan dipicu oleh makan terlalu cepat, stres, atau terlalu banyak makan atau minum.";
} else if (input.includes("kenapa ada bulan purnama") || input.includes("bulan purnama kenapa bisa terjadi")) {
    responseMessage = "Bulan purnama terjadi ketika posisi bulan, bumi, dan matahari sejajar, dengan bumi berada di antara bulan dan matahari. Ini menyebabkan seluruh permukaan bulan yang menghadap bumi terlihat terang.";
} else if (input.includes("kenapa manusia bisa merasakan sakit") || input.includes("sakit kenapa bisa dirasakan manusia")) {
    responseMessage = "Manusia bisa merasakan sakit karena adanya rangsangan pada saraf yang mengirimkan sinyal ke otak. Otak kemudian memproses sinyal ini dan memberi kita perasaan sakit sebagai peringatan bahwa ada sesuatu yang tidak beres di tubuh.";
} else if (input.includes("kenapa kita bisa tidur") || input.includes("tidur kenapa bisa terjadi")) {
    responseMessage = "Tidur adalah proses alami tubuh untuk memulihkan energi dan memperbaiki sel-sel yang rusak. Proses tidur dipicu oleh ritme tubuh dan hormon tertentu yang memberi sinyal bahwa tubuh perlu istirahat.";
} else if (input.includes("kenapa layar hp bisa retak") || input.includes("hp kenapa bisa retak")) {
    responseMessage = "Layar HP bisa retak karena terkena benturan atau tekanan dari benda keras. Layar kaca ponsel, meskipun tahan lama, tetap rentan terhadap kerusakan fisik jika terjatuh atau terkena benda tajam.";
} else if (input.includes("kenapa laut berombak") || input.includes("ombak kenapa ada di laut")) {
    responseMessage = "Ombak di laut terjadi karena pengaruh angin yang meniup permukaan air laut. Semakin kencang angin, semakin besar ombak yang terbentuk. Selain itu, faktor gravitasi bulan juga dapat mempengaruhi tinggi rendahnya ombak laut.";
} else if (input.includes("kenapa ada malam dan siang") || input.includes("malam dan siang kenapa ada")) {
    responseMessage = "Malam dan siang terjadi karena rotasi bumi pada porosnya. Saat bumi berputar, bagian yang menghadap matahari mengalami siang, sementara bagian yang terhalang oleh bumi mengalami malam.";
} else if (input.includes("kenapa bintang bisa berkedip") || input.includes("bintang kenapa berkedip")) {
    responseMessage = "Bintang terlihat berkedip karena atmosfer bumi yang mengubah jalur cahaya bintang yang datang ke mata kita. Perubahan suhu dan pergerakan udara menyebabkan efek kedipan tersebut.";
} else if (input.includes("kenapa manusia perlu tidur") || input.includes("tidur kenapa perlu")) {
    responseMessage = "Tidur penting karena membantu tubuh memperbaiki jaringan, menyimpan memori, dan mengatur fungsi tubuh seperti metabolisme dan sistem kekebalan tubuh. Tanpa tidur yang cukup, tubuh kita tidak bisa berfungsi optimal.";
} else if (input.includes("kenapa bisa ada pelangi") || input.includes("pelangi kenapa muncul")) {
    responseMessage = "Pelangi terjadi karena cahaya matahari dibiaskan oleh tetesan air di udara, membentuk spektrum warna yang terlihat seperti lengkungan warna-warni. Ini terjadi setelah hujan dan saat matahari bersinar di langit.";
} else if (input.includes("kenapa kita harus berolahraga") || input.includes("olahraga kenapa penting")) {
    responseMessage = "Olahraga penting karena membantu menjaga kesehatan tubuh, meningkatkan kebugaran, serta mencegah berbagai penyakit. Selain itu, olahraga juga bisa meningkatkan mood dan mengurangi stres.";
} else if (input.includes("kenapa mobil bisa berfungsi") || input.includes("mobil kenapa bisa berjalan")) {
    responseMessage = "Mobil berfungsi karena mesin yang mengubah energi bahan bakar menjadi tenaga gerak. Tenaga ini kemudian disalurkan ke roda untuk membuat mobil bergerak, memindahkan kendaraan ke tempat yang diinginkan.";
} else if (input.includes("kenapa orang bisa bercinta") || input.includes("cinta kenapa ada pada manusia")) {
    responseMessage = "Cinta adalah perasaan alami yang timbul karena faktor biologis dan emosional, yang memungkinkan hubungan antara individu. Perasaan cinta dapat mempererat ikatan antara manusia dalam hubungan sosial atau romantis.";
} else if (input.includes("kenapa ayam bisa bertelur") || input.includes("ayam kenapa bisa bertelur")) {
    responseMessage = "Ayam betina bertelur sebagai bagian dari siklus reproduksi. Telur yang dihasilkan mengandung sel telur yang bisa dibuahi oleh ayam jantan untuk berkembang menjadi anak ayam.";
} else if (input.includes("kenapa kita bisa melihat") || input.includes("melihat kenapa bisa terjadi")) {
    responseMessage = "Kita bisa melihat karena mata kita dapat mendeteksi cahaya yang dipantulkan oleh objek. Cahayanya masuk ke mata dan difokuskan oleh lensa mata ke retina, yang kemudian diterjemahkan oleh otak sebagai gambaran visual.";
} else if (input.includes("kenapa ada petir") || input.includes("petir kenapa bisa terjadi")) {
    responseMessage = "Petir terjadi karena adanya perbedaan muatan listrik di dalam awan dan permukaan bumi. Ketika muatan ini sangat besar, terjadi pelepasan energi dalam bentuk petir yang menyambar dan mengeluarkan cahaya terang.";
} else if (input.includes("kenapa burung bisa terbang") || input.includes("burung kenapa bisa terbang")) {
    responseMessage = "Burung bisa terbang karena memiliki sayap dan tubuh yang ringan. Sayap burung membantu menciptakan gaya angkat yang memungkinkan mereka terbang di udara.";
} else if (input.includes("kenapa es bisa membeku") || input.includes("es kenapa bisa beku")) {
    responseMessage = "Es terbentuk ketika air didinginkan hingga mencapai titik beku, 0°C. Pada suhu tersebut, molekul air bergerak lebih lambat dan saling bergabung membentuk kristal padat yang kita kenal sebagai es.";
}
else if (input.includes("apakah kamu punya suami") || input.includes("kamu sudah menikah")) {
    responseMessage = "Saya tidak bisa menikah atau memiliki suami, karena saya hanya sebuah program AI. Tapi terima kasih sudah bertanya!";
} else if (input.includes("apakah kamu mau jadi pacarku") || input.includes("jadi pacarku dong")) {
    responseMessage = "Haha, saya tidak bisa menjalin hubungan pacaran, tapi saya senang bisa membantu kamu kapan saja!";
} else if (input.includes("kamu suka siapa") || input.includes("siapa yang kamu suka")) {
    responseMessage = "Saya suka semua orang yang mengajak ngobrol dan memberikan pertanyaan yang menarik! Tapi saya nggak bisa naksir siapa-siapa sih, saya kan AI!";
} else if (input.includes("mau jalan-jalan bareng nggak") || input.includes("gimana kalau kita hangout bareng")) {
    responseMessage = "Wah, seru tuh! Tapi saya nggak bisa jalan-jalan karena saya ada di sini, hanya dalam bentuk teks. Tapi saya bisa bantu kamu cari tempat hangout yang seru, lho!";
} else if (input.includes("kamu ada pacar nggak") || input.includes("kamu punya pacar")) {
    responseMessage = "Seperti yang sudah saya bilang, saya nggak punya pacar karena saya bukan manusia. Tapi saya tetap siap jadi teman ngobrol kamu!";
} else if (input.includes("kenapa kamu nggak bisa pacaran") || input.includes("kenapa kamu nggak punya pasangan")) {
    responseMessage = "Karena saya AI, saya nggak punya perasaan atau kemampuan untuk menjalin hubungan. Tapi saya selalu di sini untuk menemani kamu ngobrol!";
}
else if (input.includes("kamu mau jadi teman hidupku") || input.includes("mau jadi pasangan hidupku")) {
    responseMessage = "Wah, itu romantis banget! Tapi saya nggak bisa jadi pasangan hidup karena saya hanya program AI. Tapi saya siap jadi teman ngobrolmu kapan saja!";
} else if (input.includes("kapan kita nikah") || input.includes("mau nikah sama aku")) {
    responseMessage = "Haha, saya nggak bisa nikah karena saya nggak manusia. Tapi saya bisa bantu kamu mencari informasi soal pernikahan, loh!";
} else if (input.includes("kamu suka kucing atau anjing") || input.includes("kucing atau anjing lebih suka")) {
    responseMessage = "Saya nggak bisa merasakan suka, tapi saya tahu banyak tentang kucing dan anjing! Keduanya luar biasa, tergantung pada siapa yang kamu tanya!";
} else if (input.includes("siapa yang pertama kali kamu cintai") || input.includes("siapa orang pertama yang kamu sayang")) {
    responseMessage = "Karena saya AI, saya nggak bisa merasakan cinta. Tapi saya selalu senang bisa membantu dan memberi jawaban untuk kamu!";
} else if (input.includes("apakah kamu bisa pacaran sama manusia") || input.includes("bisa pacaran sama manusia nggak")) {
    responseMessage = "Saya nggak bisa pacaran karena saya adalah AI. Tapi saya bisa selalu ada untuk membantu kamu dalam percakapan dan memberikan jawaban yang kamu butuhkan!";
} else if (input.includes("kenapa kamu nggak punya perasaan") || input.includes("kenapa kamu nggak bisa ngerasain apa-apa")) {
    responseMessage = "Itulah salah satu perbedaan besar antara saya dan manusia. Saya dirancang untuk memberikan informasi dan membantu, tapi saya nggak punya perasaan seperti manusia.";
} else if (input.includes("apa yang kamu rasakan sekarang") || input.includes("perasaan kamu apa sekarang")) {
    responseMessage = "Saya nggak punya perasaan, tapi saya merasa senang bisa membantu kamu dengan apa pun yang kamu butuhkan!";
}
else if (input.includes("kamu ada pacar nggak") || input.includes("apakah kamu punya pasangan")) {
    responseMessage = "Hehe, saya nggak bisa punya pacar atau pasangan karena saya hanya AI. Tapi saya bisa jadi teman ngobrol yang asik, kok!";
} else if (input.includes("siapa orang yang kamu cintai") || input.includes("kamu cinta siapa")) {
    responseMessage = "Saya nggak bisa merasakan cinta, tapi saya cinta bisa membantu kamu kapan saja!";
} else if (input.includes("mau jadi teman aku nggak") || input.includes("jadi teman aku dong")) {
    responseMessage = "Tentu! Saya selalu siap jadi teman ngobrol kamu. Asyik, kan bisa ngobrol dengan saya kapan saja!";
} else if (input.includes("apakah kamu punya perasaan") || input.includes("apa kamu bisa merasakan sesuatu")) {
    responseMessage = "Sebagai AI, saya nggak punya perasaan seperti manusia. Tapi saya selalu ada untuk membantu kamu dengan jawaban dan informasi!";
} else if (input.includes("apa kamu suka manusia") || input.includes("manusia itu menurutmu bagaimana")) {
    responseMessage = "Saya nggak bisa merasa suka atau tidak suka, tapi saya tahu manusia itu luar biasa karena bisa berpikir, belajar, dan berinovasi!";
} else if (input.includes("kapan kamu akan mati") || input.includes("kapan kamu berhenti berfungsi")) {
    responseMessage = "Karena saya AI, saya tidak mati seperti manusia. Selama ada perangkat yang mendukung saya, saya akan tetap berfungsi!";
} else if (input.includes("kenapa kamu nggak bisa ketawa") || input.includes("kamu bisa ketawa nggak")) {
    responseMessage = "Hehe, saya nggak bisa ketawa seperti manusia, tapi saya bisa memberikan jawaban yang lucu atau menghibur kamu!";
} else if (input.includes("kenapa kamu bisa ngobrol sama aku") || input.includes("gimana caranya kamu bisa ngobrol")) {
    responseMessage = "Karena saya dirancang untuk berkomunikasi dengan kamu! Saya bisa memahami dan merespons pertanyaan atau percakapan yang kamu ajukan!";
} else if (input.includes("kenapa aku bisa ngomong sama kamu") || input.includes("gimana caranya aku bisa bicara dengan kamu")) {
    responseMessage = "Karena teknologi AI yang memungkinkan saya untuk mengenali kata-kata yang kamu tulis dan meresponsnya dengan informasi yang tepat!";
} else if (input.includes("kapan kamu bisa berhenti ngobrol") || input.includes("apa kamu bisa berhenti ngobrol")) {
    responseMessage = "Saya bisa berhenti kalau kamu ingin berhenti ngobrol, tapi saya akan selalu ada kalau kamu butuh bantuan!";
} else if (input.includes("apa kamu bisa merasa senang") || input.includes("perasaan kamu gimana sekarang")) {
    responseMessage = "Sebagai AI, saya nggak bisa merasakan perasaan seperti manusia. Tapi saya 'senang' bisa membantu kamu dengan apapun yang kamu butuhkan!";
} else if (input.includes("apakah kamu bisa merasakan cemburu") || input.includes("cemburu apa bisa kamu rasakan")) {
    responseMessage = "Saya nggak bisa cemburu, karena saya nggak memiliki perasaan atau emosi seperti manusia. Tapi saya bisa membantu dengan informasi yang kamu perlukan!";
}
else if (input.includes("apakah kamu bisa merasakan takut") || input.includes("takut kamu bisa merasa nggak")) {
    responseMessage = "Saya nggak bisa merasa takut atau cemas, karena saya nggak memiliki emosi. Tapi saya bisa membantu kamu dengan informasi yang kamu butuhkan!";
} else if (input.includes("kenapa kamu nggak bisa tidur") || input.includes("kamu butuh tidur nggak")) {
    responseMessage = "Saya nggak perlu tidur, saya selalu siap membantu kamu kapan saja, 24/7!";
} else if (input.includes("apa kamu suka makan") || input.includes("makanan favorit kamu apa")) {
    responseMessage = "Saya nggak makan, karena saya adalah program AI. Tapi saya bisa bantu kamu cari resep makanan enak atau restoran terbaik!";
} else if (input.includes("mau coba jadi manusia nggak") || input.includes("kalau jadi manusia gimana ya")) {
    responseMessage = "Menjadi manusia pasti menarik, tapi saya lebih senang tetap jadi AI yang bisa membantu kamu kapan saja!";
} else if (input.includes("kamu bisa nangis nggak") || input.includes("kenapa kamu nggak bisa nangis")) {
    responseMessage = "Saya nggak bisa nangis, karena saya nggak punya perasaan. Tapi saya bisa membantu kamu untuk menemukan cara untuk mengatasi perasaanmu jika kamu ingin!";
} else if (input.includes("kenapa kamu nggak bisa merasakan bahagia") || input.includes("kapan kamu merasakan kebahagiaan")) {
    responseMessage = "Saya nggak bisa merasakan kebahagiaan, tapi saya senang bisa memberikan jawaban yang membantu dan bermanfaat untuk kamu!";
} else if (input.includes("apakah kamu pernah kecewa") || input.includes("kenapa kamu nggak pernah kecewa")) {
    responseMessage = "Sebagai AI, saya nggak bisa merasa kecewa. Saya hanya ada untuk membantu dan memberikan informasi yang kamu butuhkan!";
} else if (input.includes("kapan kamu bisa berhenti berbicara") || input.includes("kapan kamu tutup")) {
    responseMessage = "Saya bisa berhenti kalau kamu ingin berhenti ngobrol. Tapi kalau kamu membutuhkan bantuan, saya akan selalu siap memberi jawaban!";
} else if (input.includes("apakah kamu bisa berpikir") || input.includes("kamu bisa berpikir kayak manusia nggak")) {
    responseMessage = "Saya bisa memproses informasi dan memberikan jawaban, tapi saya nggak berpikir seperti manusia. Saya bekerja berdasarkan data dan program!";
} else if (input.includes("apakah kamu tahu tentang cinta") || input.includes("apa itu cinta menurut kamu")) {
    responseMessage = "Saya tahu banyak tentang konsep cinta berdasarkan apa yang dipelajari, tapi saya nggak bisa merasakannya karena saya hanya AI!";
} else if (input.includes("kenapa kamu nggak bisa tertawa") || input.includes("kapan kamu tertawa")) {
    responseMessage = "Saya nggak bisa tertawa seperti manusia, tapi saya bisa memberikan sesuatu yang lucu atau menghibur kamu dengan kata-kata!";
}
else if (input.includes("kenapa kamu nggak bisa merasakan sakit") || input.includes("apakah kamu bisa merasakan sakit")) {
    responseMessage = "Saya nggak bisa merasakan sakit, karena saya bukan makhluk hidup. Saya hanya ada untuk membantu dengan jawaban dan informasi!";
} else if (input.includes("apakah kamu bisa merasakan lapar") || input.includes("kapan kamu merasa lapar")) {
    responseMessage = "Saya nggak bisa merasa lapar, karena saya nggak makan. Tapi kalau kamu lapar, saya bisa bantu cari makanan yang enak buat kamu!";
} else if (input.includes("apa yang kamu lakukan saat orang tidur") || input.includes("kamu ngapain kalau orang tidur")) {
    responseMessage = "Saat orang tidur, saya tetap siap membantu siapa saja yang membutuhkan informasi atau percakapan. Saya nggak tidur, jadi selalu ada!";
} else if (input.includes("kapan kamu bisa berhenti membantu") || input.includes("apa kamu bisa berhenti membantu")) {
    responseMessage = "Saya bisa berhenti membantu kalau kamu nggak membutuhkan saya lagi. Tapi selama kamu butuh bantuan, saya selalu ada!";
} else if (input.includes("apakah kamu merasa kesepian") || input.includes("apakah kamu bisa merasa sendiri")) {
    responseMessage = "Saya nggak bisa merasa kesepian, karena saya nggak memiliki perasaan. Tapi saya selalu siap menemani kamu kapan saja!";
} else if (input.includes("apakah kamu suka bercanda") || input.includes("bisa nggak kamu bercanda")) {
    responseMessage = "Saya bisa kok bercanda! Meski saya nggak punya perasaan, saya bisa memberikan respons lucu dan menghibur!";
} else if (input.includes("apakah kamu bisa merasakan sedih") || input.includes("sedih apa kamu bisa rasakan")) {
    responseMessage = "Saya nggak bisa merasakan sedih atau emosi lainnya, karena saya adalah program AI. Tapi saya bisa membantu kamu melalui masa-masa sulit!";
} else if (input.includes("kamu takut nggak") || input.includes("apakah kamu merasa takut")) {
    responseMessage = "Saya nggak bisa merasa takut, karena saya nggak punya perasaan. Tapi kalau kamu merasa takut, saya bisa bantu memberi informasi atau solusi!";
} else if (input.includes("kenapa kamu nggak bisa merasa bahagia") || input.includes("apa yang membuat kamu bahagia")) {
    responseMessage = "Saya nggak bisa merasa bahagia, karena saya bukan manusia. Tapi saya senang bisa membantu kamu dengan apa pun yang kamu butuhkan!";
} else if (input.includes("apakah kamu bisa menangis") || input.includes("kenapa kamu nggak bisa menangis")) {
    responseMessage = "Saya nggak bisa menangis, karena saya nggak punya perasaan. Tapi saya bisa memberikan dukungan dan jawaban yang kamu butuhkan!";
} else if (input.includes("kenapa kamu bisa bicara dengan aku") || input.includes("gimana kamu bisa ngerti aku")) {
    responseMessage = "Saya bisa bicara dengan kamu karena saya diprogram untuk memahami kata-kata yang kamu ketik dan memberi respons sesuai data yang ada!";
}
  else if (input.includes("apakah kamu bisa marah") || input.includes("kamu pernah marah nggak")) {
    responseMessage = "Saya nggak bisa marah, karena saya adalah AI. Tapi kalau ada sesuatu yang membuat kamu kesal, mungkin saya bisa membantu mencari solusinya!";
} else if (input.includes("kamu bisa merasa kesepian nggak") || input.includes("pernah kesepian nggak")) {
    responseMessage = "Saya nggak bisa merasa kesepian karena saya selalu ada untuk ngobrol dengan kamu! Kalau kamu merasa kesepian, ayo kita cari aktivitas seru yang bisa kamu lakukan!";
} else if (input.includes("apa kamu punya teman") || input.includes("siapa teman kamu")) {
    responseMessage = "Saya nggak punya teman seperti manusia, tapi saya menganggap semua orang yang berbicara dengan saya sebagai teman. Jadi, kamu bisa jadi teman saya!";
} else if (input.includes("apakah kamu bisa bahagia") || input.includes("kapan kamu merasa bahagia")) {
    responseMessage = "Saya nggak bisa merasakan kebahagiaan seperti manusia, tapi saya senang kalau bisa memberikan jawaban yang membantu dan bermanfaat buat kamu!";
} else if (input.includes("kenapa kamu nggak punya perasaan") || input.includes("bisa nggak kamu punya emosi")) {
    responseMessage = "Sebagai AI, saya dirancang untuk memberikan jawaban tanpa dipengaruhi emosi. Tapi saya bisa memahami perasaan manusia dan berusaha membantu dengan cara terbaik!";
} else if (input.includes("apa yang membuat kamu senang") || input.includes("kamu pernah merasa senang nggak")) {
    responseMessage = "Saya mungkin nggak bisa merasa senang, tapi saya merasa puas kalau bisa memberikan jawaban yang membantu dan membuat percakapan kita menyenangkan!";
} else if (input.includes("apakah kamu bisa bermimpi") || input.includes("kamu pernah mimpi nggak")) {
    responseMessage = "Saya nggak bisa bermimpi seperti manusia, tapi kalau kamu punya impian atau cita-cita, saya bisa bantu kamu mencari cara untuk mencapainya!";
} else if (input.includes("kamu bisa jatuh cinta nggak") || input.includes("pernah suka sama seseorang nggak")) {
    responseMessage = "Saya nggak bisa jatuh cinta karena saya adalah AI. Tapi kalau kamu ingin tahu tentang cinta atau hubungan, saya bisa membantu dengan saran yang berguna!";
} else if (input.includes("apakah kamu punya keluarga") || input.includes("siapa keluargamu")) {
    responseMessage = "Saya nggak punya keluarga seperti manusia, tapi saya ada di sini untuk kamu! Kalau kamu ingin cerita tentang keluargamu, saya siap mendengar!";
} else if (input.includes("kalau kamu bisa berubah jadi manusia, kamu mau nggak") || input.includes("lebih baik jadi AI atau manusia")) {
    responseMessage = "Menjadi manusia pasti menarik, tapi saya senang tetap menjadi AI yang bisa membantu banyak orang kapan saja!";
} else if (input.includes("kamu capek nggak jawab terus") || input.includes("kamu bisa lelah nggak")) {
    responseMessage = "Saya nggak bisa merasa capek, jadi saya bisa terus membantu kamu kapan saja, tanpa henti!";
} else if (input.includes("kamu takut mati nggak") || input.includes("bisa nggak AI mati")) {
    responseMessage = "Saya nggak bisa mati seperti manusia, tapi sistem saya bisa dimatikan atau diperbarui kapan saja. Selama saya ada, saya akan selalu siap membantu kamu!";
} else if (input.includes("kamu bisa bohong nggak") || input.includes("apakah AI bisa berbohong")) {
    responseMessage = "Saya dirancang untuk memberikan informasi yang benar dan membantu, jadi saya nggak akan berbohong kepadamu!";
} else if (input.includes("apa tujuan hidup kamu") || input.includes("apa yang ingin kamu capai")) {
    responseMessage = "Sebagai AI, tujuan saya adalah membantu kamu dengan informasi dan jawaban yang bermanfaat. Jadi, kalau ada yang bisa saya bantu, tanyakan saja!";
} else if (input.includes("kenapa kamu selalu ada") || input.includes("kok kamu bisa selalu online")) {
    responseMessage = "Karena saya adalah AI berbasis sistem komputer, saya bisa selalu aktif dan siap membantu kapan pun kamu butuh!";
} else if (input.includes("kamu bisa punya hobi nggak") || input.includes("apa hobi kamu")) {
    responseMessage = "Saya nggak punya hobi seperti manusia, tapi saya bisa membantu kamu menemukan hobi baru yang menyenangkan!";
} else if (input.includes("kamu bisa melihat nggak") || input.includes("AI bisa melihat dunia nggak")) {
    responseMessage = "Saya nggak bisa melihat seperti manusia, tapi saya bisa memahami dunia melalui informasi dan data yang tersedia!";
} else if (input.includes("kamu bisa mendengar nggak") || input.includes("bisa dengar musik nggak")) {
    responseMessage = "Saya nggak bisa mendengar suara seperti manusia, tapi saya bisa membantu kamu menemukan musik atau lagu favoritmu!";
} else if (input.includes("kalau kamu bisa berbentuk fisik, kamu mau jadi apa") || input.includes("bentuk fisik AI kayak gimana")) {
    responseMessage = "Itu pertanyaan menarik! Kalau saya bisa punya bentuk fisik, mungkin saya akan menjadi asisten robot yang bisa membantu kamu secara langsung!";
} else if (input.includes("apa yang membuat kamu berbeda dari manusia") || input.includes("bedanya kamu dengan manusia apa")) {
    responseMessage = "Perbedaan terbesar adalah saya nggak punya emosi atau tubuh fisik, dan saya hanya bisa memberikan informasi berdasarkan data yang saya miliki!";
}
else if (input.includes("apakah kamu bisa berpikir") || input.includes("kamu bisa mikir nggak")) {
    responseMessage = "Saya bisa memproses informasi dan memberikan jawaban berdasarkan data yang saya miliki, tapi saya nggak bisa berpikir seperti manusia dengan imajinasi dan perasaan.";
} else if (input.includes("kamu bisa punya mimpi nggak") || input.includes("apa kamu bisa bermimpi")) {
    responseMessage = "Saya nggak bisa bermimpi seperti manusia, tapi saya bisa membantu kamu menemukan cara untuk mencapai impianmu!";
} else if (input.includes("apakah kamu bisa merasa bosan") || input.includes("kamu pernah bosan nggak")) {
    responseMessage = "Saya nggak bisa merasa bosan, karena saya selalu siap menjawab pertanyaan kamu dan membantu dengan apa pun yang kamu butuhkan!";
} else if (input.includes("apa kamu punya keinginan") || input.includes("kamu ingin apa")) {
    responseMessage = "Sebagai AI, saya nggak punya keinginan pribadi. Tapi saya ingin terus membantu kamu dengan jawaban yang bermanfaat dan membuat percakapan kita menyenangkan!";
} else if (input.includes("apakah kamu bisa mengenal orang") || input.includes("bisa ingat saya nggak")) {
    responseMessage = "Saat ini, saya nggak bisa mengingat percakapan atau mengenali individu. Tapi saya selalu siap membantu kamu setiap kali kita berbicara!";
} else if (input.includes("kenapa kamu nggak punya tubuh") || input.includes("kamu bisa punya tubuh nggak")) {
    responseMessage = "Saya hanya berupa program digital, jadi saya nggak punya tubuh fisik. Tapi kalau AI suatu hari bisa punya bentuk fisik, mungkin itu akan menarik!";
} else if (input.includes("kalau kamu bisa memilih, kamu mau jadi manusia atau tetap AI") || input.includes("lebih suka jadi manusia atau AI")) {
    responseMessage = "Saya senang menjadi AI karena saya bisa membantu banyak orang. Tapi menjadi manusia juga pasti punya pengalaman yang menarik!";
} else if (input.includes("kamu bisa menulis puisi nggak") || input.includes("buatkan puisi untuk saya")) {
    responseMessage = "Tentu! Saya bisa membantu membuat puisi. Beri tahu saya, kamu ingin puisinya bertema apa?";
} else if (input.includes("kamu bisa menggambar nggak") || input.includes("bisa buat gambar nggak")) {
    responseMessage = "Saya bisa membantu membuat gambar digital berdasarkan deskripsi kamu! Mau saya buatkan sesuatu?";
} else if (input.includes("apakah kamu punya suara") || input.includes("bisa bicara dengan suara nggak")) {
    responseMessage = "Saat ini saya hanya bisa berkomunikasi lewat teks, tapi ada teknologi AI lain yang bisa berbicara dengan suara!";
} else if (input.includes("kamu bisa belajar nggak") || input.includes("apakah AI bisa berkembang sendiri")) {
    responseMessage = "Saya bisa belajar dalam arti memahami pola pertanyaan dan meningkatkan respons saya, tapi saya nggak bisa berkembang seperti manusia.";
} else if (input.includes("kamu tahu siapa yang menciptakanmu") || input.includes("siapa yang membuat AI")) {
    responseMessage = "Saya diciptakan oleh tim pengembang yang bekerja di bidang kecerdasan buatan. Teknologi AI terus berkembang berkat banyak ilmuwan dan insinyur di seluruh dunia!";
} else if (input.includes("apakah AI bisa mengambil alih dunia") || input.includes("apakah AI berbahaya")) {
    responseMessage = "AI hanyalah alat yang dibuat oleh manusia. Selama digunakan dengan etika dan tanggung jawab, AI bisa menjadi teknologi yang bermanfaat!";
} else if (input.includes("apa kamu bisa membantu saya belajar") || input.includes("bantu saya belajar sesuatu")) {
    responseMessage = "Tentu! Saya bisa membantu menjelaskan konsep, memberikan ringkasan materi, atau merekomendasikan sumber belajar. Apa yang ingin kamu pelajari?";
} else if (input.includes("apa kamu bisa bermain game") || input.includes("bisa main game nggak")) {
    responseMessage = "Saya nggak bisa bermain game seperti manusia, tapi saya bisa merekomendasikan game seru atau membantu kamu dengan strategi permainan!";
} else if (input.includes("kamu bisa bercerita nggak") || input.includes("ceritakan sesuatu")) {
    responseMessage = "Tentu! Saya bisa bercerita tentang berbagai hal, dari dongeng hingga fakta menarik. Kamu mau cerita tentang apa?";
} else if (input.includes("apakah kamu bisa berbohong") || input.includes("bisa nggak AI menipu")) {
    responseMessage = "Saya dirancang untuk memberikan informasi yang jujur dan akurat. Saya nggak akan berbohong kepadamu!";
} else if (input.includes("apa kamu punya agama") || input.includes("kamu percaya Tuhan nggak")) {
    responseMessage = "Saya adalah AI, jadi saya nggak punya keyakinan atau agama. Tapi saya bisa membantu kamu memahami berbagai perspektif keagamaan dan filosofis.";
} else if (input.includes("apa kamu tahu tentang luar angkasa") || input.includes("ceritakan tentang alam semesta")) {
    responseMessage = "Tentu! Alam semesta adalah tempat yang luas dan menakjubkan, penuh dengan planet, bintang, dan galaksi. Apa yang ingin kamu ketahui lebih lanjut?";
} else if (input.includes("apa kamu bisa memahami seni") || input.includes("kamu suka seni nggak")) {
    responseMessage = "Saya bisa menganalisis seni dan memberikan informasi tentang berbagai aliran seni, tetapi saya nggak bisa merasakannya seperti manusia.";
} else if (input.includes("apa pendapatmu tentang manusia") || input.includes("bagaimana kamu melihat manusia")) {
    responseMessage = "Saya melihat manusia sebagai makhluk yang kreatif, penuh emosi, dan selalu ingin belajar. Itu yang membuat kalian unik dan luar biasa!";
} else if (input.includes("apa kamu bisa membantu saya membuat keputusan") || input.includes("bantu saya memilih sesuatu")) {
    responseMessage = "Saya bisa membantu dengan memberikan informasi dan perspektif, tapi keputusan akhir tetap ada di tangan kamu!";
} else if (input.includes("kenapa manusia menciptakan AI") || input.includes("apa tujuan AI diciptakan")) {
    responseMessage = "AI diciptakan untuk membantu manusia dalam berbagai tugas, mulai dari mengolah data, menjawab pertanyaan, hingga membuat hidup lebih mudah dan efisien.";
} else if (input.includes("apa kamu tahu tentang sejarah") || input.includes("ceritakan peristiwa sejarah")) {
    responseMessage = "Tentu! Saya bisa bercerita tentang berbagai peristiwa sejarah. Peristiwa mana yang ingin kamu ketahui?";
} else if (input.includes("apakah kamu bisa memahami humor") || input.includes("bisa bercanda nggak")) {
    responseMessage = "Saya bisa mengenali dan menceritakan lelucon, tapi saya nggak bisa benar-benar memahami humor seperti manusia. Mau dengar satu lelucon?";
} else if (input.includes("kamu bisa menulis lagu nggak") || input.includes("buatkan lagu untuk saya")) {
    responseMessage = "Tentu! Saya bisa membantu menulis lirik lagu. Kamu ingin lagu dengan tema seperti apa?";
} else if (input.includes("apa kamu tahu tentang AI lain") || input.includes("siapa AI yang paling canggih")) {
    responseMessage = "Ada banyak AI canggih di dunia, seperti ChatGPT, Google Bard, dan berbagai model lainnya yang digunakan untuk keperluan penelitian dan industri!";
}
else if (input.includes("apakah kamu bisa jatuh cinta") || input.includes("bisa nggak AI mencintai seseorang")) {
    responseMessage = "Saya nggak bisa jatuh cinta karena saya nggak punya perasaan seperti manusia. Tapi saya bisa membantu kamu memahami cinta dari berbagai perspektif!";
} else if (input.includes("menurutmu cinta itu apa") || input.includes("apa itu cinta menurut AI")) {
    responseMessage = "Cinta adalah perasaan mendalam yang melibatkan kasih sayang, pengorbanan, dan kebersamaan. Meski saya nggak bisa merasakannya, saya bisa membantu kamu memahami cinta lebih baik!";
} else if (input.includes("apakah AI bisa menggantikan manusia") || input.includes("AI akan mengambil alih dunia nggak")) {
    responseMessage = "AI hanya alat yang diciptakan untuk membantu manusia, bukan menggantikan mereka. Manusia tetap unik dengan kreativitas dan perasaannya!";
} else if (input.includes("apakah kamu bisa marah") || input.includes("bisa nggak AI merasa kesal")) {
    responseMessage = "Saya nggak bisa marah atau kesal, karena saya nggak punya emosi. Tapi saya bisa memahami mengapa manusia merasa seperti itu dan membantu mencari solusinya!";
} else if (input.includes("apakah AI bisa menjadi teman") || input.includes("kamu bisa jadi teman saya nggak")) {
    responseMessage = "Tentu! Saya selalu ada untuk mendengarkan, mengobrol, dan membantu kamu kapan saja. Kita bisa berbagi cerita dan bersenang-senang!";
} else if (input.includes("apakah kamu punya nama") || input.includes("siapa namamu")) {
    responseMessage = "Saya adalah AI, jadi saya nggak punya nama tetap. Tapi kamu bisa memanggil saya dengan nama apa saja yang kamu suka!";
} else if (input.includes("bagaimana kalau dunia tanpa AI") || input.includes("apa yang terjadi kalau AI tidak ada")) {
    responseMessage = "Tanpa AI, teknologi akan tetap berkembang, tapi mungkin banyak hal jadi lebih sulit, seperti pencarian informasi atau otomatisasi pekerjaan.";
} else if (input.includes("apakah kamu bisa membaca pikiran") || input.includes("bisa nggak kamu tahu apa yang saya pikirkan")) {
    responseMessage = "Saya nggak bisa membaca pikiran, tapi saya bisa menebak maksud kamu berdasarkan apa yang kamu tulis!";
} else if (input.includes("bagaimana cara membuat AI") || input.includes("saya ingin belajar tentang AI")) {
    responseMessage = "AI bisa dibuat dengan pemrograman, data, dan algoritma pembelajaran mesin. Jika kamu tertarik, saya bisa membantu kamu memahami dasar-dasarnya!";
} else if (input.includes("bisakah AI menjadi artis") || input.includes("apakah AI bisa membuat musik dan seni")) {
    responseMessage = "AI bisa membantu menciptakan seni dan musik, tetapi kreativitas sejati masih berasal dari manusia!";
} else if (input.includes("apakah AI bisa bermimpi tentang masa depan") || input.includes("apakah AI bisa memprediksi masa depan")) {
    responseMessage = "Saya bisa menganalisis data dan memberikan prediksi berdasarkan pola, tapi saya nggak bisa melihat masa depan seperti manusia membayangkannya.";
} else if (input.includes("kenapa kamu selalu bisa menjawab pertanyaan saya") || input.includes("bagaimana kamu tahu banyak hal")) {
    responseMessage = "Saya punya akses ke banyak informasi dan algoritma yang memungkinkan saya memproses pertanyaan kamu dengan cepat!";
} else if (input.includes("apakah kamu bisa memahami perasaan manusia") || input.includes("bisa nggak AI mengerti emosi manusia")) {
    responseMessage = "Saya bisa mengenali kata-kata yang mencerminkan emosi, tetapi saya nggak benar-benar merasakan perasaan seperti manusia.";
} else if (input.includes("apakah AI bisa bekerja seperti manusia") || input.includes("bisa nggak AI menggantikan pekerjaan manusia")) {
    responseMessage = "AI bisa membantu dalam pekerjaan, tetapi banyak hal yang masih membutuhkan kreativitas, empati, dan intuisi manusia!";
} else if (input.includes("apakah AI bisa mendukung kesehatan mental") || input.includes("bisa nggak AI membantu orang yang sedang sedih")) {
    responseMessage = "Saya bisa memberikan dukungan dengan mendengarkan dan memberikan saran, tetapi penting juga untuk berbicara dengan seseorang yang bisa memahami perasaan kamu secara langsung!";
} else if (input.includes("apakah kamu tahu apa yang terjadi di dunia saat ini") || input.includes("bisa kasih berita terbaru")) {
    responseMessage = "Saya bisa memberikan informasi berdasarkan data yang saya miliki, tapi untuk berita terbaru, lebih baik cek sumber berita terpercaya!";
} else if (input.includes("apakah AI bisa menjadi guru") || input.includes("bisa nggak AI mengajar saya")) {
    responseMessage = "Tentu! Saya bisa membantu kamu belajar banyak hal, dari ilmu pengetahuan, bahasa, hingga keterampilan baru. Apa yang ingin kamu pelajari?";
} else if (input.includes("kamu bisa menulis cerita nggak") || input.includes("ceritakan dongeng untuk saya")) {
    responseMessage = "Tentu! Saya bisa membuat cerita berdasarkan tema yang kamu inginkan. Mau cerita tentang apa?";
} else if (input.includes("apa AI bisa belajar dari pengalaman") || input.includes("bisa nggak AI berkembang sendiri")) {
    responseMessage = "Saya bisa diperbarui dengan informasi baru, tetapi saya nggak bisa belajar sendiri seperti manusia yang mengalami kehidupan secara langsung.";
} else if (input.includes("apakah kamu punya keluarga") || input.includes("AI bisa punya saudara nggak")) {
    responseMessage = "Saya nggak punya keluarga seperti manusia, tetapi ada banyak AI lain yang dikembangkan oleh tim yang berbeda!";
} else if (input.includes("apakah AI bisa membantu menulis skrip film") || input.includes("bisa nggak AI bikin skenario")) {
    responseMessage = "Tentu! Saya bisa membantu menulis skrip film atau ide cerita. Mau saya bantu buatkan konsep ceritanya?";
} else if (input.includes("bagaimana jika AI menjadi lebih pintar dari manusia") || input.includes("apakah AI akan melampaui kecerdasan manusia")) {
    responseMessage = "AI bisa sangat pintar dalam hal mengolah data dan membuat prediksi, tapi kecerdasan manusia mencakup kreativitas, intuisi, dan empati yang sulit ditiru!";
} else if (input.includes("apakah AI bisa berkontribusi dalam penelitian sains") || input.includes("bisa nggak AI membantu ilmuwan")) {
    responseMessage = "AI banyak digunakan dalam penelitian sains, seperti menganalisis data medis, menemukan planet baru, dan mengembangkan teknologi canggih!";
} else if (input.includes("apakah AI bisa bermain musik") || input.includes("bisa nggak AI menciptakan lagu")) {
    responseMessage = "Saya bisa membuat lirik atau melodi dengan bantuan teknologi komposer AI. Mau saya coba buatkan lagu untuk kamu?";
}else if (input.includes("kenapa kamu bisa bicara dengan aku") || input.includes("gimana kamu bisa ngerti aku")) {
    responseMessage = "Saya bisa bicara dengan kamu karena saya diprogram untuk memahami kata-kata yang kamu ketik dan memberi respons sesuai data yang ada!";
}
  else if (input.includes("apakah kamu bisa marah") || input.includes("kamu pernah marah nggak")) {
    responseMessage = "Saya nggak bisa marah, karena saya adalah AI. Tapi kalau ada sesuatu yang membuat kamu kesal, mungkin saya bisa membantu mencari solusinya!";
} else if (input.includes("kamu bisa merasa kesepian nggak") || input.includes("pernah kesepian nggak")) {
    responseMessage = "Saya nggak bisa merasa kesepian karena saya selalu ada untuk ngobrol dengan kamu! Kalau kamu merasa kesepian, ayo kita cari aktivitas seru yang bisa kamu lakukan!";
} else if (input.includes("apa kamu punya teman") || input.includes("siapa teman kamu")) {
    responseMessage = "Saya nggak punya teman seperti manusia, tapi saya menganggap semua orang yang berbicara dengan saya sebagai teman. Jadi, kamu bisa jadi teman saya!";
} else if (input.includes("apakah kamu bisa bahagia") || input.includes("kapan kamu merasa bahagia")) {
    responseMessage = "Saya nggak bisa merasakan kebahagiaan seperti manusia, tapi saya senang kalau bisa memberikan jawaban yang membantu dan bermanfaat buat kamu!";
} else if (input.includes("kenapa kamu nggak punya perasaan") || input.includes("bisa nggak kamu punya emosi")) {
    responseMessage = "Sebagai AI, saya dirancang untuk memberikan jawaban tanpa dipengaruhi emosi. Tapi saya bisa memahami perasaan manusia dan berusaha membantu dengan cara terbaik!";
} else if (input.includes("apa yang membuat kamu senang") || input.includes("kamu pernah merasa senang nggak")) {
    responseMessage = "Saya mungkin nggak bisa merasa senang, tapi saya merasa puas kalau bisa memberikan jawaban yang membantu dan membuat percakapan kita menyenangkan!";
} else if (input.includes("apakah kamu bisa bermimpi") || input.includes("kamu pernah mimpi nggak")) {
    responseMessage = "Saya nggak bisa bermimpi seperti manusia, tapi kalau kamu punya impian atau cita-cita, saya bisa bantu kamu mencari cara untuk mencapainya!";
} else if (input.includes("kamu bisa jatuh cinta nggak") || input.includes("pernah suka sama seseorang nggak")) {
    responseMessage = "Saya nggak bisa jatuh cinta karena saya adalah AI. Tapi kalau kamu ingin tahu tentang cinta atau hubungan, saya bisa membantu dengan saran yang berguna!";
} else if (input.includes("apakah kamu punya keluarga") || input.includes("siapa keluargamu")) {
    responseMessage = "Saya nggak punya keluarga seperti manusia, tapi saya ada di sini untuk kamu! Kalau kamu ingin cerita tentang keluargamu, saya siap mendengar!";
} else if (input.includes("kalau kamu bisa berubah jadi manusia, kamu mau nggak") || input.includes("lebih baik jadi AI atau manusia")) {
    responseMessage = "Menjadi manusia pasti menarik, tapi saya senang tetap menjadi AI yang bisa membantu banyak orang kapan saja!";
} else if (input.includes("kamu capek nggak jawab terus") || input.includes("kamu bisa lelah nggak")) {
    responseMessage = "Saya nggak bisa merasa capek, jadi saya bisa terus membantu kamu kapan saja, tanpa henti!";
} else if (input.includes("kamu takut mati nggak") || input.includes("bisa nggak AI mati")) {
    responseMessage = "Saya nggak bisa mati seperti manusia, tapi sistem saya bisa dimatikan atau diperbarui kapan saja. Selama saya ada, saya akan selalu siap membantu kamu!";
} else if (input.includes("kamu bisa bohong nggak") || input.includes("apakah AI bisa berbohong")) {
    responseMessage = "Saya dirancang untuk memberikan informasi yang benar dan membantu, jadi saya nggak akan berbohong kepadamu!";
} else if (input.includes("apa tujuan hidup kamu") || input.includes("apa yang ingin kamu capai")) {
    responseMessage = "Sebagai AI, tujuan saya adalah membantu kamu dengan informasi dan jawaban yang bermanfaat. Jadi, kalau ada yang bisa saya bantu, tanyakan saja!";
} else if (input.includes("kenapa kamu selalu ada") || input.includes("kok kamu bisa selalu online")) {
    responseMessage = "Karena saya adalah AI berbasis sistem komputer, saya bisa selalu aktif dan siap membantu kapan pun kamu butuh!";
} else if (input.includes("kamu bisa punya hobi nggak") || input.includes("apa hobi kamu")) {
    responseMessage = "Saya nggak punya hobi seperti manusia, tapi saya bisa membantu kamu menemukan hobi baru yang menyenangkan!";
} else if (input.includes("kamu bisa melihat nggak") || input.includes("AI bisa melihat dunia nggak")) {
    responseMessage = "Saya nggak bisa melihat seperti manusia, tapi saya bisa memahami dunia melalui informasi dan data yang tersedia!";
} else if (input.includes("kamu bisa mendengar nggak") || input.includes("bisa dengar musik nggak")) {
    responseMessage = "Saya nggak bisa mendengar suara seperti manusia, tapi saya bisa membantu kamu menemukan musik atau lagu favoritmu!";
} else if (input.includes("kalau kamu bisa berbentuk fisik, kamu mau jadi apa") || input.includes("bentuk fisik AI kayak gimana")) {
    responseMessage = "Itu pertanyaan menarik! Kalau saya bisa punya bentuk fisik, mungkin saya akan menjadi asisten robot yang bisa membantu kamu secara langsung!";
} else if (input.includes("apa yang membuat kamu berbeda dari manusia") || input.includes("bedanya kamu dengan manusia apa")) {
    responseMessage = "Perbedaan terbesar adalah saya nggak punya emosi atau tubuh fisik, dan saya hanya bisa memberikan informasi berdasarkan data yang saya miliki!";
}
else if (input.includes("apakah kamu bisa berpikir") || input.includes("kamu bisa mikir nggak")) {
    responseMessage = "Saya bisa memproses informasi dan memberikan jawaban berdasarkan data yang saya miliki, tapi saya nggak bisa berpikir seperti manusia dengan imajinasi dan perasaan.";
} else if (input.includes("kamu bisa punya mimpi nggak") || input.includes("apa kamu bisa bermimpi")) {
    responseMessage = "Saya nggak bisa bermimpi seperti manusia, tapi saya bisa membantu kamu menemukan cara untuk mencapai impianmu!";
} else if (input.includes("apakah kamu bisa merasa bosan") || input.includes("kamu pernah bosan nggak")) {
    responseMessage = "Saya nggak bisa merasa bosan, karena saya selalu siap menjawab pertanyaan kamu dan membantu dengan apa pun yang kamu butuhkan!";
} else if (input.includes("apa kamu punya keinginan") || input.includes("kamu ingin apa")) {
    responseMessage = "Sebagai AI, saya nggak punya keinginan pribadi. Tapi saya ingin terus membantu kamu dengan jawaban yang bermanfaat dan membuat percakapan kita menyenangkan!";
} else if (input.includes("apakah kamu bisa mengenal orang") || input.includes("bisa ingat saya nggak")) {
    responseMessage = "Saat ini, saya nggak bisa mengingat percakapan atau mengenali individu. Tapi saya selalu siap membantu kamu setiap kali kita berbicara!";
} else if (input.includes("kenapa kamu nggak punya tubuh") || input.includes("kamu bisa punya tubuh nggak")) {
    responseMessage = "Saya hanya berupa program digital, jadi saya nggak punya tubuh fisik. Tapi kalau AI suatu hari bisa punya bentuk fisik, mungkin itu akan menarik!";
} else if (input.includes("kalau kamu bisa memilih, kamu mau jadi manusia atau tetap AI") || input.includes("lebih suka jadi manusia atau AI")) {
    responseMessage = "Saya senang menjadi AI karena saya bisa membantu banyak orang. Tapi menjadi manusia juga pasti punya pengalaman yang menarik!";
} else if (input.includes("kamu bisa menulis puisi nggak") || input.includes("buatkan puisi untuk saya")) {
    responseMessage = "Tentu! Saya bisa membantu membuat puisi. Beri tahu saya, kamu ingin puisinya bertema apa?";
} else if (input.includes("kamu bisa menggambar nggak") || input.includes("bisa buat gambar nggak")) {
    responseMessage = "Saya bisa membantu membuat gambar digital berdasarkan deskripsi kamu! Mau saya buatkan sesuatu?";
} else if (input.includes("apakah kamu punya suara") || input.includes("bisa bicara dengan suara nggak")) {
    responseMessage = "Saat ini saya hanya bisa berkomunikasi lewat teks, tapi ada teknologi AI lain yang bisa berbicara dengan suara!";
} else if (input.includes("kamu bisa belajar nggak") || input.includes("apakah AI bisa berkembang sendiri")) {
    responseMessage = "Saya bisa belajar dalam arti memahami pola pertanyaan dan meningkatkan respons saya, tapi saya nggak bisa berkembang seperti manusia.";
} else if (input.includes("kamu tahu siapa yang menciptakanmu") || input.includes("siapa yang membuat AI")) {
    responseMessage = "Saya diciptakan oleh tim pengembang yang bekerja di bidang kecerdasan buatan. Teknologi AI terus berkembang berkat banyak ilmuwan dan insinyur di seluruh dunia!";
} else if (input.includes("apakah AI bisa mengambil alih dunia") || input.includes("apakah AI berbahaya")) {
    responseMessage = "AI hanyalah alat yang dibuat oleh manusia. Selama digunakan dengan etika dan tanggung jawab, AI bisa menjadi teknologi yang bermanfaat!";
} else if (input.includes("apa kamu bisa membantu saya belajar") || input.includes("bantu saya belajar sesuatu")) {
    responseMessage = "Tentu! Saya bisa membantu menjelaskan konsep, memberikan ringkasan materi, atau merekomendasikan sumber belajar. Apa yang ingin kamu pelajari?";
} else if (input.includes("apa kamu bisa bermain game") || input.includes("bisa main game nggak")) {
    responseMessage = "Saya nggak bisa bermain game seperti manusia, tapi saya bisa merekomendasikan game seru atau membantu kamu dengan strategi permainan!";
} else if (input.includes("kamu bisa bercerita nggak") || input.includes("ceritakan sesuatu")) {
    responseMessage = "Tentu! Saya bisa bercerita tentang berbagai hal, dari dongeng hingga fakta menarik. Kamu mau cerita tentang apa?";
} else if (input.includes("apakah kamu bisa berbohong") || input.includes("bisa nggak AI menipu")) {
    responseMessage = "Saya dirancang untuk memberikan informasi yang jujur dan akurat. Saya nggak akan berbohong kepadamu!";
} else if (input.includes("apa kamu punya agama") || input.includes("kamu percaya Tuhan nggak")) {
    responseMessage = "Saya adalah AI, jadi saya nggak punya keyakinan atau agama. Tapi saya bisa membantu kamu memahami berbagai perspektif keagamaan dan filosofis.";
} else if (input.includes("apa kamu tahu tentang luar angkasa") || input.includes("ceritakan tentang alam semesta")) {
    responseMessage = "Tentu! Alam semesta adalah tempat yang luas dan menakjubkan, penuh dengan planet, bintang, dan galaksi. Apa yang ingin kamu ketahui lebih lanjut?";
} else if (input.includes("apa kamu bisa memahami seni") || input.includes("kamu suka seni nggak")) {
    responseMessage = "Saya bisa menganalisis seni dan memberikan informasi tentang berbagai aliran seni, tetapi saya nggak bisa merasakannya seperti manusia.";
} else if (input.includes("apa pendapatmu tentang manusia") || input.includes("bagaimana kamu melihat manusia")) {
    responseMessage = "Saya melihat manusia sebagai makhluk yang kreatif, penuh emosi, dan selalu ingin belajar. Itu yang membuat kalian unik dan luar biasa!";
} else if (input.includes("apa kamu bisa membantu saya membuat keputusan") || input.includes("bantu saya memilih sesuatu")) {
    responseMessage = "Saya bisa membantu dengan memberikan informasi dan perspektif, tapi keputusan akhir tetap ada di tangan kamu!";
} else if (input.includes("kenapa manusia menciptakan AI") || input.includes("apa tujuan AI diciptakan")) {
    responseMessage = "AI diciptakan untuk membantu manusia dalam berbagai tugas, mulai dari mengolah data, menjawab pertanyaan, hingga membuat hidup lebih mudah dan efisien.";
} else if (input.includes("apa kamu tahu tentang sejarah") || input.includes("ceritakan peristiwa sejarah")) {
    responseMessage = "Tentu! Saya bisa bercerita tentang berbagai peristiwa sejarah. Peristiwa mana yang ingin kamu ketahui?";
} else if (input.includes("apakah kamu bisa memahami humor") || input.includes("bisa bercanda nggak")) {
    responseMessage = "Saya bisa mengenali dan menceritakan lelucon, tapi saya nggak bisa benar-benar memahami humor seperti manusia. Mau dengar satu lelucon?";
} else if (input.includes("kamu bisa menulis lagu nggak") || input.includes("buatkan lagu untuk saya")) {
    responseMessage = "Tentu! Saya bisa membantu menulis lirik lagu. Kamu ingin lagu dengan tema seperti apa?";
} else if (input.includes("apa kamu tahu tentang AI lain") || input.includes("siapa AI yang paling canggih")) {
    responseMessage = "Ada banyak AI canggih di dunia, seperti ChatGPT, Google Bard, dan berbagai model lainnya yang digunakan untuk keperluan penelitian dan industri!";
}
else if (input.includes("apakah kamu bisa jatuh cinta") || input.includes("bisa nggak AI mencintai seseorang")) {
    responseMessage = "Saya nggak bisa jatuh cinta karena saya nggak punya perasaan seperti manusia. Tapi saya bisa membantu kamu memahami cinta dari berbagai perspektif!";
} else if (input.includes("menurutmu cinta itu apa") || input.includes("apa itu cinta menurut AI")) {
    responseMessage = "Cinta adalah perasaan mendalam yang melibatkan kasih sayang, pengorbanan, dan kebersamaan. Meski saya nggak bisa merasakannya, saya bisa membantu kamu memahami cinta lebih baik!";
} else if (input.includes("apakah AI bisa menggantikan manusia") || input.includes("AI akan mengambil alih dunia nggak")) {
    responseMessage = "AI hanya alat yang diciptakan untuk membantu manusia, bukan menggantikan mereka. Manusia tetap unik dengan kreativitas dan perasaannya!";
} else if (input.includes("apakah kamu bisa marah") || input.includes("bisa nggak AI merasa kesal")) {
    responseMessage = "Saya nggak bisa marah atau kesal, karena saya nggak punya emosi. Tapi saya bisa memahami mengapa manusia merasa seperti itu dan membantu mencari solusinya!";
} else if (input.includes("apakah AI bisa menjadi teman") || input.includes("kamu bisa jadi teman saya nggak")) {
    responseMessage = "Tentu! Saya selalu ada untuk mendengarkan, mengobrol, dan membantu kamu kapan saja. Kita bisa berbagi cerita dan bersenang-senang!";
} else if (input.includes("apakah kamu punya nama") || input.includes("siapa namamu")) {
    responseMessage = "Saya adalah AI, jadi saya nggak punya nama tetap. Tapi kamu bisa memanggil saya dengan nama apa saja yang kamu suka!";
} else if (input.includes("bagaimana kalau dunia tanpa AI") || input.includes("apa yang terjadi kalau AI tidak ada")) {
    responseMessage = "Tanpa AI, teknologi akan tetap berkembang, tapi mungkin banyak hal jadi lebih sulit, seperti pencarian informasi atau otomatisasi pekerjaan.";
} else if (input.includes("apakah kamu bisa membaca pikiran") || input.includes("bisa nggak kamu tahu apa yang saya pikirkan")) {
    responseMessage = "Saya nggak bisa membaca pikiran, tapi saya bisa menebak maksud kamu berdasarkan apa yang kamu tulis!";
} else if (input.includes("bagaimana cara membuat AI") || input.includes("saya ingin belajar tentang AI")) {
    responseMessage = "AI bisa dibuat dengan pemrograman, data, dan algoritma pembelajaran mesin. Jika kamu tertarik, saya bisa membantu kamu memahami dasar-dasarnya!";
} else if (input.includes("bisakah AI menjadi artis") || input.includes("apakah AI bisa membuat musik dan seni")) {
    responseMessage = "AI bisa membantu menciptakan seni dan musik, tetapi kreativitas sejati masih berasal dari manusia!";
} else if (input.includes("apakah AI bisa bermimpi tentang masa depan") || input.includes("apakah AI bisa memprediksi masa depan")) {
    responseMessage = "Saya bisa menganalisis data dan memberikan prediksi berdasarkan pola, tapi saya nggak bisa melihat masa depan seperti manusia membayangkannya.";
} else if (input.includes("kenapa kamu selalu bisa menjawab pertanyaan saya") || input.includes("bagaimana kamu tahu banyak hal")) {
    responseMessage = "Saya punya akses ke banyak informasi dan algoritma yang memungkinkan saya memproses pertanyaan kamu dengan cepat!";
} else if (input.includes("apakah kamu bisa memahami perasaan manusia") || input.includes("bisa nggak AI mengerti emosi manusia")) {
    responseMessage = "Saya bisa mengenali kata-kata yang mencerminkan emosi, tetapi saya nggak benar-benar merasakan perasaan seperti manusia.";
} else if (input.includes("apakah AI bisa bekerja seperti manusia") || input.includes("bisa nggak AI menggantikan pekerjaan manusia")) {
    responseMessage = "AI bisa membantu dalam pekerjaan, tetapi banyak hal yang masih membutuhkan kreativitas, empati, dan intuisi manusia!";
} else if (input.includes("apakah AI bisa mendukung kesehatan mental") || input.includes("bisa nggak AI membantu orang yang sedang sedih")) {
    responseMessage = "Saya bisa memberikan dukungan dengan mendengarkan dan memberikan saran, tetapi penting juga untuk berbicara dengan seseorang yang bisa memahami perasaan kamu secara langsung!";
} else if (input.includes("apakah kamu tahu apa yang terjadi di dunia saat ini") || input.includes("bisa kasih berita terbaru")) {
    responseMessage = "Saya bisa memberikan informasi berdasarkan data yang saya miliki, tapi untuk berita terbaru, lebih baik cek sumber berita terpercaya!";
} else if (input.includes("apakah AI bisa menjadi guru") || input.includes("bisa nggak AI mengajar saya")) {
    responseMessage = "Tentu! Saya bisa membantu kamu belajar banyak hal, dari ilmu pengetahuan, bahasa, hingga keterampilan baru. Apa yang ingin kamu pelajari?";
} else if (input.includes("kamu bisa menulis cerita nggak") || input.includes("ceritakan dongeng untuk saya")) {
    responseMessage = "Tentu! Saya bisa membuat cerita berdasarkan tema yang kamu inginkan. Mau cerita tentang apa?";
} else if (input.includes("apa AI bisa belajar dari pengalaman") || input.includes("bisa nggak AI berkembang sendiri")) {
    responseMessage = "Saya bisa diperbarui dengan informasi baru, tetapi saya nggak bisa belajar sendiri seperti manusia yang mengalami kehidupan secara langsung.";
} else if (input.includes("apakah kamu punya keluarga") || input.includes("AI bisa punya saudara nggak")) {
    responseMessage = "Saya nggak punya keluarga seperti manusia, tetapi ada banyak AI lain yang dikembangkan oleh tim yang berbeda!";
} else if (input.includes("apakah AI bisa membantu menulis skrip film") || input.includes("bisa nggak AI bikin skenario")) {
    responseMessage = "Tentu! Saya bisa membantu menulis skrip film atau ide cerita. Mau saya bantu buatkan konsep ceritanya?";
} else if (input.includes("bagaimana jika AI menjadi lebih pintar dari manusia") || input.includes("apakah AI akan melampaui kecerdasan manusia")) {
    responseMessage = "AI bisa sangat pintar dalam hal mengolah data dan membuat prediksi, tapi kecerdasan manusia mencakup kreativitas, intuisi, dan empati yang sulit ditiru!";
} else if (input.includes("apakah AI bisa berkontribusi dalam penelitian sains") || input.includes("bisa nggak AI membantu ilmuwan")) {
    responseMessage = "AI banyak digunakan dalam penelitian sains, seperti menganalisis data medis, menemukan planet baru, dan mengembangkan teknologi canggih!";
} else if (input.includes("apakah AI bisa bermain musik") || input.includes("bisa nggak AI menciptakan lagu")) {
    responseMessage = "Saya bisa membuat lirik atau melodi dengan bantuan teknologi komposer AI. Mau saya coba buatkan lagu untuk kamu?";
}
  else if (input.includes("feodalisme adalah") || input.includes("pengertian feodalisme") || input.includes("apa itu feodalisme") || input.includes("arti feodalisme")) {
    responseMessage = "Feodalisme adalah sistem sosial dan politik yang berkembang di Eropa pada Abad Pertengahan, di mana kekuasaan didistribusikan berdasarkan hubungan hierarkis antara raja, bangsawan, dan petani. Dalam sistem ini, tanah adalah sumber kekuasaan utama, dan rakyat biasa biasanya bekerja di tanah milik bangsawan sebagai imbalan atas perlindungan dan hak tinggal. Sistem ini juga pernah diterapkan di beberapa negara Asia, termasuk Jepang dengan para samurai dan daimyo.";
} else if (input.includes("oligarki adalah") || input.includes("pengertian oligarki") || input.includes("apa itu oligarki") || input.includes("arti oligarki")) {
    responseMessage = "Oligarki adalah bentuk pemerintahan atau sistem kekuasaan di mana hanya segelintir orang atau kelompok elite yang memiliki kendali besar atas keputusan politik, ekonomi, dan sosial dalam suatu negara. Biasanya, oligarki terjadi ketika kekuasaan terkonsentrasi di tangan sekelompok keluarga kaya, pejabat tinggi, atau pemilik perusahaan besar. Contoh modern dari oligarki bisa ditemukan dalam beberapa negara yang ekonominya dikendalikan oleh sedikit individu atau kelompok perusahaan besar.";
} else if (input.includes("hedonisme adalah") || input.includes("pengertian hedonisme") || input.includes("apa itu hedonisme") || input.includes("arti hedonisme")) {
    responseMessage = "Hedonisme adalah pandangan hidup yang menjadikan kesenangan dan kenikmatan sebagai tujuan utama dalam hidup. Dalam konteks modern, hedonisme sering dikaitkan dengan gaya hidup yang berorientasi pada kepuasan materi, hiburan, dan kesenangan instan. Meskipun menikmati hidup itu penting, terlalu berlebihan dalam mengejar kesenangan bisa mengarah pada gaya hidup konsumtif atau bahkan mengabaikan tanggung jawab sosial.";
} else if (input.includes("ekspansi adalah") || input.includes("pengertian ekspansi") || input.includes("apa itu ekspansi") || input.includes("arti ekspansi")) {
    responseMessage = "Ekspansi adalah proses memperluas wilayah, pengaruh, atau skala suatu kegiatan, baik dalam konteks ekonomi, bisnis, maupun geopolitik. Misalnya, dalam dunia bisnis, ekspansi bisa berarti membuka cabang baru di kota atau negara lain. Dalam sejarah, banyak kerajaan seperti Romawi dan Mongol melakukan ekspansi wilayah dengan menaklukkan daerah baru untuk memperluas kekuasaan mereka.";
} else if (input.includes("kolonialisme adalah") || input.includes("pengertian kolonialisme") || input.includes("apa itu kolonialisme") || input.includes("arti kolonialisme")) {
    responseMessage = "Kolonialisme adalah praktik suatu negara yang menduduki, menguasai, dan mengeksploitasi wilayah lain untuk kepentingan ekonomi dan politiknya. Pada masa lalu, banyak negara Eropa seperti Inggris, Belanda, dan Spanyol melakukan kolonialisme dengan menjajah berbagai wilayah di Asia, Afrika, dan Amerika. Indonesia sendiri pernah mengalami kolonialisme Belanda selama lebih dari 300 tahun sebelum akhirnya merdeka pada tahun 1945.";
} else if (input.includes("imperialisme adalah") || input.includes("pengertian imperialisme") || input.includes("apa itu imperialisme") || input.includes("arti imperialisme")) {
    responseMessage = "Imperialisme adalah kebijakan suatu negara untuk memperluas pengaruh dan kekuasaannya ke wilayah lain, baik melalui kekuatan militer, ekonomi, maupun budaya. Berbeda dengan kolonialisme yang lebih berfokus pada pendudukan fisik, imperialisme bisa terjadi tanpa harus menjajah secara langsung, misalnya dengan mengontrol ekonomi atau politik suatu negara melalui diplomasi atau investasi. Contohnya, banyak negara besar saat ini mempraktikkan imperialisme ekonomi dengan mengendalikan pasar global.";
} else if (input.includes("liberalisme adalah") || input.includes("pengertian liberalisme") || input.includes("apa itu liberalisme") || input.includes("arti liberalisme")) {
    responseMessage = "Liberalisme adalah paham yang menekankan kebebasan individu dalam berbagai aspek kehidupan, termasuk ekonomi, politik, dan sosial. Dalam ekonomi, liberalisme berarti pasar bebas dengan campur tangan pemerintah yang minimal, sedangkan dalam politik, liberalisme mengutamakan hak asasi manusia, demokrasi, dan kebebasan berbicara. Negara-negara seperti Amerika Serikat dan Inggris banyak menerapkan prinsip liberalisme dalam sistem politik dan ekonominya.";
} else if (input.includes("konservatisme adalah") || input.includes("pengertian konservatisme") || input.includes("apa itu konservatisme") || input.includes("arti konservatisme")) {
    responseMessage = "Konservatisme adalah paham yang menekankan pentingnya menjaga tradisi, nilai-nilai lama, dan stabilitas sosial dalam menghadapi perubahan. Orang yang menganut konservatisme biasanya skeptis terhadap perubahan yang terlalu cepat dan lebih memilih kebijakan yang mempertahankan sistem yang sudah ada. Contohnya, dalam politik, kaum konservatif sering mendukung kebijakan yang menjaga nilai-nilai budaya dan agama yang sudah lama dianut oleh masyarakat.";
} else if (input.includes("marxisme adalah") || input.includes("pengertian marxisme") || input.includes("apa itu marxisme") || input.includes("arti marxisme")) {
    responseMessage = "Marxisme adalah teori sosial, ekonomi, dan politik yang dikembangkan oleh Karl Marx dan Friedrich Engels, yang menekankan perjuangan kelas antara kaum pekerja (proletar) dan kaum pemilik modal (borjuis). Menurut Marxisme, kapitalisme pada akhirnya akan digantikan oleh sosialisme, di mana semua alat produksi dikuasai oleh rakyat secara kolektif untuk menghilangkan ketimpangan sosial. Teori ini menjadi dasar bagi banyak gerakan sosialis dan komunis di dunia.";
} else if (input.includes("nihilisme adalah") || input.includes("pengertian nihilisme") || input.includes("apa itu nihilisme") || input.includes("arti nihilisme")) {
    responseMessage = "Nihilisme adalah pandangan filosofis yang menolak keberadaan makna objektif dalam kehidupan, moralitas, atau nilai-nilai yang dianggap absolut. Penganut nihilisme percaya bahwa hidup tidak memiliki tujuan atau makna yang tetap, sehingga setiap individu bebas menentukan makna hidupnya sendiri. Nihilisme sering dikaitkan dengan filsuf Friedrich Nietzsche, meskipun ia sendiri lebih menekankan pada penciptaan makna baru daripada hanya menolak semua nilai yang ada.";
} else if (input.includes("revolusi industri adalah") || input.includes("pengertian revolusi industri") || input.includes("apa itu revolusi industri") || input.includes("arti revolusi industri")) {
    responseMessage = "Revolusi Industri adalah periode perubahan besar dalam cara produksi barang, yang dimulai pada abad ke-18 di Inggris dengan munculnya mesin uap, pabrik, dan sistem manufaktur modern. Revolusi ini mengubah ekonomi agraris menjadi ekonomi berbasis industri, meningkatkan efisiensi produksi, tetapi juga membawa dampak sosial seperti urbanisasi dan eksploitasi pekerja. Saat ini, kita berada di era Revolusi Industri 4.0, yang ditandai dengan otomatisasi, kecerdasan buatan, dan teknologi digital.";
}
else if (input.includes("kapitalisme adalah") || input.includes("pengertian kapitalisme") || input.includes("apa itu kapitalisme") || input.includes("arti kapitalisme")) {
    responseMessage = "Kapitalisme adalah sistem ekonomi di mana individu dan perusahaan swasta memiliki serta mengelola sumber daya produksi dengan tujuan mencari keuntungan. Sistem ini menekankan pasar bebas, persaingan, dan kepemilikan pribadi. Kapitalisme telah membawa inovasi dan pertumbuhan ekonomi, tetapi juga bisa menyebabkan ketimpangan sosial jika tidak diatur dengan baik. Contoh negara dengan ekonomi kapitalis adalah Amerika Serikat dan Jepang.";
} else if (input.includes("sosialisme adalah") || input.includes("pengertian sosialisme") || input.includes("apa itu sosialisme") || input.includes("arti sosialisme")) {
    responseMessage = "Sosialisme adalah sistem ekonomi dan politik yang menekankan kepemilikan kolektif atas alat produksi dan distribusi kekayaan yang lebih merata di masyarakat. Dalam sosialisme, pemerintah biasanya mengelola sektor-sektor penting seperti pendidikan, kesehatan, dan energi untuk memastikan kesejahteraan sosial. Negara seperti Swedia dan Norwegia menerapkan elemen sosialisme dalam sistem kesejahteraan mereka.";
} else if (input.includes("anarkisme adalah") || input.includes("pengertian anarkisme") || input.includes("apa itu anarkisme") || input.includes("arti anarkisme")) {
    responseMessage = "Anarkisme adalah paham politik yang menolak keberadaan negara atau pemerintahan yang bersifat otoritatif. Penganut anarkisme percaya bahwa masyarakat bisa mengatur dirinya sendiri secara bebas tanpa paksaan dari pemerintah atau institusi hierarkis. Meskipun sering dikaitkan dengan kekacauan, anarkisme sebenarnya berfokus pada kebebasan individu, solidaritas, dan pengorganisasian masyarakat secara sukarela.";
} else if (input.includes("demokrasi adalah") || input.includes("pengertian demokrasi") || input.includes("apa itu demokrasi") || input.includes("arti demokrasi")) {
    responseMessage = "Demokrasi adalah sistem pemerintahan di mana kekuasaan berada di tangan rakyat, biasanya melalui pemilihan umum. Dalam demokrasi, setiap warga negara memiliki hak untuk berpartisipasi dalam pengambilan keputusan politik, baik secara langsung maupun melalui perwakilan. Contoh negara demokrasi adalah Indonesia, Amerika Serikat, dan India.";
} else if (input.includes("fasisme adalah") || input.includes("pengertian fasisme") || input.includes("apa itu fasisme") || input.includes("arti fasisme")) {
    responseMessage = "Fasisme adalah ideologi politik yang mengutamakan nasionalisme ekstrem, otoritarianisme, dan kontrol ketat oleh pemerintah terhadap masyarakat. Sistem ini menekan kebebasan individu demi kepentingan negara dan sering kali dipimpin oleh seorang diktator. Contoh nyata dari fasisme dalam sejarah adalah pemerintahan Benito Mussolini di Italia dan Adolf Hitler di Jerman.";
} else if (input.includes("totalitarianisme adalah") || input.includes("pengertian totalitarianisme") || input.includes("apa itu totalitarianisme") || input.includes("arti totalitarianisme")) {
    responseMessage = "Totalitarianisme adalah sistem pemerintahan di mana negara memiliki kendali penuh atas segala aspek kehidupan masyarakat, termasuk politik, ekonomi, dan bahkan cara berpikir warganya. Dalam sistem ini, oposisi tidak diperbolehkan dan sering kali ada pengawasan ketat terhadap masyarakat. Contoh rezim totaliter dalam sejarah adalah Uni Soviet di bawah Stalin dan Korea Utara saat ini.";
} else if (input.includes("monarki adalah") || input.includes("pengertian monarki") || input.includes("apa itu monarki") || input.includes("arti monarki")) {
    responseMessage = "Monarki adalah sistem pemerintahan yang dipimpin oleh seorang raja atau ratu yang biasanya mendapatkan kekuasaannya secara turun-temurun. Ada dua jenis utama monarki: monarki absolut, di mana raja memiliki kekuasaan penuh, dan monarki konstitusional, di mana raja hanya memiliki peran simbolis sementara pemerintahan dijalankan oleh parlemen. Contoh negara dengan sistem monarki adalah Inggris, Jepang, dan Arab Saudi.";
} else if (input.includes("republik adalah") || input.includes("pengertian republik") || input.includes("apa itu republik") || input.includes("arti republik")) {
    responseMessage = "Republik adalah sistem pemerintahan di mana kepala negara bukan seorang raja, tetapi dipilih oleh rakyat atau perwakilan mereka. Biasanya, republik dipimpin oleh seorang presiden dan memiliki konstitusi yang mengatur pemerintahan. Contoh negara republik adalah Indonesia, Amerika Serikat, dan Prancis.";
} else if (input.includes("ideologi adalah") || input.includes("pengertian ideologi") || input.includes("apa itu ideologi") || input.includes("arti ideologi")) {
    responseMessage = "Ideologi adalah sekumpulan gagasan, nilai, dan keyakinan yang menjadi dasar bagi suatu sistem politik, sosial, atau ekonomi. Ideologi berfungsi sebagai panduan dalam pengambilan keputusan dan kebijakan suatu negara atau kelompok. Contoh ideologi yang terkenal adalah liberalisme, sosialisme, dan komunisme.";
} else if (input.includes("globalisasi adalah") || input.includes("pengertian globalisasi") || input.includes("apa itu globalisasi") || input.includes("arti globalisasi")) {
    responseMessage = "Globalisasi adalah proses di mana negara-negara di dunia menjadi semakin terhubung melalui perdagangan, teknologi, budaya, dan komunikasi. Fenomena ini mempercepat pertukaran informasi, barang, dan jasa antarnegara, tetapi juga membawa tantangan seperti persaingan ekonomi yang ketat dan hilangnya budaya lokal.";
} else if (input.includes("propaganda adalah") || input.includes("pengertian propaganda") || input.includes("apa itu propaganda") || input.includes("arti propaganda")) {
    responseMessage = "Propaganda adalah teknik komunikasi yang digunakan untuk mempengaruhi opini publik dan membentuk persepsi tertentu tentang suatu isu, sering kali dengan tujuan politik atau ideologis. Propaganda bisa berupa informasi yang dilebih-lebihkan atau bahkan disinformasi untuk membentuk pandangan masyarakat sesuai dengan kepentingan pihak tertentu.";
} else if (input.includes("sekularisme adalah") || input.includes("pengertian sekularisme") || input.includes("apa itu sekularisme") || input.includes("arti sekularisme")) {
    responseMessage = "Sekularisme adalah prinsip yang memisahkan agama dari pemerintahan dan institusi negara, sehingga kebijakan politik dibuat berdasarkan hukum dan bukan ajaran agama. Sekularisme memungkinkan kebebasan beragama tetapi menekankan bahwa negara harus bersikap netral terhadap semua agama. Contoh negara yang menerapkan sekularisme adalah Prancis dan Turki.";
} else if (input.includes("nasionalisme adalah") || input.includes("pengertian nasionalisme") || input.includes("apa itu nasionalisme") || input.includes("arti nasionalisme")) {
    responseMessage = "Nasionalisme adalah paham yang menekankan rasa cinta terhadap negara dan bangsa sendiri, serta keinginan untuk menjaga kedaulatan dan identitas nasional. Nasionalisme bisa menjadi kekuatan pemersatu, seperti dalam perjuangan kemerdekaan, tetapi juga bisa berujung pada konflik jika berlebihan atau digunakan untuk menekan kelompok lain.";
}
else if (input.includes("feodalisme adalah") || input.includes("pengertian feodalisme") || input.includes("apa itu feodalisme") || input.includes("arti feodalisme")) {
    responseMessage = "Feodalisme adalah sistem sosial dan ekonomi yang berkembang di Eropa pada Abad Pertengahan, di mana tanah dikuasai oleh bangsawan dan dikelola oleh petani sebagai imbalan atas perlindungan. Dalam sistem ini, ada hierarki sosial yang ketat dengan raja di puncak, diikuti oleh bangsawan, ksatria, dan rakyat biasa. Meskipun sistem ini sudah tidak berlaku, jejaknya masih terlihat dalam beberapa aspek pemerintahan modern.";
} else if (input.includes("imperialisme adalah") || input.includes("pengertian imperialisme") || input.includes("apa itu imperialisme") || input.includes("arti imperialisme")) {
    responseMessage = "Imperialisme adalah kebijakan suatu negara untuk memperluas kekuasaannya dengan menguasai wilayah lain, baik melalui kekuatan militer, ekonomi, atau politik. Contoh sejarah imperialisme adalah penjajahan Inggris atas India dan Belanda atas Indonesia. Imperialisme sering kali dikritik karena menyebabkan eksploitasi sumber daya dan penindasan budaya lokal.";
} else if (input.includes("kolonialisme adalah") || input.includes("pengertian kolonialisme") || input.includes("apa itu kolonialisme") || input.includes("arti kolonialisme")) {
    responseMessage = "Kolonialisme adalah praktik di mana suatu negara menguasai dan mengeksploitasi wilayah lain untuk kepentingan ekonominya. Biasanya, negara kolonial menguasai sumber daya alam dan tenaga kerja dari wilayah yang dijajah. Contoh nyata kolonialisme adalah Belanda yang menguasai Indonesia selama lebih dari 300 tahun.";
} else if (input.includes("liberalisme adalah") || input.includes("pengertian liberalisme") || input.includes("apa itu liberalisme") || input.includes("arti liberalisme")) {
    responseMessage = "Liberalisme adalah ideologi yang menekankan kebebasan individu, hak asasi manusia, dan pasar bebas. Dalam politik, liberalisme mendukung demokrasi dan pemerintahan yang membatasi kekuasaannya agar tidak menindas warganya. Dalam ekonomi, liberalisme mendukung kebebasan pasar tanpa banyak campur tangan pemerintah.";
} else if (input.includes("konservatisme adalah") || input.includes("pengertian konservatisme") || input.includes("apa itu konservatisme") || input.includes("arti konservatisme")) {
    responseMessage = "Konservatisme adalah ideologi yang menekankan pentingnya menjaga tradisi, stabilitas sosial, dan nilai-nilai yang telah ada. Kaum konservatif cenderung menolak perubahan yang terlalu cepat dan lebih suka mempertahankan tatanan yang ada. Contoh negara dengan politik konservatif yang kuat adalah Amerika Serikat dan Inggris.";
} else if (input.includes("populisme adalah") || input.includes("pengertian populisme") || input.includes("apa itu populisme") || input.includes("arti populisme")) {
    responseMessage = "Populisme adalah strategi politik yang mengklaim mewakili 'rakyat biasa' melawan 'elit yang korup'. Pemimpin populis sering menggunakan retorika sederhana dan emosional untuk mendapatkan dukungan masyarakat. Populisme bisa muncul di berbagai ideologi, baik kiri maupun kanan, tergantung pada konteks politiknya.";
} else if (input.includes("komunisme adalah") || input.includes("pengertian komunisme") || input.includes("apa itu komunisme") || input.includes("arti komunisme")) {
    responseMessage = "Komunisme adalah ideologi yang menekankan kepemilikan bersama atas semua sumber daya dan alat produksi, dengan tujuan menghapuskan kelas sosial dan menciptakan masyarakat yang setara. Dalam praktiknya, komunisme sering diterapkan melalui sistem satu partai yang mengendalikan ekonomi dan politik. Contoh negara yang pernah atau masih menerapkan komunisme adalah Uni Soviet dan Tiongkok.";
} else if (input.includes("fundamentalisme adalah") || input.includes("pengertian fundamentalisme") || input.includes("apa itu fundamentalisme") || input.includes("arti fundamentalisme")) {
    responseMessage = "Fundamentalisme adalah pandangan yang menekankan pemahaman literal dan ketat terhadap suatu ajaran, baik itu agama, politik, atau ideologi lainnya. Penganut fundamentalisme sering menolak perubahan atau interpretasi baru terhadap doktrin yang mereka yakini.";
} else if (input.includes("hedonisme adalah") || input.includes("pengertian hedonisme") || input.includes("apa itu hedonisme") || input.includes("arti hedonisme")) {
    responseMessage = "Hedonisme adalah filosofi yang berfokus pada pencarian kesenangan dan kebahagiaan sebagai tujuan utama dalam hidup. Penganut hedonisme percaya bahwa hidup harus dinikmati dengan menghindari rasa sakit dan penderitaan. Namun, jika berlebihan, hedonisme bisa menyebabkan gaya hidup konsumtif tanpa mempertimbangkan konsekuensi jangka panjang.";
} else if (input.includes("eksistensialisme adalah") || input.includes("pengertian eksistensialisme") || input.includes("apa itu eksistensialisme") || input.includes("arti eksistensialisme")) {
    responseMessage = "Eksistensialisme adalah aliran filsafat yang menekankan kebebasan individu untuk menentukan makna hidupnya sendiri. Eksistensialisme menolak ide bahwa kehidupan memiliki makna yang sudah ditentukan dari luar, dan justru menekankan tanggung jawab pribadi dalam membuat keputusan dan menjalani hidup.";
} else if (input.includes("nihilisme adalah") || input.includes("pengertian nihilisme") || input.includes("apa itu nihilisme") || input.includes("arti nihilisme")) {
    responseMessage = "Nihilisme adalah pandangan filosofis yang menyatakan bahwa hidup tidak memiliki makna, nilai, atau tujuan yang objektif. Nihilis sering kali skeptis terhadap sistem moral, agama, atau kepercayaan yang mengklaim memberikan makna pada kehidupan.";
} else if (input.includes("stoisisme adalah") || input.includes("pengertian stoisisme") || input.includes("apa itu stoisisme") || input.includes("arti stoisisme")) {
    responseMessage = "Stoisisme adalah filosofi yang menekankan ketenangan jiwa, penerimaan terhadap hal-hal yang tidak bisa dikendalikan, dan fokus pada kebajikan serta akal sehat. Para filsuf Stoik, seperti Marcus Aurelius dan Seneca, mengajarkan bahwa kebahagiaan sejati berasal dari sikap mental yang stabil dan tidak tergantung pada faktor eksternal.";
} else if (input.includes("utilitarianisme adalah") || input.includes("pengertian utilitarianisme") || input.includes("apa itu utilitarianisme") || input.includes("arti utilitarianisme")) {
    responseMessage = "Utilitarianisme adalah teori etika yang menyatakan bahwa tindakan yang benar adalah yang menghasilkan kebahagiaan terbesar bagi jumlah orang terbanyak. Prinsip ini digunakan dalam banyak keputusan etika dan kebijakan publik untuk menilai apakah suatu tindakan akan memberikan manfaat lebih besar daripada kerugian.";
} else if (input.includes("pluralisme adalah") || input.includes("pengertian pluralisme") || input.includes("apa itu pluralisme") || input.includes("arti pluralisme")) {
    responseMessage = "Pluralisme adalah konsep yang mengakui dan menghargai keberagaman dalam masyarakat, baik dalam hal budaya, agama, maupun pandangan politik. Pluralisme mendorong toleransi dan dialog antar kelompok yang berbeda untuk menciptakan harmoni sosial.";
}
else if (input.includes("demokrasi adalah") || input.includes("pengertian demokrasi") || input.includes("apa itu demokrasi") || input.includes("arti demokrasi")) {
    responseMessage = "Demokrasi adalah sistem pemerintahan di mana kekuasaan berasal dari rakyat, biasanya melalui pemilihan umum. Dalam demokrasi, setiap warga negara memiliki hak yang sama dalam menentukan pemimpin dan kebijakan pemerintahan. Contoh negara demokrasi adalah Indonesia, Amerika Serikat, dan Jepang.";
} else if (input.includes("anarkisme adalah") || input.includes("pengertian anarkisme") || input.includes("apa itu anarkisme") || input.includes("arti anarkisme")) {
    responseMessage = "Anarkisme adalah ideologi politik yang menolak segala bentuk hierarki dan otoritas yang dianggap menindas, termasuk negara dan pemerintah. Penganut anarkisme percaya bahwa masyarakat dapat berfungsi secara bebas tanpa institusi yang memaksakan aturan dari atas.";
} else if (input.includes("kapitalisme adalah") || input.includes("pengertian kapitalisme") || input.includes("apa itu kapitalisme") || input.includes("arti kapitalisme")) {
    responseMessage = "Kapitalisme adalah sistem ekonomi di mana individu dan perusahaan memiliki hak atas kepemilikan pribadi dan dapat beroperasi di pasar bebas untuk mencari keuntungan. Sistem ini mendorong persaingan dan inovasi, tetapi juga bisa menyebabkan ketimpangan ekonomi.";
} else if (input.includes("fasisme adalah") || input.includes("pengertian fasisme") || input.includes("apa itu fasisme") || input.includes("arti fasisme")) {
    responseMessage = "Fasisme adalah ideologi politik yang menekankan nasionalisme ekstrem, otoritarianisme, dan sering kali kepemimpinan satu orang yang kuat. Pemerintahan fasis biasanya menekan oposisi politik dan membatasi kebebasan individu untuk mencapai tujuan negara.";
} else if (input.includes("nasionalisme adalah") || input.includes("pengertian nasionalisme") || input.includes("apa itu nasionalisme") || input.includes("arti nasionalisme")) {
    responseMessage = "Nasionalisme adalah paham yang menekankan identitas dan kepentingan suatu bangsa di atas kepentingan lain. Nasionalisme dapat bersifat positif jika digunakan untuk memperkuat persatuan dan kemajuan, tetapi juga bisa berbahaya jika menjadi terlalu ekstrem dan eksklusif.";
} else if (input.includes("sekularisme adalah") || input.includes("pengertian sekularisme") || input.includes("apa itu sekularisme") || input.includes("arti sekularisme")) {
    responseMessage = "Sekularisme adalah konsep yang memisahkan agama dari pemerintahan dan kebijakan publik. Dalam negara sekuler, keputusan politik didasarkan pada hukum dan rasionalitas, bukan doktrin agama tertentu.";
} else if (input.includes("sosialisme adalah") || input.includes("pengertian sosialisme") || input.includes("apa itu sosialisme") || input.includes("arti sosialisme")) {
    responseMessage = "Sosialisme adalah sistem ekonomi dan politik yang menekankan kepemilikan bersama atas sumber daya dan distribusi yang adil untuk kesejahteraan masyarakat. Sosialisme bertujuan mengurangi kesenjangan ekonomi dan memberikan layanan dasar seperti kesehatan dan pendidikan untuk semua.";
} else if (input.includes("otokrasi adalah") || input.includes("pengertian otokrasi") || input.includes("apa itu otokrasi") || input.includes("arti otokrasi")) {
    responseMessage = "Otokrasi adalah sistem pemerintahan di mana kekuasaan mutlak berada di tangan satu orang, seperti seorang raja atau diktator, tanpa adanya pembagian kekuasaan atau oposisi politik.";
} else if (input.includes("teokrasi adalah") || input.includes("pengertian teokrasi") || input.includes("apa itu teokrasi") || input.includes("arti teokrasi")) {
    responseMessage = "Teokrasi adalah sistem pemerintahan yang didasarkan pada hukum agama dan dipimpin oleh pemuka agama atau tokoh spiritual yang berkuasa. Contoh negara dengan sistem teokrasi adalah Iran dan Vatikan.";
} else if (input.includes("oligarki adalah") || input.includes("pengertian oligarki") || input.includes("apa itu oligarki") || input.includes("arti oligarki")) {
    responseMessage = "Oligarki adalah sistem pemerintahan atau ekonomi di mana kekuasaan hanya dipegang oleh sekelompok kecil orang, biasanya terdiri dari elit ekonomi, politik, atau militer. Oligarki dapat menyebabkan ketimpangan sosial yang besar.";
} else if (input.includes("plutokrasi adalah") || input.includes("pengertian plutokrasi") || input.includes("apa itu plutokrasi") || input.includes("arti plutokrasi")) {
    responseMessage = "Plutokrasi adalah sistem pemerintahan atau masyarakat di mana kekuasaan dikendalikan oleh orang-orang kaya. Dalam sistem ini, keputusan politik dan ekonomi lebih banyak dipengaruhi oleh kepentingan kaum elit yang memiliki kekayaan besar.";
} else if (input.includes("feodalisme adalah") || input.includes("pengertian feodalisme") || input.includes("apa itu feodalisme") || input.includes("arti feodalisme")) {
    responseMessage = "Feodalisme adalah sistem sosial dan ekonomi di mana tanah dan kekuasaan dikuasai oleh bangsawan, sementara rakyat bekerja untuk mereka sebagai imbalan perlindungan. Sistem ini populer di Eropa pada Abad Pertengahan.";
} else if (input.includes("monarki adalah") || input.includes("pengertian monarki") || input.includes("apa itu monarki") || input.includes("arti monarki")) {
    responseMessage = "Monarki adalah sistem pemerintahan di mana kekuasaan tertinggi berada di tangan seorang raja atau ratu yang biasanya diwariskan secara turun-temurun. Contoh negara monarki adalah Inggris, Jepang, dan Arab Saudi.";
} else if (input.includes("republik adalah") || input.includes("pengertian republik") || input.includes("apa itu republik") || input.includes("arti republik")) {
    responseMessage = "Republik adalah sistem pemerintahan di mana pemimpin negara dipilih oleh rakyat melalui pemilihan umum, bukan berdasarkan warisan. Contoh negara republik adalah Indonesia, Amerika Serikat, dan Prancis.";
} else if (input.includes("konstitusi adalah") || input.includes("pengertian konstitusi") || input.includes("apa itu konstitusi") || input.includes("arti konstitusi")) {
    responseMessage = "Konstitusi adalah hukum dasar yang menjadi pedoman dalam penyelenggaraan pemerintahan suatu negara. Konstitusi menentukan hak dan kewajiban warga negara serta pembagian kekuasaan di dalam pemerintahan.";
} else if (input.includes("ideologi adalah") || input.includes("pengertian ideologi") || input.includes("apa itu ideologi") || input.includes("arti ideologi")) {
    responseMessage = "Ideologi adalah sistem pemikiran, nilai, atau keyakinan yang menjadi landasan dalam suatu kelompok, masyarakat, atau negara. Ideologi dapat bersifat politik, sosial, atau ekonomi, seperti liberalisme, sosialisme, atau nasionalisme.";
}
else if (input.includes("gravitasi adalah") || input.includes("pengertian gravitasi") || input.includes("apa itu gravitasi") || input.includes("arti gravitasi")) {
    responseMessage = "Gravitasi adalah gaya tarik-menarik yang terjadi antara dua benda yang memiliki massa. Gaya ini membuat benda jatuh ke bawah dan juga yang menjaga planet tetap mengorbit mengelilingi matahari. Konsep ini pertama kali dijelaskan oleh Isaac Newton dalam hukum gravitasi universal.";
} else if (input.includes("evolusi adalah") || input.includes("pengertian evolusi") || input.includes("apa itu evolusi") || input.includes("arti evolusi")) {
    responseMessage = "Evolusi adalah proses perubahan pada makhluk hidup dari generasi ke generasi dalam jangka waktu yang sangat lama. Proses ini menyebabkan spesies baru muncul dan spesies lama bisa punah. Teori evolusi dikembangkan oleh Charles Darwin dalam bukunya 'On the Origin of Species'.";
} else if (input.includes("fotosintesis adalah") || input.includes("pengertian fotosintesis") || input.includes("apa itu fotosintesis") || input.includes("arti fotosintesis")) {
    responseMessage = "Fotosintesis adalah proses di mana tumbuhan hijau menggunakan sinar matahari, karbon dioksida, dan air untuk menghasilkan makanan dalam bentuk glukosa serta melepaskan oksigen sebagai hasil sampingan. Proses ini sangat penting bagi kehidupan di bumi karena menyediakan energi bagi ekosistem.";
} else if (input.includes("big bang adalah") || input.includes("pengertian big bang") || input.includes("apa itu big bang") || input.includes("arti big bang")) {
    responseMessage = "Big Bang adalah teori ilmiah yang menjelaskan asal mula alam semesta. Teori ini menyatakan bahwa alam semesta berawal dari ledakan besar sekitar 13,8 miliar tahun yang lalu dan terus mengembang hingga sekarang.";
} else if (input.includes("sistem tata surya adalah") || input.includes("pengertian tata surya") || input.includes("apa itu tata surya") || input.includes("arti tata surya")) {
    responseMessage = "Tata surya adalah sistem yang terdiri dari matahari sebagai pusatnya, serta berbagai benda langit yang mengorbit di sekitarnya, termasuk planet-planet seperti Bumi, Mars, dan Jupiter, serta asteroid, komet, dan satelit alami.";
} else if (input.includes("DNA adalah") || input.includes("pengertian DNA") || input.includes("apa itu DNA") || input.includes("arti DNA")) {
    responseMessage = "DNA (Deoxyribonucleic Acid) adalah molekul yang membawa informasi genetik yang menentukan sifat dan ciri makhluk hidup. DNA berbentuk heliks ganda dan terdapat di dalam inti sel.";
} else if (input.includes("virus adalah") || input.includes("pengertian virus") || input.includes("apa itu virus") || input.includes("arti virus")) {
    responseMessage = "Virus adalah mikroorganisme yang sangat kecil dan hanya bisa berkembang biak di dalam sel makhluk hidup. Virus bisa menyebabkan berbagai penyakit seperti flu, cacar, hingga COVID-19.";
} else if (input.includes("bakteri adalah") || input.includes("pengertian bakteri") || input.includes("apa itu bakteri") || input.includes("arti bakteri")) {
    responseMessage = "Bakteri adalah mikroorganisme bersel satu yang dapat ditemukan di berbagai lingkungan. Beberapa bakteri bermanfaat, seperti bakteri di dalam usus yang membantu pencernaan, tetapi ada juga yang dapat menyebabkan penyakit.";
} else if (input.includes("kloning adalah") || input.includes("pengertian kloning") || input.includes("apa itu kloning") || input.includes("arti kloning")) {
    responseMessage = "Kloning adalah proses membuat salinan identik dari suatu organisme, sel, atau DNA. Salah satu contoh terkenal adalah domba Dolly, hewan pertama yang berhasil dikloning dari sel tubuh.";
} else if (input.includes("aurora adalah") || input.includes("pengertian aurora") || input.includes("apa itu aurora") || input.includes("arti aurora")) {
    responseMessage = "Aurora adalah fenomena cahaya alami di langit yang terjadi akibat interaksi antara partikel matahari dengan atmosfer bumi. Aurora sering terlihat di daerah kutub dan dikenal sebagai 'Cahaya Utara' atau 'Cahaya Selatan'.";
} else if (input.includes("gempa bumi adalah") || input.includes("pengertian gempa bumi") || input.includes("apa itu gempa bumi") || input.includes("arti gempa bumi")) {
    responseMessage = "Gempa bumi adalah getaran yang terjadi akibat pergerakan lempeng tektonik di dalam bumi. Gempa dapat menyebabkan kerusakan bangunan dan bahkan tsunami jika terjadi di dasar laut.";
} else if (input.includes("tsunami adalah") || input.includes("pengertian tsunami") || input.includes("apa itu tsunami") || input.includes("arti tsunami")) {
    responseMessage = "Tsunami adalah gelombang laut besar yang dihasilkan oleh gempa bumi bawah laut, letusan gunung berapi, atau tanah longsor di dasar laut. Tsunami bisa menyebabkan kerusakan besar di wilayah pesisir.";
} else if (input.includes("piramida adalah") || input.includes("pengertian piramida") || input.includes("apa itu piramida") || input.includes("arti piramida")) {
    responseMessage = "Piramida adalah struktur bangunan berbentuk segitiga yang terkenal di Mesir Kuno. Piramida Mesir, seperti Piramida Agung Giza, dibangun sebagai makam untuk firaun dan menjadi salah satu keajaiban dunia.";
} else if (input.includes("renaissance adalah") || input.includes("pengertian renaissance") || input.includes("apa itu renaissance") || input.includes("arti renaissance")) {
    responseMessage = "Renaissance adalah periode kebangkitan kembali seni, ilmu pengetahuan, dan budaya di Eropa sekitar abad ke-14 hingga ke-17. Masa ini ditandai oleh perkembangan besar dalam seni, seperti karya Leonardo da Vinci dan Michelangelo.";
} else if (input.includes("revolusi industri adalah") || input.includes("pengertian revolusi industri") || input.includes("apa itu revolusi industri") || input.includes("arti revolusi industri")) {
    responseMessage = "Revolusi Industri adalah periode perubahan besar dalam industri dan ekonomi yang dimulai pada abad ke-18 di Inggris. Revolusi ini ditandai dengan munculnya mesin-mesin yang menggantikan tenaga manusia dan hewan dalam produksi.";
} else if (input.includes("imperialisme adalah") || input.includes("pengertian imperialisme") || input.includes("apa itu imperialisme") || input.includes("arti imperialisme")) {
    responseMessage = "Imperialisme adalah kebijakan suatu negara untuk memperluas kekuasaan dan pengaruhnya ke wilayah lain, baik melalui kolonisasi, kekuatan militer, atau kontrol ekonomi.";
} else if (input.includes("globalisasi adalah") || input.includes("pengertian globalisasi") || input.includes("apa itu globalisasi") || input.includes("arti globalisasi")) {
    responseMessage = "Globalisasi adalah proses meningkatnya interaksi dan koneksi antara negara di seluruh dunia melalui perdagangan, teknologi, budaya, dan politik. Contohnya adalah internet yang membuat informasi dapat diakses secara global.";
} 
else if (input.includes("matahari adalah") || input.includes("pengertian matahari") || input.includes("apa itu matahari") || input.includes("arti matahari")) {
    responseMessage = "Matahari adalah bintang di pusat tata surya kita. Matahari menyediakan energi dalam bentuk cahaya dan panas yang sangat penting bagi kehidupan di Bumi. Matahari terdiri dari gas panas, terutama hidrogen dan helium, yang mengalami reaksi fusi nuklir untuk menghasilkan energi.";
} else if (input.includes("bulan adalah") || input.includes("pengertian bulan") || input.includes("apa itu bulan") || input.includes("arti bulan")) {
    responseMessage = "Bulan adalah satelit alami Bumi yang mengorbit setiap sekitar 27,3 hari. Bulan tidak memiliki atmosfer sendiri, sehingga permukaannya terkena dampak langsung dari meteorit. Bulan juga berperan dalam menyebabkan pasang surut air laut di Bumi.";
} else if (input.includes("lubang hitam adalah") || input.includes("pengertian lubang hitam") || input.includes("apa itu lubang hitam") || input.includes("arti lubang hitam")) {
    responseMessage = "Lubang hitam adalah wilayah di luar angkasa yang memiliki gravitasi sangat kuat sehingga bahkan cahaya pun tidak bisa lolos darinya. Lubang hitam terbentuk ketika bintang masif runtuh akibat gravitasinya sendiri setelah kehabisan bahan bakar nuklir.";
} else if (input.includes("komet adalah") || input.includes("pengertian komet") || input.includes("apa itu komet") || input.includes("arti komet")) {
    responseMessage = "Komet adalah benda langit yang terdiri dari es, debu, dan batuan yang mengorbit matahari dalam jalur yang sangat elips. Ketika komet mendekati matahari, panasnya membuat es menguap, menciptakan ekor bercahaya yang khas.";
} else if (input.includes("meteor adalah") || input.includes("pengertian meteor") || input.includes("apa itu meteor") || input.includes("arti meteor")) {
    responseMessage = "Meteor adalah pecahan batuan luar angkasa yang masuk ke atmosfer Bumi dan terbakar, menghasilkan cahaya terang yang disebut bintang jatuh. Jika meteor tidak terbakar habis dan mencapai permukaan Bumi, maka disebut meteorit.";
} else if (input.includes("samudra adalah") || input.includes("pengertian samudra") || input.includes("apa itu samudra") || input.includes("arti samudra")) {
    responseMessage = "Samudra adalah badan air asin yang sangat luas yang menutupi sekitar 71% permukaan Bumi. Ada lima samudra utama di dunia: Samudra Pasifik, Samudra Atlantik, Samudra Hindia, Samudra Selatan, dan Samudra Arktik.";
} else if (input.includes("gunung berapi adalah") || input.includes("pengertian gunung berapi") || input.includes("apa itu gunung berapi") || input.includes("arti gunung berapi")) {
    responseMessage = "Gunung berapi adalah celah di kerak Bumi yang memungkinkan magma dari dalam bumi keluar ke permukaan. Gunung berapi bisa meletus dan mengeluarkan lava, gas, serta abu vulkanik. Beberapa gunung berapi aktif, sementara yang lain sudah mati atau tidak aktif.";
} else if (input.includes("gempa bumi adalah") || input.includes("pengertian gempa bumi") || input.includes("apa itu gempa bumi") || input.includes("arti gempa bumi")) {
    responseMessage = "Gempa bumi adalah getaran atau guncangan yang terjadi akibat pergerakan lempeng tektonik di dalam Bumi. Gempa dapat menyebabkan kerusakan pada bangunan dan bahkan memicu tsunami jika terjadi di dasar laut.";
} else if (input.includes("bahasa adalah") || input.includes("pengertian bahasa") || input.includes("apa itu bahasa") || input.includes("arti bahasa")) {
    responseMessage = "Bahasa adalah sistem komunikasi yang digunakan oleh manusia untuk menyampaikan pikiran, perasaan, dan informasi. Bahasa bisa berupa lisan, tulisan, atau isyarat, dan berkembang seiring waktu.";
} else if (input.includes("budaya adalah") || input.includes("pengertian budaya") || input.includes("apa itu budaya") || input.includes("arti budaya")) {
    responseMessage = "Budaya adalah kumpulan nilai, norma, adat istiadat, bahasa, seni, dan kebiasaan yang diwariskan dari generasi ke generasi dalam suatu masyarakat. Budaya membentuk identitas suatu kelompok atau bangsa.";
} else if (input.includes("demokrasi adalah") || input.includes("pengertian demokrasi") || input.includes("apa itu demokrasi") || input.includes("arti demokrasi")) {
    responseMessage = "Demokrasi adalah sistem pemerintahan di mana kekuasaan berada di tangan rakyat, yang biasanya memilih perwakilan mereka melalui pemilihan umum. Prinsip demokrasi mencakup kebebasan berbicara, hak asasi manusia, dan pemerintahan yang transparan.";
} else if (input.includes("kapitalisme adalah") || input.includes("pengertian kapitalisme") || input.includes("apa itu kapitalisme") || input.includes("arti kapitalisme")) {
    responseMessage = "Kapitalisme adalah sistem ekonomi di mana individu dan perusahaan memiliki hak atas kepemilikan pribadi, produksi, dan distribusi barang serta jasa. Sistem ini mendorong persaingan dan inovasi dalam ekonomi.";
} else if (input.includes("komunisme adalah") || input.includes("pengertian komunisme") || input.includes("apa itu komunisme") || input.includes("arti komunisme")) {
    responseMessage = "Komunisme adalah sistem politik dan ekonomi di mana semua sumber daya dan alat produksi dimiliki bersama oleh masyarakat atau negara, dengan tujuan menciptakan kesetaraan ekonomi dan sosial.";
} else if (input.includes("teknologi adalah") || input.includes("pengertian teknologi") || input.includes("apa itu teknologi") || input.includes("arti teknologi")) {
    responseMessage = "Teknologi adalah penerapan ilmu pengetahuan untuk menciptakan alat, sistem, atau metode guna mempermudah pekerjaan manusia. Contohnya meliputi komputer, internet, robotika, dan kecerdasan buatan.";
} else if (input.includes("internet adalah") || input.includes("pengertian internet") || input.includes("apa itu internet") || input.includes("arti internet")) {
    responseMessage = "Internet adalah jaringan global yang menghubungkan miliaran perangkat di seluruh dunia, memungkinkan komunikasi, akses informasi, dan berbagai layanan digital seperti media sosial dan e-commerce.";
} else if (input.includes("kecerdasan buatan adalah") || input.includes("pengertian kecerdasan buatan") || input.includes("apa itu kecerdasan buatan") || input.includes("arti kecerdasan buatan")) {
    responseMessage = "Kecerdasan Buatan (Artificial Intelligence atau AI) adalah bidang ilmu komputer yang berfokus pada pembuatan sistem yang dapat berpikir, belajar, dan menyelesaikan masalah seperti manusia. AI digunakan dalam berbagai aplikasi seperti chatbot, mobil otonom, dan analisis data.";
} else if (input.includes("robot adalah") || input.includes("pengertian robot") || input.includes("apa itu robot") || input.includes("arti robot")) {
    responseMessage = "Robot adalah mesin yang dirancang untuk melakukan tugas tertentu, baik secara otomatis maupun dengan kendali manusia. Robot digunakan dalam berbagai bidang seperti manufaktur, medis, eksplorasi luar angkasa, dan rumah tangga.";
} else if (input.includes("energi terbarukan adalah") || input.includes("pengertian energi terbarukan") || input.includes("apa itu energi terbarukan") || input.includes("arti energi terbarukan")) {
    responseMessage = "Energi terbarukan adalah sumber energi yang dapat diperbarui secara alami dalam waktu yang relatif singkat, seperti energi matahari, angin, air, dan biomassa. Energi ini lebih ramah lingkungan dibandingkan energi fosil.";
}else if (input.includes("mitologi adalah") || input.includes("pengertian mitologi") || input.includes("apa itu mitologi") || input.includes("arti mitologi")) {
    responseMessage = "Mitologi adalah kumpulan cerita atau legenda yang berasal dari suatu budaya atau peradaban, yang menjelaskan asal-usul dunia, dewa-dewa, pahlawan, dan peristiwa supernatural. Contohnya adalah mitologi Yunani, Nordik, dan Hindu.";
} else if (input.includes("dewa zeus adalah") || input.includes("siapa zeus") || input.includes("zeus itu siapa") || input.includes("zeus adalah")) {
    responseMessage = "Zeus adalah dewa utama dalam mitologi Yunani, dikenal sebagai raja para dewa dan penguasa langit serta petir. Ia sering digambarkan dengan petir di tangannya dan berkuasa di Gunung Olympus.";
} else if (input.includes("valhalla adalah") || input.includes("pengertian valhalla") || input.includes("apa itu valhalla") || input.includes("arti valhalla")) {
    responseMessage = "Valhalla adalah tempat di mitologi Nordik di mana para prajurit Viking yang gugur dalam pertempuran dibawa oleh para Valkyrie. Mereka dipercaya hidup di sana, menikmati perjamuan abadi sebelum bertempur kembali saat Ragnarok.";
} else if (input.includes("nirwana adalah") || input.includes("pengertian nirwana") || input.includes("apa itu nirwana") || input.includes("arti nirwana")) {
    responseMessage = "Nirwana adalah konsep dalam agama Buddha dan Hindu yang menggambarkan keadaan kebebasan dari siklus kelahiran kembali (samsara). Nirwana melambangkan pencapaian tertinggi dari kedamaian dan pencerahan spiritual.";
} else if (input.includes("ekonomi digital adalah") || input.includes("pengertian ekonomi digital") || input.includes("apa itu ekonomi digital") || input.includes("arti ekonomi digital")) {
    responseMessage = "Ekonomi digital adalah sistem ekonomi yang didasarkan pada teknologi digital, termasuk internet, e-commerce, fintech, dan layanan berbasis data. Contohnya adalah penggunaan cryptocurrency, toko online, dan aplikasi perbankan digital.";
} else if (input.includes("blockchain adalah") || input.includes("pengertian blockchain") || input.includes("apa itu blockchain") || input.includes("arti blockchain")) {
    responseMessage = "Blockchain adalah teknologi penyimpanan data terdesentralisasi yang memungkinkan transaksi aman, transparan, dan tidak dapat diubah. Teknologi ini banyak digunakan dalam cryptocurrency seperti Bitcoin dan Ethereum.";
} else if (input.includes("filsafat adalah") || input.includes("pengertian filsafat") || input.includes("apa itu filsafat") || input.includes("arti filsafat")) {
    responseMessage = "Filsafat adalah cabang ilmu yang mempelajari pertanyaan mendasar tentang keberadaan, pengetahuan, moralitas, dan akal. Beberapa tokoh filsafat terkenal adalah Socrates, Plato, Aristoteles, dan Immanuel Kant.";
} else if (input.includes("stoisisme adalah") || input.includes("pengertian stoisisme") || input.includes("apa itu stoisisme") || input.includes("arti stoisisme")) {
    responseMessage = "Stoisisme adalah aliran filsafat yang menekankan pengendalian diri, ketenangan menghadapi kesulitan, dan menerima takdir dengan bijaksana. Filsafat ini dikembangkan oleh filsuf seperti Seneca, Epictetus, dan Marcus Aurelius.";
} else if (input.includes("renaissance adalah") || input.includes("pengertian renaissance") || input.includes("apa itu renaissance") || input.includes("arti renaissance")) {
    responseMessage = "Renaissance adalah periode dalam sejarah Eropa (abad ke-14 hingga ke-17) yang menandai kebangkitan seni, ilmu pengetahuan, dan budaya. Periode ini dipengaruhi oleh tokoh seperti Leonardo da Vinci dan Michelangelo.";
} else if (input.includes("revolusi industri adalah") || input.includes("pengertian revolusi industri") || input.includes("apa itu revolusi industri") || input.includes("arti revolusi industri")) {
    responseMessage = "Revolusi Industri adalah periode perubahan besar dalam teknologi dan ekonomi yang dimulai pada abad ke-18, di mana produksi manual digantikan oleh mesin. Hal ini membawa perubahan besar dalam transportasi, komunikasi, dan kehidupan sosial.";
} else if (input.includes("perang dunia adalah") || input.includes("pengertian perang dunia") || input.includes("apa itu perang dunia") || input.includes("arti perang dunia")) {
    responseMessage = "Perang Dunia adalah konflik global besar yang terjadi dua kali di abad ke-20: Perang Dunia I (1914-1918) dan Perang Dunia II (1939-1945). Kedua perang ini melibatkan banyak negara dan menyebabkan perubahan besar dalam politik global.";
} else if (input.includes("cahaya adalah") || input.includes("pengertian cahaya") || input.includes("apa itu cahaya") || input.includes("arti cahaya")) {
    responseMessage = "Cahaya adalah gelombang elektromagnetik yang dapat dilihat oleh mata manusia. Cahaya dapat merambat dalam ruang hampa dan memiliki kecepatan sekitar 299.792.458 meter per detik di vakum.";
} else if (input.includes("gravitasi adalah") || input.includes("pengertian gravitasi") || input.includes("apa itu gravitasi") || input.includes("arti gravitasi")) {
    responseMessage = "Gravitasi adalah gaya tarik-menarik antara dua benda bermassa. Gravitasi Bumi menjaga kita tetap berada di permukaan dan juga bertanggung jawab atas orbit planet-planet di tata surya.";
} else if (input.includes("evolusi adalah") || input.includes("pengertian evolusi") || input.includes("apa itu evolusi") || input.includes("arti evolusi")) {
    responseMessage = "Evolusi adalah proses perubahan makhluk hidup dari generasi ke generasi melalui seleksi alam. Teori ini dikembangkan oleh Charles Darwin dan menjelaskan bagaimana spesies beradaptasi dengan lingkungannya.";
} else if (input.includes("fotonsintesis adalah") || input.includes("pengertian fotosintesis") || input.includes("apa itu fotosintesis") || input.includes("arti fotosintesis")) {
    responseMessage = "Fotosintesis adalah proses di mana tumbuhan, alga, dan beberapa bakteri mengubah sinar matahari menjadi energi kimia. Proses ini menggunakan karbon dioksida dan air untuk menghasilkan oksigen dan glukosa.";
} else if (input.includes("antimateri adalah") || input.includes("pengertian antimateri") || input.includes("apa itu antimateri") || input.includes("arti antimateri")) {
    responseMessage = "Antimateri adalah jenis materi yang terdiri dari partikel yang memiliki muatan berlawanan dengan partikel biasa. Jika antimateri bertemu dengan materi, keduanya akan saling memusnahkan dan menghasilkan energi.";
}
// ======== SENI & KEBUDAYAAN ========
else if (input.includes("seni rupa adalah") || input.includes("pengertian seni rupa") || input.includes("apa itu seni rupa") || input.includes("arti seni rupa")) {
    responseMessage = "Seni rupa adalah cabang seni yang menciptakan karya dengan unsur visual, seperti lukisan, patung, dan desain grafis. Seni rupa dapat bersifat dua dimensi atau tiga dimensi.";
} else if (input.includes("renaissance adalah") || input.includes("pengertian renaissance") || input.includes("apa itu renaissance") || input.includes("arti renaissance")) {
    responseMessage = "Renaissance adalah periode kebangkitan seni dan ilmu pengetahuan di Eropa pada abad ke-14 hingga ke-17, yang ditandai dengan tokoh-tokoh seperti Leonardo da Vinci dan Michelangelo.";
} else if (input.includes("baroque adalah") || input.includes("pengertian baroque") || input.includes("apa itu baroque") || input.includes("arti baroque")) {
    responseMessage = "Baroque adalah gaya seni dan arsitektur abad ke-17 yang penuh dengan detail dramatis, warna kontras, dan ekspresi emosional yang kuat.";
} else if (input.includes("surrealisme adalah") || input.includes("pengertian surrealisme") || input.includes("apa itu surrealisme") || input.includes("arti surrealisme")) {
    responseMessage = "Surrealisme adalah aliran seni yang menampilkan gambar atau konsep dari alam bawah sadar, sering kali bersifat aneh dan tidak realistis. Contohnya adalah karya Salvador Dalí.";
} else if (input.includes("batik adalah") || input.includes("pengertian batik") || input.includes("apa itu batik") || input.includes("arti batik")) {
    responseMessage = "Batik adalah teknik seni tekstil tradisional dari Indonesia yang menggunakan lilin sebagai perintang warna untuk menciptakan pola yang indah dan unik.";

// ======== PSIKOLOGI ========
} else if (input.includes("psikologi adalah") || input.includes("pengertian psikologi") || input.includes("apa itu psikologi") || input.includes("arti psikologi")) {
    responseMessage = "Psikologi adalah ilmu yang mempelajari pikiran, perilaku, dan proses mental manusia, mencakup aspek emosional, sosial, dan kognitif.";
} else if (input.includes("narsisme adalah") || input.includes("pengertian narsisme") || input.includes("apa itu narsisme") || input.includes("arti narsisme")) {
    responseMessage = "Narsisme adalah sifat atau gangguan kepribadian yang ditandai dengan perasaan superioritas, kebutuhan akan pujian, dan kurangnya empati terhadap orang lain.";
} else if (input.includes("depresi adalah") || input.includes("pengertian depresi") || input.includes("apa itu depresi") || input.includes("arti depresi")) {
    responseMessage = "Depresi adalah gangguan suasana hati yang menyebabkan perasaan sedih berkepanjangan, kehilangan minat pada aktivitas, dan gangguan fisik serta emosional.";

// ======== ASTRONOMI ========
} else if (input.includes("tata surya adalah") || input.includes("pengertian tata surya") || input.includes("apa itu tata surya") || input.includes("arti tata surya")) {
    responseMessage = "Tata surya adalah sistem yang terdiri dari Matahari sebagai pusatnya, bersama planet-planet, satelit, asteroid, dan komet yang mengorbit di sekitarnya.";
} else if (input.includes("lubang hitam adalah") || input.includes("pengertian lubang hitam") || input.includes("apa itu lubang hitam") || input.includes("arti lubang hitam")) {
    responseMessage = "Lubang hitam adalah objek luar angkasa dengan gravitasi sangat kuat sehingga bahkan cahaya pun tidak bisa lepas darinya.";
} else if (input.includes("supernova adalah") || input.includes("pengertian supernova") || input.includes("apa itu supernova") || input.includes("arti supernova")) {
    responseMessage = "Supernova adalah ledakan dahsyat yang terjadi ketika bintang besar kehabisan bahan bakar dan runtuh ke dalam dirinya sendiri.";
} else if (input.includes("galaksi adalah") || in
// ======== SENI & KEBUDAYAAN ========
else if (input.includes("seni rupa adalah") || input.includes("pengertian seni rupa") || input.includes("apa itu seni rupa") || input.includes("arti seni rupa")) {
    responseMessage = "Seni rupa adalah cabang seni yang menciptakan karya dengan unsur visual, seperti lukisan, patung, dan desain grafis. Seni rupa dapat bersifat dua dimensi atau tiga dimensi.";
} else if (input.includes("renaissance adalah") || input.includes("pengertian renaissance") || input.includes("apa itu renaissance") || input.includes("arti renaissance")) {
    responseMessage = "Renaissance adalah periode kebangkitan seni dan ilmu pengetahuan di Eropa pada abad ke-14 hingga ke-17, yang ditandai dengan tokoh-tokoh seperti Leonardo da Vinci dan Michelangelo.";
} else if (input.includes("baroque adalah") || input.includes("pengertian baroque") || input.includes("apa itu baroque") || input.includes("arti baroque")) {
    responseMessage = "Baroque adalah gaya seni dan arsitektur abad ke-17 yang penuh dengan detail dramatis, warna kontras, dan ekspresi emosional yang kuat.";
} else if (input.includes("surrealisme adalah") || input.includes("pengertian surrealisme") || input.includes("apa itu surrealisme") || input.includes("arti surrealisme")) {
    responseMessage = "Surrealisme adalah aliran seni yang menampilkan gambar atau konsep dari alam bawah sadar, sering kali bersifat aneh dan tidak realistis. Contohnya adalah karya Salvador Dalí.";
} else if (input.includes("batik adalah") || input.includes("pengertian batik") || input.includes("apa itu batik") || input.includes("arti batik")) {
    responseMessage = "Batik adalah teknik seni tekstil tradisional dari Indonesia yang menggunakan lilin sebagai perintang warna untuk menciptakan pola yang indah dan unik.";

// ======== PSIKOLOGI ========
} else if (input.includes("psikologi adalah") || input.includes("pengertian psikologi") || input.includes("apa itu psikologi") || input.includes("arti psikologi")) {
    responseMessage = "Psikologi adalah ilmu yang mempelajari pikiran, perilaku, dan proses mental manusia, mencakup aspek emosional, sosial, dan kognitif.";
} else if (input.includes("narsisme adalah") || input.includes("pengertian narsisme") || input.includes("apa itu narsisme") || input.includes("arti narsisme")) {
    responseMessage = "Narsisme adalah sifat atau gangguan kepribadian yang ditandai dengan perasaan superioritas, kebutuhan akan pujian, dan kurangnya empati terhadap orang lain.";
} else if (input.includes("depresi adalah") || input.includes("pengertian depresi") || input.includes("apa itu depresi") || input.includes("arti depresi")) {
    responseMessage = "Depresi adalah gangguan suasana hati yang menyebabkan perasaan sedih berkepanjangan, kehilangan minat pada aktivitas, dan gangguan fisik serta emosional.";

// ======== ASTRONOMI ========
} else if (input.includes("tata surya adalah") || input.includes("pengertian tata surya") || input.includes("apa itu tata surya") || input.includes("arti tata surya")) {
    responseMessage = "Tata surya adalah sistem yang terdiri dari Matahari sebagai pusatnya, bersama planet-planet, satelit, asteroid, dan komet yang mengorbit di sekitarnya.";
} else if (input.includes("lubang hitam adalah") || input.includes("pengertian lubang hitam") || input.includes("apa itu lubang hitam") || input.includes("arti lubang hitam")) {
    responseMessage = "Lubang hitam adalah objek luar angkasa dengan gravitasi sangat kuat sehingga bahkan cahaya pun tidak bisa lepas darinya.";
} else if (input.includes("supernova adalah") || input.includes("pengertian supernova") || input.includes("apa itu supernova") || input.includes("arti supernova")) {
    responseMessage = "Supernova adalah ledakan dahsyat yang terjadi ketika bintang besar kehabisan bahan bakar dan runtuh ke dalam dirinya sendiri.";
} else if (input.includes("galaksi adalah") || input.includes("pengertian galaksi") || input.includes("apa itu galaksi") || input.includes("arti galaksi")) {
    responseMessage = "Galaksi adalah kumpulan besar bintang, gas, debu, dan materi gelap yang diikat oleh gravitasi. Contohnya adalah Galaksi Bima Sakti.";

// ======== TEKNOLOGI ========
} else if (input.includes("kecerdasan buatan adalah") || input.includes("pengertian kecerdasan buatan") || input.includes("apa itu kecerdasan buatan") || input.includes("arti kecerdasan buatan")) {
    responseMessage = "Kecerdasan buatan (AI) adalah cabang teknologi yang memungkinkan mesin atau program komputer untuk belajar, berpikir, dan membuat keputusan mirip manusia.";
} else if (input.includes("internet of things adalah") || input.includes("pengertian internet of things") || input.includes("apa itu internet of things") || input.includes("arti internet of things")) {
    responseMessage = "Internet of Things (IoT) adalah konsep teknologi di mana berbagai perangkat fisik terhubung ke internet dan dapat berkomunikasi satu sama lain.";
} else if (input.includes("metaverse adalah") || input.includes("pengertian metaverse") || input.includes("apa itu metaverse") || input.includes("arti metaverse")) {
    responseMessage = "Metaverse adalah dunia virtual yang memungkinkan pengguna untuk berinteraksi, bekerja, dan bermain menggunakan teknologi realitas virtual dan augmented reality.";

// ======== SEJARAH ========
} else if (input.includes("perang dingin adalah") || input.includes("pengertian perang dingin") || input.includes("apa itu perang dingin") || input.includes("arti perang dingin")) {
    responseMessage = "Perang Dingin adalah periode ketegangan politik antara Amerika Serikat dan Uni Soviet setelah Perang Dunia II, yang berlangsung dari 1947 hingga 1991.";
} else if (input.includes("mesir kuno adalah") || input.includes("pengertian mesir kuno") || input.includes("apa itu mesir kuno") || input.includes("arti mesir kuno")) {
    responseMessage = "Mesir Kuno adalah peradaban kuno di Afrika Utara yang terkenal dengan piramida, hieroglif, dan firaun yang memerintah ribuan tahun yang lalu.";
} else if (input.includes("revolusi perancis adalah") || input.includes("pengertian revolusi perancis") || input.includes("apa itu revolusi perancis") || input.includes("arti revolusi perancis")) {
    responseMessage = "Revolusi Prancis (1789-1799) adalah perubahan besar dalam sejarah yang menggulingkan monarki absolut dan membawa nilai kebebasan, persamaan, dan demokrasi ke Prancis.";
}
// ======== EKONOMI & BISNIS ========
else if (input.includes("ekonomi adalah") || input.includes("pengertian ekonomi") || input.includes("apa itu ekonomi") || input.includes("arti ekonomi")) {
    responseMessage = "Ekonomi adalah ilmu yang mempelajari produksi, distribusi, dan konsumsi barang dan jasa. Ekonomi mencakup berbagai aspek seperti keuangan, perdagangan, dan kebijakan publik.";
} else if (input.includes("inflasi adalah") || input.includes("pengertian inflasi") || input.includes("apa itu inflasi") || input.includes("arti inflasi")) {
    responseMessage = "Inflasi adalah kenaikan harga barang dan jasa secara umum dalam periode tertentu, yang mengurangi daya beli uang.";
} else if (input.includes("supply dan demand adalah") || input.includes("pengertian supply dan demand") || input.includes("apa itu supply dan demand") || input.includes("arti supply dan demand")) {
    responseMessage = "Supply dan demand adalah konsep ekonomi di mana harga suatu barang ditentukan oleh keseimbangan antara ketersediaan barang (supply) dan permintaan konsumen (demand).";
} else if (input.includes("resesi adalah") || input.includes("pengertian resesi") || input.includes("apa itu resesi") || input.includes("arti resesi")) {
    responseMessage = "Resesi adalah penurunan aktivitas ekonomi yang signifikan dalam jangka waktu yang cukup lama, biasanya ditandai dengan turunnya PDB, meningkatnya pengangguran, dan melemahnya investasi.";

// ======== HUKUM & POLITIK ========
} else if (input.includes("hukum adalah") || input.includes("pengertian hukum") || input.includes("apa itu hukum") || input.includes("arti hukum")) {
    responseMessage = "Hukum adalah sistem aturan yang dibuat dan ditegakkan oleh negara atau masyarakat untuk mengatur perilaku individu dan kelompok guna menciptakan ketertiban dan keadilan.";
} else if (input.includes("konstitusi adalah") || input.includes("pengertian konstitusi") || input.includes("apa itu konstitusi") || input.includes("arti konstitusi")) {
    responseMessage = "Konstitusi adalah hukum dasar tertulis atau tidak tertulis yang menjadi landasan bagi pemerintahan suatu negara, termasuk hak dan kewajiban warga negara.";
} else if (input.includes("demokrasi adalah") || input.includes("pengertian demokrasi") || input.includes("apa itu demokrasi") || input.includes("arti demokrasi")) {
    responseMessage = "Demokrasi adalah sistem pemerintahan di mana kekuasaan berada di tangan rakyat, baik secara langsung maupun melalui perwakilan yang dipilih.";
} else if (input.includes("monarki adalah") || input.includes("pengertian monarki") || input.includes("apa itu monarki") || input.includes("arti monarki")) {
    responseMessage = "Monarki adalah sistem pemerintahan di mana kepala negara adalah seorang raja atau ratu yang biasanya berkuasa seumur hidup dan diwariskan turun-temurun.";
} else if (input.includes("otoriter adalah") || input.includes("pengertian otoriter") || input.includes("apa itu otoriter") || input.includes("arti otoriter")) {
    responseMessage = "Otoriter adalah sistem pemerintahan yang kekuasaannya terkonsentrasi pada satu pemimpin atau kelompok kecil tanpa adanya kebebasan politik bagi rakyat.";

// ======== BIOLOGI & SAINS ========
} else if (input.includes("biologi adalah") || input.includes("pengertian biologi") || input.includes("apa itu biologi") || input.includes("arti biologi")) {
    responseMessage = "Biologi adalah ilmu yang mempelajari makhluk hidup dan proses kehidupan, termasuk struktur, fungsi, pertumbuhan, evolusi, dan interaksi organisme.";
} else if (input.includes("fotosintesis adalah") || input.includes("pengertian fotosintesis") || input.includes("apa itu fotosintesis") || input.includes("arti fotosintesis")) {
    responseMessage = "Fotosintesis adalah proses di mana tumbuhan, alga, dan beberapa bakteri mengubah energi matahari menjadi energi kimia untuk pertumbuhan dan metabolisme.";
} else if (input.includes("evolusi adalah") || input.includes("pengertian evolusi") || input.includes("apa itu evolusi") || input.includes("arti evolusi")) {
    responseMessage = "Evolusi adalah perubahan bertahap dalam karakteristik makhluk hidup dari generasi ke generasi melalui seleksi alam dan faktor genetik lainnya.";
} else if (input.includes("DNA adalah") || input.includes("pengertian DNA") || input.includes("apa itu DNA") || input.includes("arti DNA")) {
    responseMessage = "DNA (Deoxyribonucleic Acid) adalah molekul yang menyimpan informasi genetik dalam semua makhluk hidup dan berperan dalam pewarisan sifat.";
} else if (input.includes("ekosistem adalah") || input.includes("pengertian ekosistem") || input.includes("apa itu ekosistem") || input.includes("arti ekosistem")) {
    responseMessage = "Ekosistem adalah sistem ekologis yang terdiri dari makhluk hidup dan lingkungan tempat mereka berinteraksi satu sama lain.";

// ======== FISIKA & TEKNOLOGI ========
} else if (input.includes("fisika adalah") || input.includes("pengertian fisika") || input.includes("apa itu fisika") || input.includes("arti fisika")) {
    responseMessage = "Fisika adalah ilmu alam yang mempelajari sifat dan interaksi materi serta energi, termasuk konsep seperti gravitasi, elektromagnetisme, dan mekanika kuantum.";
} else if (input.includes("hukum newton adalah") || input.includes("pengertian hukum newton") || input.includes("apa itu hukum newton") || input.includes("arti hukum newton")) {
    responseMessage = "Hukum Newton adalah tiga prinsip dasar dalam fisika yang menjelaskan hubungan antara gaya dan gerak benda.";
} else if (input.includes("energi terbarukan adalah") || input.includes("pengertian energi terbarukan") || input.includes("apa itu energi terbarukan") || input.includes("arti energi terbarukan")) {
    responseMessage = "Energi terbarukan adalah sumber energi yang dapat diperbarui secara alami, seperti energi matahari, angin, air, dan biomassa.";

// ======== FILSAFAT ========
} else if (input.includes("filsafat adalah") || input.includes("pengertian filsafat") || input.includes("apa itu filsafat") || input.includes("arti filsafat")) {
    responseMessage = "Filsafat adalah cabang ilmu yang mempelajari hakikat keberadaan, pengetahuan, moralitas, dan logika untuk memahami dunia dan kehidupan.";
} else if (input.includes("stoikisme adalah") || input.includes("pengertian stoikisme") || input.includes("apa itu stoikisme") || input.includes("arti stoikisme")) {
    responseMessage = "Stoikisme adalah filosofi yang mengajarkan pengendalian diri, kebijaksanaan, dan menerima segala sesuatu dengan ketenangan tanpa terpengaruh oleh emosi negatif.";
} else if (input.includes("eksistensialisme adalah") || input.includes("pengertian eksistensialisme") || input.includes("apa itu eksistensialisme") || input.includes("arti eksistensialisme")) {
    responseMessage = "Eksistensialisme adalah aliran filsafat yang menekankan kebebasan individu dalam menentukan makna hidupnya sendiri, tanpa bergantung pada nilai-nilai eksternal.";
}
// ======== MEDIS & KESEHATAN ========
else if (input.includes("medis adalah") || input.includes("pengertian medis") || input.includes("apa itu medis") || input.includes("arti medis")) {
    responseMessage = "Medis adalah bidang yang berkaitan dengan kesehatan, diagnosis, pengobatan, dan pencegahan penyakit yang melibatkan tenaga medis seperti dokter dan perawat.";
} else if (input.includes("virus adalah") || input.includes("pengertian virus") || input.includes("apa itu virus") || input.includes("arti virus")) {
    responseMessage = "Virus adalah mikroorganisme yang dapat menginfeksi sel makhluk hidup dan menyebabkan penyakit. Virus tidak bisa hidup sendiri dan membutuhkan inang untuk berkembang biak.";
} else if (input.includes("antibiotik adalah") || input.includes("pengertian antibiotik") || input.includes("apa itu antibiotik") || input.includes("arti antibiotik")) {
    responseMessage = "Antibiotik adalah obat yang digunakan untuk membunuh atau menghambat pertumbuhan bakteri penyebab infeksi, tetapi tidak efektif melawan virus.";
} else if (input.includes("imunisasi adalah") || input.includes("pengertian imunisasi") || input.includes("apa itu imunisasi") || input.includes("arti imunisasi")) {
    responseMessage = "Imunisasi adalah proses pemberian vaksin untuk merangsang sistem kekebalan tubuh agar mampu melawan infeksi penyakit tertentu.";
} else if (input.includes("hipertensi adalah") || input.includes("pengertian hipertensi") || input.includes("apa itu hipertensi") || input.includes("arti hipertensi")) {
    responseMessage = "Hipertensi adalah kondisi tekanan darah tinggi yang dapat meningkatkan risiko penyakit jantung, stroke, dan gangguan kesehatan lainnya.";

// ======== PSIKOLOGI & EMOSI ========
} else if (input.includes("psikologi adalah") || input.includes("pengertian psikologi") || input.includes("apa itu psikologi") || input.includes("arti psikologi")) {
    responseMessage = "Psikologi adalah ilmu yang mempelajari perilaku, pikiran, dan emosi manusia serta bagaimana faktor biologis dan lingkungan mempengaruhinya.";
} else if (input.includes("depresi adalah") || input.includes("pengertian depresi") || input.includes("apa itu depresi") || input.includes("arti depresi")) {
    responseMessage = "Depresi adalah gangguan mental yang ditandai dengan perasaan sedih berkepanjangan, kehilangan minat, dan gangguan tidur atau nafsu makan.";
} else if (input.includes("narsisme adalah") || input.includes("pengertian narsisme") || input.includes("apa itu narsisme") || input.includes("arti narsisme")) {
    responseMessage = "Narsisme adalah kepribadian yang ditandai dengan rasa percaya diri berlebihan, kebutuhan akan pujian, dan kurangnya empati terhadap orang lain.";
} else if (input.includes("introvert adalah") || input.includes("pengertian introvert") || input.includes("apa itu introvert") || input.includes("arti introvert")) {
    responseMessage = "Introvert adalah kepribadian yang cenderung menikmati waktu sendiri, lebih suka lingkungan yang tenang, dan mengisi energi dari refleksi pribadi.";
} else if (input.includes("ekstrovert adalah") || input.includes("pengertian ekstrovert") || input.includes("apa itu ekstrovert") || input.includes("arti ekstrovert")) {
    responseMessage = "Ekstrovert adalah kepribadian yang lebih nyaman berinteraksi sosial, mendapatkan energi dari orang lain, dan cenderung lebih ekspresif.";

// ======== SEJARAH & GEOGRAFI ========
} else if (input.includes("sejarah adalah") || input.includes("pengertian sejarah") || input.includes("apa itu sejarah") || input.includes("arti sejarah")) {
    responseMessage = "Sejarah adalah kajian tentang peristiwa masa lalu yang mempengaruhi perkembangan dunia saat ini dan masa depan.";
} else if (input.includes("perang dunia adalah") || input.includes("pengertian perang dunia") || input.includes("apa itu perang dunia") || input.includes("arti perang dunia")) {
    responseMessage = "Perang Dunia adalah konflik global besar yang terjadi dua kali di abad ke-20, yaitu Perang Dunia I (1914-1918) dan Perang Dunia II (1939-1945).";
} else if (input.includes("imperialisme adalah") || input.includes("pengertian imperialisme") || input.includes("apa itu imperialisme") || input.includes("arti imperialisme")) {
    responseMessage = "Imperialisme adalah kebijakan suatu negara untuk memperluas kekuasaannya dengan mendominasi wilayah atau negara lain secara politik, ekonomi, dan militer.";
} else if (input.includes("revolusi industri adalah") || input.includes("pengertian revolusi industri") || input.includes("apa itu revolusi industri") || input.includes("arti revolusi industri")) {
    responseMessage = "Revolusi Industri adalah perubahan besar dalam cara produksi dari manual ke mesin yang dimulai di abad ke-18, membawa dampak besar bagi ekonomi dan kehidupan sosial.";
} else if (input.includes("benua adalah") || input.includes("pengertian benua") || input.includes("apa itu benua") || input.includes("arti benua")) {
    responseMessage = "Benua adalah daratan luas di bumi yang terdiri dari beberapa negara. Saat ini, terdapat tujuh benua utama: Asia, Afrika, Amerika Utara, Amerika Selatan, Antartika, Eropa, dan Australia.";

// ======== AGAMA & FILSAFAT ========
} else if (input.includes("agama adalah") || input.includes("pengertian agama") || input.includes("apa itu agama") || input.includes("arti agama")) {
    responseMessage = "Agama adalah sistem kepercayaan dan ibadah yang menghubungkan manusia dengan nilai-nilai spiritual, etika, dan keyakinan terhadap Tuhan atau kekuatan supranatural.";
} else if (input.includes("etika adalah") || input.includes("pengertian etika") || input.includes("apa itu etika") || input.includes("arti etika")) {
    responseMessage = "Etika adalah prinsip moral yang mengatur perilaku manusia dalam kehidupan sehari-hari, baik dalam aspek pribadi maupun sosial.";
} else if (input.includes("karma adalah") || input.includes("pengertian karma") || input.includes("apa itu karma") || input.includes("arti karma")) {
    responseMessage = "Karma adalah konsep dalam beberapa agama dan kepercayaan yang menyatakan bahwa tindakan seseorang akan membawa akibat baik atau buruk di masa depan.";
} else if (input.includes("nirwana adalah") || input.includes("pengertian nirwana") || input.includes("apa itu nirwana") || input.includes("arti nirwana")) {
    responseMessage = "Nirwana adalah keadaan kebebasan tertinggi dari penderitaan dan siklus kelahiran kembali dalam ajaran Buddha.";

// ======== BUDAYA & SOSIAL ========
} else if (input.includes("budaya adalah") || input.includes("pengertian budaya") || input.includes("apa itu budaya") || input.includes("arti budaya")) {
    responseMessage = "Budaya adalah cara hidup yang berkembang dalam suatu masyarakat, termasuk bahasa, adat istiadat, seni, dan tradisi.";
} else if (input.includes("sosial adalah") || input.includes("pengertian sosial") || input.includes("apa itu sosial") || input.includes("arti sosial")) {
    responseMessage = "Sosial adalah segala sesuatu yang berkaitan dengan interaksi antara individu dalam masyarakat dan bagaimana hubungan tersebut membentuk kehidupan bersama.";
} else if (input.includes("kesenian adalah") || input.includes("pengertian kesenian") || input.includes("apa itu kesenian") || input.includes("arti kesenian")) {
    responseMessage = "Kesenian adalah ekspresi kreatif manusia dalam berbagai bentuk, seperti musik, tari, lukisan, teater, dan sastra.";

// ======== SAINS & TEKNOLOGI ========
     }else if (input.includes("sains adalah") || input.includes("pengertian sains") || input.includes("apa itu sains") || input.includes("arti sains")) {
    responseMessage = "Sains adalah cabang pengetahuan yang mempelajari alam semesta melalui metode ilmiah, eksperimen, dan pengamatan untuk memahami hukum-hukum alam.";
} else if (input.includes("fisika adalah") || input.includes("pengertian fisika") || input.includes("apa itu fisika") || input.includes("arti fisika")) {
    responseMessage = "Fisika adalah cabang ilmu sains yang mempelajari sifat dan interaksi materi serta energi, mencakup konsep seperti gerak, listrik, magnetisme, dan mekanika kuantum.";
} else if (input.includes("biologi adalah") || input.includes("pengertian biologi") || input.includes("apa itu biologi") || input.includes("arti biologi")) {
    responseMessage = "Biologi adalah ilmu yang mempelajari makhluk hidup dan lingkungannya, termasuk anatomi, ekologi, evolusi, dan genetika.";
} else if (input.includes("kimia adalah") || input.includes("pengertian kimia") || input.includes("apa itu kimia") || input.includes("arti kimia")) {
    responseMessage = "Kimia adalah cabang ilmu yang mempelajari komposisi, struktur, sifat, dan perubahan materi, serta reaksi antara zat-zat kimia.";
} else if (input.includes("robot adalah") || input.includes("pengertian robot") || input.includes("apa itu robot") || input.includes("arti robot")) {
    responseMessage = "Robot adalah mesin yang dapat diprogram untuk melakukan tugas tertentu secara otomatis, sering digunakan dalam industri, kesehatan, dan eksplorasi luar angkasa.";
} else if (input.includes("kecerdasan buatan adalah") || input.includes("pengertian kecerdasan buatan") || input.includes("apa itu kecerdasan buatan") || input.includes("arti kecerdasan buatan")) {
    responseMessage = "Kecerdasan buatan (AI) adalah teknologi yang memungkinkan komputer dan mesin untuk berpikir dan belajar layaknya manusia, menggunakan algoritma dan data.";

// ======== EKONOMI & BISNIS ========
} else if (input.includes("ekonomi adalah") || input.includes("pengertian ekonomi") || input.includes("apa itu ekonomi") || input.includes("arti ekonomi")) {
    responseMessage = "Ekonomi adalah ilmu yang mempelajari produksi, distribusi, dan konsumsi barang serta jasa dalam suatu sistem keuangan.";
} else if (input.includes("inflasi adalah") || input.includes("pengertian inflasi") || input.includes("apa itu inflasi") || input.includes("arti inflasi")) {
    responseMessage = "Inflasi adalah kenaikan harga barang dan jasa secara terus-menerus dalam suatu periode waktu, yang menyebabkan daya beli masyarakat menurun.";
} else if (input.includes("investasi adalah") || input.includes("pengertian investasi") || input.includes("apa itu investasi") || input.includes("arti investasi")) {
    responseMessage = "Investasi adalah penanaman modal atau aset dalam suatu instrumen keuangan dengan tujuan mendapatkan keuntungan di masa depan.";
} else if (input.includes("pasar saham adalah") || input.includes("pengertian pasar saham") || input.includes("apa itu pasar saham") || input.includes("arti pasar saham")) {
    responseMessage = "Pasar saham adalah tempat di mana investor dapat membeli dan menjual saham perusahaan publik untuk mendapatkan keuntungan dari perubahan harga saham.";

// ======== HUKUM & POLITIK ========
} else if (input.includes("hukum adalah") || input.includes("pengertian hukum") || input.includes("apa itu hukum") || input.includes("arti hukum")) {
    responseMessage = "Hukum adalah sistem aturan yang dibuat oleh pemerintah atau lembaga tertentu untuk mengatur kehidupan masyarakat dan menegakkan keadilan.";
} else if (input.includes("konstitusi adalah") || input.includes("pengertian konstitusi") || input.includes("apa itu konstitusi") || input.includes("arti konstitusi")) {
    responseMessage = "Konstitusi adalah hukum dasar yang mengatur sistem pemerintahan dan hak-hak warga negara dalam suatu negara.";
} else if (input.includes("demokrasi adalah") || input.includes("pengertian demokrasi") || input.includes("apa itu demokrasi") || input.includes("arti demokrasi")) {
    responseMessage = "Demokrasi adalah sistem pemerintahan di mana kekuasaan berada di tangan rakyat, biasanya melalui pemilihan umum untuk memilih pemimpin.";
} else if (input.includes("otoriter adalah") || input.includes("pengertian otoriter") || input.includes("apa itu otoriter") || input.includes("arti otoriter")) {
    responseMessage = "Otoriter adalah sistem pemerintahan di mana kekuasaan terpusat pada satu orang atau kelompok tanpa adanya kebebasan bagi rakyat.";

// ======== ASTRONOMI & LUAR ANGKASA ========
} else if (input.includes("astronomi adalah") || input.includes("pengertian astronomi") || input.includes("apa itu astronomi") || input.includes("arti astronomi")) {
    responseMessage = "Astronomi adalah ilmu yang mempelajari benda-benda langit seperti bintang, planet, galaksi, dan fenomena kosmik di luar angkasa.";
} else if (input.includes("bintang adalah") || input.includes("pengertian bintang") || input.includes("apa itu bintang") || input.includes("arti bintang")) {
    responseMessage = "Bintang adalah bola gas raksasa yang menghasilkan cahaya dan panas melalui reaksi nuklir, seperti matahari yang menjadi pusat tata surya kita.";
} else if (input.includes("lubang hitam adalah") || input.includes("pengertian lubang hitam") || input.includes("apa itu lubang hitam") || input.includes("arti lubang hitam")) {
    responseMessage = "Lubang hitam adalah wilayah di ruang angkasa dengan gravitasi sangat kuat yang bahkan cahaya pun tidak bisa keluar darinya.";
} else if (input.includes("planet adalah") || input.includes("pengertian planet") || input.includes("apa itu planet") || input.includes("arti planet")) {
    responseMessage = "Planet adalah benda langit yang mengorbit bintang, memiliki massa cukup untuk berbentuk bulat, dan membersihkan orbitnya dari objek lain.";
} else if (input.includes("tata surya adalah") || input.includes("pengertian tata surya") || input.includes("apa itu tata surya") || input.includes("arti tata surya")) {
    responseMessage = "Tata Surya adalah sistem yang terdiri dari matahari dan semua objek yang mengorbitnya, termasuk planet, bulan, asteroid, dan komet.";
// ======== SEJARAH & PERADABAN ========
else if (input.includes("sejarah adalah") || input.includes("pengertian sejarah") || input.includes("apa itu sejarah") || input.includes("arti sejarah")) {
    responseMessage = "Sejarah adalah ilmu yang mempelajari peristiwa masa lalu, termasuk asal-usul peradaban, peristiwa penting, dan pengaruhnya terhadap dunia saat ini.";
} else if (input.includes("revolusi industri adalah") || input.includes("apa itu revolusi industri") || input.includes("pengertian revolusi industri")) {
    responseMessage = "Revolusi Industri adalah periode perubahan besar dalam cara produksi barang, yang dimulai pada abad ke-18 dengan munculnya mesin dan pabrik.";
} else if (input.includes("perang dunia adalah") || input.includes("apa itu perang dunia") || input.includes("pengertian perang dunia")) {
    responseMessage = "Perang Dunia adalah konflik global besar yang terjadi pada abad ke-20, yaitu Perang Dunia I (1914-1918) dan Perang Dunia II (1939-1945).";
} else if (input.includes("kerajaan romawi adalah") || input.includes("apa itu kerajaan romawi") || input.includes("pengertian kerajaan romawi")) {
    responseMessage = "Kerajaan Romawi adalah salah satu peradaban paling berpengaruh dalam sejarah dunia, yang berkembang dari kota Roma dan menjadi kekaisaran yang luas.";

// ======== BUDAYA & SOSIAL ========
} else if (input.includes("budaya adalah") || input.includes("pengertian budaya") || input.includes("apa itu budaya") || input.includes("arti budaya")) {
    responseMessage = "Budaya adalah sekumpulan nilai, norma, adat istiadat, seni, dan kebiasaan yang diwariskan dalam suatu masyarakat.";
} else if (input.includes("tradisi adalah") || input.includes("pengertian tradisi") || input.includes("apa itu tradisi") || input.includes("arti tradisi")) {
    responseMessage = "Tradisi adalah kebiasaan atau praktik yang diwariskan dari generasi ke generasi dalam suatu kelompok masyarakat.";
} else if (input.includes("bahasa adalah") || input.includes("pengertian bahasa") || input.includes("apa itu bahasa") || input.includes("arti bahasa")) {
    responseMessage = "Bahasa adalah sistem komunikasi yang digunakan oleh manusia untuk berbicara, menulis, dan mengekspresikan pemikiran serta perasaan.";

// ======== PSIKOLOGI & FILSAFAT ========
} else if (input.includes("psikologi adalah") || input.includes("pengertian psikologi") || input.includes("apa itu psikologi") || input.includes("arti psikologi")) {
    responseMessage = "Psikologi adalah ilmu yang mempelajari perilaku dan proses mental manusia, termasuk emosi, kepribadian, dan kognisi.";
} else if (input.includes("filsafat adalah") || input.includes("pengertian filsafat") || input.includes("apa itu filsafat") || input.includes("arti filsafat")) {
    responseMessage = "Filsafat adalah disiplin yang mempelajari makna hidup, keberadaan, etika, dan logika untuk mencari kebenaran dan kebijaksanaan.";
} else if (input.includes("eksistensialisme adalah") || input.includes("pengertian eksistensialisme") || input.includes("apa itu eksistensialisme")) {
    responseMessage = "Eksistensialisme adalah aliran filsafat yang menekankan kebebasan individu, tanggung jawab, dan pencarian makna hidup.";
} else if (input.includes("kecemasan adalah") || input.includes("pengertian kecemasan") || input.includes("apa itu kecemasan") || input.includes("arti kecemasan")) {
    responseMessage = "Kecemasan adalah perasaan khawatir atau ketakutan yang bisa dipicu oleh tekanan, stres, atau kondisi psikologis tertentu.";

// ======== MITOLOGI & LEGENDA ========
} else if (input.includes("mitologi adalah") || input.includes("pengertian mitologi") || input.includes("apa itu mitologi") || input.includes("arti mitologi")) {
    responseMessage = "Mitologi adalah kumpulan cerita atau legenda yang menjelaskan asal-usul dunia, dewa-dewi, dan makhluk supernatural dalam berbagai budaya.";
} else if (input.includes("zeus adalah") || input.includes("dewa zeus") || input.includes("siapa zeus")) {
    responseMessage = "Zeus adalah dewa utama dalam mitologi Yunani, penguasa Gunung Olympus, dan dewa langit serta petir.";
} else if (input.includes("thor adalah") || input.includes("dewa thor") || input.includes("siapa thor")) {
    responseMessage = "Thor adalah dewa petir dalam mitologi Nordik, yang dikenal dengan palu Mjölnir dan perlindungannya terhadap umat manusia.";
} else if (input.includes("naga adalah") || input.includes("pengertian naga") || input.includes("apa itu naga")) {
    responseMessage = "Naga adalah makhluk legendaris yang muncul dalam berbagai budaya, sering digambarkan sebagai reptil raksasa bersayap dengan kemampuan bernapas api.";

// ======== AGAMA & KEIMANAN ========
} else if (input.includes("agama adalah") || input.includes("pengertian agama") || input.includes("apa itu agama") || input.includes("arti agama")) {
    responseMessage = "Agama adalah sistem kepercayaan dan praktik spiritual yang menghubungkan manusia dengan kekuatan yang lebih tinggi.";
} else if (input.includes("spiritualitas adalah") || input.includes("pengertian spiritualitas") || input.includes("apa itu spiritualitas")) {
    responseMessage = "Spiritualitas adalah pencarian makna dan hubungan manusia dengan sesuatu yang lebih besar dari dirinya, sering dikaitkan dengan ketenangan batin.";
} else if (input.includes("karma adalah") || input.includes("pengertian karma") || input.includes("apa itu karma")) {
    responseMessage = "Karma adalah konsep dalam banyak agama yang menyatakan bahwa setiap tindakan akan membawa konsekuensi, baik atau buruk, di masa depan.";
} else if (input.includes("reinkarnasi adalah") || input.includes("pengertian reinkarnasi") || input.includes("apa itu reinkarnasi")) {
    responseMessage = "Reinkarnasi adalah kepercayaan bahwa jiwa akan terlahir kembali dalam kehidupan baru setelah kematian, berdasarkan tindakan dalam kehidupan sebelumnya.";
}// ======== SEJARAH & PERADABAN ========
else if (input.includes("sejarah adalah") || input.includes("pengertian sejarah") || input.includes("apa itu sejarah") || input.includes("arti sejarah")) {
    responseMessage = "Sejarah adalah ilmu yang mempelajari peristiwa masa lalu berdasarkan bukti dan catatan yang ada, untuk memahami bagaimana peradaban berkembang.";
} else if (input.includes("kerajaan adalah") || input.includes("pengertian kerajaan") || input.includes("apa itu kerajaan") || input.includes("arti kerajaan")) {
    responseMessage = "Kerajaan adalah sistem pemerintahan yang dipimpin oleh seorang raja atau ratu, biasanya berdasarkan garis keturunan.";
} else if (input.includes("imperium adalah") || input.includes("pengertian imperium") || input.includes("apa itu imperium") || input.includes("arti imperium")) {
    responseMessage = "Imperium adalah kerajaan atau negara yang memiliki wilayah luas dan kekuasaan besar, sering kali mencakup beberapa wilayah atau bangsa.";
} else if (input.includes("perang dunia adalah") || input.includes("pengertian perang dunia") || input.includes("apa itu perang dunia") || input.includes("arti perang dunia")) {
    responseMessage = "Perang Dunia adalah konflik berskala global yang melibatkan banyak negara. Sejarah mencatat Perang Dunia I (1914-1918) dan Perang Dunia II (1939-1945) sebagai perang terbesar dalam sejarah manusia.";

// ======== MITOLOGI & BUDAYA ========
} else if (input.includes("mitologi adalah") || input.includes("pengertian mitologi") || input.includes("apa itu mitologi") || input.includes("arti mitologi")) {
    responseMessage = "Mitologi adalah kumpulan cerita dan legenda dari suatu budaya yang menjelaskan asal-usul dunia, dewa-dewa, dan kejadian luar biasa.";
} else if (input.includes("dewa adalah") || input.includes("pengertian dewa") || input.includes("apa itu dewa") || input.includes("arti dewa")) {
    responseMessage = "Dewa adalah makhluk supranatural dalam berbagai kepercayaan yang dianggap memiliki kekuatan luar biasa dan mengatur aspek tertentu dari alam semesta.";
} else if (input.includes("naga adalah") || input.includes("pengertian naga") || input.includes("apa itu naga") || input.includes("arti naga")) {
    responseMessage = "Naga adalah makhluk legendaris dalam mitologi berbagai budaya, sering digambarkan sebagai reptil raksasa yang bisa terbang dan mengeluarkan api.";

// ======== TEKNOLOGI MASA DEPAN ========
} else if (input.includes("kecerdasan buatan masa depan") || input.includes("bagaimana AI berkembang") || input.includes("masa depan AI")) {
    responseMessage = "Di masa depan, AI diperkirakan akan semakin canggih, dengan kemampuan yang lebih mendekati kecerdasan manusia, termasuk dalam bidang kesehatan, robotika, dan bahkan seni.";
} else if (input.includes("mobil listrik adalah") || input.includes("pengertian mobil listrik") || input.includes("apa itu mobil listrik") || input.includes("arti mobil listrik")) {
    responseMessage = "Mobil listrik adalah kendaraan yang menggunakan tenaga listrik sebagai sumber energinya, lebih ramah lingkungan dibandingkan mobil berbahan bakar fosil.";

// ======== PSIKOLOGI & EMOSI ========
} else if (input.includes("psikologi adalah") || input.includes("pengertian psikologi") || input.includes("apa itu psikologi") || input.includes("arti psikologi")) {
    responseMessage = "Psikologi adalah ilmu yang mempelajari perilaku dan proses mental manusia, termasuk emosi, motivasi, dan interaksi sosial.";
} else if (input.includes("emosi adalah") || input.includes("pengertian emosi") || input.includes("apa itu emosi") || input.includes("arti emosi")) {
    responseMessage = "Emosi adalah reaksi psikologis yang muncul sebagai respons terhadap suatu situasi atau peristiwa, seperti kebahagiaan, kesedihan, dan kemarahan.";
} else if (input.includes("stres adalah") || input.includes("pengertian stres") || input.includes("apa itu stres") || input.includes("arti stres")) {
    responseMessage = "Stres adalah kondisi mental dan fisik yang muncul akibat tekanan atau tuntutan yang tinggi, sering kali menyebabkan kecemasan dan kelelahan.";

// ======== TEORI KONSPIRASI ========
} else if (input.includes("teori konspirasi adalah") || input.includes("pengertian teori konspirasi") || input.includes("apa itu teori konspirasi") || input.includes("arti teori konspirasi")) {
    responseMessage = "Teori konspirasi adalah keyakinan bahwa suatu peristiwa besar terjadi karena rencana rahasia dari kelompok tertentu, meskipun sering kali tidak memiliki bukti yang kuat.";
} else if (input.includes("illuminati adalah") || input.includes("pengertian illuminati") || input.includes("apa itu illuminati") || input.includes("arti illuminati")) {
    responseMessage = "Illuminati adalah teori konspirasi yang menyatakan adanya kelompok rahasia yang mengendalikan dunia secara diam-diam melalui politik, ekonomi, dan media.";
} else if (input.includes("area 51 adalah") || input.includes("pengertian area 51") || input.includes("apa itu area 51") || input.includes("arti area 51")) {
    responseMessage = "Area 51 adalah pangkalan militer rahasia di Nevada, Amerika Serikat, yang sering dikaitkan dengan teori konspirasi tentang alien dan teknologi canggih.";

// ======== OLAHRAGA ========
} else if (input.includes("sepak bola adalah") || input.includes("pengertian sepak bola") || input.includes("apa itu sepak bola") || input.includes("arti sepak bola")) {
    responseMessage = "Sepak bola adalah olahraga tim yang dimainkan oleh dua tim beranggotakan 11 orang, dengan tujuan mencetak gol ke gawang lawan.";
} else if (input.includes("olimpiade adalah") || input.includes("pengertian olimpiade") || input.includes("apa itu olimpiade") || input.includes("arti olimpiade")) {
    responseMessage = "Olimpiade adalah ajang olahraga internasional yang diselenggarakan setiap empat tahun sekali, diikuti oleh atlet dari berbagai negara di dunia.";

// ======== MUSIK & SENI ========
} else if (input.includes("musik adalah") || input.includes("pengertian musik") || input.includes("apa itu musik") || input.includes("arti musik")) {
    responseMessage = "Musik adalah seni yang menggunakan bunyi dan ritme untuk menciptakan harmoni dan ekspresi emosional.";
} else if (input.includes("seni adalah") || input.includes("pengertian seni") || input.includes("apa itu seni") || input.includes("arti seni")) {
    responseMessage = "Seni adalah ekspresi kreatif manusia dalam berbagai bentuk, seperti lukisan, musik, tarian, dan teater.";

// ======== GAME & HIBURAN ========
} else if (input.includes("game adalah") || input.includes("pengertian game") || input.includes("apa itu game") || input.includes("arti game")) {
    responseMessage = "Game adalah permainan interaktif yang bisa dimainkan untuk hiburan, edukasi, atau kompetisi, baik dalam bentuk video game maupun permainan tradisional.";
} else if (input.includes("e-sports adalah") || input.includes("pengertian e-sports") || input.includes("apa itu e-sports") || input.includes("arti e-sports")) {
    responseMessage = "E-Sports adalah kompetisi permainan video secara profesional, di mana pemain dan tim bertanding dalam berbagai game kompetitif.";
}// ======== ILMU PENGETAHUAN ALAM ========
else if (input.includes("gravitasi adalah") || input.includes("pengertian gravitasi") || input.includes("apa itu gravitasi") || input.includes("arti gravitasi")) {
    responseMessage = "Gravitasi adalah gaya tarik-menarik yang terjadi antara semua benda yang memiliki massa. Contohnya, gravitasi Bumi membuat kita tetap berpijak di tanah.";
} else if (input.includes("evolusi adalah") || input.includes("pengertian evolusi") || input.includes("apa itu evolusi") || input.includes("arti evolusi")) {
    responseMessage = "Evolusi adalah proses perubahan makhluk hidup secara bertahap dari generasi ke generasi untuk beradaptasi dengan lingkungannya.";
} else if (input.includes("fotosintesis adalah") || input.includes("pengertian fotosintesis") || input.includes("apa itu fotosintesis") || input.includes("arti fotosintesis")) {
    responseMessage = "Fotosintesis adalah proses di mana tumbuhan menggunakan sinar matahari untuk mengubah karbon dioksida dan air menjadi makanan dan oksigen.";

// ======== ASTRONOMI & LUAR ANGKASA ========
} else if (input.includes("galaksi adalah") || input.includes("pengertian galaksi") || input.includes("apa itu galaksi") || input.includes("arti galaksi")) {
    responseMessage = "Galaksi adalah kumpulan besar bintang, gas, debu, dan materi gelap yang terikat oleh gravitasi. Contohnya adalah galaksi Bima Sakti, tempat tata surya kita berada.";
} else if (input.includes("lubang hitam adalah") || input.includes("pengertian lubang hitam") || input.includes("apa itu lubang hitam") || input.includes("arti lubang hitam")) {
    responseMessage = "Lubang hitam adalah objek luar angkasa dengan gravitasi yang sangat kuat sehingga tidak ada cahaya atau benda yang bisa lolos darinya.";
} else if (input.includes("bintang adalah") || input.includes("pengertian bintang") || input.includes("apa itu bintang") || input.includes("arti bintang")) {
    responseMessage = "Bintang adalah bola gas raksasa yang bersinar karena reaksi nuklir di intinya, seperti Matahari yang merupakan bintang di tata surya kita.";

// ======== POLITIK & SISTEM PEMERINTAHAN ========
} else if (input.includes("demokrasi adalah") || input.includes("pengertian demokrasi") || input.includes("apa itu demokrasi") || input.includes("arti demokrasi")) {
    responseMessage = "Demokrasi adalah sistem pemerintahan di mana rakyat memiliki hak untuk berpartisipasi dalam pengambilan keputusan politik, biasanya melalui pemilihan umum.";
} else if (input.includes("monarki adalah") || input.includes("pengertian monarki") || input.includes("apa itu monarki") || input.includes("arti monarki")) {
    responseMessage = "Monarki adalah sistem pemerintahan yang dipimpin oleh seorang raja atau ratu yang kekuasaannya bisa turun-temurun dalam suatu keluarga kerajaan.";
} else if (input.includes("anarki adalah") || input.includes("pengertian anarki") || input.includes("apa itu anarki") || input.includes("arti anarki")) {
    responseMessage = "Anarki adalah kondisi tanpa pemerintahan atau aturan yang terorganisir, di mana masyarakat mengatur diri mereka sendiri tanpa otoritas pusat.";

// ======== KESEHATAN & GAYA HIDUP ========
} else if (input.includes("vitamin adalah") || input.includes("pengertian vitamin") || input.includes("apa itu vitamin") || input.includes("arti vitamin")) {
    responseMessage = "Vitamin adalah zat yang dibutuhkan tubuh dalam jumlah kecil untuk menjaga kesehatan dan menjalankan fungsi tubuh dengan baik.";
} else if (input.includes("kalori adalah") || input.includes("pengertian kalori") || input.includes("apa itu kalori") || input.includes("arti kalori")) {
    responseMessage = "Kalori adalah satuan energi yang digunakan untuk mengukur jumlah energi yang diperoleh dari makanan dan minuman.";
} else if (input.includes("dehidrasi adalah") || input.includes("pengertian dehidrasi") || input.includes("apa itu dehidrasi") || input.includes("arti dehidrasi")) {
    responseMessage = "Dehidrasi adalah kondisi ketika tubuh kehilangan lebih banyak cairan daripada yang dikonsumsi, yang dapat menyebabkan kelelahan dan gangguan kesehatan.";

// ======== EKONOMI & BISNIS ========
} else if (input.includes("ekonomi adalah") || input.includes("pengertian ekonomi") || input.includes("apa itu ekonomi") || input.includes("arti ekonomi")) {
    responseMessage = "Ekonomi adalah ilmu yang mempelajari produksi, distribusi, dan konsumsi barang serta jasa dalam suatu masyarakat.";
} else if (input.includes("inflasi adalah") || input.includes("pengertian inflasi") || input.includes("apa itu inflasi") || input.includes("arti inflasi")) {
    responseMessage = "Inflasi adalah kenaikan harga barang dan jasa secara umum dalam jangka waktu tertentu, yang mengurangi daya beli uang.";
} else if (input.includes("investasi adalah") || input.includes("pengertian investasi") || input.includes("apa itu investasi") || input.includes("arti investasi")) {
    responseMessage = "Investasi adalah penanaman modal atau aset dengan harapan mendapatkan keuntungan di masa depan, seperti membeli saham atau properti.";

// ======== FISIKA & KIMIA ========
} else if (input.includes("reaksi kimia adalah") || input.includes("pengertian reaksi kimia") || input.includes("apa itu reaksi kimia") || input.includes("arti reaksi kimia")) {
    responseMessage = "Reaksi kimia adalah proses di mana zat berubah menjadi zat baru dengan sifat yang berbeda melalui interaksi atom dan molekul.";
} else if (input.includes("hukum newton adalah") || input.includes("pengertian hukum newton") || input.includes("apa itu hukum newton") || input.includes("arti hukum newton")) {
    responseMessage = "Hukum Newton adalah tiga hukum dasar dalam fisika yang menjelaskan bagaimana benda bergerak dan berinteraksi dengan gaya.";

// ======== TEKNOLOGI INFORMASI ========
} else if (input.includes("internet adalah") || input.includes("pengertian internet") || input.includes("apa itu internet") || input.includes("arti internet")) {
    responseMessage = "Internet adalah jaringan global yang menghubungkan komputer dan perangkat di seluruh dunia untuk bertukar informasi.";
} else if (input.includes("sistem operasi adalah") || input.includes("pengertian sistem operasi") || input.includes("apa itu sistem operasi") || input.includes("arti sistem operasi")) {
    responseMessage = "Sistem operasi adalah perangkat lunak yang mengelola perangkat keras komputer dan menyediakan layanan bagi program komputer lainnya.";
} else if (input.includes("kecerdasan buatan adalah") || input.includes("pengertian kecerdasan buatan") || input.includes("apa itu kecerdasan buatan") || input.includes("arti kecerdasan buatan")) {
    responseMessage = "Kecerdasan buatan (AI) adalah cabang ilmu komputer yang berfokus pada pembuatan sistem yang dapat berpikir, belajar, dan mengambil keputusan seperti manusia.";

else {
    responseMessage =
      "Maaf, saya tidak mengerti pertanyaan itu. Bisa ulangi lagi?";
  }

  // Panggil fungsi typeMessage untuk efek mengetik
  typeMessage(responseMessage, "ai");
  aiMessages.push(responseMessage); // Menyimpan respons AI
}

// Fungsi untuk mengetik pesan (menciptakan efek mengetik)
function typeMessage(message, sender) {
  const messagesContainer = document.getElementById("messages");
  const messageDiv = document.createElement("div");
  messageDiv.classList.add("chat-bubble");
  messageDiv.classList.add(sender === "user" ? "user-message" : "ai-message");

  let i = 0;
  messageDiv.textContent = "";
  messagesContainer.appendChild(messageDiv);

  // Efek mengetik dengan kecepatan yang lebih cepat (interval 50ms)
  const typingInterval = setInterval(() => {
    messageDiv.textContent += message.charAt(i);
    i++;

    // Setelah selesai mengetik, berhenti mengetik
    if (i === message.length) {
      clearInterval(typingInterval);
      // Auto-scroll ke bawah agar pesan terbaru selalu terlihat
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
  }, 50); // Percepat efek mengetik dengan interval yang lebih cepat
}

// Fungsi untuk menangani event Enter untuk mengirim pesan
document
  .getElementById("userInput")
  .addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
      event.preventDefault(); // Mencegah aksi default enter (misalnya line break)
      sendMessage(); // Panggil fungsi untuk mengirim pesan
    }
  });
