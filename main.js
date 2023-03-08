if (!localStorage.getItem('comments')) {
  localStorage.setItem('comments', JSON.stringify([]));
}
document.getElementById('comment-add').addEventListener('click', function (e) {
  event.preventDefault();
  //Создание переменных
  let name = document.getElementById('comment-name').value;
  let text = document.getElementById('comment-text').value;
  let date = document.getElementById('comment-date').value;
  let time = Math.floor(Date.now() / 1000);
  let dateNow = dateConverter(time);
  // функция сравнения дат
  function compareDate() {
    let dif = +dateNow.split('-').join('') - +date.split('-').join('');
    if (dif === 0) {
      return (dateComment = 'Сегодня');
    } else if (dif === 1) {
      return (dateComment = 'Вчера');
    } else {
      return (dateComment = date);
    }
  }
  compareDate();
  //если дата не указана, то текущая
  if (!dateComment) {
    dateComment = 'Сегодня';
  }

  // функция удаления ошибок
  function removeError(input) {
    const parent = input.parentNode;
    input.onfocus = function () {
      if (parent.classList.contains('error')) {
        parent.querySelector('.form-group-error-label').remove();
        parent.classList.remove('error');
      }
    };
    if (parent.classList.contains('error')) {
      parent.querySelector('.form-group-error-label').remove();
      parent.classList.remove('error');
    }
  }
  // функция создания ошибок
  function createError(input, text) {
    const parent = input.parentNode;
    const errorLabel = document.createElement('label');
    errorLabel.classList.add('form-group-error-label');
    parent.classList.add('error');
    errorLabel.textContent = text;
    parent.append(errorLabel);
  }
  //Блок валидации
  // валидация date
  function validationDate() {
    removeError(document.getElementById('comment-date'));

    if (dateNow < date) {
      createError(
        document.getElementById('comment-date'),
        'Не только лишь все могут смотреть в завтрашний день! ©',
      );
      return false;
    }
    {
      return true;
    }
  }

  // валидация name
  function validationName() {
    removeError(document.getElementById('comment-name'));
    if (name) {
      name = name[0].toUpperCase() + name.slice(1);
      return true, name;
    } else {
      createError(document.getElementById('comment-name'), 'Имя не задано!');
      return false;
    }
  }

  // валидация text
  function validationText() {
    removeError(document.getElementById('comment-text'));
    if (text && text.length > 4 && text.length) {
      return true;
    } else {
      createError(document.getElementById('comment-text'), 'Текст не введён или менее 5 символов!');
      return false;
    }
  }
  let dateOk = validationDate();
  let nameOk = validationName();
  let textOk = validationText();
  if (dateOk && nameOk && textOk) {
    setComments();
  }
  //функция для записи
  function setComments() {
    document.getElementById('comment-name').value = '';
    document.getElementById('comment-text').value = '';
    document.getElementById('comment-date').value = '';

    let comments = JSON.parse(localStorage.getItem('comments'));
    comments.push(['comment' + comments.length, name, text, dateComment, time, false]);
    localStorage.setItem('comments', JSON.stringify(comments));
    update_comments();
  }
});

update_comments();
//функция рендера
function update_comments() {
  let commentField = document.getElementById('comment-field');
  let comments = JSON.parse(localStorage.getItem('comments'));
  let out = '';
  comments.reverse();

  for (let i = 0; i < comments.length; i++) {
    out += `<div class="comment-block"><p class="comment-field-time">${
      comments[i][3]
    }, ${timeConverter(comments[i][4])}</p>`;
    out += `<p class="comment-field-name">${comments[i][1]}</p>`;
    out += `<p class="comment-field-text">${comments[i][2]}</p>`;
    comments[i][5]
      ? (out += `<div class="comment-field-btns"><button data-like="${comments[i][0]}" id="like${comments[i][0]}" class="comment-field-btns-like on"></button><button data-delete="${comments[i][0]}" class="comment-field-btns-del" id="delete"></button></div></div>`)
      : (out += `<div class="comment-field-btns"><button data-like="${comments[i][0]}" id="like${comments[i][0]}" class="comment-field-btns-like"></button><button data-delete="${comments[i][0]}" class="comment-field-btns-del" id="delete"></button></div></div>`);
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

// установить/снять лайк
document.querySelector('#comment-field').addEventListener('click', function (e) {
  e.preventDefault();
  if (!e.target.dataset.like) {
    return;
  }

  let comments = JSON.parse(localStorage.getItem('comments'));
  for (let i = 0; i < comments.length; i++) {
    if (comments[i][0] == e.target.dataset.like) {
      document.querySelector(`#like${comments[i][0]}`).classList.toggle('on');
      comments[i][5] = !comments[i][5];
      localStorage.setItem('comments', JSON.stringify(comments));
    }
  }
});

// converter для времени
function timeConverter(UNIX_timestamp) {
  let a = new Date(UNIX_timestamp * 1000);
  let hour = a.getHours();
  let min = a.getMinutes();
  if (min < 10) {
    min = '0' + min;
  }
  let time = hour + ':' + min;
  return time;
}
// converter для даты
function dateConverter(UNIX_timestamp) {
  let a = new Date(UNIX_timestamp * 1000);
  let months = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
  let year = a.getFullYear();
  let month = months[a.getMonth()];
  let date = a.getDate();
  if (date < 10) {
    date = '0' + date;
  }
  let dateNow = year + '-' + month + '-' + date;
  return dateNow;
}
