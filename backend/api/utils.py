from django.contrib.auth import get_user_model
from rest_framework import authentication
from rest_framework import exceptions
from jose import jwt

class Auth0Authentication(authentication.BaseAuthentication):
    def authenticate(self, request):
        auth_header = request.META.get('HTTP_AUTHORIZATION')
        if not auth_header:
            return None

        token = auth_header.split()[1]
        try:
            payload = jwt.decode(
                token,
                'your-auth0-public-key',
                algorithms=['RS256'],
                audience='your-api-identifier',
                issuer='https://your-auth0-domain/'
            )
        except jwt.JWTError:
            raise exceptions.AuthenticationFailed('Invalid token')

        User = get_user_model()
        user, _ = User.objects.get_or_create(
            auth0_id=payload['sub'],
            defaults={'username': payload['sub']}  # Use auth0_id as username by default
        )
        return (user, token)