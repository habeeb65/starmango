from rest_framework import serializers
from notifications.models import Notification

class NotificationSerializer(serializers.ModelSerializer):
    recipient_username = serializers.CharField(source='recipient.username', read_only=True)
    
    class Meta:
        model = Notification
        fields = [
            'id', 'recipient', 'recipient_username', 'notification_type', 
            'level', 'title', 'message', 'read', 'created_at', 
            'content_type', 'object_id', 'action_url'
        ]
        read_only_fields = ['created_at']