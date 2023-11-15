// login.js

window.addEventListener("DOMContentLoaded", function () {
  const form = document.querySelector("#loginForm");
  form.addEventListener("submit", function (e) {
    e.preventDefault();

    // Get the user input from the form
    const id = this.id.value;
    const pw = this.pw.value;
    if (!id || !pw) {
      alert("Write both id and password");
      return;
    }

    // Function to shift the characters
    const shiftChar = (char) => {
      if (char.match(/[a-zA-Z]/)) {
        // Check if character is an alphabet
        const code = char.charCodeAt(0);
        // Shift for uppercase and lowercase letters
        if ((code >= 65 && code < 90) || (code >= 97 && code < 122)) {
          return String.fromCharCode(code + 1);
        }
        // Wrap around Z to A and z to a
        if (code === 90) return "A";
        if (code === 122) return "a";
      }
      return char; // Return the original character if it's not a letter
    };

    const encryptedId = Array.from(id).map(shiftChar).join("");
    const encryptedPw = Array.from(pw).map(shiftChar).join("");

    const key = "ktkl-blackboard";
    const AESId = CryptoJS.AES.encrypt(encryptedId, key).toString();
    const AESPw = CryptoJS.AES.encrypt(encryptedPw, key).toString();

    form.AESId.value = AESId;
    form.AESPw.value = AESPw;

    form.id.value = "";
    form.pw.value = "";

    this.id.value = "";
    this.pw.value = "";
    // Submit the form
    form.submit();
  });
});
