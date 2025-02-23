import requests
from bs4 import BeautifulSoup
from django.views.decorators.cache import cache_page
from rest_framework.decorators import api_view
from rest_framework.response import Response

@cache_page(60 * 60)  # Cache for 1 hour
@api_view(['GET'])
def link_preview(request):
    url = request.query_params.get('url')
    if not url:
        return Response({'error': 'URL is required'}, status=400)

    try:
        headers = {'User-Agent': 'Mozilla/5.0'}
        response = requests.get(url, headers=headers, timeout=5)
        soup = BeautifulSoup(response.text, 'html.parser')

        # Get OpenGraph data or fallback to meta tags
        title = (
            soup.find('meta', property='og:title') or 
            soup.find('title')
        )
        description = (
            soup.find('meta', property='og:description') or 
            soup.find('meta', {'name': 'description'})
        )
        image = soup.find('meta', property='og:image')
        site_name = (
            soup.find('meta', property='og:site_name') or 
            soup.find('meta', {'name': 'application-name'})
        )

        return Response({
            'title': title.get('content', '') if title else '',
            'description': description.get('content', '') if description else '',
            'image': image.get('content', '') if image else '',
            'siteName': site_name.get('content', '') if site_name else ''
        })
    except Exception as e:
        return Response({'error': str(e)}, status=400)
