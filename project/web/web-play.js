window.onload = function () {
    const currentUser = localStorage.getItem('currentUser');
  
    if (!currentUser || currentUser === 'null') {
      const playOutput = document.getElementById('play-output');
      const playIframe = document.getElementById('play-iframe');
      playOutput.style.backgroundColor = 'red';
      playOutput.style.display = 'block';
      playIframe.style.display = 'none';
      playOutput.textContent = 'Oops! You need to login!';
    } else {
      const playIframe = document.getElementById('play-iframe');
      const playOutput = document.getElementById('play-output');
      playIframe.style.display = 'block';
      playOutput.style.display = 'none';
    }
  };