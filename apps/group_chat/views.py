from django.template.response import TemplateResponse
from django.utils.text import slugify

from apps.web.meta import websocket_absolute_url, websocket_reverse


def chat_list(request):
    return TemplateResponse(
        request,
        "group_chat/group_chat_home.html",
        {
            "active_tab": "group-chat",
        },
    )


def chat_room(request, room_name):
    room_id = slugify(room_name) or "lobby"
    websocket_url = websocket_absolute_url(websocket_reverse("ws_group_chat", args=[room_id]))
    return TemplateResponse(
        request,
        "group_chat/chat_room.html",
        {
            "active_tab": "group-chat",
            "room_name": room_name,
            "websocket_url": websocket_url,
        },
    )
