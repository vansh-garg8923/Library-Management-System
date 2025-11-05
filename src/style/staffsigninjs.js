// staff login logic

let loginbutton = document.querySelector('#submitbtn');

loginbutton.addEventListener('click', async (event) => {
  event.preventDefault();

  let usrname = document.querySelector('#name').value.trim();
  let passwd = document.querySelector('#passwd').value.trim();

  console.log("Searching for ", usrname, passwd);

  const res = await fetch(`/login/staff?username=${encodeURIComponent(usrname)}&password=${encodeURIComponent(passwd)}`);

  let data;

  try {
    data = await res.json().catch(()=>null);
  } catch(err) {
    console.log("JSON parse failed:", err);
    return;
  }

  console.log(data);

  if (data.message === "Login successful") {
    document.querySelector('#name').value = "";
    document.querySelector('#passwd').value = "";
    window.location.href = "/staff_work.html";
    localStorage.setItem("curr_user", usrname);
  } else {
      if (!res.ok) {
      alert(data.error || data.message || "Unknown error");
      return;
    }
  }
});
