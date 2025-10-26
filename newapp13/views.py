

from django.shortcuts import render
from django.core.mail import send_mail
from django.contrib import messages
from django.conf import settings

from django.contrib import messages
from django.shortcuts import render, redirect
from django.core.mail import send_mail
from django.conf import settings

def index(request):
    if request.method == 'POST':
        name = request.POST.get('name')
        email = request.POST.get('email')
        message = request.POST.get('message')

        # send mail
        send_mail(
            subject=f"New Message from {name}",
            message=f"Email: {email}\n\nMessage:\n{message}",
            from_email=settings.EMAIL_HOST_USER,
            recipient_list=[settings.EMAIL_HOST_USER],
        )

        messages.success(request, 'Your message has been sent successfully!')
        # 👇 Add this line to stay on contact section
        return redirect('/#contact')

    return render(request, 'index.html')




# Other pages (no contact form)
def home(request):
    return render(request, "home.html")

def about(request):
    return render(request, "about.html")

def skills(request):
    return render(request, "skills.html")

def projects(request):
    return render(request, "projects.html")

def cv(request):
    return render(request, "cv.html")
