from rest_framework import serializers

from .models import Profile, Project, Tag


def _absolute_file_url(instance_file, request):
    if not instance_file:
        return None
    url = instance_file.url
    return request.build_absolute_uri(url) if request else url


class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ["id", "name"]


class ProfileSerializer(serializers.ModelSerializer):
    resume_url = serializers.SerializerMethodField()

    class Meta:
        model = Profile
        fields = ["resume_url", "updated_at"]

    def get_resume_url(self, obj):
        return _absolute_file_url(obj.resume, self.context.get("request"))


class ProjectSerializer(serializers.ModelSerializer):
    tags = TagSerializer(many=True, read_only=True)
    tag_names = serializers.ListField(
        child=serializers.CharField(max_length=50),
        write_only=True,
        required=False,
        help_text="Tag names to attach to this project; unknown names are created.",
    )
    thumbnail_url = serializers.SerializerMethodField()

    class Meta:
        model = Project
        fields = [
            "id",
            "title",
            "slug",
            "short_description",
            "long_description",
            "tech_stack",
            "tags",
            "tag_names",
            "github_url",
            "live_demo_url",
            "thumbnail",
            "thumbnail_url",
            "featured",
            "date_completed",
            "order",
            "views",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "slug", "views", "created_at", "updated_at"]
        extra_kwargs = {"thumbnail": {"write_only": True, "required": False}}

    def get_thumbnail_url(self, obj):
        return _absolute_file_url(obj.thumbnail, self.context.get("request"))

    def create(self, validated_data):
        tag_names = validated_data.pop("tag_names", [])
        project = Project.objects.create(**validated_data)
        self._set_tags(project, tag_names)
        return project

    def update(self, instance, validated_data):
        tag_names = validated_data.pop("tag_names", None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        if tag_names is not None:
            self._set_tags(instance, tag_names)
        return instance

    @staticmethod
    def _set_tags(project, tag_names):
        if not tag_names:
            return
        tags = [Tag.objects.get_or_create(name=name.strip())[0] for name in tag_names if name.strip()]
        project.tags.set(tags)
