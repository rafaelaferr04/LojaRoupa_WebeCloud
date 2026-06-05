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

campanhas_saldos = {
    2: 30,
    8: 50,
    15: 30,
    23: 50,
    35: 30,
    48: 50,
    62: 30,
    74: 50,
    91: 30,
    108: 50,
    126: 30,
    142: 50,
}


def load_json(filename):
    path = DATA_DIR / filename

    with path.open("r", encoding="utf-8") as file:
        return json.load(file)


def add_timestamps(document):
    now = datetime.now(timezone.utc)
    document.setdefault("createdAt", now)
    document["updatedAt"] = now
    return document


def convert_product(product):
    discount = campanhas_saldos.get(product["id"])
    final_price = product["preco"]
    old_price = None
    sale_campaign = None

    if discount:
        final_price = round(product["preco"] * (1 - discount / 100))
        old_price = f'{product["preco"]} EUR'
        sale_campaign = f"Até {discount}%"

    document = {
        "id": product["id"],
        "name": product["title"],
        "categoryKey": product["categoriaKey"],
        "category": product["categoria"],
        "subcategoryGroup": product["grupo"],
        "subcategory": product["subcategoria"],
        "type": product["tipo"],
        "color": product["cor"],
        "price": f"{final_price} EUR",
        "priceValue": final_price,
        "oldPrice": old_price,
        "saleCampaign": sale_campaign,
        "description": product["descricao"],
        "materials": product.get("materiais"),
        "sizes": product.get("tamanhosValidos", []),
        "image": product["imagem"],
        "imageAlt": product["title"],
        "badge": "Saldos" if discount else product.get("destaque"),
        "totalSales": 0,
        "weeklySales": 0,
    }

    return add_timestamps(document)


def import_products():
    products = load_json("productsData.json")
    documents = [convert_product(product) for product in products]

    db.products.delete_many({})

    if documents:
        db.products.insert_many(documents)

    return len(documents)


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
    user_emails = {
        order["userEmail"].strip().lower()
        for order in orders
        if order.get("userEmail")
    }

    if user_emails:
        db.orders.delete_many({"userEmail": {"$in": list(user_emails)}})

    for order in orders:
        order = add_timestamps(order)
        db.orders.insert_one(order)
        imported += 1

    return imported


print(f"Products importados/atualizados: {import_products()}")
print(f"Users importados/atualizados: {import_users()}")
print(f"Orders importadas/atualizadas: {import_orders()}")
