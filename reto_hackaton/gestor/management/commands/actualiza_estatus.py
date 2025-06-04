from django.core.management.base import BaseCommand
from gestor.models import Solicitud
from django.utils import timezone
from datetime import timedelta

class Command(BaseCommand):
    help = 'Actualiza el estatus de solicitudes que exceden 3 días hábiles sin ser evaluadas'

    def handle(self, *args, **options):
        now = timezone.now()
        solicitudes = Solicitud.objects.filter(estatus="En revisión")
        actualizadas = 0

        for solicitud in solicitudes:
            delta = now - solicitud.fecha_creacion
            # Consideramos 3 días naturales, si quieres hábiles podemos ajustar
            if delta.days >= 3:
                solicitud.estatus = "Pendiente Evaluación"
                solicitud.save()
                actualizadas += 1

        self.stdout.write(self.style.SUCCESS(
            f'Solicitudes actualizadas: {actualizadas}'
        ))
