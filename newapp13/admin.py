from django.contrib import admin
from django.utils.safestring import mark_safe
from .models import HomeSection, AboutSection, Skill, Project, ContactInfo, CV


@admin.register(HomeSection)
class HomeSectionAdmin(admin.ModelAdmin):
    list_display = ('name', 'subtitle')


@admin.register(AboutSection)
class AboutAdmin(admin.ModelAdmin):
    list_display = ('title', 'subtitle')


@admin.register(Skill)
class SkillAdmin(admin.ModelAdmin):
    list_display = ('name', 'icon_preview', 'order')
    search_fields = ('name', 'icon_class')

    def icon_preview(self, obj):
        if obj.icon_class:
            return mark_safe(f'<i class="{obj.icon_class}" style="font-size:24px;color:#ff6b00;"></i>')
        return '—'
    icon_preview.short_description = 'Icon Preview'


@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ('title', 'order', 'github_link', 'live_demo_link')
    ordering = ('order',)


@admin.register(ContactInfo)
class ContactAdmin(admin.ModelAdmin):
    list_display = ('email', 'phone', 'location')


@admin.register(CV)
class CVAdmin(admin.ModelAdmin):
    list_display = ('title', 'published')
