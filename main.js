import {LOG} from './module/log.js'
import {API} from './module/api.js'
import {VIEW} from './module/view.js'
import {Search} from './module/search.js'


const api = new API();

new Search(new LOG(), api, new VIEW(api));
