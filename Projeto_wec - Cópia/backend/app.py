import base64
import hashlib
import hmac
import json
import os
import re
import secrets
import smtplib
from datetime import datetime, timedelta, timezone
from email.message import EmailMessage
from functools import wraps

from bson import ObjectId
from flask import Flask, jsonify, request
from flask_cors import CORS
from pymongo import ASCENDING, DESCENDING, MongoClient
from pymongo.errors import PyMongoError


app = Flask(__name__)
CORS(app)

mongo_connection_string = os.environ.get("MONGODB_CONNECTION_STRING", "MONGODB_CONECTION_STRING")
database_name = os.environ.get("DATABASE_NAME", "DATABASE_NAME")
jwt_secret = os.environ.get("JWT_SECRET", "atelier-wec-dev-secret")
smtp_host = os.environ.get("SMTP_HOST")
smtp_port = int(os.environ.get("SMTP_PORT", "587"))
smtp_user = os.environ.get("SMTP_USER")
smtp_password = os.environ.get("SMTP_PASSWORD")
smtp_from = os.environ.get("SMTP_FROM", smtp_user or "noreply@atelierwec.pt")

client = MongoClient(
    mongo_connection_string,
    tls=True,
    tlsAllowInvalidCertificates=True,
)
db = client[database_name]

newsletter_message = """Agradecemos por se subscrever à newsletter de Atelier WEC. Vai poder estar a par de todas as nossas novidades e promoções especiais.

Atentamente,
Equipa Atelier WEC"""

return_message = """Lamentamos que não tenha ficado satisfeito com o seu produto, será contactado pela empresa de envio brevemente para saber como devolver a encomenda.

Atentamente,
Equipa Atelier WEC"""


def json_error(message, status_code):
    return jsonify({"error": message}), status_code


def is_valid_email(email):
    return bool(re.match(r"^[^\s@]+@[^\s@]+\.[^\s@]+$", email or ""))


def now_utc():
    return datetime.now(timezone.utc)


def serialize_document(document):
    if document is None:
        return None

    serialized = {}

    for key, value in document.items():
        if isinstance(value, ObjectId):
            serialized[key] = str(value)
        elif isinstance(value, datetime):
            serialized[key] = value.isoformat()
        elif isinstance(value, list):
            serialized[key] = [
                serialize_document(item) if isinstance(item, dict) else item
                for item in value
            ]
        elif isinstance(value, dict):
            serialized[key] = serialize_document(value)
        else:
            serialized[key] = value

    return serialized


def serialize_documents(documents):
    return [serialize_document(document) for document in documents]


def send_email(to_email, subject, body):
    if not all([smtp_host, smtp_user, smtp_password, smtp_from]):
        return False, "SMTP nao configurado."

    message = EmailMessage()
    message["From"] = smtp_from
    message["To"] = to_email
    message["Subject"] = subject
    message.set_content(body)

    try:
        with smtplib.SMTP(smtp_host, smtp_port) as server:
            server.starttls()
            server.login(smtp_user, smtp_password)
            server.send_message(message)
    except OSError as error:
        return False, str(error)
    except smtplib.SMTPException as error:
        return False, str(error)

    return True, None


def get_pagination():
    try:
        page = max(int(request.args.get("page", 1)), 1)
        limit = min(max(int(request.args.get("limit", 10)), 1), 100)
    except ValueError:
        page = 1
        limit = 10

    return page, limit, (page - 1) * limit


def paginated_products(query=None, sort=None):
    page, limit, skip = get_pagination()
    query = query or {}
    sort = sort or [("id", ASCENDING)]

    try:
        total = db.products.count_documents(query)
        documents = db.products.find(query).sort(sort).skip(skip).limit(limit)
    except PyMongoError as error:
        return json_error(str(error), 500)

    return jsonify(
        {
            "page": page,
            "limit": limit,
            "total": total,
            "totalPages": (total + limit - 1) // limit,
            "products": serialize_documents(documents),
        }
    )


def get_product_lookup(product_id):
    lookup = [{"id": str(product_id)}, {"id": product_id}]

    try:
        lookup.append({"_id": ObjectId(str(product_id))})
    except Exception:
        pass

    return {"$or": lookup}


def create_password_hash(password):
    salt = secrets.token_hex(16)
    password_hash = hashlib.pbkdf2_hmac(
        "sha256",
        password.encode("utf-8"),
        salt.encode("utf-8"),
        100000,
    ).hex()

    return f"{salt}${password_hash}"


def verify_password(password, user):
    stored_hash = user.get("passwordHash")

    if stored_hash:
        try:
            salt, password_hash = stored_hash.split("$", 1)
        except ValueError:
            return False

        candidate_hash = hashlib.pbkdf2_hmac(
            "sha256",
            password.encode("utf-8"),
            salt.encode("utf-8"),
            100000,
        ).hex()

        return hmac.compare_digest(candidate_hash, password_hash)

    # Compatibilidade com users importados para testes e com a app atual.
    return user.get("password") == password


def b64url_encode(data):
    encoded = base64.urlsafe_b64encode(data).decode("utf-8")
    return encoded.rstrip("=")


def b64url_decode(data):
    padding = "=" * (-len(data) % 4)
    return base64.urlsafe_b64decode(data + padding)


def create_token(user):
    header = {"alg": "HS256", "typ": "JWT"}
    payload = {
        "sub": str(user["_id"]),
        "username": user.get("username") or user.get("email"),
        "email": user.get("email"),
        "role": user.get("role", "user"),
        "exp": int((now_utc() + timedelta(hours=8)).timestamp()),
    }

    header_part = b64url_encode(json.dumps(header, separators=(",", ":")).encode("utf-8"))
    payload_part = b64url_encode(json.dumps(payload, separators=(",", ":")).encode("utf-8"))
    signature = hmac.new(
        jwt_secret.encode("utf-8"),
        f"{header_part}.{payload_part}".encode("utf-8"),
        hashlib.sha256,
    ).digest()

    return f"{header_part}.{payload_part}.{b64url_encode(signature)}"


def decode_token(token):
    try:
        header_part, payload_part, signature_part = token.split(".")
    except ValueError:
        return None

    expected_signature = hmac.new(
        jwt_secret.encode("utf-8"),
        f"{header_part}.{payload_part}".encode("utf-8"),
        hashlib.sha256,
    ).digest()

    if not hmac.compare_digest(b64url_encode(expected_signature), signature_part):
        return None

    try:
        payload = json.loads(b64url_decode(payload_part))
    except (json.JSONDecodeError, ValueError):
        return None

    if payload.get("exp", 0) < int(now_utc().timestamp()):
        return None

    return payload


def get_authenticated_user():
    header = request.headers.get("Authorization", "")

    if not header.startswith("Bearer "):
        return None

    payload = decode_token(header.replace("Bearer ", "", 1).strip())

    if not payload:
        return None

    try:
        return db.users.find_one({"_id": ObjectId(payload["sub"])})
    except (PyMongoError, Exception):
        return None


def authentication_required(admin=False):
    def decorator(function):
        @wraps(function)
        def wrapper(*args, **kwargs):
            authenticated_user = get_authenticated_user()

            if authenticated_user is None:
                return json_error("Autenticacao obrigatoria.", 401)

            if admin and authenticated_user.get("role") != "admin":
                return json_error("Permissao de administrador obrigatoria.", 403)

            request.authenticated_user = authenticated_user
            return function(*args, **kwargs)

        return wrapper

    return decorator


def collection_response(collection_name, query=None):
    try:
        documents = db[collection_name].find(query or {})
        return jsonify(serialize_documents(documents))
    except PyMongoError as error:
        return json_error(str(error), 500)


def single_document_response(collection_name, document_id):
    try:
        document = db[collection_name].find_one({"_id": ObjectId(document_id)})
    except Exception:
        return json_error("ID invalido.", 400)
    except PyMongoError as error:
        return json_error(str(error), 500)

    if document is None:
        return json_error("Documento nao encontrado.", 404)

    return jsonify(serialize_document(document))


def create_document(collection_name):
    data = request.get_json(silent=True)

    if not isinstance(data, dict):
        return json_error("O corpo do pedido deve ser um objeto JSON.", 400)

    data["createdAt"] = now_utc()
    data["updatedAt"] = now_utc()

    try:
        result = db[collection_name].insert_one(data)
        document = db[collection_name].find_one({"_id": result.inserted_id})
    except PyMongoError as error:
        return json_error(str(error), 500)

    return jsonify(serialize_document(document)), 201


def update_document(collection_name, document_id):
    data = request.get_json(silent=True)

    if not isinstance(data, dict):
        return json_error("O corpo do pedido deve ser um objeto JSON.", 400)

    data.pop("_id", None)
    data["updatedAt"] = now_utc()

    try:
        result = db[collection_name].update_one(
            {"_id": ObjectId(document_id)},
            {"$set": data},
        )
    except Exception:
        return json_error("ID invalido.", 400)
    except PyMongoError as error:
        return json_error(str(error), 500)

    if result.matched_count == 0:
        return json_error("Documento nao encontrado.", 404)

    document = db[collection_name].find_one({"_id": ObjectId(document_id)})
    return jsonify(serialize_document(document))


def delete_document(collection_name, document_id):
    try:
        result = db[collection_name].delete_one({"_id": ObjectId(document_id)})
    except Exception:
        return json_error("ID invalido.", 400)
    except PyMongoError as error:
        return json_error(str(error), 500)

    if result.deleted_count == 0:
        return json_error("Documento nao encontrado.", 404)

    return jsonify({"deleted": True, "id": document_id})


def build_product_query():
    query = {}
    category_key = request.args.get("categoryKey")
    subcategory = request.args.get("subcategory")
    group = request.args.get("group")
    search = request.args.get("search")

    if category_key:
        query["categoryKey"] = category_key

    if subcategory:
        query["subcategory"] = subcategory

    if group:
        query["subcategoryGroup"] = group

    if search:
        query["$or"] = [
            {"name": {"$regex": search, "$options": "i"}},
            {"description": {"$regex": search, "$options": "i"}},
            {"category": {"$regex": search, "$options": "i"}},
            {"subcategory": {"$regex": search, "$options": "i"}},
        ]

    return query


@app.route("/", methods=["GET"])
def index():
    return jsonify(
        {
            "name": "Atelier WEC API",
            "status": "online",
            "endpoints": [
                "/api/v1/products",
                "/api/v1/products/total",
                "/api/v1/products/categorias/<categorias>",
                "/api/v1/products/price",
                "/api/v1/products/sales",
                "/api/v1/user/signup",
                "/api/v1/user/login",
                "/api/v1/user/confirmation",
                "/api/v1/newsletter",
                "/api/v1/newsletter/cancel",
                "/api/v1/returns",
            ],
        }
    )


@app.route("/health", methods=["GET"])
def health():
    try:
        client.admin.command("ping")
    except PyMongoError as error:
        return json_error(str(error), 500)

    return jsonify({"status": "ok"})


@app.route("/api/v1/products", methods=["GET"])
def api_get_products():
    return paginated_products(build_product_query())


@app.route("/api/v1/products/<int:product_id>", methods=["GET"])
def api_get_product(product_id):
    try:
        document = db.products.find_one(get_product_lookup(product_id))
    except PyMongoError as error:
        return json_error(str(error), 500)

    if document is None:
        return json_error("Produto nao encontrado.", 404)

    return jsonify(serialize_document(document))


@app.route("/api/v1/products", methods=["POST"])
@authentication_required()
def api_create_products():
    data = request.get_json(silent=True)

    if isinstance(data, dict):
        documents = [data]
    elif isinstance(data, list) and all(isinstance(item, dict) for item in data):
        documents = data
    else:
        return json_error("Envie um produto ou uma lista de produtos em JSON.", 400)

    for document in documents:
        document["createdAt"] = now_utc()
        document["updatedAt"] = now_utc()

    try:
        if len(documents) == 1:
            result = db.products.insert_one(documents[0])
            created = db.products.find_one({"_id": result.inserted_id})
            return jsonify(serialize_document(created)), 201

        result = db.products.insert_many(documents)
        created = db.products.find({"_id": {"$in": result.inserted_ids}})
        return jsonify(serialize_documents(created)), 201
    except PyMongoError as error:
        return json_error(str(error), 500)


@app.route("/api/v1/products/<int:product_id>", methods=["PUT"])
@authentication_required()
def api_update_product(product_id):
    data = request.get_json(silent=True)

    if not isinstance(data, dict):
        return json_error("O corpo do pedido deve ser um objeto JSON.", 400)

    data.pop("_id", None)
    data["updatedAt"] = now_utc()

    try:
        result = db.products.update_one(get_product_lookup(product_id), {"$set": data})
        document = db.products.find_one(get_product_lookup(product_id))
    except PyMongoError as error:
        return json_error(str(error), 500)

    if result.matched_count == 0 or document is None:
        return json_error("Produto nao encontrado.", 404)

    return jsonify(serialize_document(document))


@app.route("/api/v1/products/<int:product_id>", methods=["DELETE"])
@authentication_required()
def api_delete_product(product_id):
    try:
        result = db.products.delete_one(get_product_lookup(product_id))
    except PyMongoError as error:
        return json_error(str(error), 500)

    if result.deleted_count == 0:
        return json_error("Produto nao encontrado.", 404)

    return jsonify({"deleted": True, "id": product_id})


@app.route("/api/v1/products/total", methods=["GET"])
def api_get_products_total():
    try:
        total = db.products.count_documents(build_product_query())
    except PyMongoError as error:
        return json_error(str(error), 500)

    return jsonify({"total": total})


@app.route("/api/v1/products/categorias/<categorias>", methods=["GET"])
def api_get_products_by_categories(categorias):
    category_values = [category.strip() for category in categorias.split(",") if category.strip()]

    if not category_values:
        return json_error("Indique pelo menos uma categoria.", 400)

    query = {
        "$or": [
            {"categoryKey": {"$in": category_values}},
            {"category": {"$in": category_values}},
            {"subcategory": {"$in": category_values}},
        ]
    }

    return paginated_products(query)


@app.route("/api/v1/products/price", methods=["GET"])
def api_get_products_by_price():
    try:
        min_price = float(request.args.get("min", 0))
        max_price = float(request.args.get("max", 999999))
    except ValueError:
        return json_error("Os parametros min e max devem ser numeros.", 400)

    order = request.args.get("order", "asc").lower()
    sort_direction = DESCENDING if order in {"desc", "descending"} else ASCENDING
    query = {"priceValue": {"$gte": min_price, "$lte": max_price}}

    return paginated_products(query, [("priceValue", sort_direction)])


@app.route("/api/v1/products/sales", methods=["GET"])
def api_get_product_sales():
    week_start = now_utc() - timedelta(days=7)

    try:
        orders = list(db.orders.find({}))
    except PyMongoError as error:
        return json_error(str(error), 500)

    sales_by_product = {}

    for order in orders:
        order_date = order.get("createdAt")

        if isinstance(order_date, str):
            try:
                order_date = datetime.fromisoformat(order_date.replace("Z", "+00:00"))
            except ValueError:
                order_date = None

        if isinstance(order_date, datetime) and order_date.tzinfo is None:
            order_date = order_date.replace(tzinfo=timezone.utc)

        is_weekly_order = isinstance(order_date, datetime) and order_date >= week_start

        for item in order.get("items", []):
            product_id = str(item.get("productId"))
            quantity = item.get("quantity", 1)

            sales_by_product.setdefault(
                product_id,
                {"productId": product_id, "totalSales": 0, "weeklySales": 0},
            )
            sales_by_product[product_id]["totalSales"] += quantity

            if is_weekly_order:
                sales_by_product[product_id]["weeklySales"] += quantity

    return jsonify(list(sales_by_product.values()))


@app.route("/api/v1/user/signup", methods=["POST"])
def api_signup():
    data = request.get_json(silent=True)

    if not isinstance(data, dict):
        return json_error("O corpo do pedido deve ser um objeto JSON.", 400)

    username = (data.get("username") or data.get("email") or "").strip().lower()
    email = (data.get("email") or username).strip().lower()
    password = data.get("password")

    if not username or not password:
        return json_error("Username e password sao obrigatorios.", 400)

    try:
        existing_user = db.users.find_one({"$or": [{"username": username}, {"email": email}]})

        if existing_user:
            return json_error("Utilizador ja existe.", 409)

        user = {
            "username": username,
            "name": data.get("name") or username,
            "email": email,
            "passwordHash": create_password_hash(password),
            "confirmed": False,
            "role": "user",
            "newsletterSubscribed": False,
            "cart": [],
            "favorites": [],
            "createdAt": now_utc(),
            "updatedAt": now_utc(),
        }

        result = db.users.insert_one(user)
        created = db.users.find_one({"_id": result.inserted_id})
    except PyMongoError as error:
        return json_error(str(error), 500)

    created.pop("passwordHash", None)
    created.pop("password", None)
    return jsonify(serialize_document(created)), 201


@app.route("/api/v1/user/login", methods=["POST"])
def api_login():
    data = request.get_json(silent=True)

    if not isinstance(data, dict):
        return json_error("O corpo do pedido deve ser um objeto JSON.", 400)

    username = (data.get("username") or data.get("email") or "").strip().lower()
    password = data.get("password")

    if not username or not password:
        return json_error("Username e password sao obrigatorios.", 400)

    try:
        user = db.users.find_one({"$or": [{"username": username}, {"email": username}]})
    except PyMongoError as error:
        return json_error(str(error), 500)

    if user is None or not verify_password(password, user):
        return json_error("Credenciais invalidas.", 401)

    if user.get("confirmed") is not True:
        return json_error("Utilizador ainda nao confirmado.", 403)

    return jsonify({"token": create_token(user), "user": serialize_document(user)})


@app.route("/api/v1/user/confirmation", methods=["POST"])
@authentication_required(admin=True)
def api_confirm_user():
    data = request.get_json(silent=True)

    if not isinstance(data, dict):
        return json_error("O corpo do pedido deve ser um objeto JSON.", 400)

    username = (data.get("username") or data.get("email") or "").strip().lower()

    if not username:
        return json_error("Indique username ou email.", 400)

    try:
        result = db.users.update_one(
            {"$or": [{"username": username}, {"email": username}]},
            {"$set": {"confirmed": True, "updatedAt": now_utc()}},
        )

        if result.matched_count == 0:
            return json_error("Utilizador nao encontrado.", 404)

        user = db.users.find_one({"$or": [{"username": username}, {"email": username}]})
    except PyMongoError as error:
        return json_error(str(error), 500)

    return jsonify(serialize_document(user))


@app.route("/api/v1/newsletter", methods=["POST"])
def api_newsletter_signup():
    data = request.get_json(silent=True)

    if not isinstance(data, dict):
        return json_error("O corpo do pedido deve ser um objeto JSON.", 400)

    email = (data.get("email") or "").strip().lower()

    if not is_valid_email(email):
        return json_error("Email invalido.", 400)

    sent, send_error = send_email(
        email,
        "Subscrição da newsletter Atelier WEC",
        newsletter_message,
    )

    subscriber = {
        "email": email,
        "message": newsletter_message,
        "emailSent": sent,
        "emailError": send_error,
        "createdAt": now_utc(),
        "updatedAt": now_utc(),
    }

    try:
        db.newsletterSubscribers.update_one(
            {"email": email},
            {"$set": subscriber},
            upsert=True,
        )
        saved_subscriber = db.newsletterSubscribers.find_one({"email": email})
    except PyMongoError as error:
        return json_error(str(error), 500)

    try:
        db.users.update_one(
            {"email": email},
            {"$set": {"newsletterSubscribed": True, "updatedAt": now_utc()}},
        )
    except PyMongoError as error:
        return json_error(str(error), 500)

    return jsonify(serialize_document(saved_subscriber)), 201


@app.route("/api/v1/newsletter/cancel", methods=["POST"])
def api_cancel_newsletter():
    data = request.get_json(silent=True)

    if not isinstance(data, dict):
        return json_error("O corpo do pedido deve ser um objeto JSON.", 400)

    email = (data.get("email") or "").strip().lower()

    if not is_valid_email(email):
        return json_error("Email invalido.", 400)

    try:
        db.newsletterSubscribers.update_one(
            {"email": email},
            {
                "$set": {
                    "cancelledAt": now_utc(),
                    "newsletterSubscribed": False,
                    "updatedAt": now_utc(),
                }
            },
            upsert=True,
        )
        db.users.update_one(
            {"email": email},
            {"$set": {"newsletterSubscribed": False, "updatedAt": now_utc()}},
        )
    except PyMongoError as error:
        return json_error(str(error), 500)

    return jsonify({"cancelled": True, "email": email})


@app.route("/api/v1/returns", methods=["POST"])
def api_create_return_request():
    data = request.get_json(silent=True)

    if not isinstance(data, dict):
        return json_error("O corpo do pedido deve ser um objeto JSON.", 400)

    email = (data.get("userEmail") or data.get("email") or "").strip().lower()

    if not is_valid_email(email):
        return json_error("Email invalido.", 400)

    sent, send_error = send_email(
        email,
        "Instruções de devolução Atelier WEC",
        return_message,
    )

    return_request = {
        "userEmail": email,
        "orderId": data.get("orderId"),
        "itemKey": data.get("itemKey"),
        "productId": data.get("productId"),
        "productName": data.get("productName"),
        "message": return_message,
        "emailSent": sent,
        "emailError": send_error,
        "createdAt": now_utc(),
        "updatedAt": now_utc(),
    }

    try:
        result = db.returns.insert_one(return_request)
        saved_return = db.returns.find_one({"_id": result.inserted_id})
    except PyMongoError as error:
        return json_error(str(error), 500)

    return jsonify(serialize_document(saved_return)), 201


# Rotas antigas mantidas para a app React atual.
@app.route("/products", methods=["GET"])
def get_products():
    return collection_response("products", build_product_query())


@app.route("/products/<product_id>", methods=["GET"])
def get_product(product_id):
    return single_document_response("products", product_id)


@app.route("/products", methods=["POST"])
def create_product():
    return create_document("products")


@app.route("/products/<product_id>", methods=["PUT", "PATCH"])
def update_product(product_id):
    return update_document("products", product_id)


@app.route("/products/<product_id>", methods=["DELETE"])
def delete_product(product_id):
    return delete_document("products", product_id)


@app.route("/users", methods=["GET"])
def get_users():
    return collection_response("users")


@app.route("/users/<user_id>", methods=["GET"])
def get_user(user_id):
    return single_document_response("users", user_id)


@app.route("/users", methods=["POST"])
def create_user():
    return create_document("users")


@app.route("/users/<user_id>", methods=["PUT", "PATCH"])
def update_user(user_id):
    return update_document("users", user_id)


@app.route("/users/<user_id>", methods=["DELETE"])
def delete_user(user_id):
    return delete_document("users", user_id)


@app.route("/orders", methods=["GET"])
def get_orders():
    query = {}
    user_email = request.args.get("userEmail")

    if user_email:
        query["userEmail"] = user_email.strip().lower()

    return collection_response("orders", query)


@app.route("/orders/<order_id>", methods=["GET"])
def get_order(order_id):
    return single_document_response("orders", order_id)


@app.route("/orders", methods=["POST"])
def create_order():
    return create_document("orders")


@app.route("/orders/<order_id>", methods=["PUT", "PATCH"])
def update_order(order_id):
    return update_document("orders", order_id)


@app.route("/orders/<order_id>", methods=["DELETE"])
def delete_order(order_id):
    return delete_document("orders", order_id)


if __name__ == "__main__":
    app.run(debug=True)
