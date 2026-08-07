from pathlib import Path

from django.conf import settings
from django.http import HttpResponse

_INDEX_HTML_PATH = Path(settings.BASE_DIR).parent / "frontend" / "dist" / "index.html"


def spa_view(request):
    try:
        html = _INDEX_HTML_PATH.read_text(encoding="utf-8")
    except FileNotFoundError:
        return HttpResponse(
            "Frontend build not found. Run `npm run build` in frontend/.",
            status=501,
        )
    return HttpResponse(html)
