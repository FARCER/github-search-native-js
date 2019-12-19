class Search {

  static get USER_PER_PAGE() {
    return 20;
  };

  constructor() {
    this.app = document.getElementById('app');

    this.title = this.createElement('h1', 'title');
    this.title.textContent = 'Github Search Users';

    this.usersList = this.createElement('ul', 'users');

    this.searchLine = this.createElement('div', 'search-line');
    this.searchInput = this.createElement('input', 'search-input');
    this.searchInput.addEventListener('keyup', this.debounce(this.searchUsers.bind(this), 500));
    this.usersCounter = this.createElement('span', 'counter');
    this.searchLine.append(this.searchInput);
    this.searchLine.append(this.usersCounter);

    this.loadMore = this.createElement('button', 'brn');
    this.loadMore.textContent = 'Загрузить еще';
    this.loadMore.addEventListener('click', this.loadMoreUsers.bind(this));
    this.loadMore.style.display = 'none';


    this.app.append(this.title);
    this.app.append(this.searchLine);
    this.app.append(this.usersList);
    this.app.append(this.loadMore);
  }

  // Функция для создания элемента
  createElement(elementName, className) {
    const element = document.createElement(elementName);
    if (className) {
      element.classList.add(className)
    }
    return element;
  }


  loadMoreUsers() {

  }

  // Выполняем поиск пользователей
  async searchUsers() {
    const searchValue = this.searchInput.value;
    let users;
    let usersCount;
    let response;
    let currentPage = 1;
    if (searchValue) {
      response = await fetch(`https://api.github.com/search/users?q=${searchValue}&per_page=${Search.USER_PER_PAGE}$page=${currentPage}`);
      if (response.ok) {
        this.clearUsers();
        response.json().then((res) => {
          if (res.items) {
            users = res.items;
            usersCount = res.total_count;
            users.forEach(user => this.createUser(user));
            currentPage++;
          } else {
            this.clearUsers();
          }
          this.usersCounter.textContent = (usersCount > 0) ? `Найдено ${usersCount} пользователей` : 'По вашему запросу пользователей не найдено';
        });
      } else {
        console.log('Error 1' + response.status);
      }
    } else {
      this.clearUsers();
      this.usersCounter.textContent = '';
    }
  }

  // Очистка найденных пользователей
  clearUsers() {
    this.usersList.innerHTML = '';
  }

  // Создаем каждого найденного пользователя
  createUser(userData) {
    const user = this.createElement('li', 'user');
    user.innerHTML = `<img class="user-photo" src="${userData.avatar_url} alt="${userData.login}_photo">
                          <span class="user-name">${userData.login}</span>`;
    this.usersList.append(user);
  }

  // Задержка ввода данных для отправки запроса
  debounce(f, ms) {
    let isCooldown = false;
    return function () {
      if (isCooldown) return;
      f.apply(this, arguments);
      isCooldown = true;
      setTimeout(() => isCooldown = false, ms);
    };
  }
}

new Search();
