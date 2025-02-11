import json
import uuid

from channels.generic.websocket import AsyncWebsocketConsumer
from django.template.loader import render_to_string

from apps.users.serializers import CustomUserSerializer


class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.user = self.scope["user"]
        self.session_id = uuid.uuid4().hex
        self.room_name = self.scope["url_route"]["kwargs"]["room_name"]
        self.room_group_name = "chat_%s" % self.room_name

        # Join room group
        await self.channel_layer.group_add(self.room_group_name, self.channel_name)

        await self.accept()

    async def disconnect(self, close_code):
        # Leave room group
        await self.channel_layer.group_discard(self.room_group_name, self.channel_name)

    # Receive message from WebSocket
    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message = text_data_json["message"]
        user_data = None
        if not self.user.is_anonymous:
            user_data = CustomUserSerializer(self.user).data
        event = {
            "type": "chat_message",
            "message": message,
            "user": user_data,
            "session": self.session_id,
        }
        # Send message to room group
        await self.channel_layer.group_send(self.room_group_name, event)

    # Receive message from room group
    async def chat_message(self, event):
        message = event["message"]
        user = event["user"]
        is_own = self.session_id == event["session"] or (user and user["id"] == self.user.id)
        response = render_to_string(
            "group_chat/components/chat_response_htmx.html",
            {
                "user": user,
                "message": message,
                "is_own": is_own,
            },
        )
        await self.send(text_data=response)
