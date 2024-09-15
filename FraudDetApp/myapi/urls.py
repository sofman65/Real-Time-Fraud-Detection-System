from django.urls import path
from . import views

urlpatterns = [
    path('chatbot/', views.chatbot, name='chatbot'),
    path('fraud_prediction/', views.predict_transaction_fraud, name='predict_transaction_fraud'),

]
