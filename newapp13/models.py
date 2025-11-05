from django.db import models


# ==============================
# HOME SECTION
# ==============================
class HomeSection(models.Model):
    greeting = models.CharField(max_length=120, default="Hi, I'm")
    name = models.CharField(max_length=120, default="Ehsan")
    subtitle = models.CharField(max_length=200, blank=True, null=True)  # e.g. Full Stack Developer
    short_desc = models.TextField(blank=True, null=True)
    extra_desc = models.TextField(blank=True, null=True)
    image = models.ImageField(upload_to='home/', blank=True, null=True)

    def __str__(self):
        return f"Home - {self.name}"


# ==============================
# ABOUT SECTION
# ==============================
class AboutSection(models.Model):
    title = models.CharField(max_length=120, default="About Me")
    subtitle = models.CharField(max_length=200, blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    image = models.ImageField(upload_to='about/', blank=True, null=True)

    def __str__(self):
        return "About"


# ==============================
# SKILLS SECTION
# ==============================
class Skill(models.Model):
    name = models.CharField(max_length=80)
    icon_class = models.CharField(
        max_length=120,
        blank=True,
        null=True,
        help_text='Example: fa-brands fa-html5 or fa-brands fa-js'
    )
    description = models.CharField(max_length=200, blank=True, null=True)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['order']

    def save(self, *args, **kwargs):
        """
        Cleans up icon_class input to prevent HTML or quotes from breaking rendering.
        Example: <i class="fa-brands fa-html5"></i> → fa-brands fa-html5
        """
        if self.icon_class:
            self.icon_class = (
                self.icon_class.strip()
                .replace('"', '')
                .replace("'", '')
                .replace('<i', '')
                .replace('</i>', '')
                .replace('>', '')
                .replace('class=', '')
                .replace('=', '')
            )
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name


# ==============================
# PROJECTS SECTION
# ==============================
class Project(models.Model):
    title = models.CharField(max_length=150)
    description = models.TextField(blank=True, null=True)
    image = models.ImageField(upload_to='projects/', blank=True, null=True)
    github_link = models.URLField(blank=True, null=True)
    live_demo_link = models.URLField(blank=True, null=True)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['order']

    def __str__(self):
        return self.title


# ==============================
# CONTACT INFO
# ==============================
class ContactInfo(models.Model):
    location = models.CharField(max_length=150, blank=True, null=True)
    email = models.EmailField(blank=True, null=True)
    phone = models.CharField(max_length=40, blank=True, null=True)
    github = models.URLField(blank=True, null=True)
    facebook = models.URLField(blank=True, null=True)
    linkedin = models.URLField(blank=True, null=True)
    whatsapp = models.CharField(
        max_length=20,
        blank=True,
        null=True,
        help_text="e.g. +923001234567"
    )

    def __str__(self):
        return "Contact Info"


# ==============================
# CV SECTION
# ==============================
class CV(models.Model):
    title = models.CharField(max_length=120, default="My Resume")
    file = models.FileField(upload_to='cv/')
    published = models.BooleanField(default=True)

    def __str__(self):
        return self.title
