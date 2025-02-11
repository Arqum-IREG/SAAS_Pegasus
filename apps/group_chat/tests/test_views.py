from django.test import TestCase
from django.urls import reverse


class TestGroupChatViews(TestCase):
    def test_group_chat_home(self):
        self._assert_200(reverse("group_chat:chat_list"))

    def test_chat_room(self):
        self._assert_200(reverse("group_chat:chat_room", args=["lobby"]))

    def _assert_200(self, url):
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
