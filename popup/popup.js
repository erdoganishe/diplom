document.addEventListener('DOMContentLoaded', async () => {
  await checkForStoredData().then((result) => {
    if (result) {
      window.location.href = "../utils/login.html";
    } else {
      window.location.href = "../utils/register.html";
    }
  })
}); 
