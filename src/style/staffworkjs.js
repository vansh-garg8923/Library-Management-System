// book issuing logic

let submit_button = document.querySelector('#submit_button');

submit_button.addEventListener('click', async (event) => {
  event.preventDefault();

  let student_enroll = document.querySelector('#enr').value.trim();
  // let staff_id = document.querySelector('#passwd').value.trim();
  let isbn = document.querySelector('#isbn').value.trim();
  let staff_id = 101;

  console.log("Issuing for ", student_enroll, staff_id , isbn);

  const res = await fetch(`/issue?student_enroll=${encodeURIComponent(student_enroll)}&staff_id=${staff_id}&isbn=${isbn}`);

  let data;

  try {
    data = await res.json().catch(()=>null);
  } catch(err) {
    console.log("JSON parse failed:", err);
    return;
  }

  console.log(data);

  if (data.message === "Book issued successfully") {
    document.querySelector('#enr').value = "";
    document.querySelector('#isbn').value = "";
    window.location.href = "/issue_successfull.html";
  } else {
      if (!res.ok) {
      alert(data.error || data.message || "Unknown error");
      return;
    }
  }
});