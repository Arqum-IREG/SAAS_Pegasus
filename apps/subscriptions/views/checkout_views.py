from django.contrib import messages
from django.contrib.auth.decorators import login_required
from django.http import HttpResponseRedirect

from apps.subscriptions.helpers import (
    get_subscription_urls,
    provision_subscription,
)
from apps.subscriptions.wrappers import SubscriptionWrapper
from apps.teams.decorators import login_and_team_required
from apps.utils.billing import get_stripe_module


@login_required
def subscription_confirm(request):
    session_id = request.GET.get("session_id")
    session = get_stripe_module().checkout.Session.retrieve(session_id)
    client_reference_id = int(session.client_reference_id)
    subscription_holder = request.user.teams.select_related("subscription", "customer").get(id=client_reference_id)
    if not subscription_holder.subscription or subscription_holder.subscription.id != session.subscription:
        # provision subscription
        djstripe_subscription = provision_subscription(subscription_holder, session.subscription)
    else:
        # already provisioned (likely by webhook)
        djstripe_subscription = subscription_holder.subscription

    subscription_name = SubscriptionWrapper(djstripe_subscription).display_name
    messages.success(request, f"You've successfully signed up for {subscription_name}. Thanks for the support!")
    return HttpResponseRedirect(get_subscription_urls(subscription_holder)["subscription_details"])


@login_and_team_required
def checkout_canceled(request, team_slug):
    subscription_holder = request.team
    messages.info(request, "Your upgrade was canceled.")
    return HttpResponseRedirect(get_subscription_urls(subscription_holder)["subscription_details"])
