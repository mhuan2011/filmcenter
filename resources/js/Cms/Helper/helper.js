// import moment from 'moment';
import { notification } from 'antd';
import moment from 'moment';

export default {
    Noti(type, message, description) {
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
        if (item) {
            return item;
        }
        return false;
    },

    removeStorage(key) {
        localStorage.removeStorage(key);
    },

    formatCurrency(money) {
        var x = money;
        x = x.toLocaleString('it-IT', { style: 'currency', currency: 'VND' });
        return x;
    },

    formatDateToShow(date) {
        var days = ['Chủ Nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];
        var str = days[moment(date).day()] + " (" + date + ")";
        return str;
    },


    openNotification(title, desc, placement = 'topRight') {
        notification.info({
            message: `${title}`,
            description:
                desc,
            placement,
        });
    },

    notification(obj) {
        notification[obj.status]({
            message: 'Thông báo',
            description: obj.message,
        });
    },

    formatSelect(data) {
        var result = []
        data.forEach(item => {
            result.push({
                value: item.id,
                label: item.name ? item.name : item.title
            })
        });
        return result;
    }
}