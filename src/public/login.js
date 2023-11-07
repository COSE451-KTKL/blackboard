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
      // location.reload();
    }

    console.log(id, pw);

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

    // Encrypt the ID and password by shifting each character
    const encryptedId = Array.from(id).map(shiftChar).join("");
    const encryptedPw = Array.from(pw).map(shiftChar).join("");

    form.encryptedId.value = encryptedId;
    form.encryptedPw.value = encryptedPw;

    // // Create hidden fields to hold the encrypted values
    // const encryptedIdField = document.createElement("input");
    // encryptedIdField.type = "hidden";
    // encryptedIdField.name = "encryptedId";
    // encryptedIdField.value = encryptedId;

    // const encryptedPwField = document.createElement("input");
    // encryptedPwField.type = "hidden";
    // encryptedPwField.name = "encryptedPw";
    // encryptedPwField.value = encryptedPw;

    // // Append the hidden fields to the form
    // form.appendChild(encryptedIdField);
    // form.appendChild(encryptedPwField);

    // // Clear the visible fields
    // this.id.value = "";
    // this.pw.value = "";
    console.log(
      this.id.value,
      this.pw.value,
      form.encryptedId.value,
      form.encryptedPw.value
    );
    // Submit the form
    form.submit();
  });
});
