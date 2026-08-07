from django.conf import settings
from django.core.validators import FileExtensionValidator
from django.db import models
from django.utils.text import slugify


def resume_storage():
    """Non-image files (PDFs) need Cloudinary's 'raw' resource type, not the
    'image' one the default storage uses — Cloudinary blocks PDF delivery under
    'image' by default as an anti-abuse measure. Falls back to local disk when
    Cloudinary isn't configured."""
    if getattr(settings, "CLOUDINARY_STORAGE", None):
        from cloudinary_storage.storage import RawMediaCloudinaryStorage

        return RawMediaCloudinaryStorage()
    from django.core.files.storage import default_storage

    return default_storage


class Tag(models.Model):
    name = models.CharField(max_length=50, unique=True)

    class Meta:
        ordering = ["name"]

    def __str__(self):
        return self.name


class Project(models.Model):
    title = models.CharField(max_length=200)
    slug = models.SlugField(unique=True, blank=True)
    short_description = models.CharField(max_length=300)
    long_description = models.TextField(blank=True)
    tech_stack = models.CharField(
        max_length=300,
        blank=True,
        help_text="Comma-separated, e.g. 'React, Django, PostgreSQL'",
    )
    tags = models.ManyToManyField(Tag, blank=True, related_name="projects")
    github_url = models.URLField(blank=True)
    live_demo_url = models.URLField(blank=True)
    thumbnail = models.ImageField(upload_to="thumbnails/", blank=True, null=True)
    featured = models.BooleanField(default=False)
    date_completed = models.DateField(null=True, blank=True)
    order = models.PositiveIntegerField(default=0)
    views = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["order", "-date_completed"]

    def __str__(self):
        return self.title

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)


class Profile(models.Model):
    """Singleton holding site-wide files managed from the admin, e.g. the resume."""

    resume = models.FileField(
        upload_to="resume/",
        blank=True,
        null=True,
        storage=resume_storage,
        validators=[FileExtensionValidator(["pdf"])],
        help_text="PDF only — browsers can't render .docx/.doc inline, so the site's \"View resume\" button would silently fall back to a download.",
    )
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return "Site profile"

    def save(self, *args, **kwargs):
        self.pk = 1
        super().save(*args, **kwargs)

    def delete(self, *args, **kwargs):
        pass

    @classmethod
    def load(cls):
        obj, _ = cls.objects.get_or_create(pk=1)
        return obj
