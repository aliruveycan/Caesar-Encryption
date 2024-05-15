// Öğeyi DOM'dan alın
const form = document.getElementById("controls");
const hInput = document.querySelector("#heading-input");
const hOutput = document.querySelector("#heading-output");
const selectEncodeOrDecode = document.getElementsByName("code");
const inputText = document.getElementById("input-text");
const outputText = document.getElementById("output-text");
const shiftKey = document.getElementById("shift-input");
const modulo = document.getElementById("mod-input");
const alphabet = document.getElementById("alphabet-input");
const letterCase = document.getElementById("letter-case");
const foreignChars = document.getElementById("foreign-chars");

// Kodlama veya kod çözme işlemine bağlı olarak başlık başlığını değiştirin ve içeriği temizleyin
selectEncodeOrDecode.forEach((option) => {
    option.addEventListener("click", () => {
        if (option.value === "encode") {
            hInput.textContent = "Metin";
            hOutput.textContent = "Şifreli Metin";
            inputText.value = "";
            outputText.textContent = "";
        } else if (option.value === "decode") {
            hInput.textContent = "Şifreli Metin";
            hOutput.textContent = "Metin";
            inputText.value = "";
            outputText.textContent = "";
        }
    });
});

// Çalıştır düğmesine tıklandığında sezar şifrelemesi gerçekleştirilecektir
form.addEventListener("submit", (event) => {
    event.preventDefault();
    
    // DOM'dan değerini alın
    let inputTextValue = inputText.value;
    let selectedOption = Array.from(selectEncodeOrDecode).find((option) => option.checked);
    let shiftValue = parseInt(shiftKey.value);
    let moduloValue = parseInt(modulo.value);
    let alphabetValue = alphabet.value;
    let letterCaseValue = letterCase.value;
    let foreignCharsValue = foreignChars.value;


    /**
   * Belirtilen kaydırma ve modülü kullanarak giriş metnine sezar şifresini uygular.
   * @param {boolean} [decode="decode"] - Kodlama yerine kod çözme yapılıp yapılmayacağı.
   * @param {string} text - Kodlanacak veya kodu çözülecek giriş metni.
   * @param {number} shift - Girdi metnindeki her karaktere uygulanacak kaydırma değeri.
   * @param {number} mod - Karakter kümesinin etrafını sarmak için kullanılacak modül değeri.
   * @param {string} [charset="abcdefghijklmnopqrstuvwxyz0123456789çğıöşü"] - Şifre için kullanılacak karakter kümesi.
   * @param {string} [foreignChars=1] - Yabancı karakterler kaldırılacaktır.
   * @returns {string} Metni kodlar veya kodunu çözer.
   */
    function caesarCipher(decode, text, shift, mod, charset, foreignChars) {
        // Kod çözme işlemi kod çözme işlemine eşitse kaydırma değerinin işaretini tersine çevirin.
        if (decode == "decode") {
            shift = -shift;
        }
        // foreignChars 1'e eşitse yabancı karakterleri kaldırın
        if (foreignChars == 1) {
            text = removeForeignChars(text);
        }
        // Karakter kümesini küçük harf yapın
        charset = charset.toLowerCase();
        // Sonuçları saklayın
        let result = "";
        for (let i = 0; i < text.length; i++) {
            let char = text.charAt(i);
            // Karakter kümesindeki karakterin indeksini bulun, büyük/küçük harf göz ardı edilir
            const index = charset.indexOf(char.toLowerCase());
            // Karakter setin içindeyse, kaydırma işlemini gerçekleştirin
            if (index !== -1) {
                let newIndex = (index + shift) % mod;
                // Yeni indeks negatifse, doğru konuma sarmak için modül ekleyin
                if (newIndex < 0) {
                    newIndex += mod;
                }
                // Orijinal karakter büyük harf ise yeni karakteri büyük harfe dönüştürür
                char = char === char.toLowerCase() ? charset[newIndex] : charset[newIndex].toUpperCase();
            }
            // Karakteri sonuç dizesine ekler
            result += char;
        }
        return result;
    }

    /**
     * Harf ve rakam olmayan karakterleri giriş dizesinden kaldırır.
     * @param {string} input - Temizlenecek girdi dizesi.
     * @returns {string} Harf ve rakam olmayan karakterlerin çıkarıldığı giriş dizesi.
     */
    function removeForeignChars(input) {
        // Harf ve rakam olmayan karakterleri eşleştirmek için düzenli ifade
        const regex = /[^a-zA-Z0-9 ]/g;
        // Harf ve rakam olmayan tüm karakterleri boş bir dize ile değiştirin
        return input.replace(regex, "");
    }
    // caesarCipher işlevi metin çıktısını saklar
    let cipherOutput = caesarCipher(selectedOption.value, inputTextValue, shiftValue, moduloValue, alphabetValue, foreignCharsValue);
    // Harfleri küçük harfe dönüştürün
    if (letterCaseValue == 2) {
        cipherOutput = cipherOutput.toLowerCase();
    }
    // Harfleri büyük harfe çevirin
    else if (letterCaseValue == 3) {
        cipherOutput = cipherOutput.toUpperCase();
    }
    // Çıktıyı ouput textarea'sında göster 
    outputText.textContent = cipherOutput;
});
