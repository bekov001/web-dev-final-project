# KBTU Predictions

Prediction market platform inspired by Polymarket. Users can create markets with Yes/No outcomes, place predictions, and discuss in comments.

Built with Angular (frontend) and Django + DRF (backend).

## Tech Stack

- **Frontend:** Angular 21, TypeScript, RxJS
- **Backend:** Django 4.2, Django REST Framework
- **Database:** SQLite

## How to Run

### Backend

```bash
cd backend
pip install django djangorestframework django-cors-headers
python3 manage.py migrate
python3 manage.py runserver
```

To seed test data:

```bash
python3 seed.py
```

Backend runs on `http://localhost:8000`

### Frontend

```bash
cd frontend
npm install
npx ng serve
```

Frontend runs on `http://localhost:4200`

## Features

- Browse prediction markets by category
- Search markets
- Create new markets with a question, description, category, and end date
- Vote Yes or No on any market
- Comment and discuss markets
- Delete markets
- Filter by category (Politics, Crypto, Sports, Tech, Science)

## API Endpoints

| Method | URL | Description |
|--------|-----|-------------|
| GET | /api/categories/ | List categories |
| POST | /api/categories/ | Create category |
| GET | /api/markets/ | List markets |
| POST | /api/markets/ | Create market |
| GET | /api/markets/:id/ | Market detail |
| PUT | /api/markets/:id/ | Update market |
| DELETE | /api/markets/:id/ | Delete market |
| GET | /api/trades/?market_id=X | List trades |
| POST | /api/trades/ | Place trade |
| GET | /api/comments/?market_id=X | List comments |
| POST | /api/comments/ | Add comment |

## Project Structure

```
backend/
  config/          # Django settings, urls
  markets/         # Models, serializers, views
  seed.py          # Test data seeder
frontend/
  src/app/
    pages/         # Home, MarketDetail, CreateMarket
    services/      # API service (HttpClient)
    models/        # TypeScript interfaces
```

## Group Members

- Bekov Anuar
