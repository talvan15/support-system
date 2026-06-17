const notifications = [];

function addNotification(data) {

    notifications.push({
        id: notifications.length + 1,
        ...data,
        receivedAt: new Date()
    });

}

function getNotifications() {
    return notifications;
}

module.exports = {
    addNotification,
    getNotifications
};