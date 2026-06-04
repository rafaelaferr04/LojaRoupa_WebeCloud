import os
from datetime import datetime, timezone

from bson import ObjectId
from flask import Flask, jsonify, request
from flask_cors import CORS
from pymongo import MongoClient
from pymongo.errors import PyMongoError


app = Flask(__name__)
CORS(app)

mongo_connection_string = os.environ.get("MONGODB_CONNECTION_STRING", "MONGODB_CONECTION_STRING")
database_name = os.environ.get("DATABASE_NAME", "DATABASE_NAME")

client = MongoClient(
    mongo_connection_string,
    tls=True,
    tlsAllowInvalidCertificates=True,
)
db = client[database_name]


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


def get_document_id(document_id):
    try:
        return ObjectId(document_id)
    except Exception:
        return None


def json_error(message, status_code):
    return jsonify({"error": message}), status_code


def collection_response(collection_name, query=None):
    try:
        documents = db[collection_name].find(query or {})
        return jsonify(serialize_documents(documents))
    except PyMongoError as error:
        return json_error(str(error), 500)


def single_document_response(collection_name, document_id):
    object_id = get_document_id(document_id)

    if object_id is None:
        return json_error("ID invalido.", 400)

    try:
        document = db[collection_name].find_one({"_id": object_id})
    except PyMongoError as error:
        return json_error(str(error), 500)

    if document is None:
        return json_error("Documento nao encontrado.", 404)

    return jsonify(serialize_document(document))


def create_document(collection_name):
    data = request.get_json(silent=True)

    if not isinstance(data, dict):
        return json_error("O corpo do pedido deve ser um objeto JSON.", 400)

    data["createdAt"] = datetime.now(timezone.utc)
    data["updatedAt"] = datetime.now(timezone.utc)

    try:
        result = db[collection_name].insert_one(data)
        document = db[collection_name].find_one({"_id": result.inserted_id})
    except PyMongoError as error:
        return json_error(str(error), 500)

    return jsonify(serialize_document(document)), 201


def update_document(collection_name, document_id):
    object_id = get_document_id(document_id)

    if object_id is None:
        return json_error("ID invalido.", 400)

    data = request.get_json(silent=True)

    if not isinstance(data, dict):
        return json_error("O corpo do pedido deve ser um objeto JSON.", 400)

    data.pop("_id", None)
    data["updatedAt"] = datetime.now(timezone.utc)

    try:
        result = db[collection_name].update_one({"_id": object_id}, {"$set": data})
    except PyMongoError as error:
        return json_error(str(error), 500)

    if result.matched_count == 0:
        return json_error("Documento nao encontrado.", 404)

    document = db[collection_name].find_one({"_id": object_id})
    return jsonify(serialize_document(document))


def delete_document(collection_name, document_id):
    object_id = get_document_id(document_id)

    if object_id is None:
        return json_error("ID invalido.", 400)

    try:
        result = db[collection_name].delete_one({"_id": object_id})
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
            "endpoints": ["/products", "/users", "/orders"],
        }
    )


@app.route("/health", methods=["GET"])
def health():
    try:
        client.admin.command("ping")
    except PyMongoError as error:
        return json_error(str(error), 500)

    return jsonify({"status": "ok"})


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
