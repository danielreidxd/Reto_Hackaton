from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import SolicitudViewSet, ProcesoViewSet, ArchivoAdjuntoViewSet

router = DefaultRouter()
router.register(r'solicitudes', SolicitudViewSet)
router.register(r'procesos', ProcesoViewSet)
router.register(r'archivos', ArchivoAdjuntoViewSet)

urlpatterns = [
    path('', include(router.urls)),

]
