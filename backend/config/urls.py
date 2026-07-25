from django.conf import settings
from django.contrib import admin
from django.urls import include, path, re_path
from django.views.decorators.clickjacking import xframe_options_exempt
from django.views.static import serve

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
