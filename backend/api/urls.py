from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView, TokenBlacklistView
from .views import CustomTokenObtainPairView, UserRegistrationView, CategoryListCreateView, CategoryDetailView, EntryListCreateView, EntryDetailView, UserDetailView

urlpatterns = [
    path('api/register', UserRegistrationView.as_view(), name='register_user'),
    path('api/token', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/token/logout', TokenBlacklistView.as_view(), name='token_blacklist'),

    path('api/entries', EntryListCreateView.as_view(), name='entry-list'),
    path('api/entries/<int:pk>', EntryDetailView.as_view(), name='entry-detail'),
    path('api/categories', CategoryListCreateView.as_view(), name='category-list'),
    path('api/categories/<int:pk>', CategoryDetailView.as_view(), name='category-detail'),
    path('api/details/<int:pk>', UserDetailView.as_view(), name='user-details')
]