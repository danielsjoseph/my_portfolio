from django.contrib import admin

from .models import Profile, Project, Tag


@admin.register(Tag)
class TagAdmin(admin.ModelAdmin):
    search_fields = ["name"]


@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    prepopulated_fields = {"slug": ("title",)}
    list_display = ["title", "featured", "date_completed", "order", "views"]
    list_filter = ["featured", "tags"]
    search_fields = ["title", "short_description", "tech_stack"]
    filter_horizontal = ["tags"]
    ordering = ["order", "-date_completed"]


@admin.register(Profile)
class ProfileAdmin(admin.ModelAdmin):
    list_display = ["__str__", "resume", "updated_at"]

    def has_add_permission(self, request):
        return not Profile.objects.exists()

    def has_delete_permission(self, request, obj=None):
        return False

    def changelist_view(self, request, extra_context=None):
        profile = Profile.load()
        from django.shortcuts import redirect
        from django.urls import reverse

        return redirect(reverse("admin:projects_profile_change", args=[profile.pk]))
