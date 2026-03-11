# Unara Insights

Unara Insights is a self-hostable Next.js app that reads Nara app export files and turns them into local analytics views.

## Local development

```bash
npm ci
npm run dev
```

By default, the SQLite database is stored in `./data/unara-insights.sqlite`.

## Self-hosting with Docker

The app ships with a production `Dockerfile`. The container stores its SQLite database in `/data/unara-insights.sqlite`, so mount `/data` to persistent storage on the host.

Build the image:

```bash
docker build -t unara-insights:latest .
```

Run it:

```bash
docker run -d \
  --name unara-insights \
  -p 3344:3344 \
  -v /path/on/host/unara-insights:/data \
  --restart unless-stopped \
  unara-insights:latest
```

Open `http://localhost:3344`.

## Publish a pullable Docker image

The repository includes a GitHub Actions workflow at `.github/workflows/docker-publish.yml` that publishes the image to GitHub Container Registry.

Expected image name:

```bash
ghcr.io/<github-user-or-org>/unara-insights:latest
```

Recommended flow:

1. Push this repository to GitHub.
2. In the GitHub repository settings, make sure GitHub Actions is enabled.
3. Push to `master` or `main` to publish `:latest`.
4. Push a tag like `v1.0.0` to publish a versioned image tag as well.
5. In the package settings on GitHub, set the container package visibility to public if you want anonymous `docker pull`.

Example commands:

```bash
git add .
git commit -m "Prepare Docker publishing"
git remote add origin git@github.com:<you>/unara-insights.git
git push -u origin master
git tag v1.0.0
git push origin v1.0.0
```

After the workflow finishes, test it with:

```bash
docker pull ghcr.io/<github-user-or-org>/unara-insights:latest
```

If you prefer Docker Hub instead of GHCR, replace the workflow login and image name with your Docker Hub namespace and use Docker Hub credentials as repository secrets.

## Unraid example

In Unraid, create a container from the image and set:

- Repository: your image name, for example `ghcr.io/your-user/unara-insights:latest`
- Network Type: `bridge`
- Host Port: `3344`
- Container Port: `3344`
- Path: map `/mnt/user/appdata/unara-insights` to `/data`

Optional environment variables:

- `DATA_DIR=/data`
- `PORT=3344`
- `HOSTNAME=0.0.0.0`

If you want HTTPS and a stable domain, put the container behind your existing reverse proxy on Unraid, such as Nginx Proxy Manager, Traefik, or SWAG.
