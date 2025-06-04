from rest_framework.permissions import BasePermission

class IsAprobador(BasePermission):
    """
    Permite acceso solo a usuarios en el grupo 'Aprobador' o 'Administrador'.
    """
    def has_permission(self, request, view):
        return request.user.groups.filter(name__in=['Aprobador', 'Administrador']).exists()
