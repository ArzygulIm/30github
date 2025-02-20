from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List
import pandas as pd

app = FastAPI()

# Определяем путь к файлу Excel
EXCEL_FILE = "items.xlsx"

# Загружаем данные из Excel или создаем новый файл
try:
    df = pd.read_excel(EXCEL_FILE)
    items = df.to_dict(orient="records")
except FileNotFoundError:
    items = []
    pd.DataFrame(items).to_excel(EXCEL_FILE, index=False)

class Item(BaseModel):
    id: int
    name: str
    description: str = None
    status: boolean = false
    date: str

def save_to_excel():
    pd.DataFrame(items).to_excel(EXCEL_FILE, index=False)

@app.get("/")
def read_root():
    return {"message": "Hello, FastAPI!"}

@app.get("/items", response_model=List[Item])
def get_items():
    return items

@app.get("/items/{item_id}", response_model=Item)
def get_item(item_id: int):
    for item in items:
        if item["id"] == item_id:
            return item
    raise HTTPException(status_code=404, detail="Item not found")

@app.post("/items", response_model=Item)
def create_item(item: Item):
    items.append(item.dict())
    save_to_excel()
    return item

@app.put("/items/{item_id}", response_model=Item)
def update_item(item_id: int, updated_item: Item):
    for i, item in enumerate(items):
        if item["id"] == item_id:
            items[i] = updated_item.dict()
            save_to_excel()
            return updated_item
    raise HTTPException(status_code=404, detail="Item not found")

@app.delete("/items/{item_id}")
def delete_item(item_id: int):
    global items
    items = [item for item in items if item["id"] != item_id]
    save_to_excel()
    return {"message": "Item deleted"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
