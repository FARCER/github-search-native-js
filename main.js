class Search {

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


        this.app.append(this.title);
        this.app.append(this.searchLine);
        this.app.append(this.usersList);
    }

    createElement(elementName, className) {
        const element = document.createElement(elementName);
        if (className) {
            element.classList.add(className)
        }
        return element;
    }

    async searchUsers() {
        const searchValue = this.searchInput.value;
        let users;
        let usersCount;
        let response;
        if (searchValue) {
            response = await fetch(`https://api.github.com/search/users?q=${searchValue}`);
            if (response.ok) {
                response.json().then((res) => {
                    users = res.items;
                    usersCount = res.total_count;
                    users.forEach(user => this.createUser(user));
                    this.usersCounter.textContent = (usersCount > 0) ? `Найдено ${usersCount} пользователей` : '';

                });
            } else {
                console.log('Error 1' + response.status)
            }
        }
    }

    createUser(userData) {
        const user = this.createElement('li', 'user');
        user.innerHTML = `<img class="user-photo" src="${userData.avatar_url} alt="${userData.login}_photo">
                          <span class="user-name">${userData.login}</span>`;
        this.usersList.append(user);
    }

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
