from django.urls import path

from .views.handlers_match.get_all_match import get_all_matches
from .views.handlers_match.create_match import create_match
from .views.handlers_match.get_match_by_id import get_match_by_id
from .views.handlers_match.update_match import update_match
from .views.handlers_match.delete_match_by_id import delete_match_by_id
from .views.handlers_match.get_last_three_matches import get_last_three_matches
from .views.handlers_match.get_upcoming_matches import get_upcoming_matches
from .views.handlers_match.get_last_match import get_last_match
from .views.handlers_match.get_next_matches import get_next_matches


urlpatterns = [
    path('get_upcoming/', get_upcoming_matches, name='get_upcoming_matches'),
    path('get_last/', get_last_match, name='get_last_match'),
    path('get_last_three/', get_last_three_matches, name='get_last_three_matches'),
    path('get_next/', get_next_matches, name='get_next_matches'),
    path('get_all/', get_all_matches, name='get_all_matches'),
    path('get_by_id/<int:id>/', get_match_by_id, name='get_by_id'),

    path('create/', create_match, name='create_match'),
    path('update/<int:match_id>/', update_match, name='update_by_id'),
    path('delete/<int:match_id>/', delete_match_by_id, name='delete_match_by_id'),

]

