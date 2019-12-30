export class VIEW {
    constructor(api) {
        this.api = api;

        this.app = document.getElementById('app');

        // Заголовок
        this.title = this.createElement('h1', 'title');
        this.title.textContent = 'Github Search Users';

        // Основной блок
        this.mainContent = this.createElement('div', 'main');

        // Список пользователей
        this.usersListWrapper = this.createElement('div', 'users-wrapper');
        this.usersList = this.createElement('ul', 'users');
        this.usersListWrapper.append(this.usersList);

        // Поле поиска
        this.searchLine = this.createElement('div', 'search-line');
        this.searchInput = this.createElement('input', 'search-input');
        this.usersCounter = this.createElement('span', 'counter');
        this.searchLine.append(this.searchInput);
        this.searchLine.append(this.usersCounter);

        // Кнопка "Загрузить еще"
        this.loadMore = this.createElement('button', 'btn');
        this.loadMore.textContent = 'Загрузить еще';
        this.loadMore.style.display = 'none';
        this.usersListWrapper.append(this.loadMore);

        //Добавление всех блоков в приложение
        this.app.append(this.title);
        this.app.append(this.searchLine);
        this.mainContent.append(this.usersListWrapper);
        this.app.append(this.mainContent);
    }

    // Функция для создания элемента
    createElement(elementName, className) {
        const element = document.createElement(elementName);
        if (className) {
            element.classList.add(className)
        }
        return element;
    }

    // Создаем каждого найденного пользователя
    createUser(userData) {
        const user = this.createElement('li', 'user-prev');
        user.addEventListener('click', () => this.showUser(userData));
        user.innerHTML = `<img class="user-prev-photo" src="${userData.avatar_url}" alt="${userData.login}_photo">
                          <span class="user-prev-name">${userData.login}</span>`;
        this.usersList.append(user);
    }

    // Показываем данные выбранного пользователя
    showUser(userData) {
        const user = this.createElement('div', 'user');
        const userHtml = this.mainContent.querySelector('.user');
        const name = userData.login;
        this.api.loadUserData(name)
            .then(data => {
                const [following, followers, repos] = data;
                const followingHTML = this.getUserListHTML(following, 'Following');
                const followersHTML = this.getUserListHTML(followers, 'Followers');
                const reposHTML = this.getUserListHTML(repos, 'Repos');
                user.innerHTML = `<img src="${userData.avatar_url}">
                                  <h2 class="user-name">${name}</h2>
                                     ${followingHTML}
                                     ${followersHTML}
                                     ${reposHTML}`;
                if (userHtml) {
                    userHtml.remove();
                }
                this.mainContent.append(user);
            });
    }

    // Получаем html списка в данных пользователя
    getUserListHTML(data, title) {
        return data.length ? `<div class="user-block">
                                  <h3 class="user-block-title">${title}</h3>
                                  <ul class="user-list">${this.templateItem(data)}</ul>
                              </div>`
            : '';
    }

    // Строим каждый элемент списка
    templateItem(data) {
        let userItem = '';
        data.forEach(user => {
            userItem += `<li class="user-list-item">
                            <a href="${user.html_url}" class="user-list-link">${user.login ? user.login : user.name}</a>
                          </li>`;
        });
        return userItem
    }

    // Очистка найденных пользователей
    clearUsers() {
        this.usersList.innerHTML = '';
    }

    // Устанавливаем сообщение о количестве найденных пользователей
    setUserCounter(message) {
        this.usersCounter.textContent = message
    }

    //Показываем или скрываем кнопку "Загрузить еще"
    toggleStateLoadMoreButton(show) {
        this.loadMore.style.display = show ? 'block' : 'none';
    }
}
