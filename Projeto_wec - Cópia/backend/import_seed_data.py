import json
import os
from datetime import datetime, timezone
from pathlib import Path

from pymongo import MongoClient


BASE_DIR = Path(__file__).resolve().parent
FRONTEND_DIR = BASE_DIR.parent / "my-app"
DATA_DIR = FRONTEND_DIR / "src" / "data"

mongo_connection_string = os.environ.get("MONGODB_CONNECTION_STRING")
database_name = os.environ.get("DATABASE_NAME", "atelier_wec")


if not mongo_connection_string:
    raise SystemExit("Define primeiro MONGODB_CONNECTION_STRING no terminal.")


client = MongoClient(
    mongo_connection_string,
    tls=True,
    tlsAllowInvalidCertificates=True,
)
db = client[database_name]


def load_json(filename):
    path = DATA_DIR / filename

    with path.open("r", encoding="utf-8") as file:
        return json.load(file)


def add_timestamps(document):
    now = datetime.now(timezone.utc)
    document.setdefault("createdAt", now)
    document["updatedAt"] = now
    return document


def import_users():
    users = load_json("users-mongodb.json")
    imported = 0

    for user in users:
        user = add_timestamps(user)
        db.users.update_one(
            {"email": user["email"]},
            {"$set": user},
            upsert=True,
        )
        imported += 1

    return imported


def import_orders():
    orders = load_json("orders-mongodb.json")
    imported = 0

    for order in orders:
        order = add_timestamps(order)
        db.orders.update_one(
            {"id": order["id"]},
            {"$set": order},
            upsert=True,
        )
        imported += 1

    return imported


print(f"Users importados/atualizados: {import_users()}")
print(f"Orders importadas/atualizadas: {import_orders()}")
