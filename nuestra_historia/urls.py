import os
from django.urls import path, include, re_path
from django.http import FileResponse, HttpResponse
from django.conf import settings


def spa_view(request, path=None):
    index = os.path.join(settings.BASE_DIR, 'frontend', 'dist', 'index.html')
    if not os.path.exists(index):
        return HttpResponse(
            '<h1>Frontend not built</h1>'
            '<p>Run <code>cd frontend &amp;&amp; npm install &amp;&amp; npm run build</code></p>',
            status=503,
            content_type='text/html',
        )
    return FileResponse(open(index, 'rb'), content_type='text/html')


urlpatterns = [
    path('api/', include('api.urls')),
    re_path(r'^(?!api/).*', spa_view),
]
