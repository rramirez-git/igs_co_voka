from django import forms

from igs_app_base.hiperforms import BaseHiperModelForm

from .models import OpcionColor
from .models import TipoColor


class MainForm(BaseHiperModelForm):
    class Meta:
        model = TipoColor
        fields = "__all__"


class OpcionColorMainForm(BaseHiperModelForm):
    class Meta:
        model = OpcionColor
        fields = "__all__"


class OpcionColorForm(BaseHiperModelForm):
    class Meta:
        model = OpcionColor
        fields = ['color']
        widgets = {'color': forms.TextInput({'type': 'color'})}