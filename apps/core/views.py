from django.http import JsonResponse

def health_check(request):
    return JsonResponse({"status": "ok"})

def index(request):
    return JsonResponse({
        "service": "Diplom API",
        "status": "running",
        "endpoints": {
            "api": "/api/",
            "admin": "/admin/",
            "health": "/health/"
        }
    })
