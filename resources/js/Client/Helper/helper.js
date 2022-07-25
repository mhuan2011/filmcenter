// import moment from 'moment';
import { notification } from 'antd';

export default {
    Noti(type, message, description){
        notification[type]({
            message: message,
            description: description,
        });
    },


    storageItem(key, value) {
        localStorage.setItem(key, value);
    },

    getStorage(key) {
        var item = localStorage.getItem(key);
        if(item){
            return item;
        }
        return false;
    },

    removeStorage(key) {
        localStorage.removeStorage(key);
    },

    formatCurrency(money) {
        var x = money;
        x = x.toLocaleString('it-IT', {style : 'currency', currency : 'VND'});
        return x;
    }
}