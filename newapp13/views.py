from django.shortcuts import render, redirect
from django.core.mail import send_mail
from django.contrib import messages
from django.http import FileResponse, Http404
from django.conf import settings
import os

from .models import HomeSection, AboutSection, Skill, Project, ContactInfo, CV


# ==============================
# HOME PAGE + CONTACT FORM
# ==============================
def index(request):
    if request.method == "POST":
        # Get form inputs
        name = request.POST.get("name")
        email = request.POST.get("email")
        message = request.POST.get("message")

        # Email content that YOU receive
        subject = f"New Message from {name} - Portfolio Contact Form"
        body = f"""
You have received a new message from your portfolio website.

Name: {name}
Email: {email}

Message:
--------------------------------
{message}
--------------------------------
"""

        # Auto reply email to USER
        user_subject = "✅ Message Received - Thank You!"
        user_body = f"""
Hi {name},

Thank you for contacting me through my portfolio website!
I have received your message and will reply to you shortly.

Your Message:
--------------------------------
{message}
--------------------------------

Regards,
Ehsan
"""

        try:
            # Send to YOU
            send_mail(subject, body, settings.EMAIL_HOST_USER, [settings.EMAIL_HOST_USER], fail_silently=False)

            # Send email confirmation to USER
            send_mail(user_subject, user_body, settings.EMAIL_HOST_USER, [email], fail_silently=False)

            messages.success(request, "✅ Your message has been sent successfully!")

        except Exception as e:
            messages.error(request, f"❌ Failed to send message: {e}")

        return redirect('/#contact')

    # Load Home Data (Show Only First 3 Projects)
    context = {
        'home': HomeSection.objects.first(),
        'about': AboutSection.objects.first(),
        'skills': Skill.objects.all(),
        'projects': Project.objects.all()[:3],  # ✅ Only show 3 projects on homepage
        'contact': ContactInfo.objects.first(),
        'cv': CV.objects.filter(published=True).first(),
    }
    return render(request, 'index.html', context)


# ==============================
# SHOW ALL PROJECTS PAGE
# ==============================
def all_projects(request):
    projects = Project.objects.all().order_by('order')
    return render(request, 'projects_list.html', {'projects': projects})


# ==============================
# CV PAGE VIEW (DIRECT PDF OPEN)
# ==============================
def cv_view(request):
    cv = CV.objects.filter(published=True).first()
    if not cv or not cv.file:
        raise Http404("CV not found")

    cv_path = cv.file.path
    if os.path.exists(cv_path):
        return FileResponse(open(cv_path, 'rb'), content_type='application/pdf')
    else:
        raise Http404("CV file not found")
