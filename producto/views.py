from django.http import HttpResponseRedirect
from django.shortcuts import redirect
from django.urls import reverse
from django.views.generic import TemplateView

from igs_app_base.session.vw import ImIn
from igs_app_base.views import GenericAppRootView


class ProductoView(GenericAppRootView):
    app = "producto"
    titulo = "Producto"


class DisclaimerProds(TemplateView):

    def setup(self, request, *args, **kwargs):
        super().setup(request, *args, **kwargs)
        self.view = ImIn()
        self.view.setup(request, *args, **kwargs)

    def get(self, request, *args, **kwargs):
        if request.user.is_authenticated:
            return self.view.get(request=request)
        else:
            return redirect('display_open_products')

class DisplayOpenProds(TemplateView):
    template_name = "producto/display/open_prods.html"
