window.addEventListener("DOMContentLoaded", function () {
  const form = document.querySelector("#signupForm");
  form.addEventListener("submit", function (e) {
    e.preventDefault();

    // Get the user input from the form
    const id = this.id.value;
    const pw = this.pw.value;
    if (!id || !pw) {
      alert("Write both id and password");
      return;
    }

    const key = "ktkl-blackboard";

    const AESId = CryptoJS.AES.encrypt(id, key).toString();
    const AESPw = CryptoJS.AES.encrypt(pw, key).toString();

    form.AESId.value = AESId;
    form.AESPw.value = AESPw;

    this.id.value = "";
    this.pw.value = "";

    // Submit the form
    form.submit();
  });
});
