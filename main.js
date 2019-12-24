class Search {

    static get USER_PER_PAGE() {
        return 20;
    };

    // Получаем текущую страницу поиска
    get currentPageNumber() {
        return this.currentPage;
    }

    // Устанавливаем текущую страницу поиска
    setCurrentPageValue(pageNumber) {
        this.currentPage = pageNumber;
    }

    constructor(log, api, view) {
        this.log = log;
        this.api = api;
        this.view = view;
        this.view.searchInput.addEventListener('keyup', this.debounce(this.searchUsers.bind(this), 500));
        this.view.loadMore.addEventListener('click', this.loadMoreUsers.bind(this));
        this.currentPage = 1;
    }

    // Выполняем поиск пользователей при каждом вводе символа в поисковую строку
    searchUsers() {
        this.setCurrentPageValue(1);
        if (this.view.searchInput.value) {
            this.api.loadUsers(this.view.searchInput.value, this.currentPageNumber).then(response => this.updateUsers(response))
        } else {
            this.view.clearUsers();
            this.view.setUserCounter('');
        }
    }

    // Подгружаем пользователей при нажатии на кнопку "Загрузить еще"
    loadMoreUsers() {
        this.setCurrentPageValue(this.currentPage + 1);
        this.api.loadUsers(this.view.searchInput.value, this.currentPageNumber).then(response => this.updateUsers(response, true))
    }

    // Обновляем текущее состояние пользователей
    updateUsers(response, isUpdate = false) {
        let users;
        let usersCount;
        if (response.ok) {
            if (!isUpdate) {
                // Если новый поиск а не подгрузка, то очищаем ранее найденных пользователей
                this.view.clearUsers();
            }
            response.json().then((res) => {
                if (res.items) {
                    users = res.items;
                    usersCount = res.total_count;
                    this.view.toggleStateLoadMoreButton(usersCount > 10 && users.length * this.currentPageNumber !== usersCount);
                    users.forEach(user => this.view.createUser(user));
                } else {
                    this.view.clearUsers();
                }
                this.view.setUserCounter(this.log.counterMessage(usersCount));
            });
        } else {
            console.log('Error 1' + response.status);
        }
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


class LOG {
    constructor() {
    }

    // Сообщение с числом пользователей
    counterMessage(usersCount) {
        return (usersCount > 0) ? `Найдено ${usersCount} пользователей` : 'По вашему запросу пользователей не найдено';
    }
}

class API {
    constructor() {
    }

    // Загрузка пользователей
    async loadUsers(searchValue, page) {
        return await fetch(`https://api.github.com/search/users?q=${searchValue}&per_page=${Search.USER_PER_PAGE}&page=${page}`);
    }

}

class VIEW {
    constructor() {
        this.app = document.getElementById('app');

        // Заголовок
        this.title = this.createElement('h1', 'title');
        this.title.textContent = 'Github Search Users';

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

    // Создаем каждого найденного пользователя
    createUser(userData) {
        const user = this.createElement('li', 'user');
        user.innerHTML = `<img class="user-photo" src="${userData.avatar_url}" alt="${userData.login}_photo">
                          <span class="user-name">${userData.login}</span>`;
        this.usersList.append(user);
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

new Search(new LOG(), new API(), new VIEW());
