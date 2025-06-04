from djongo import models
from django.utils import timezone
from django.contrib.auth.models import User




PRIORIDAD_CHOICES = [
    ('alta', 'Alta'),
    ('media', 'Media'),
    ('baja', 'Baja'),
    ('otro', 'Otro'),
]
class Solicitud(models.Model):
    usuario = models.ForeignKey(User, on_delete=models.CASCADE, related_name='solicitudes')
    folio = models.CharField(max_length=50, unique=True)
    folio = models.CharField(max_length=50, unique=True)
    descripcion = models.TextField()
    tipo_area = models.CharField(max_length=50)
    responsable_seguimiento = models.CharField(max_length=150)
    fecha_creacion = models.DateTimeField(default=timezone.now)
    fecha_estimacion = models.DateTimeField()
    estatus = models.CharField(max_length=50, default="En revisión")
    fecha_aprobacion = models.DateTimeField(null=True, blank=True)
    retroalimentacion = models.TextField(blank=True)
    aprobado_por = models.CharField(max_length=150, blank=True)
    prioridad = models.CharField(max_length=20, choices=PRIORIDAD_CHOICES, default='media')

    def clasificar_prioridad(self):
        descripcion = (self.descripcion or "").lower()
        if any(palabra in descripcion for palabra in ['urgente', 'cumplimiento', 'auditoría']):
            self.prioridad = 'alta'
        elif 'mejora' in descripcion or 'normatividad' in descripcion:
            self.prioridad = 'media'
        else:
            self.prioridad = 'baja'


    def __str__(self):
        return self.folio

class Proceso(models.Model):
    solicitud = models.ForeignKey(Solicitud, on_delete=models.CASCADE, related_name='procesos')
    nombre = models.CharField(max_length=150)
    descripcion = models.TextField()
    fecha_registro = models.DateTimeField(default=timezone.now)
    estatus = models.CharField(max_length=50, default="Pendiente")

    def __str__(self):
        return self.nombre
    

class ArchivoAdjunto(models.Model):
    solicitud = models.ForeignKey('Solicitud', on_delete=models.CASCADE, related_name='archivos')
    archivo = models.FileField(upload_to='adjuntos/')
    nombre = models.CharField(max_length=255)
    fecha_subida = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return self.nombre
    

