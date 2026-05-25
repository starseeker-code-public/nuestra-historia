from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager


class UserManager(BaseUserManager):
    def create_user(self, username, display_name, role, password, is_active=True):
        user = self.model(
            username=username,
            display_name=display_name,
            role=role,
            is_active=is_active,
        )
        user.set_password(password)
        user.save(using=self._db)
        return user


class User(AbstractBaseUser):
    ROLE_CHOICES = [('hombre', 'Hombre'), ('mujer', 'Mujer')]
    username = models.CharField(max_length=50, unique=True)
    display_name = models.CharField(max_length=100)
    role = models.CharField(max_length=10, choices=ROLE_CHOICES)
    is_active = models.BooleanField(default=True)

    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = ['display_name', 'role']

    objects = UserManager()

    class Meta:
        app_label = 'api'


class BlogEntry(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField()
    date = models.DateTimeField()
    paragraph_hombre = models.TextField(null=True, blank=True)
    paragraph_mujer = models.TextField(null=True, blank=True)
    categories = models.CharField(max_length=500, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-date']

    def __str__(self):
        return self.title


class EntryImage(models.Model):
    entry = models.ForeignKey(BlogEntry, on_delete=models.CASCADE, related_name='images')
    filename = models.CharField(max_length=255)
    caption = models.CharField(max_length=500, null=True, blank=True)
    is_featured = models.BooleanField(default=False)
    order_index = models.IntegerField(default=0)
