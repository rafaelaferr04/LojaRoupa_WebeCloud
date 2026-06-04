import json
import os
import re
from datetime import datetime, timezone
from pathlib import Path

from pymongo import MongoClient


BASE_DIR = Path(__file__).resolve().parent
DATA_DIR = BASE_DIR.parent / "my-app" / "src" / "data"

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


def slugify(value):
    value = value.lower()
    replacements = {
        "á": "a",
        "à": "a",
        "ã": "a",
        "â": "a",
        "é": "e",
        "ê": "e",
        "í": "i",
        "ó": "o",
        "ô": "o",
        "õ": "o",
        "ú": "u",
        "ç": "c",
    }

    for original, replacement in replacements.items():
        value = value.replace(original, replacement)

    value = re.sub(r"[^a-z0-9]+", "-", value)
    return value.strip("-")


def sale_info(product):
    discount = campanhas_saldos.get(product["id"])

    if not discount:
        return None

    return {
        "priceValue": round(product["preco"] * (1 - discount / 100)),
        "oldPrice": f'{product["preco"]} EUR',
        "saleCampaign": f"Até {discount}%",
    }


def convert_product(product):
    sale = sale_info(product)
    price_value = sale["priceValue"] if sale else product["preco"]

    converted = {
        "id": str(product["id"]),
        "name": product["title"],
        "categoryKey": product["categoriaKey"],
        "category": product["categoria"],
        "subcategoryGroup": product["grupo"],
        "subcategory": product["subcategoria"],
        "subcategoryPath": f'/{product["categoriaKey"]}/{slugify(product["subcategoria"])}',
        "type": product["tipo"],
        "color": product["cor"],
        "price": f"{price_value} EUR",
        "priceValue": price_value,
        "description": product["descricao"],
        "materials": product["materiais"],
        "sizes": product["tamanhosValidos"],
        "image": product["imagem"],
        "imageAlt": product["title"],
        "badge": "Saldos" if sale else product.get("destaque"),
        "totalSales": 0,
        "weeklySales": 0,
        "createdAt": datetime.now(timezone.utc),
        "updatedAt": datetime.now(timezone.utc),
    }

    if sale:
        converted["oldPrice"] = sale["oldPrice"]
        converted["saleCampaign"] = sale["saleCampaign"]

    return converted


products_path = DATA_DIR / "productsData.json"

with products_path.open("r", encoding="utf-8") as file:
    source_products = json.load(file)

products = [convert_product(product) for product in source_products]

db.products.delete_many({})

if products:
    db.products.insert_many(products)

print(f"Produtos substituidos no MongoDB: {len(products)}")
