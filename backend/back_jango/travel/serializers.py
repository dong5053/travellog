from rest_framework import serializers
from travel.models import Travel

class TravelSerializer(serializers.ModelSerializer):
    likes_count = serializers.SerializerMethodField()

    class Meta:
        model = Travel
        # 기존 fields에 likes_count 필드 추가
        fields = ['TravelID', 'City', 'Money', 'Tag', 'Date', 'Journal', 'name', 'likes_count']

    def get_likes_count(self, obj):
        # 현재 Travel 객체의 좋아요 수 반환
        return obj.likes.count()