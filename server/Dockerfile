# One image definition for every microservice:
#   docker build --build-arg SERVICE=news_microservice --build-arg PORT=8001 server/
FROM python:3.12-slim-bookworm

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PYTHONPATH=/app

WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir --default-timeout=100 --retries 10 -r requirements.txt

ARG SERVICE
ARG PORT
ENV SERVICE=${SERVICE} PORT=${PORT}

COPY common ./common
COPY ${SERVICE} ./service
WORKDIR /app/service

RUN useradd --system --no-create-home app && mkdir -p staticfiles && chown app staticfiles
USER app

EXPOSE ${PORT}
# Migrations and static files (Swagger UI) at start, then a production WSGI server instead of runserver.
CMD python manage.py migrate --noinput \
    && python manage.py collectstatic --noinput -v 0 \
    && exec gunicorn "${SERVICE}_core.wsgi:application" --bind "0.0.0.0:${PORT}" --workers 3 --access-logfile -
