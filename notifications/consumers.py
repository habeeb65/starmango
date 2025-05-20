import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from django.contrib.auth.models import User
from .models import Notification

class NotificationConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.user = self.scope["user"]
        
        # Anonymous users can't receive notifications
        if self.user.is_anonymous:
            await self.close()
            return
        
        self.user_group_name = f'user_{self.user.id}'
        
        # Join user group
        await self.channel_layer.group_add(
            self.user_group_name,
            self.channel_name
        )
        
        await self.accept()
        
        # Send unread notifications on connect
        unread_notifications = await self.get_unread_notifications()
        if unread_notifications:
            await self.send(text_data=json.dumps({
                'type': 'unread_notifications',
                'notifications': unread_notifications
            }))
    
    async def disconnect(self, close_code):
        # Leave user group
        await self.channel_layer.group_discard(
            self.user_group_name,
            self.channel_name
        )
    
    async def receive(self, text_data):
        data = json.loads(text_data)
        
        # Handle marking notifications as read
        if data.get('type') == 'mark_read':
            notification_id = data.get('notification_id')
            if notification_id:
                await self.mark_notification_read(notification_id)
                await self.send(text_data=json.dumps({
                    'type': 'notification_marked_read',
                    'notification_id': notification_id
                }))
    
    async def notification_message(self, event):
        # Send notification to WebSocket
        await self.send(text_data=json.dumps({
            'type': 'new_notification',
            'notification': event['message']
        }))
    
    @database_sync_to_async
    def get_unread_notifications(self):
        notifications = Notification.objects.filter(
            recipient=self.user,
            read=False
        ).order_by('-created_at')[:10]
        
        return [
            {
                'id': notification.id,
                'title': notification.title,
                'message': notification.message,
                'level': notification.level,
                'timestamp': notification.created_at.isoformat(),
                'url': notification.action_url
            }
            for notification in notifications
        ]
    
    @database_sync_to_async
    def mark_notification_read(self, notification_id):
        try:
            notification = Notification.objects.get(
                id=notification_id,
                recipient=self.user
            )
            notification.mark_as_read()
            return True
        except Notification.DoesNotExist:
            return False