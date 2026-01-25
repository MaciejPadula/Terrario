function showNotification(message) {
  self.registration.showNotification(message.notification.title, {
    body: message.notification.body,
    icon: message.notification.icon,
    image: message.notification.image,
  });
}

this.onpush = (event) => {
  const messageText = event.data.text();
  showNotification(JSON.parse(messageText));
};
