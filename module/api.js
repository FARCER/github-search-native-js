const USER_PER_PAGE = 20;
const URL = 'https://api.github.com/';

export class API {

    constructor() {
    }

    // Загрузка пользователей
    async loadUsers(searchValue, page) {
        return await fetch(`${URL}search/users?q=${searchValue}&per_page=${USER_PER_PAGE}&page=${page}`);
    }

    // Получаем подписчиков пользователя
    loadUserFollowing(user) {
        return this.getData(`${URL}users/${user}/following`);
    }

    // Получаем пользователей, на который подписан
    async loadUserFollowers(user) {
        return await fetch(`${URL}users/${user}/followers`);
    }

    // Получаем список репозиториев
    async loadUserRepos(user) {
        return await fetch(`${URL}users/${user}/repos`);
    }

    async getData(url) {
        return await fetch(url).then(res => {
            if (res.ok) {
                res.json().then(res => {
                    console.log(res);
                });
            }
        })
    }

}
