export class API {
    static get USER_PER_PAGE() {
        return 20;
    };

    constructor() {
    }

    // Загрузка пользователей
    async loadUsers(searchValue, page) {
        return await fetch(`https://api.github.com/search/users?q=${searchValue}&per_page=${API.USER_PER_PAGE}&page=${page}`);
    }

    // Получаем подписчиков пользователя
    async loadUserFollowing(user) {
        return await fetch(`https://api.github.com/users/${user}/following`);
    }

    // Получаем пользователей, на который подписан
    async loadUserFollowers(user) {
        return await fetch(`https://api.github.com/users/${user}/followers`);
    }

    // Получаем список репозиториев
    async loadUserRepos(user) {
        return await fetch(`https://api.github.com/users/${user}/repos`);
    }

}
