# Scraper frontend app

Built with nodejs, Nextjs 13, and Ant Design
This is only frontend of Scrapers app. You must get backend part to make it work.
[Scraper](https://github.com/aldis-sarja/django-scraper.git)

## Installation

Clone, install, and run backend part
[Scraper](https://github.com/aldis-sarja/django-scraper.git)

Install frontend:

```bash
git clone https://github.com/aldis-sarja/scraper-frontend.git
cd scraper-frontend
npm install
```

Rename the file `.env.local.example` to `.env.local`, or make a copy:

```bash
cp .env.local.example .env.local
```

Write down Your backend address:

```dosini
NEXT_PUBLIC_BACKEND_URL=<address:port/api>
```

Run:

```bash
npm run dev
```

## Usage

Point your browser to address `http://localhost:3000/`
