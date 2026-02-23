from django.http import HttpResponseRedirect
from django.shortcuts import redirect

from igs_app_base.views import GenericCreate
from igs_app_base.views import GenericDelete
from igs_app_base.views import GenericDeleteMany
from igs_app_base.views import GenericList
from igs_app_base.views import GenericRead
from igs_app_base.views import GenericUpdate

from producto.models import CampoParteProducto
from producto.models import GrupoCampos
from producto.models import ParteProducto
from producto.parteproducto.forms import MainFormCampo
from producto.parteproducto.forms import MainFormGrupo
from producto.parteproducto.forms import MainFormParte

from .forms import MainForm
from .models import Producto

titulo = "Producto"
app = "producto"


class List(GenericList):
    model = Producto
    titulo = "Productos"
    app = app


class Create(GenericCreate):
    model = Producto
    titulo = titulo
    app = app
    form_class = MainForm

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context["forms"] = {
            'top': [],
            'left': [{'form': MainForm()}],
            'right': [],
            'bottom': [],
        }
        return context


class Read(GenericRead):
    model = Producto
    titulo = titulo
    app = app
    form_class = MainForm

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context["forms"] = {
            'top': [],
            'left': [{'form': MainForm(instance=self.object)}],
            'right': [],
            'bottom': [],
        }
        context["form_parte"] = MainFormParte()
        context["form_campo"] = MainFormCampo()
        context["form_grupo"] = MainFormGrupo()
        return context

    def post(self, request, *args, **kwargs):
        action = request.POST.get("action")
        extra = request.POST.get("extra")
        if action == "create-parte":
            frm = MainFormParte(request.POST)
            if frm.is_valid():
                obj = frm.save(commit=False)
                obj.producto = self.get_object()
                obj.save()
        elif action == "update-parte":
            obj = ParteProducto.objects.get(pk=extra)
            frm = MainFormParte(request.POST, instance=obj)
            if frm.is_valid():
                frm.save()
        elif action == "delete-parte":
            ParteProducto.objects.filter(pk=extra).delete()
        elif action == "create-campo":
            frm = MainFormCampo(request.POST)
            if frm.is_valid():
                obj = frm.save(commit=False)
                if extra.startswith('grupo-'):
                    pk = int(extra.replace('grupo-', '0'))
                    obj.grupo_producto = GrupoCampos.objects.get(pk=pk)
                else:
                    obj.parte_producto = ParteProducto.objects.get(
                        pk=int(extra))
                obj.save()
        elif action == "update-campo":
            obj = CampoParteProducto.objects.get(pk=extra)
            frm = MainFormCampo(request.POST, instance=obj)
            if frm.is_valid():
                frm.save()
        elif action == "delete-campo":
            CampoParteProducto.objects.filter(pk=extra).delete()
        elif action == "create-grupo":
            frm = MainFormGrupo(request.POST)
            if frm.is_valid():
                obj = frm.save(commit=False)
                obj.parte_producto = ParteProducto.objects.get(
                    pk=int(extra))
                obj.save()
        elif action == "update-grupo":
            obj = GrupoCampos.objects.get(pk=extra)
            frm = MainFormGrupo(request.POST, instance=obj)
            if frm.is_valid():
                frm.save()
        elif action == "delete-grupo":
            GrupoCampos.objects.filter(pk=extra).delete()
        return redirect(request.path)


class Update(GenericUpdate):
    model = Producto
    titulo = titulo
    app = app
    form_class = MainForm

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context["forms"] = {
            'top': [],
            'left': [{'form': MainForm(instance=self.object)}],
            'right': [],
            'bottom': [],
        }
        return context


class Delete(GenericDelete):
    model = Producto
    titulo = titulo
    app = app


class DeleteMany(GenericDeleteMany):
    model = Producto
    titulo = titulo
    app = app
