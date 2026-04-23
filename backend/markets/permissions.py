from rest_framework.permissions import BasePermission


def is_moderator_or_admin(user):
    if not user or not user.is_authenticated:
        return False
    return (
        user.is_staff
        or user.is_superuser
        or user.groups.filter(name__iexact='moderator').exists()
    )


class IsModeratorOrAdmin(BasePermission):
    message = 'Only moderators or admins can perform this action.'

    def has_permission(self, request, view):
        return is_moderator_or_admin(request.user)
