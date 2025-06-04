from rest_framework import serializers
from .models import Solicitud, Proceso, ArchivoAdjunto

class ArchivoAdjuntoSerializer(serializers.ModelSerializer):
    class Meta:
        model = ArchivoAdjunto
        fields = '__all__'

class ProcesoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Proceso
        fields = '__all__'

class SolicitudSerializer(serializers.ModelSerializer):
    procesos = ProcesoSerializer(many=True, read_only=True)
    archivos = ArchivoAdjuntoSerializer(many=True, read_only=True)
    folio = serializers.CharField(read_only=True)
    prioridad = serializers.CharField(read_only=True)
    usuario = serializers.StringRelatedField(read_only=True)
    class Meta:
        model = Solicitud
        fields = '__all__'
