export class Search {

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
    debounce(func, wait, immediate) {
        let timeout;
        return function() {
            const context = this, args = arguments;
            const later = function() {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };
            const callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(context, args);
        };
    }
}
