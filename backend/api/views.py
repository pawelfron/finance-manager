from django.http import JsonResponse
from rest_framework import generics, views, status, response
from rest_framework.permissions import AllowAny
from rest_framework.exceptions import NotFound
from rest_framework_simplejwt.views import TokenObtainPairView
import requests
from .models import CustomUser, Entry, Category
from .serializers import UserRegistrationSerializer, CustomTokenObtainPairSerializer, UserSerializer, EntrySerializer, CategorySerializer

class InflationDataProxyView(views.APIView):
    def get(self, request, *args, **kwargs):
        start_period = request.query_params.get('startPeriod')
        end_period = request.query_params.get('endPeriod')

        external_api_url = f"https://data-api.ecb.europa.eu/service/data/ICP/M.PL.N.000000.4.ANR?format=jsondata&startPeriod={start_period}&endPeriod={end_period}"

        try:
            external_response = requests.get(external_api_url)
            
            if external_response.status_code == 200:
                return JsonResponse(external_response.json(), safe=False)
            else:
                return response.Response(
                    {"error": "ECB API request failed", "status_code": external_response.status_code},
                    status=status.HTTP_502_BAD_GATEWAY
                )

        except requests.exceptions.RequestException as e:
            return response.Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

class UserRegistrationView(generics.CreateAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = UserRegistrationSerializer
    permission_classes = [AllowAny]

class UserDetailView(generics.RetrieveUpdateAPIView):
    serializer_class = UserSerializer

    def get_queryset(self):
        user = self.request.user
        return CustomUser.objects.filter(id=user.id)

class CategoryListCreateView(generics.ListCreateAPIView):
    serializer_class = CategorySerializer

    def get_queryset(self):
        user = self.request.user
        return Category.objects.filter(user=user)
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class CategoryDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = CategorySerializer

    def get_queryset(self):
        user = self.request.user
        return Category.objects.filter(user=user)

    def get_object(self):
        category = super().get_object()
        if category.user != self.request.user:
            raise NotFound('Not authorized to access this category')
        return category

class EntryListCreateView(generics.ListCreateAPIView):
    serializer_class = EntrySerializer

    def get_queryset(self):
        user = self.request.user
        return Entry.objects.filter(user=user)

    def perform_create(self, serializer):
        entry = serializer.save(user=self.request.user)
        user = entry.user
        user.balance += entry.amount if not entry.is_expense else - entry.amount
        user.save()

class EntryDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = EntrySerializer

    def get_queryset(self):
        user = self.request.user
        return Entry.objects.filter(user=user)

    def get_object(self):
        entry = super().get_object()
        if entry.user != self.request.user:
            raise NotFound('Not authorized to access this entry')
        return entry

    def perform_update(self, serializer):
        old_entry = serializer.instance
        old_amount = old_entry.amount
        old_is_expense = old_entry.is_expense
        new_entry = serializer.save()

        if old_amount != new_entry.amount or old_is_expense != new_entry.is_expense:
            user = old_entry.user
            user.balance -= old_amount if not old_is_expense else - old_amount
            user.balance += new_entry.amount if not new_entry.is_expense else - new_entry.amount
            user.save()
    
    def perform_destroy(self, instance):
        user = instance.user
        user.balance -= instance.amount if not instance.is_expense else - instance.amount
        user.save()
        instance.delete()
