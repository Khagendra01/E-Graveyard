from rest_framework.permissions import BasePermission

class IsGraveOwner(BasePermission):
    def has_object_permission(self, request, view, obj):
        return obj.owner == request.user
    
class IsOwner(BasePermission):
    def has_object_permission(self, request, view, obj):
        email = request.query_params.get('email', None)
        return obj.email == request.email
