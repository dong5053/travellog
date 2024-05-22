from django.db import models

class UserData(models.Model):
    name = models.CharField(max_length=20, primary_key=True)
    password = models.CharField(max_length=20, null=False)

    def __str__(self):
        return self.name

class Travel(models.Model):
    TravelID = models.AutoField(primary_key=True)
    City = models.CharField(max_length=50, null=False)
    Money = models.IntegerField(null=False)
    Tag = models.CharField(max_length=50)
    Date = models.CharField(max_length=50, null=False)
    Journal = models.CharField(max_length=500)
    name = models.ForeignKey(UserData, on_delete=models.CASCADE, related_name='users')
    likes = models.ManyToManyField(UserData, through='Like', related_name='liked_posts', blank=True)

    def __str__(self):
        return str(self.TravelID)

class Like(models.Model):
    name = models.ForeignKey(UserData, on_delete=models.CASCADE)
    post = models.ForeignKey(Travel, on_delete=models.CASCADE)

    class Meta:
        unique_together = ['name', 'post']
