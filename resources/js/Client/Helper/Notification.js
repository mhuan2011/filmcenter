import { notification } from "antd";

const openNotification = obj => {
  obj.status === false ? obj.status = "error" : obj.status = "success"
  notification[obj.status]({
    message: 'Thông báo',
    description: obj.message,
  });
};

export {openNotification} 