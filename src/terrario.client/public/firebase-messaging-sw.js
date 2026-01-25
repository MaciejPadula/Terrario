function showNotification(message) {
  self.registration.showNotification(message.notification.title, {
    body: message.notification.body,
    icon: message.data.icon,
    image: message.notification.image,
    data: message.data, // Store data for click handling
  });
}

this.onpush = (event) => {
  const messageText = event.data.text();
  showNotification(JSON.parse(messageText));
};

this.addEventListener('notificationclick', (event) => {
  event.notification.close();

  const link = event.notification.data?.link;
  if (link) {
    event.waitUntil(
      clients.openWindow(link)
    );
  }
});
