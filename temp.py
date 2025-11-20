import json

with open("temp.json", "r", encoding="utf-8") as f:
    data = json.load(f)

productos = []
for product in data:
    productId = product.get("productId")
    productName = product.get("productName")
    productTitle = product.get("productTitle")
    item = product.get("items", [{}])[0]
    ean = item.get("ean")
    seller = item.get("sellers", [{}])[0]
    price = seller.get("commertialOffer", {}).get("Price")
    imageUrl = item.get("images", [{}])[0].get("imageUrl")
    productos.append({
        "productId": productId,
        "productName": productName,
        "productTitle": productTitle,
        "ean": ean,
        "price": price,
        "imageUrl": imageUrl
    })

with open("producto-temp.json", "w", encoding="utf-8") as f:
    json.dump(productos, f, ensure_ascii=False, indent=2)