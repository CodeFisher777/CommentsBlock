if (!localStorage.getItem('comments')) {
  localStorage.setItem('comments', JSON.stringify([]));
}
document.getElementById('comment-add').addEventListener('click', function (e) {
  let name = document.getElementById('comment-name').value;
  let text = document.getElementById('comment-text').value;
  let date = document.getElementById('comment-date').value;

  //функция для вчера сегодня
  let date2 = date.substring(date.length - 2);
  function getDayName() {
    let today = new Date().getDate() + '';
    let yesterday = new Date().getDate() - 1 + '';
    if (today.length === 1) {
      today = '0' + today;
    }
    if (yesterday.length === 1) {
      yesterday = '0' + yesterday;
    }
    if (date2 === today) {
      return (date2 = 'Сегодня');
    } else if (date2 === yesterday) {
      return (date2 = 'Вчера');
    } else {
      return (date2 = date);
    }
  }
  getDayName();

  if (name && text) {
    document.getElementById('comment-name').value = '';
    document.getElementById('comment-text').value = '';
    document.getElementById('comment-date').value = '';
    let id = 1;
    let time = Math.floor(Date.now() / 1000);
    if (!date2) {
      date2 = 'Сегодня';
    }

    let comments = JSON.parse(localStorage.getItem('comments'));
    comments.push(['comment' + comments.length, name, text, date2, time]);
    localStorage.setItem('comments', JSON.stringify(comments));
    update_comments();
  } else {
    alert('Заполните все поля кроме даты');
  }
});

update_comments();

function update_comments() {
  let commentField = document.getElementById('comment-field');
  let comments = JSON.parse(localStorage.getItem('comments'));
  let out = '';
  comments.reverse();

  for (let i = 0; i < comments.length; i++) {
    out += `<div class="comment-block"><p class="comment-field-time">${
      comments[i][3]
    } в ${timeConverter(comments[i][4])}</p>`;
    out += `<p class="comment-field-name">${comments[i][1]}</p>`;
    out += `<p class="comment-field-text">${comments[i][2]}</p>`;
    out += `<div class="comment-field-btns"><button data-like="${comments[i][0]}" id="like${comments[i][0]}" class="comment-field-btns-like"></button><button data-delete="${comments[i][0]}" class="comment-field-btns-del" id="delete"></button></div></div>`;
  }
  commentField.innerHTML = out;
}

//функция удаления из массива
document.querySelector('#comment-field').addEventListener('click', function (e) {
  if (!e.target.dataset.delete) {
    return;
  }
  let comments = JSON.parse(localStorage.getItem('comments'));
  for (let i = 0; i < comments.length; i++) {
    if (comments[i][0] == e.target.dataset.delete) {
      comments.splice(i, 1);
      localStorage.setItem('comments', JSON.stringify(comments));
      update_comments();
    }
  }
});

// функция установки лайка
document.querySelector('#comment-field').addEventListener('click', function (e) {
  e.preventDefault();
  if (!e.target.dataset.like) {
    return;
  }

  let comments = JSON.parse(localStorage.getItem('comments'));
  for (let i = 0; i < comments.length; i++) {
    if (comments[i][0] == e.target.dataset.like) {
      document.querySelector(`#like${comments[i][0]}`).classList.toggle('on');
    }
  }
});

// timeconverter
function timeConverter(UNIX_timestamp) {
  let a = new Date(UNIX_timestamp * 1000);
  let months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  let year = a.getFullYear();
  let month = months[a.getMonth()];
  let date = a.getDate();
  let hour = a.getHours();
  let min = a.getMinutes();
  let sec = a.getSeconds();
  let time = hour + ':' + min;
  return time;
}
