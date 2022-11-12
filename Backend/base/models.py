from django.db import models
from django.contrib.auth.models import BaseUserManager, AbstractBaseUser, PermissionsMixin


class UserManager(BaseUserManager):
    use_in_migrations = True

    def _create_user(self, email, password, **extra_fields):
        if not email:
            raise ValueError('Email is required')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save()
        return user

    def create_user(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', False)
        extra_fields.setdefault('is_superuser', False)
        return self._create_user(email, password, **extra_fields)

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        if not extra_fields.get('is_staff'):
            raise ValueError('Superuser must have is_staff=True')
        if not extra_fields.get('is_superuser'):
            raise ValueError('Superuser must have is_superuser=True')

        return self._create_user(email, password, **extra_fields)


class User(AbstractBaseUser, PermissionsMixin):
    class Meta:
        verbose_name = 'user'
        verbose_name_plural = 'users'

    USERNAME_FIELD = 'email'

    id = models.AutoField(primary_key=True)

    email = models.EmailField(
        verbose_name='email adress',
        unique=True, 
        error_messages={'unique': 'A user is already registered with this adress'}
    )

    username = models.CharField(
        verbose_name='username',
        unique=True,
        error_messages={'unique': 'This username is already in use'},
        max_length=200
    )

    profile_image = models.ImageField(
        verbose_name='profile image',
        blank=True,
        null=True,
        upload_to='user_images/'
    )

    bio = models.TextField(
        blank = True,
        null = True
    )

    is_staff = models.BooleanField(
        verbose_name='staff status',
        default=False
    )

    created = models.DateTimeField(
        verbose_name='user creation date',
        auto_now_add=True
    )

    objects = UserManager()

    def __str__(self) -> str:
        return f'{self.username}/{self.email}'


class ConversationGroup(models.Model):
    host = models.ForeignKey(
        User, 
        on_delete=models.SET_NULL, 
        null=True
    )

    name = models.CharField(
        verbose_name='name',
        unique=True,
        error_messages={'unique': 'This group name is already in use'},
        max_length=200
    )

    description = models.TextField(
        verbose_name='description',
        null=True,
        blank=True
    )

    is_private = models.BooleanField(
        verbose_name='is private',
        default=True
    )

    updated = models.DateTimeField(
        verbose_name='last message time',
        auto_now=True
    )

    created = models.DateTimeField(
        verbose_name='group creation date',
        auto_now_add=True
    )

    def __str__(self) -> str:
        return self.name

class GroupMember(models.Model):
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE
    )

    group = models.ForeignKey(
        ConversationGroup,
        on_delete=models.CASCADE
    )

    is_moderator = models.BooleanField(
        default=False
    )

    def __str__(self) -> str:
        return f'user:{self.user.id}/group:{self.group.id}'


class Message(models.Model):
    author = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
    )

    group = models.ForeignKey(
        ConversationGroup,
        on_delete=models.CASCADE
    )

    body = models.TextField()
    edited = models.DateTimeField(auto_now=True)
    created = models.DateTimeField(auto_now_add=True)

    def __str__(self) -> str:
        return self.body[0:50]


class Event(models.Model):
    host = models.ForeignKey(
        User, 
        on_delete=models.CASCADE
    )

    group = models.ForeignKey(
        ConversationGroup,
        on_delete=models.SET_NULL,
        null=True
    )

    participants = models.ManyToManyField(
        User, 
        related_name='participants', 
        blank=True
    )

    name = models.CharField(
        verbose_name='name',
        unique=True,
        error_messages={'unique': 'This group name is already in use'},
        max_length=200
    )

    description = models.TextField(
        verbose_name='description',
        null=True,
        blank=True
    )

    max_participants = models.IntegerField(
        blank=True,
        null=True
    )


    expires = models.DateTimeField()
    created = models.DateTimeField(auto_now_add=True)


