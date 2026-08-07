from django.conf import settings
from django.contrib import admin
from django.urls import include, path, re_path
from django.views.decorators.clickjacking import xframe_options_exempt
from django.views.static import serve

from .spa import spa_view

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/", include("projects.urls")),
]

if settings.DEBUG:
    # Media files (e.g. the resume) need to be embeddable in an <iframe> from the
    # frontend's origin, so exempt them from Django's default X-Frame-Options: DENY.
    urlpatterns += [
        re_path(
            r"^media/(?P<path>.*)$",
            xframe_options_exempt(serve),
            {"document_root": settings.MEDIA_ROOT},
        ),
    ]

# Anything else is a client-side route handled by the React app.
urlpatterns += [
    re_path(r"^(?!admin/|api/|static/|media/).*$", spa_view, name="spa"),
]
