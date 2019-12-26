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
        this.usersList = this.createElement('ul', 'users');

        // Поле поиска
        this.searchLine = this.createElement('div', 'search-line');
        this.searchInput = this.createElement('input', 'search-input');
        this.usersCounter = this.createElement('span', 'counter');
        this.searchLine.append(this.searchInput);
        this.searchLine.append(this.usersCounter);

        // Кнопка "Загрузить еще"
        this.loadMore = this.createElement('button', 'brn');
        this.loadMore.textContent = 'Загрузить еще';
        this.loadMore.style.display = 'none';

        //Добавление всех блоков в приложение
        this.app.append(this.title);
        this.app.append(this.searchLine);
        this.mainContent.append(this.usersList);
        this.app.append(this.mainContent);
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

    // Создаем каждого найденного пользователя
    createUser(userData) {
        const user = this.createElement('li', 'user-prev');
        user.addEventListener('click', () => this.showUser(userData));
        user.innerHTML = `<img class="user-prev-photo" src="${userData.avatar_url}" alt="${userData.login}_photo">
                          <span class="user-prev-name">${userData.login}</span>`;
        this.usersList.append(user);
    }

    showUser(data) {
        const user = this.createElement('div', 'user');
        const userHtml = this.mainContent.querySelector('.user');
        const userFollowing = this.api.loadUserFollowing(data.login);
        console.log(userFollowing);
        user.innerHTML = `<img src="${data.avatar_url}">
                          <h2>${data.login}</h2>`;
        if (userHtml) {
            userHtml.remove();
        }
        this.mainContent.append(user);
    }

    getUserFollowing(userName) {
        let result;
        this.api.loadUserFollowing(userName).then(response => {
            if (response.ok) {
                response.json().then((res => {
                    result = res;
                    return result;
                }));
            }
        });
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
