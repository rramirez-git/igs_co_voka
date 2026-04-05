from http.client import HTTPResponse
from io import BytesIO
import os
from email.mime.image import MIMEImage
import re

from django.conf import settings
from django.contrib.auth.models import User
from django.core.mail import EmailMultiAlternatives
from django.http import HttpResponse
from django.http import HttpResponseRedirect
from django.shortcuts import redirect
from django.template.loader import render_to_string
from django.urls import reverse
from django.utils.html import strip_tags
from django.views.generic import TemplateView
from weasyprint import HTML


import json

from catalogo.models import EstadoPersonalizacion
from igs_app_base.views import GenericCreate
from igs_app_base.views import GenericList
from igs_app_base.views import GenericRead
from igs_app_base.views import GenericViews
from producto.models import Producto

from .forms import MainForm
from .models import Personalizacion
from .models import PersonalizacionDetalle

views = GenericViews(
    Personalizacion, "Personalización", "Personalizaciones",
    "producto", MainForm, MainForm, MainForm
)

def create_empty_personalizacion(
        nombre: str, telefono: str, correo_electronico: str,
        notas_y_comentarios: str, producto: int, user: int
    ) -> Personalizacion:
    producto = Producto.objects.get(pk=producto)
    user = User.objects.get(pk=user) if user > 0 else None
    estado = EstadoPersonalizacion.objects.get(estado_interno="STARTED")
    personalizacion = Personalizacion.objects.create(
        nombre=nombre,
        telefono=telefono,
        correo_electronico=correo_electronico,
        notas_y_comentarios=notas_y_comentarios,
        producto=producto,
        user=user,
        estado=estado
    )
    for parte in personalizacion.producto.partes.all():
        for campo in parte.campos.all():
            PersonalizacionDetalle.objects.create(
                personalizacion=personalizacion, campo=campo
            )
        for gpo in parte.gruposdecampos.all():
            for campo in gpo.campos.all():
                PersonalizacionDetalle.objects.create(
                    personalizacion=personalizacion, campo=campo
                )
    return personalizacion

class Create(GenericCreate):
    model = Personalizacion
    titulo = "Personalización"
    app = "producto"
    form_class = MainForm

    def form_valid(self, form):
        response = super().form_valid(form)
        for parte in self.object.producto.partes.all():
            for campo in parte.campos.all():
                PersonalizacionDetalle.objects.create(
                    personalizacion=self.object, campo=campo
                )
        return response

class Read(GenericRead):
    model = Personalizacion
    titulo = "Personalización"
    app = "producto"
    form_class = MainForm

    def post(self, request, *args, **kwargs):
        self.object = self.get_object()
        pkcampo = request.POST.get('pkcampo')
        valor = request.POST.get(f'campo-html-object-{pkcampo}')
        action = request.POST.get('action')
        if action == "update-field-value":
            detail = self.object.get_detail_by_field_pk(int(pkcampo))
            if detail:
                detail.valor = valor
                detail.save()
        return redirect(request.path)

views.Create = Create
views.Read = Read

class CreateFromUser(TemplateView):
    def post(self, request, *args, **kwargs):
        producto_pk = int(request.POST.get('producto_pk', '0'))
        pk = 0
        if producto_pk > 0:
            user = request.POST.get('user_pk', "")
            user = int(user) if user != "None" else 0
            personalizacion = create_empty_personalizacion(
                request.POST.get('user_nombre', ""),
                request.POST.get('user_telefono', ""),
                request.POST.get('user_correo', ""),
                request.POST.get('user_notas', ""),
                producto_pk,
                user
            )
            pk = personalizacion.pk
            campos_color = json.loads(request.POST.get('campos_color', '{}',))
            for campo_valor in personalizacion.detalle.all():
                if campo_valor.campo.tipo_de_campo.tipo_interno == "CAT_COLOR":
                    try:
                        campo_valor.valor = campos_color[f"campo-{campo_valor.campo.pk}"]
                    except KeyError:
                        campo_valor.valor = ""
                else:
                    campo_valor.valor = request.POST.get(f"campo-{campo_valor.campo.pk}", '')
                campo_valor.save()
        return redirect('pdf_personalizacion', pk=pk)

class ViewPersonalizacion(GenericRead):
    template_name = "personalizacion_producto/create_from_user.html"
    model = Personalizacion
    form_class = MainForm

class List(GenericList):
    model = Personalizacion
    titulo = "Personalizaciones"
    app = "producto"

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        user = self.request.user
        context['is_cliente'] = user.groups.filter(name='cliente').exists()
        return context

    def get_queryset(self):
        qs = super().get_queryset()
        user = self.request.user
        if user.groups.filter(name='cliente').exists():
            qs = qs.filter(user=user)
        return qs

views.List = List

def html_para_mail_function(personalizacion):
    objeto = personalizacion
    estilos_email = """
    <style>
        .email-container { font-family: Arial, sans-serif; color: #333; max-width: 800px; }
        .table-email { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
        .table-email th { text-align: right; padding: 8px; border-bottom: 1px solid #ddd; width: 30%; }
        .table-email td { text-align: left; padding: 8px; border-bottom: 1px solid #ddd; }
        .img-container { text-align: center; margin: 30px 0; }
    </style>
    """
    cuerpo_simplificado = f"""
    <div class="email-container">
        <h1>Personalización de producto</h1>
        <table class="table-email">
            <tr><th>Producto:</th><td>{objeto.producto}</td></tr>
            <tr><th>Nombre:</th><td>{objeto.nombre}</td></tr>
            <tr><th>Teléfono:</th><td>{objeto.telefono}</td></tr>
            <tr><th>Correo Electrónico:</th><td>{objeto.correo_electronico}</td></tr>
            <tr><th>Notas y Comentarios:</th><td>{objeto.notas_y_comentarios or ''}</td></tr>
            <tr><th>Fecha de Creación:</th><td>{objeto.creacion}</td></tr>
            <tr><th>Usuario:</th><td>{objeto.user.profile if objeto.user else 'N/A'}</td></tr>
        </table>
        <div id="producto-svg" class="img-container">
            <img src="cid:imagen_personalizada" alt="Banca" style="width: 100%; max-width: 600px; height: auto;" />
        </div>
    </div>
    """
    return f"<html><head>{estilos_email}</head><body>{cuerpo_simplificado}</body></html>"

def ViewPDFPersonalizacion(request, pk):
    object = Personalizacion.objects.get(pk=pk)
    html = str(render_to_string("personalizacion_producto/create_from_user.html", {
        'object': object
    }) + "")

    imgpath = os.path.join(settings.MEDIA_ROOT, 'tmp', os.path.dirname(str(object.producto.imagen)))
    tmp_png = os.path.join(imgpath, f"personalizacion_{object.pk:05d}.png")
    pdf_buffer = BytesIO()
    HTML(string=html).write_pdf(pdf_buffer)
    pdf_contenido = pdf_buffer.getvalue()
    text = strip_tags(html)
    msg = EmailMultiAlternatives(
        subject=f"Personalización {object.producto}",
        body=text,
        from_email=settings.DEFAULT_FROM_EMAIL,
        to=[object.correo_electronico]
    )
    html_para_email = html_para_mail_function(object)
    msg.attach_alternative(html_para_email, "text/html")
    msg.attach(f"Personalizacion {object.producto}.pdf", pdf_contenido, "application/pdf")
    with open(tmp_png, 'rb') as f:
        msg_img = MIMEImage(f.read())
        msg_img.add_header('Content-ID', '<imagen_personalizada>')
        msg_img.add_header('Content-Disposition', 'inline', filename=os.path.basename(tmp_png))
        msg.attach(msg_img)
    try:
        msg.send()
    except Exception as e:
        print(f"Error enviando correo de personalización {object.pk}. {e}")

    response = HttpResponse(content_type="application/pdf")
    response["Content-Disposition"] = f'attachment; filename="Personalizacion {object.producto}.pdf"'
    HTML(string=html).write_pdf(response)
    return response
