from .vw import views

obj = 'tipocampo'
app_label = 'catalogo'

urlpatterns = views.create_urls(app_label)