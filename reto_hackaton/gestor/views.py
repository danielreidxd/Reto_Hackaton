from rest_framework import viewsets, serializers
from .models import Solicitud, Proceso, ArchivoAdjunto
from .serializers import SolicitudSerializer, ProcesoSerializer, ArchivoAdjuntoSerializer
from rest_framework import viewsets
from django.utils import timezone
from .permissions import IsAprobador
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated

class SolicitudViewSet(viewsets.ModelViewSet):
    queryset = Solicitud.objects.all()
    serializer_class = SolicitudSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        last = Solicitud.objects.order_by('-id').first()
        if last and last.folio.startswith('CCADPRC-'):
            last_num = int(last.folio.split('-')[-1])
            new_num = last_num + 1
        else:
            new_num = 1
        solicitud = serializer.save(folio=f'CCADPRC-{new_num:04d}', usuario=self.request.user)
        solicitud.clasificar_prioridad()
        solicitud.save()

        

    def perform_update(self, serializer):
        instancia = serializer.save()
        instancia.clasificar_prioridad()
        instancia.save()
    def get_permissions(self):
        if self.action in ['update', 'partial_update', 'destroy']:  # o la acción personalizada para aprobar/rechazar
            return [IsAuthenticated(), IsAprobador()]
        return [IsAuthenticated()]
    
    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated, IsAprobador])
    def aprobar(self, request, pk=None):
        solicitud = self.get_object()
        if solicitud.estatus == "Aprobada":
            return Response({"detail": "Ya está aprobada."}, status=status.HTTP_400_BAD_REQUEST)
        solicitud.estatus = "Aprobada"
        solicitud.aprobado_por = request.user.username
        solicitud.fecha_aprobacion = timezone.now()
        solicitud.save()
        return Response({"status": "Solicitud aprobada"}, status=status.HTTP_200_OK)
    
    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated, IsAprobador])
    def rechazar(self, request, pk=None):
        solicitud = self.get_object()
        if solicitud.estatus == "Rechazada":
            return Response({"detail": "Ya está rechazada."}, status=status.HTTP_400_BAD_REQUEST)
        solicitud.estatus = "Rechazada"
        solicitud.aprobado_por = request.user.username
        solicitud.fecha_aprobacion = timezone.now()
        solicitud.save()
        return Response({"status": "Solicitud rechazada"}, status=status.HTTP_200_OK)


class ProcesoViewSet(viewsets.ModelViewSet):
    queryset = Proceso.objects.all()
    serializer_class = ProcesoSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        solicitud = serializer.validated_data['solicitud']
        if solicitud.estatus != "Aprobada":
            raise serializers.ValidationError("Solo se pueden crear procesos para solicitudes aprobadas.")
        serializer.save()

class ArchivoAdjuntoViewSet(viewsets.ModelViewSet):
    queryset = ArchivoAdjunto.objects.all()
    serializer_class = ArchivoAdjuntoSerializer
    permission_classes = [IsAuthenticated]