from rest_framework.permissions import BasePermission

class IsGraveOwner(BasePermission):
    def has_object_permission(self, request, view, obj):
        return obj.owner == request.user
    
class IsChatOwner(BasePermission):
    def has_object_permission(self, request, view, obj):
        return obj.user == request.user
