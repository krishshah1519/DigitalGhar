from django.db import models
from django.contrib.auth.models import AbstractUser
import secured_fields


class User(AbstractUser):
    first_name = secured_fields.EncryptedCharField(blank=True, max_length=150, verbose_name='first name')
    last_name = secured_fields.EncryptedCharField(blank=True, max_length=150, verbose_name='last name')
    email = secured_fields.EncryptedCharField(blank=True, max_length=254, verbose_name='email address')
    dob = secured_fields.EncryptedDateField(null=True, blank=True)
    phone_number = secured_fields.EncryptedCharField(max_length=15)

    gender_choices = (('male', 'Male'), ('female', 'Female'))
    gender = models.CharField(choices=gender_choices, max_length=10)

    def __str__(self):
        return self.username

class Folder(models.Model):
    name = secured_fields.EncryptedCharField(max_length=255)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='folders')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

class Tag(models.Model):
    name = secured_fields.EncryptedCharField(max_length=100)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='tags')

    class Meta:
        unique_together = ('name', 'user')

    def __str__(self):
        return self.name

class Document(models.Model):
    name = secured_fields.EncryptedCharField(max_length=255)
    file = secured_fields.EncryptedFileField(upload_to='documents/')
    file_type = models.CharField(max_length=50, blank=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='documents')
    folder = models.ForeignKey(Folder, on_delete=models.CASCADE, related_name='documents')
    tags = models.ManyToManyField(Tag, blank=True, related_name='documents')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name